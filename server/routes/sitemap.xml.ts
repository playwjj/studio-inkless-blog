import type { DbArticle, DbPage } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Get the base URL from the request
  const host = getHeader(event, 'host') || 'example.com'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  try {
    // Fetch all published articles
    const articlesResponse = await fetchFromDb<DbArticle>('articles', {
      limit: 1000,
      sortBy: 'published_at',
      sortOrder: 'desc'
    })

    // Fetch all published pages
    const pagesResponse = await fetchFromDb<DbPage>('pages', {
      limit: 1000,
      sortBy: 'updated_at',
      sortOrder: 'desc'
    })

    const articles = articlesResponse.data.filter(a => a.published_at && a.status === 'published' && new Date(a.published_at) <= new Date())
    const pages = pagesResponse.data.filter(p => p.status === 'published' && (!p.published_at || new Date(p.published_at) <= new Date()))

    // Build XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    // Add homepage
    xml += '  <url>\n'
    xml += `    <loc>${baseUrl}/</loc>\n`
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`
    xml += '    <changefreq>weekly</changefreq>\n'
    xml += '    <priority>1.0</priority>\n'
    xml += '  </url>\n'

    // Add blog index page
    xml += '  <url>\n'
    xml += `    <loc>${baseUrl}/blog</loc>\n`
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`
    xml += '    <changefreq>daily</changefreq>\n'
    xml += '    <priority>0.9</priority>\n'
    xml += '  </url>\n'

    // Add all articles
    for (const article of articles) {
      const lastmod = article.updated_at || article.published_at
      xml += '  <url>\n'
      xml += `    <loc>${baseUrl}/blog/${article.slug}</loc>\n`
      xml += `    <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>\n`
      xml += '    <changefreq>monthly</changefreq>\n'
      xml += '    <priority>0.8</priority>\n'
      xml += '  </url>\n'
    }

    // Add all pages
    for (const page of pages) {
      const lastmod = page.updated_at || page.created_at
      // Remove leading slash from slug to avoid double slashes
      const slug = page.slug.startsWith('/') ? page.slug.slice(1) : page.slug
      xml += '  <url>\n'
      xml += `    <loc>${baseUrl}/${slug}</loc>\n`
      xml += `    <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>\n`
      xml += '    <changefreq>monthly</changefreq>\n'
      xml += '    <priority>0.7</priority>\n'
      xml += '  </url>\n'
    }

    // Add category pages
    const categoriesResponse = await fetchFromDb<any>('categories', { limit: 100 })
    const categories = categoriesResponse.data
    for (const category of categories) {
      xml += '  <url>\n'
      xml += `    <loc>${baseUrl}/blog/category/${category.slug}</loc>\n`
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`
      xml += '    <changefreq>weekly</changefreq>\n'
      xml += '    <priority>0.6</priority>\n'
      xml += '  </url>\n'
    }

    // Add tag pages
    const tagsResponse = await fetchFromDb<any>('tags', { limit: 100 })
    const tags = tagsResponse.data
    for (const tag of tags) {
      xml += '  <url>\n'
      xml += `    <loc>${baseUrl}/blog/tag/${tag.slug}</loc>\n`
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`
      xml += '    <changefreq>weekly</changefreq>\n'
      xml += '    <priority>0.5</priority>\n'
      xml += '  </url>\n'
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
