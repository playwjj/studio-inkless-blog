import type { DbCategory } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Get pagination parameters from query
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 50
    const sortBy = (query.sortBy as string) || 'created_at'
    const sortOrder = (query.sortOrder as 'asc' | 'desc') || 'desc'

    // Fetch categories and articles
    const [categoriesResponse] = await Promise.all([
      fetchFromDb<DbCategory>('categories', {
        page,
        limit,
        sortBy,
        sortOrder
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
      pagination: {
        page: categoriesResponse.meta?.page || page,
        limit: categoriesResponse.meta?.limit || limit,
        total: categoriesResponse.meta?.total || categories.length,
        totalPages: Math.ceil((categoriesResponse.meta?.total || categories.length) / limit)
      }
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
