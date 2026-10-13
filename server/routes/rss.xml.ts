import type { DbArticle, DbSite } from '~/server/types/dbTypes'

/**
 * RSS 2.0 feed serving the 30 most recent published articles.
 * /feed redirects here (see server/routes/feed.ts).
 */

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineEventHandler(async (event) => {
  const host = getHeader(event, 'host') || 'example.com'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  try {
    const [articles, siteResponse] = await Promise.all([
      executeQuery<DbArticle>(
        'SELECT slug, title, excerpt, published_at FROM articles WHERE status = ? ORDER BY published_at DESC LIMIT 30',
        ['published']
      ),
      fetchFromDb<DbSite>('site', { page: 1, limit: 1, sortBy: 'id', sortOrder: 'desc' }).catch(() => null)
    ])

    const site = siteResponse?.data?.[0]
    const siteName = site?.og_site_name || site?.name || 'Studio Inkless Blog'
    const siteDescription = site?.description || ''
    const now = new Date()

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n'
    xml += '  <channel>\n'
    xml += `    <title>${escapeXml(siteName)}</title>\n`
    xml += `    <link>${baseUrl}/</link>\n`
    xml += `    <description>${escapeXml(siteDescription)}</description>\n`
    xml += '    <language>en</language>\n'
    xml += `    <lastBuildDate>${now.toUTCString()}</lastBuildDate>\n`
    xml += `    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />\n`

    for (const article of articles) {
      // Skip scheduled articles that are not yet live
      if (!article.published_at || new Date(article.published_at) > now) continue

      const link = `${baseUrl}/blog/${article.slug}`
      xml += '    <item>\n'
      xml += `      <title>${escapeXml(article.title)}</title>\n`
      xml += `      <link>${link}</link>\n`
      xml += `      <guid isPermaLink="true">${link}</guid>\n`
      xml += `      <description>${escapeXml(article.excerpt || '')}</description>\n`
      xml += `      <pubDate>${new Date(article.published_at).toUTCString()}</pubDate>\n`
      xml += '    </item>\n'
    }

    xml += '  </channel>\n'
    xml += '</rss>'

    setResponseHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
    setResponseHeader(event, 'Cache-Control', 'public, max-age=3600')

    return xml
  } catch (error) {
    console.error('Failed to generate RSS feed:', error)
    setResponseStatus(event, 500)
    return 'Failed to generate RSS feed'
  }
})
