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
      tag_names: body.tags || '',  // Store tags as comma-separated string, default to empty string
      // published_at is required in database, set it based on status
      published_at: body.status === 'published'
        ? (body.published_at || new Date().toISOString())
        : new Date().toISOString()  // Even for drafts, set a timestamp
    }

    // Insert article into database
    await insertRow('articles', articleData)

    // Sync tags to tags table using batch operations (optimized)
    if (body.tags) {
      await batchSyncTags(body.tags, '', '', body.status)
    }

    // Update category count if article is published
    if (body.status === 'published') {
      await incrementCategoryCount(parseInt(body.category_id))
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

