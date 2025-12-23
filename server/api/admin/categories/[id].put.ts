import type { DbCategory } from '~/server/types/dbTypes'
import { purgeCacheForCategory } from '~/server/utils/cache'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Get category ID from route params
    const categoryId = getRouterParam(event, 'id')

    if (!categoryId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category ID is required'
      })
    }

    const body = await readBody(event)
    const { name, slug, description } = body

    // Validate required fields
    if (!name || !slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name and slug are required'
      })
    }

    // Fetch existing category
    const existingCategory = await fetchOneFromDb<DbCategory>('categories', categoryId)

    if (!existingCategory) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }

    // Check if slug is taken by another category
    if (slug !== existingCategory.slug) {
      const categoryWithSlug = await fetchByField<DbCategory>('categories', 'slug', slug)
      if (categoryWithSlug && categoryWithSlug.id !== existingCategory.id) {
        throw createError({
          statusCode: 409,
          statusMessage: 'A category with this slug already exists'
        })
      }
    }

    // Update category
    const updatedCategory = await updateRow<DbCategory>('categories', categoryId, {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description?.trim() || null,
      updated_at: new Date().toISOString()
    })

    // Purge cache for categories
    const origin = getRequestURL(event).origin
    await purgeCacheForCategory(categoryId, origin)

    return {
      success: true,
      category: updatedCategory
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to update category:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
