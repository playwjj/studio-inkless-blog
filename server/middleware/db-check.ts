import { fetchFromDb } from '~/server/utils/dbApi'

// Cache a successful check per isolate so page requests don't each hit the DB
const CHECK_TTL_MS = 5 * 60 * 1000
let lastSuccessfulCheck = 0

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

  // Skip the DB round-trip if connectivity was verified recently
  if (Date.now() - lastSuccessfulCheck < CHECK_TTL_MS) { return }

  // Try a lightweight DB request to verify connectivity
  try {
    // fetchFromDb will throw if it cannot connect or credentials are invalid
    await fetchFromDb('site', { page: 1, limit: 1 })
    lastSuccessfulCheck = Date.now()
  } catch (err) {
    // Redirect browser requests to the setup page so user can follow instructions
    return sendRedirect(event, '/setup')
  }
})
