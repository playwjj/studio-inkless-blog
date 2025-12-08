import type { DbApiToken } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Get current user from session
    const currentUser = await requireAuth(event)

    // Get token ID from route params
    const tokenId = getRouterParam(event, 'id')

    if (!tokenId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token ID is required'
      })
    }

    // Fetch the token to verify ownership
    const token = await fetchOneFromDb<DbApiToken>('api_tokens', tokenId)

    if (!token) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Token not found'
      })
    }

    // Verify the token belongs to the current user
    if (token.user_id !== currentUser.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'You do not have permission to delete this token'
      })
    }

    // Delete the token
    await deleteRow('api_tokens', tokenId)

    return {
      success: true,
      message: 'Token deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Delete token error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
