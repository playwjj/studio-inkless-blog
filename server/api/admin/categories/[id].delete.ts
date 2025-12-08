import type { DbCategory, DbArticle } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Get category ID from route params
    const categoryId = getRouterParam(event, 'id')

    if (!categoryId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category ID is required'
      })
    }

    // Fetch the category to verify it exists
    const category = await fetchOneFromDb<DbCategory>('categories', categoryId)

    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }

    // Check if category has any articles
    const articlesResponse = await fetchFromDb<DbArticle>('articles', { limit: 1000 })
    const articlesInCategory = articlesResponse.data.filter(
      article => article.category_id === category.id
    )

    if (articlesInCategory.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: `Cannot delete category with ${articlesInCategory.length} article(s). Please reassign or delete the articles first.`
      })
    }

    // Delete the category
    await deleteRow('categories', categoryId)

    return {
      success: true,
      message: 'Category deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to delete category:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
