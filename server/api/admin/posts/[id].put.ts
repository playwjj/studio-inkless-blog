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

    // Get request body
    const body = await readBody(event)

    // Fetch the article to verify it exists
    const article = await fetchOneFromDb<DbArticle>('articles', articleId)

    if (!article) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article not found'
      })
    }

    // Prepare update data
    const updateData: Record<string, any> = {}

    // Allow updating status
    if (body.status && ['draft', 'published', 'archived'].includes(body.status)) {
      updateData.status = body.status

      // Update published_at when publishing
      if (body.status === 'published' && !article.published_at) {
        updateData.published_at = new Date().toISOString()
      }
    }

    // If no valid updates provided
    if (Object.keys(updateData).length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No valid update data provided'
      })
    }

    // Update the article
    await updateRow('articles', articleId, updateData)

    return {
      success: true,
      message: 'Article updated successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to update article:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
