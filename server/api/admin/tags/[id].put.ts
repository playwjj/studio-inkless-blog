import type { DbTag } from '~/server/types/dbTypes'
import { purgeCacheForTag } from '~/server/utils/cache'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Get tag ID from route params
    const tagId = getRouterParam(event, 'id')

    if (!tagId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tag ID is required'
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

    // Fetch existing tag
    const existingTag = await fetchOneFromDb<DbTag>('tags', tagId)

    if (!existingTag) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Tag not found'
      })
    }

    // Check if slug is taken by another tag
    if (slug !== existingTag.slug) {
      const tagWithSlug = await fetchByField<DbTag>('tags', 'slug', slug)
      if (tagWithSlug && tagWithSlug.id !== existingTag.id) {
        throw createError({
          statusCode: 409,
          statusMessage: 'A tag with this slug already exists'
        })
      }
    }

    // Update tag
    const updatedTag = await updateRow<DbTag>('tags', tagId, {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description?.trim() || null,
      updated_at: new Date().toISOString()
    })

    // Purge cache for tags
    const origin = getRequestURL(event).origin
    await purgeCacheForTag(tagId, origin)

    return {
      success: true,
      tag: updatedTag
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to update tag:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
