import type { DbArticle, DbCategory } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Get pagination parameters from query
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const sortBy = (query.sortBy as string) || 'created_at'
    const sortOrder = (query.sortOrder as 'asc' | 'desc') || 'desc'

    // Fetch articles and categories
    const [articlesResponse, categoriesResponse] = await Promise.all([
      fetchFromDb<DbArticle>('articles', {
        page,
        limit,
        sortBy,
        sortOrder
      }),
      fetchFromDb<DbCategory>('categories', { limit: 100 })
    ])

    const articles = articlesResponse.data || []
    const categories = categoriesResponse.data || []

    // Enhance articles with category names
    const articlesWithCategory = articles.map(article => {
      const category = categories.find(cat => cat.id === article.category_id)
      return {
        ...article,
        category_name: category?.name || 'Uncategorized'
      }
    })

    return {
      success: true,
      articles: articlesWithCategory,
      pagination: {
        page: articlesResponse.meta?.page || page,
        limit: articlesResponse.meta?.limit || limit,
        total: articlesResponse.meta?.total || articles.length,
        totalPages: Math.ceil((articlesResponse.meta?.total || articles.length) / limit)
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to fetch articles:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
