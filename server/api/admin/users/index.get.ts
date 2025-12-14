import type { DbUser } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    const users = await fetchAllFromDb<DbUser>('users')

    // Remove password_hash from response
    const safeUsers = (users || []).map((u: any) => {
      if (u.password_hash) u.password_hash = ''
      return u
    })

    return {
      success: true,
      data: safeUsers
    }
  } catch (error: any) {
    if (error.statusCode) throw error

    console.error('Failed to fetch users:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
