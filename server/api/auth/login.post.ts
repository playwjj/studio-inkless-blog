import type { DbUser } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username and password are required'
    })
  }

  try {
    // Fetch user by username
    const user = await fetchByField<DbUser>('users', 'username', username)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // Check if user is active
    if (!user.is_active) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Account is disabled'
      })
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash)

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // Update last login time
    await updateRow('users', user.id, {
      last_login_at: new Date().toISOString()
    })

    // Create session
    const userSession = createUserSession(user)
    await setUserSession(event, userSession)

    return {
      success: true,
      user: userSession
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Login error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
