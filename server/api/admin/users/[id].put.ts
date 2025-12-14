import type { DbUser } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event)

    const userId = getRouterParam(event, 'id')

    if (!userId) {
      throw createError({ statusCode: 400, statusMessage: 'User ID is required' })
    }

    const body = await readBody(event)
    const { username, email, password, full_name, avatar_url, role, is_active } = body

    // Fetch existing user
    const existing = await fetchOneFromDb<DbUser>('users', userId)
    if (!existing) {
      throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    // Validate uniqueness if username/email changed
    if (username && username !== existing.username) {
      const u = await fetchByField<DbUser>('users', 'username', username)
      if (u) throw createError({ statusCode: 409, statusMessage: 'Username already exists' })
    }
    if (email && email !== existing.email) {
      const e = await fetchByField<DbUser>('users', 'email', email)
      if (e) throw createError({ statusCode: 409, statusMessage: 'Email already exists' })
    }

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    }

    if (username !== undefined) updateData.username = String(username).trim()
    if (email !== undefined) updateData.email = String(email).trim()
    if (full_name !== undefined) updateData.full_name = full_name?.trim() || null
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url?.trim() || null
    if (role !== undefined) updateData.role = role
    if (is_active !== undefined) updateData.is_active = is_active ? 1 : 0

    if (password !== undefined && password !== '') {
      if (String(password).length < 8) {
        throw createError({ statusCode: 400, statusMessage: 'Password must be at least 8 characters' })
      }
      updateData.password_hash = await hashPassword(password)
    }

    const updated = await updateRow<DbUser>('users', userId, updateData)
    if (updated && updated.password_hash) updated.password_hash = ''

    return {
      success: true,
      user: updated
    }
  } catch (error: any) {
    if (error.statusCode) throw error

    console.error('Failed to update user:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
