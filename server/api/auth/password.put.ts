import type { DbUser } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Get current user from session
    const currentUser = await requireAuth(event)

    const body = await readBody(event)
    const { current_password, new_password } = body

    // Validate required fields
    if (!current_password || !new_password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Current password and new password are required'
      })
    }

    // Validate new password strength
    if (new_password.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'New password must be at least 8 characters long'
      })
    }

    // Fetch user from database to get password hash
    const user = await fetchOneFromDb<DbUser>('users', currentUser.id)

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Verify current password
    const isPasswordValid = await verifyPassword(current_password, user.password_hash)

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Current password is incorrect'
      })
    }

    // Hash new password
    const newPasswordHash = await hashPassword(new_password)

    // Update password
    await updateRow('users', user.id, {
      password_hash: newPasswordHash,
      updated_at: new Date().toISOString()
    })

    return {
      success: true,
      message: 'Password updated successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Change password error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
