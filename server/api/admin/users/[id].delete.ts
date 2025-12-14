export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event)

    const userId = getRouterParam(event, 'id')

    if (!userId) {
      throw createError({ statusCode: 400, statusMessage: 'User ID is required' })
    }

    const existing = await fetchOneFromDb('users', userId)
    if (!existing) {
      throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    // Prevent deleting last admin? (optional) — keep simple for now

    await deleteRow('users', userId)

    return {
      success: true,
      message: 'User deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) throw error

    console.error('Failed to delete user:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
