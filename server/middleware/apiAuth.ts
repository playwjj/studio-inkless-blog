import type { H3Event } from 'h3'
import type { DbApiToken, DbUser } from '~/server/types/dbTypes'

/**
 * API Token Authentication Middleware
 *
 * This middleware checks for API tokens in the Authorization header.
 * If a valid token is found, it attaches the user to the event context.
 *
 * Usage in API routes:
 * - Check if event.context.apiUser exists to determine if authenticated via API token
 * - Check if event.context.isApiRequest is true
 */
export default defineEventHandler(async (event) => {
  // Only process API routes
  const path = event.path
  if (!path.startsWith('/api/')) {
    return
  }

  // Skip authentication routes
  if (path.startsWith('/api/auth/') || path.startsWith('/api/tokens/')) {
    return
  }

  // Check for API token in Authorization header
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No API token, continue to next middleware/handler
    return
  }

  const token = authHeader.substring(7) // Remove 'Bearer ' prefix

  // Validate token format
  if (!token.startsWith('sk_live_')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid API token format'
    })
  }

  try {
    // Hash the token to look it up in database
    const tokenHash = await hashApiToken(token)

    // Find token in database
    const dbToken = await findTokenByHash(tokenHash)

    if (!dbToken) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid API token'
      })
    }

    // Validate token
    if (!isTokenValid(dbToken)) {
      throw createError({
        statusCode: 401,
        statusMessage: 'API token is expired or inactive'
      })
    }

    // Fetch user associated with token
    const user = await fetchOneFromDb<DbUser>('users', dbToken.user_id)

    if (!user || user.is_active !== 1) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User account is inactive'
      })
    }

    // Attach user and token info to event context
    event.context.apiUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }
    event.context.apiToken = {
      id: dbToken.id,
      scopes: dbToken.scopes ? JSON.parse(dbToken.scopes) : []
    }
    event.context.isApiRequest = true

    // Update token last used (don't await to avoid slowing down requests)
    updateTokenLastUsed(dbToken.id).catch(err => {
      console.error('Failed to update token last used:', err)
    })

  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('API token validation error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
