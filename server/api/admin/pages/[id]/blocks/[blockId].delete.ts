import type { DbPageBlock } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Get block ID from route params
    const blockId = getRouterParam(event, 'blockId')

    if (!blockId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Block ID is required'
      })
    }

    // Verify block exists
    const block = await fetchOneFromDb<DbPageBlock>('page_blocks', blockId)

    if (!block) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Block not found'
      })
    }

    // Delete the block
    await deleteRow('page_blocks', blockId)

    return {
      success: true,
      message: 'Block deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to delete page block:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
