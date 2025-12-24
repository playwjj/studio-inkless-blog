import type { DbArticle } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Get request body
    const body = await readBody(event)

    // Validate required fields
    if (!body.title || !body.slug || !body.content || !body.author_id || !body.category_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title, slug, content, author, and category are required'
      })
    }

    // Generate UUID for article id (since id is text type in database)
    const articleId = crypto.randomUUID()

    // Prepare article data
    const articleData: Partial<DbArticle> = {
      id: articleId,  // UUID as text
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt || '',
      status: body.status || 'draft',
      author_id: parseInt(body.author_id),
      category_id: parseInt(body.category_id),
      cover_image_url: body.cover_image_url || null,
      read_time: body.read_time ? parseInt(body.read_time) : 5,
      is_featured: body.is_featured ? parseInt(body.is_featured) : 0,
      view_count: 0,  // Initialize view count
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // published_at is required in database, set it based on status
      published_at: body.status === 'published'
        ? (body.published_at || new Date().toISOString())
        : new Date().toISOString()  // Even for drafts, set a timestamp
    }

    // Insert article into database
    console.log(`[CreatePost] Creating article with ID: ${articleId}`)
    await insertRow('articles', articleData)
    console.log(`[CreatePost] Article created successfully`)

    // Sync tags using many-to-many relationship (with fault tolerance)
    let tagSyncSuccess = true
    let tagSyncError: string | null = null

    if (body.tags) {
      console.log(`[CreatePost] Syncing tags: ${body.tags}`)
      try {
        // Use fast path for new articles
        await syncArticleTags(articleId, body.tags, '', body.status, true)
        console.log(`[CreatePost] Tags synced successfully`)
      } catch (tagError: any) {
        // Fault tolerance: Don't rollback article if tag sync fails
        // Article is more important than tags, tags can be fixed later
        tagSyncSuccess = false
        tagSyncError = tagError?.message || 'Unknown error'
        console.error('[CreatePost] Failed to sync tags (non-fatal):', tagError)
        console.warn(`[CreatePost] Article ${articleId} created but tags failed to sync. User can edit article later to retry.`)
      }
    }

    // Update category count if article is published
    if (body.status === 'published') {
      console.log(`[CreatePost] Updating category count for category ${body.category_id}`)
      try {
        await incrementCategoryCount(parseInt(body.category_id))
      } catch (categoryError) {
        // Also non-fatal, just log the error
        console.error('[CreatePost] Failed to update category count (non-fatal):', categoryError)
      }
    }

    console.log(`[CreatePost] Article ${articleId} created successfully`)

    // Return response with warning if tags failed
    if (!tagSyncSuccess) {
      return {
        success: true,
        message: 'Article created successfully, but tags sync failed',
        warning: 'Tags were not synced. Please edit the article to retry tag sync.',
        data: {
          id: articleId,
          tagSyncFailed: true,
          tagSyncError: tagSyncError
        }
      }
    }

    return {
      success: true,
      message: 'Article created successfully',
      data: {
        id: articleId
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to create article:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})

