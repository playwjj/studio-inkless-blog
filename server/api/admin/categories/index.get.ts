import type { DbCategory } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Fetch categories and articles
    const [categoriesResponse] = await Promise.all([
      fetchFromDb<DbCategory>('categories', {
        limit: 100,
        sortBy: 'created_at',
        sortOrder: 'desc'
      })
    ])

    const categories = categoriesResponse.data

    // Count articles per category
    const categoriesWithCount = categories.map(category => ({
      ...category,
      post_count: category.count
    }))

    return {
      success: true,
      categories: categoriesWithCount,
      total: categoriesResponse.meta?.total || categories.length
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to fetch categories:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
