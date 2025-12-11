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

    // Handle tags if provided
    if (body.tags !== undefined) {
      updateData.tag_names = body.tags || ''  // Default to empty string, matching database default

      // Sync tags to tags table
      if (body.tags) {
        await syncTagsToTable(body.tags, article.tag_names)
      }
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

// Helper function to sync tags to tags table
async function syncTagsToTable(newTagsString: string, oldTagsString?: string | null) {
  const newTagNames = newTagsString
    ? newTagsString.split(',').map(tag => tag.trim()).filter(Boolean)
    : []

  const oldTagNames = oldTagsString
    ? oldTagsString.split(',').map(tag => tag.trim()).filter(Boolean)
    : []

  // Find tags to add (in new but not in old)
  const tagsToAdd = newTagNames.filter(
    tag => !oldTagNames.some(oldTag => oldTag.toLowerCase() === tag.toLowerCase())
  )

  // Find tags to remove (in old but not in new)
  const tagsToRemove = oldTagNames.filter(
    tag => !newTagNames.some(newTag => newTag.toLowerCase() === tag.toLowerCase())
  )

  // Add/increment new tags
  for (const tagName of tagsToAdd) {
    try {
      let tag = await fetchOneFromDb<{ id: number, name: string, usage_count: number }>(
        'tags',
        undefined,
        { name: tagName }
      )

      if (!tag) {
        // Create new tag
        await insertRow('tags', {
          name: tagName,
          slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          usage_count: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      } else {
        // Increment usage count
        await updateRow('tags', tag.id, {
          usage_count: (tag.usage_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error(`Failed to sync tag "${tagName}":`, error)
    }
  }

  // Decrement removed tags
  for (const tagName of tagsToRemove) {
    try {
      let tag = await fetchOneFromDb<{ id: number, name: string, usage_count: number }>(
        'tags',
        undefined,
        { name: tagName }
      )

      if (tag && tag.usage_count > 0) {
        // Decrement usage count
        await updateRow('tags', tag.id, {
          usage_count: tag.usage_count - 1,
          updated_at: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error(`Failed to update tag "${tagName}":`, error)
    }
  }
}
