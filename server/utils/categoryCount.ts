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

/**
 * Recalculate count for all categories
 * Optimized for Cloudflare Workers to avoid "Too many subrequests" error
 */
export async function recalculateAllCategoryCounts(): Promise<void> {
  try {
    // Get all categories and articles in parallel
    const [allCategories, articleCounts] = await Promise.all([
      fetchAllFromDb<{ id: number, name: string }>('categories'),
      executeQuery<{ category_id: number, count: number }>(
        'SELECT category_id, COUNT(*) as count FROM articles WHERE status = ? GROUP BY category_id',
        ['published']
      )
    ])

    if (allCategories.length === 0) {
      console.log('No categories to recalculate')
      return
    }

    // Create a map of category counts
    const countMap = new Map<number, number>()
    for (const result of articleCounts) {
      countMap.set(result.category_id, result.count)
    }

    // Build batch update SQL
    const now = new Date().toISOString()
    const whenClauses = allCategories.map(category => {
      const count = countMap.get(category.id) || 0
      console.log(`Updated category "${category.name}" count to ${count}`)
      return `WHEN id = ${category.id} THEN ${count}`
    }).join(' ')

    const updateSql = `
      UPDATE categories
      SET count = CASE ${whenClauses} ELSE 0 END,
          updated_at = ?
      WHERE id IN (${allCategories.map(c => c.id).join(',')})
    `

    await executeQuery(updateSql, [now])

    console.log('Successfully recalculated all category counts')
  } catch (error) {
    console.error('Failed to recalculate category counts:', error)
    throw error
  }
}
