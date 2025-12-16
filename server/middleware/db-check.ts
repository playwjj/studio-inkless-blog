import { fetchFromDb } from '~/server/utils/dbApi'

export default defineEventHandler(async (event) => {
  const reqUrl = getRequestURL(event)
  const pathname = reqUrl.pathname || ''

  // Skip assets, API calls (allow APIs to return errors), setup page itself and nuxt internals
  if (
    pathname.startsWith('/_') ||
    pathname.startsWith('/api') ||
    pathname === '/setup' ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots.txt') ||
    pathname === '/sitemap.xml' ||
    pathname.startsWith('/.well-known')
  ) {
    return
  }

  const config = useRuntimeConfig()

  // Skip check if setupDisabled flag is set
  if (config.setupDisabled) { return }

  // If runtime config missing DB info, redirect to setup page
  if (!config.dbApiKey || !config.dbApiUrl) {
    return sendRedirect(event, '/setup')
  }

  // Try a lightweight DB request to verify connectivity
  try {
    // fetchFromDb will throw if it cannot connect or credentials are invalid
    await fetchFromDb('site', { page: 1, limit: 1 })
    // ok — allow request to proceed
  } catch (err) {
    // Redirect browser requests to the setup page so user can follow instructions
    return sendRedirect(event, '/setup')
  }
})
