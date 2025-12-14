import { requireAuth } from '~/server/utils/auth'
import { fetchOneFromDb } from '~/server/utils/dbApi'
import type { DbUser } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Ensure the request is authenticated and get the user (may be session snapshot)
    const sessionUser: any = await requireAuth(event)

    // If we have an id, fetch the latest user data from the DB for real-time info
    const userId = sessionUser?.id

    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not authenticated'
      })
    }

    const freshUser = await fetchOneFromDb<DbUser>('users', userId)

    if (!freshUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Remove sensitive fields if present
    if (freshUser.password_hash) freshUser.password_hash = ''

    return {
      success: true,
      user: freshUser
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Get me error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
