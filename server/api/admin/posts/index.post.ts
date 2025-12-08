import type { DbArticle } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Get request body
    const body = await readBody(event)

    // Validate required fields
    if (!body.title || !body.slug || !body.content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title, slug, and content are required'
      })
    }

    // Prepare article data
    const articleData: Partial<DbArticle> = {
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt || '',
      status: body.status || 'draft',
      author_id: 1, // TODO: Get from session
      category_id: body.category_id ? parseInt(body.category_id) : null,
      cover_image_url: body.cover_image_url || null,
      read_time: body.read_time ? parseInt(body.read_time) : 5,
      views: 0,
      likes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Set published_at if status is published
    if (body.status === 'published') {
      articleData.published_at = body.published_at || new Date().toISOString()
    }

    // Insert article into database
    const result = await insertRow('articles', articleData)

    // Handle tags if provided
    if (body.tags && result.lastID) {
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
            article_id: result.lastID,
            tag_id: tag.id
          })
        }
      }
    }

    return {
      success: true,
      message: 'Article created successfully',
      data: {
        id: result.lastID
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
