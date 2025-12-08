import type { DbTag, DbArticleTag } from '~/server/types/dbTypes'

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

    // Fetch the tag to verify it exists
    const tag = await fetchOneFromDb<DbTag>('tags', tagId)

    if (!tag) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Tag not found'
      })
    }

    // Check if tag is being used (usage_count > 0)
    if (tag.usage_count > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: `Cannot delete tag with ${tag.usage_count} article(s). Please remove the tag from articles first.`
      })
    }

    // Delete the tag
    await deleteRow('tags', tagId)

    return {
      success: true,
      message: 'Tag deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to delete tag:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
