import type { DbArticle } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Get article ID from route params
    const articleId = getRouterParam(event, 'id')

    if (!articleId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Article ID is required'
      })
    }

    // Fetch the article to verify it exists
    const article = await fetchOneFromDb<DbArticle>('articles', articleId)

    if (!article) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article not found'
      })
    }

    // Delete the article
    await deleteRow('articles', articleId)

    return {
      success: true,
      message: 'Article deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to delete article:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
