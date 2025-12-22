/**
 * API endpoint to recalculate count for all categories
 * This will fix any inconsistencies in category counts
 */
export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Recalculate all category counts using optimized batch function
    await recalculateAllCategoryCounts()

    return {
      success: true,
      message: 'Successfully recalculated all category counts'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to recalculate category counts:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
