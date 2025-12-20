/**
 * API endpoint to recalculate count for all categories
 * This will fix any inconsistencies in category counts
 */
export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Get all categories
    const allCategories = await fetchAllFromDb<{ id: number, name: string }>('categories')

    for (const category of allCategories) {
      await updateCategoryCount(category.id)
      console.log(`Updated category "${category.name}" count`)
    }

    return {
      success: true,
      message: 'Successfully recalculated all category counts',
      data: {
        categoriesUpdated: allCategories.length
      }
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
