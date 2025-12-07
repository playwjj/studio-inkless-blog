import type { DbUser } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Get current user from session
    const currentUser = await requireAuth(event)

    const body = await readBody(event)
    const { username, email, full_name, avatar_url } = body

    // Validate required fields
    if (!username || !email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username and email are required'
      })
    }

    // Check if username is already taken by another user
    if (username !== currentUser.username) {
      const existingUser = await fetchByField<DbUser>('users', 'username', username)
      if (existingUser && existingUser.id !== currentUser.id) {
        throw createError({
          statusCode: 409,
          statusMessage: 'Username already taken'
        })
      }
    }

    // Check if email is already taken by another user
    if (email !== currentUser.email) {
      const existingUser = await fetchByField<DbUser>('users', 'email', email)
      if (existingUser && existingUser.id !== currentUser.id) {
        throw createError({
          statusCode: 409,
          statusMessage: 'Email already taken'
        })
      }
    }

    // Update user
    const updatedUser = await updateRow<DbUser>('users', currentUser.id, {
      username,
      email,
      full_name: full_name || null,
      avatar_url: avatar_url || null,
      updated_at: new Date().toISOString()
    })

    // Update session
    const userSession = createUserSession(updatedUser)
    await setUserSession(event, userSession)

    return {
      success: true,
      user: userSession
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Update profile error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
