import type { DbTag } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    const body = await readBody(event)
    const { name, slug, description } = body

    // Validate required fields
    if (!name || !slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name and slug are required'
      })
    }

    // Check if slug already exists
    const existingTag = await fetchByField<DbTag>('tags', 'slug', slug)
    if (existingTag) {
      throw createError({
        statusCode: 409,
        statusMessage: 'A tag with this slug already exists'
      })
    }

    // Create tag
    const newTag = await createRow<DbTag>('tags', {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description?.trim() || null,
      usage_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    return {
      success: true,
      tag: newTag
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to create tag:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
