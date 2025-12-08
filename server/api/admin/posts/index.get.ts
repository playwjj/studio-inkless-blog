import type { DbArticle, DbCategory } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Fetch articles and categories
    const [articlesResponse, categoriesResponse] = await Promise.all([
      fetchFromDb<DbArticle>('articles', {
        limit: 1000,
        sortBy: 'created_at',
        sortOrder: 'desc'
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
      total: articlesResponse.meta?.total || articles.length
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
