/**
 * Update the count field for a category
 * This function recalculates the article count for a given category
 */
export async function updateCategoryCount(categoryId: number): Promise<void> {
  try {
    // Count all published articles in this category
    const articles = await executeQuery<{ count: number }>(
      'SELECT COUNT(*) as count FROM articles WHERE category_id = ? AND status = ?',
      [categoryId, 'published']
    )

    const count = articles[0]?.count || 0

    // Update the category count
    await updateRow('categories', categoryId, {
      count,
      updated_at: new Date().toISOString()
    })
  } catch (error) {
    console.error(`Failed to update category count for category ${categoryId}:`, error)
    // Don't throw - we don't want to fail the main operation if count update fails
  }
}

/**
 * Increment the count for a category (faster than recalculating)
 */
export async function incrementCategoryCount(categoryId: number): Promise<void> {
  try {
    const category = await fetchOneFromDb<{ id: number, count: number }>(
      'categories',
      categoryId
    )

    if (category) {
      await updateRow('categories', categoryId, {
        count: (category.count || 0) + 1,
        updated_at: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error(`Failed to increment category count for category ${categoryId}:`, error)
  }
}

/**
 * Decrement the count for a category (faster than recalculating)
 */
export async function decrementCategoryCount(categoryId: number): Promise<void> {
  try {
    const category = await fetchOneFromDb<{ id: number, count: number }>(
      'categories',
      categoryId
    )

    if (category && category.count > 0) {
      await updateRow('categories', categoryId, {
        count: category.count - 1,
        updated_at: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error(`Failed to decrement category count for category ${categoryId}:`, error)
  }
}
