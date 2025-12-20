/**
 * API endpoint to recalculate usage_count for all tags
 * This will fix any inconsistencies in tag counts
 */
export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Recalculate all tag counts
    await recalculateAllTagCounts()

    return {
      success: true,
      message: 'Successfully recalculated all tag usage counts'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to recalculate tag counts:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
