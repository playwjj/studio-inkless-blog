/**
 * /feed redirects to the RSS 2.0 feed at /rss.xml
 * (see server/routes/rss.xml.ts).
 */
export default defineEventHandler((event) => {
  return sendRedirect(event, '/rss.xml', 301)
})
