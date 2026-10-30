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
    const blocks = await executeQuery<DbPageBlock>(
      'SELECT * FROM page_blocks WHERE page_id = ? AND is_visible = 1 ORDER BY block_order ASC',
      [parseInt(id)]
    )

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
