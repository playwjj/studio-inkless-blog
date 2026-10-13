/**
 * robots.txt served dynamically so the Sitemap directive is an absolute URL
 * (required by the robots.txt spec) for whichever host serves the site.
 */
export default defineEventHandler((event) => {
  const host = getHeader(event, 'host') || 'example.com'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=86400')

  return [
    '# Allow all crawlers',
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/*',
    '',
    '# Sitemap location',
    `Sitemap: ${baseUrl}/sitemap.xml`,
    ''
  ].join('\n')
})
