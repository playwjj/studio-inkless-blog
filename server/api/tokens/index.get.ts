import type { DbApiToken } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Get current user from session
    const currentUser = await requireAuth(event)

    // Fetch all tokens for the current user
    const response = await fetchFromDb<DbApiToken>('api_tokens', {
      limit: 100
    })

    // Filter tokens by user_id (since the API doesn't support filtering)
    const userTokens = response.data.filter(token => token.user_id === currentUser.id)

    // Remove token_hash from response for security
    const safeTokens = userTokens.map(token => ({
      id: token.id,
      name: token.name,
      description: token.description,
      scopes: token.scopes ? JSON.parse(token.scopes) : [],
      expires_at: token.expires_at,
      last_used_at: token.last_used_at,
      is_active: token.is_active,
      created_at: token.created_at
    }))

    return {
      success: true,
      tokens: safeTokens
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Get tokens error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
