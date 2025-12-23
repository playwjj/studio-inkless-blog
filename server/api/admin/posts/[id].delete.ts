import type { DbArticle } from '~/server/types/dbTypes'
import { purgeCacheForPost } from '~/server/utils/cache'

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

    // Update tag counts before deleting (if article is published)
    if (article.status === 'published') {
      // Get tag IDs for this article
      const relations = await executeQuery<{ tag_id: number }>(
        `SELECT tag_id FROM article_tags WHERE article_id = ?`,
        [articleId]
      )
      const tagIds = relations.map(r => r.tag_id)

      if (tagIds.length > 0) {
        // Decrement usage counts
        const placeholders = tagIds.map(() => '?').join(',')
        await executeQuery(
          `UPDATE tags
           SET usage_count = CASE
             WHEN usage_count > 0 THEN usage_count - 1
             ELSE 0
           END,
           updated_at = ?
           WHERE id IN (${placeholders})`,
          [new Date().toISOString(), ...tagIds]
        )
      }
    }

    // Delete the article (article_tags will be cascade deleted via foreign key)
    await deleteRow('articles', articleId)

    // Purge cache for this post
    const origin = getRequestURL(event).origin
    await purgeCacheForPost(articleId, origin)

    // Update category count if article was published
    if (article.status === 'published') {
      await decrementCategoryCount(article.category_id)
    }

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
