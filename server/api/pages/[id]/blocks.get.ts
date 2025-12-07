import type { DbPageBlock } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Page ID is required'
    })
  }

  try {
    // Fetch all blocks for this page
    const blocksResponse = await fetchFromDb<DbPageBlock>('page_blocks', {
      limit: 100
    })

    // Filter blocks by page_id and visible status
    let blocks = blocksResponse.data.filter(
      block => block.page_id === parseInt(id) && block.is_visible === 1
    )

    // Sort by block_order
    blocks = blocks.sort((a, b) => a.block_order - b.block_order)

    // Parse JSON config for each block
    const parsedBlocks = blocks.map(block => ({
      ...block,
      config: block.config ? JSON.parse(block.config) : null
    }))

    return {
      blocks: parsedBlocks
    }
  } catch (error) {
    console.error('Failed to fetch page blocks:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch page blocks'
    })
  }
})
