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

    // Get request body
    const body = await readBody(event)

    // Fetch the block to verify it exists
    const block = await fetchOneFromDb<DbPageBlock>('page_blocks', blockId)

    if (!block) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Block not found'
      })
    }

    // Prepare update data
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    }

    if (body.block_type !== undefined) updateData.block_type = body.block_type
    if (body.block_order !== undefined) updateData.block_order = parseInt(body.block_order)
    if (body.title !== undefined) updateData.title = body.title || null
    if (body.subtitle !== undefined) updateData.subtitle = body.subtitle || null
    if (body.content !== undefined) updateData.content = body.content || null
    if (body.config !== undefined) updateData.config = body.config || null
    if (body.background_color !== undefined) updateData.background_color = body.background_color || null
    if (body.background_image !== undefined) updateData.background_image = body.background_image || null
    if (body.text_color !== undefined) updateData.text_color = body.text_color || null
    if (body.is_visible !== undefined) updateData.is_visible = body.is_visible ? 1 : 0

    // Update the block
    await updateRow('page_blocks', blockId, updateData)

    return {
      success: true,
      message: 'Block updated successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to update page block:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
