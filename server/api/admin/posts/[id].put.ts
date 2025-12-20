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
    const oldTags = article.tag_names || ''
    const newTags = body.tags !== undefined ? (body.tags || '') : oldTags

    // Handle tags if provided
    if (body.tags !== undefined) {
      updateData.tag_names = body.tags || ''  // Default to empty string, matching database default

      // Sync tags to tags table (only for published articles)
      await syncTagsToTableWithStatus(newTags, oldTags, oldStatus, newStatus)
    } else if (oldStatus !== newStatus) {
      // Status changed but tags didn't - still need to update tag counts
      await handleStatusChangeForTags(oldTags, oldStatus, newStatus)
    }

    // Update the article
    await updateRow('articles', articleId, updateData)

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

// Helper function to sync tags considering article status changes
async function syncTagsToTableWithStatus(
  newTagsString: string,
  oldTagsString: string,
  oldStatus: string,
  newStatus: string
) {
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

  // Tags that remain unchanged
  const tagsUnchanged = newTagNames.filter(
    tag => oldTagNames.some(oldTag => oldTag.toLowerCase() === tag.toLowerCase())
  )

  // Handle added tags
  for (const tagName of tagsToAdd) {
    // Only increment if new status is published
    if (newStatus === 'published') {
      await incrementOrCreateTag(tagName)
    } else {
      // Create tag with usage_count = 0 if it doesn't exist
      await ensureTagExists(tagName)
    }
  }

  // Handle removed tags
  for (const tagName of tagsToRemove) {
    // Only decrement if old status was published
    if (oldStatus === 'published') {
      await decrementTag(tagName)
    }
  }

  // Handle unchanged tags when status changes
  if (oldStatus !== newStatus && tagsUnchanged.length > 0) {
    for (const tagName of tagsUnchanged) {
      if (oldStatus === 'published' && newStatus !== 'published') {
        // Was published, now not - decrement
        await decrementTag(tagName)
      } else if (oldStatus !== 'published' && newStatus === 'published') {
        // Wasn't published, now is - increment
        await incrementOrCreateTag(tagName)
      }
    }
  }
}

// Helper function to handle status change when tags don't change
async function handleStatusChangeForTags(
  tagsString: string,
  oldStatus: string,
  newStatus: string
) {
  if (!tagsString || oldStatus === newStatus) return

  const tagNames = tagsString.split(',').map(tag => tag.trim()).filter(Boolean)

  if (oldStatus === 'published' && newStatus !== 'published') {
    // Changed from published to draft/archived
    for (const tagName of tagNames) {
      await decrementTag(tagName)
    }
  } else if (oldStatus !== 'published' && newStatus === 'published') {
    // Changed from draft/archived to published
    for (const tagName of tagNames) {
      await incrementOrCreateTag(tagName)
    }
  }
}

// Helper to increment tag or create if doesn't exist
async function incrementOrCreateTag(tagName: string) {
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
    console.error(`Failed to increment tag "${tagName}":`, error)
  }
}

// Helper to ensure tag exists (for draft articles)
async function ensureTagExists(tagName: string) {
  try {
    let tag = await fetchOneFromDb<{ id: number, name: string, usage_count: number }>(
      'tags',
      undefined,
      { name: tagName }
    )

    if (!tag) {
      // Create new tag with usage_count = 0
      await insertRow('tags', {
        name: tagName,
        slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        usage_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error(`Failed to ensure tag exists "${tagName}":`, error)
  }
}

// Helper to decrement tag
async function decrementTag(tagName: string) {
  try {
    let tag = await fetchOneFromDb<{ id: number, name: string, usage_count: number }>(
      'tags',
      undefined,
      { name: tagName }
    )

    if (tag && tag.usage_count > 0) {
      await updateRow('tags', tag.id, {
        usage_count: tag.usage_count - 1,
        updated_at: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error(`Failed to decrement tag "${tagName}":`, error)
  }
}
