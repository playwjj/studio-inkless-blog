import type { DbArticle, DbPage } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Get the base URL from the request
  const host = getHeader(event, 'host') || 'example.com'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  try {
    // Query directly so results are not capped by the DB API's page size
    const [publishedArticles, pagesResponse, categories, tags] = await Promise.all([
      executeQuery<Pick<DbArticle, 'slug' | 'published_at' | 'updated_at'>>(
        'SELECT slug, published_at, updated_at FROM articles WHERE status = ? ORDER BY published_at DESC',
        ['published']
      ),
      // Fetch all published pages
      fetchFromDb<DbPage>('pages', {
        limit: 1000,
        sortBy: 'updated_at',
        sortOrder: 'desc'
      }),
      executeQuery<{ slug: string }>('SELECT slug FROM categories'),
      executeQuery<{ slug: string }>('SELECT DISTINCT t.slug FROM tags t INNER JOIN article_tags at ON at.tag_id = t.id')
    ])

    const articles = publishedArticles.filter(a => a.published_at && new Date(a.published_at) <= new Date())
    const pages = pagesResponse.data.filter(p => p.status === 'published' && (!p.published_at || new Date(p.published_at) <= new Date()))

    // Build XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    // Dedupe: the pages table may hold records (e.g. slug "" or "blog")
    // that duplicate the hardcoded homepage/blog entries below —
    // emit each loc only once, keeping the first (hardcoded) version
    const seen = new Set<string>()
    const addUrl = (loc: string, lastmod: string, changefreq: string, priority: string) => {
      if (seen.has(loc)) return
      seen.add(loc)
      xml += '  <url>\n'
      xml += `    <loc>${loc}</loc>\n`
      xml += `    <lastmod>${lastmod}</lastmod>\n`
      xml += `    <changefreq>${changefreq}</changefreq>\n`
      xml += `    <priority>${priority}</priority>\n`
      xml += '  </url>\n'
    }

    const today = new Date().toISOString().split('T')[0]

    // Add homepage
    addUrl(`${baseUrl}/`, today, 'weekly', '1.0')

    // Add blog index page
    addUrl(`${baseUrl}/blog`, today, 'daily', '0.9')

    // Add all articles
    for (const article of articles) {
      const lastmod = article.updated_at || article.published_at
      addUrl(
        `${baseUrl}/blog/${article.slug}`,
        new Date(lastmod).toISOString().split('T')[0],
        'monthly',
        '0.8'
      )
    }

    // Add all pages
    for (const page of pages) {
      const lastmod = page.updated_at || page.created_at
      // Remove leading slash from slug to avoid double slashes
      const slug = page.slug.startsWith('/') ? page.slug.slice(1) : page.slug
      // Skip malformed date-like slugs (e.g. 2026-01-06) — these page records 404
      // and must not pollute the sitemap
      if (/^\d{4}-\d{2}-\d{2}$/.test(slug)) continue
      addUrl(
        `${baseUrl}/${slug}`,
        new Date(lastmod).toISOString().split('T')[0],
        'monthly',
        '0.7'
      )
    }

    // Add category pages
    for (const category of categories) {
      addUrl(`${baseUrl}/blog/category/${category.slug}`, today, 'weekly', '0.6')
    }

    // Add tag pages (only tags that are attached to at least one article)
    for (const tag of tags) {
      addUrl(`${baseUrl}/blog/tag/${tag.slug}`, today, 'weekly', '0.5')
    }

    xml += '</urlset>'

    // Set response headers
    setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    setResponseHeader(event, 'Cache-Control', 'public, max-age=3600')

    return xml
  } catch (error) {
    console.error('Failed to generate sitemap:', error)

    // Return basic sitemap on error
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    xml += '  <url>\n'
    xml += `    <loc>${baseUrl}/</loc>\n`
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`
    xml += '  </url>\n'
    xml += '</urlset>'

    setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    return xml
  }
})
