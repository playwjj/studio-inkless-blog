export default defineEventHandler(async (event) => {
  try {
    // Get current user from session
    const currentUser = await requireAuth(event)

    const body = await readBody(event)
    const { password } = body

    // Require password confirmation for account deletion
    if (!password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password confirmation is required'
      })
    }

    // Fetch user from database to verify password
    const user = await fetchOneFromDb('users', currentUser.id)

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash)

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Incorrect password'
      })
    }

    // Delete user account
    await deleteRow('users', currentUser.id)

    // Clear session
    await clearUserSession(event)

    return {
      success: true,
      message: 'Account deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Delete account error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
