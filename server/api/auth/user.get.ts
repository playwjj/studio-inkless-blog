export default defineEventHandler(async (event) => {
  try {
    const user = await getUserFromSession(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not authenticated'
      })
    }

    return {
      success: true,
      user
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Get user error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
