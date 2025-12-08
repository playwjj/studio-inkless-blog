import type { DbCategory } from '~/server/types/dbTypes'

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
    const existingCategory = await fetchByField<DbCategory>('categories', 'slug', slug)
    if (existingCategory) {
      throw createError({
        statusCode: 409,
        statusMessage: 'A category with this slug already exists'
      })
    }

    // Create category
    const newCategory = await createRow<DbCategory>('categories', {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description?.trim() || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    return {
      success: true,
      category: {
        ...newCategory,
        post_count: 0
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to create category:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
