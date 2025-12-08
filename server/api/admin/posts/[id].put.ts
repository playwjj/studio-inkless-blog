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
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    }

    // Update allowed fields
    if (body.title) updateData.title = body.title
    if (body.slug) updateData.slug = body.slug
    if (body.content) updateData.content = body.content
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt
    if (body.cover_image_url !== undefined) updateData.cover_image_url = body.cover_image_url
    if (body.read_time) updateData.read_time = parseInt(body.read_time)
    if (body.category_id !== undefined) {
      updateData.category_id = body.category_id ? parseInt(body.category_id) : null
    }

    // Allow updating status
    if (body.status && ['draft', 'published', 'archived'].includes(body.status)) {
      updateData.status = body.status

      // Update published_at when publishing for the first time
      if (body.status === 'published' && !article.published_at) {
        updateData.published_at = new Date().toISOString()
      }
    }

    // Update published_at if provided
    if (body.published_at) {
      updateData.published_at = body.published_at
    }

    // Update the article
    await updateRow('articles', articleId, updateData)

    // Handle tags if provided
    if (body.tags !== undefined) {
      // Remove existing tags
      await deleteRows('article_tags', { article_id: articleId })

      if (body.tags) {
        const tagNames = body.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)

        for (const tagName of tagNames) {
          // Find or create tag
          let tag = await fetchOneFromDb<{ id: number, name: string }>('tags', undefined, { name: tagName })

          if (!tag) {
            const tagResult = await insertRow('tags', {
              name: tagName,
              slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
              created_at: new Date().toISOString()
            })
            tag = { id: tagResult.lastID, name: tagName }
          }

          // Create article-tag relationship
          if (tag && tag.id) {
            await insertRow('article_tags', {
              article_id: parseInt(articleId),
              tag_id: tag.id
            })
          }
        }
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
