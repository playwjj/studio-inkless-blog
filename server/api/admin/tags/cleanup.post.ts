/**
 * API endpoint to cleanup unused tags
 * This will delete tags with usage_count = 0
 */
export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Clean up unused tags
    const deletedCount = await cleanupUnusedTags()

    return {
      success: true,
      message: `Successfully deleted ${deletedCount} unused tag(s)`,
      data: {
        deletedCount
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to cleanup unused tags:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
