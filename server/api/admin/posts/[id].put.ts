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
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    }

    // Validate required fields
    if (!body.title || !body.slug || !body.content || !body.author_id || !body.category_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title, slug, content, author, and category are required'
      })
    }

    // Update allowed fields
    if (body.title) updateData.title = body.title
    if (body.slug) updateData.slug = body.slug
    if (body.content) updateData.content = body.content
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt
    if (body.cover_image_url !== undefined) updateData.cover_image_url = body.cover_image_url
    if (body.read_time) updateData.read_time = parseInt(body.read_time)
    if (body.is_featured !== undefined) updateData.is_featured = parseInt(body.is_featured)
    if (body.author_id) updateData.author_id = parseInt(body.author_id)
    if (body.category_id) updateData.category_id = parseInt(body.category_id)

    // Allow updating status
    if (body.status && ['draft', 'published', 'archived'].includes(body.status)) {
      updateData.status = body.status
    }

    // Update published_at if provided, or set current time when publishing
    if (body.published_at) {
      updateData.published_at = body.published_at
    } else if (body.status === 'published') {
      updateData.published_at = new Date().toISOString()
    }

    // Prepare status information for tag and category updates
    const oldStatus = article.status
    const newStatus = body.status || oldStatus
    const oldCategoryId = article.category_id
    const newCategoryId = body.category_id ? parseInt(body.category_id) : oldCategoryId

    // Handle tags using many-to-many relationship
    if (body.tags !== undefined) {
      // Get old tags from article_tags table
      const oldTagNames = await getArticleTagNames(articleId)
      const oldTags = oldTagNames.join(', ')
      const newTags = body.tags || ''

      // Sync tags using many-to-many relationship
      await syncArticleTags(articleId, newTags, oldTags, newStatus)
    } else if (oldStatus !== newStatus) {
      // Status changed but tags didn't - still need to update tag counts
      await handleArticleStatusChangeForTags(articleId, oldStatus, newStatus)
    }

    // Update the article
    await updateRow('articles', articleId, updateData)

    // Purge cache for this post
    const origin = getRequestURL(event).origin
    await purgeCacheForPost(articleId, origin)

    // Update category counts based on changes
    // Handle category change
    if (oldCategoryId !== newCategoryId) {
      // If article is published, update both old and new category counts
      if (oldStatus === 'published') {
        await decrementCategoryCount(oldCategoryId)
      }
      if (newStatus === 'published') {
        await incrementCategoryCount(newCategoryId)
      }
    }
    // Handle status change (same category)
    else if (oldStatus !== newStatus) {
      if (oldStatus === 'published' && newStatus !== 'published') {
        // Changed from published to draft/archived
        await decrementCategoryCount(oldCategoryId)
      } else if (oldStatus !== 'published' && newStatus === 'published') {
        // Changed from draft/archived to published
        await incrementCategoryCount(newCategoryId)
      }
    }

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

