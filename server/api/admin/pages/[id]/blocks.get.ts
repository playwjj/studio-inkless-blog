import type { DbPageBlock } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Get page ID from route params
    const pageId = getRouterParam(event, 'id')

    if (!pageId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Page ID is required'
      })
    }

    // Fetch all blocks for this page, ordered by block_order
    const blocksResponse = await fetchFromDb<DbPageBlock>('page_blocks', {
      where: { page_id: parseInt(pageId) },
      sortBy: 'block_order',
      sortOrder: 'asc',
      limit: 100
    })

    const blocks = blocksResponse.data || []

    return {
      success: true,
      blocks: blocks
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to fetch page blocks:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
