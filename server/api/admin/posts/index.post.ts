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
      updated_at: new Date().toISOString(),
      tag_names: body.tags || null  // Store tags as comma-separated string
    }

    // Set published_at if status is published
    if (body.status === 'published') {
      articleData.published_at = body.published_at || new Date().toISOString()
    }

    // Insert article into database
    const result = await insertRow('articles', articleData)

    // Sync tags to tags table
    if (body.tags) {
      await syncTagsToTable(body.tags)
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

// Helper function to sync tags to tags table
async function syncTagsToTable(tagsString: string) {
  if (!tagsString) return

  const tagNames = tagsString
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)

  for (const tagName of tagNames) {
    try {
      // Check if tag exists
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
        // Update usage count
        await updateRow('tags', tag.id, {
          usage_count: (tag.usage_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error(`Failed to sync tag "${tagName}":`, error)
    }
  }
}
