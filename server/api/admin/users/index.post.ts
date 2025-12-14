import type { DbUser } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event)

    const body = await readBody(event)
    const { username, email, password, full_name, avatar_url, role, is_active } = body

    if (!username || !email) {
      throw createError({ statusCode: 400, statusMessage: 'Username and email are required' })
    }

    // Check uniqueness
    const existingByUsername = await fetchByField<DbUser>('users', 'username', username)
    if (existingByUsername) {
      throw createError({ statusCode: 409, statusMessage: 'Username already exists' })
    }
    const existingByEmail = await fetchByField<DbUser>('users', 'email', email)
    if (existingByEmail) {
      throw createError({ statusCode: 409, statusMessage: 'Email already exists' })
    }

    // Password is required for new user
    if (!password || password.length < 8) {
      throw createError({ statusCode: 400, statusMessage: 'Password is required and must be at least 8 characters' })
    }

    // Hash password
    const password_hash = await hashPassword(password)

    const now = new Date().toISOString()

    const newUser = await createRow<DbUser>('users', {
      username: String(username).trim(),
      email: String(email).trim(),
      password_hash,
      full_name: full_name?.trim() || null,
      avatar_url: avatar_url?.trim() || null,
      role: role || 'viewer',
      is_active: is_active ? 1 : 0,
      created_at: now,
      updated_at: now,
      bio: ''
    })

    if (newUser && newUser.password_hash) newUser.password_hash = ''

    return {
      success: true,
      user: newUser
    }
  } catch (error: any) {
    if (error.statusCode) throw error

    console.error('Failed to create user:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
