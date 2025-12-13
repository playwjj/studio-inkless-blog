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

    // Get request body
    const body = await readBody(event)

    // Validate required fields
    if (!body.block_type) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Block type is required'
      })
    }

    // Prepare block data
    const blockData: Partial<DbPageBlock> = {
      page_id: parseInt(pageId),
      block_type: body.block_type,
      block_order: body.block_order !== undefined ? parseInt(body.block_order) : 0,
      title: body.title || null,
      subtitle: body.subtitle || null,
      content: body.content || null,
      config: body.config || null,
      background_color: body.background_color || null,
      background_image: body.background_image || null,
      text_color: body.text_color || null,
      is_visible: body.is_visible !== undefined ? (body.is_visible ? 1 : 0) : 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Insert block into database
    const result = await insertRow('page_blocks', blockData)

    return {
      success: true,
      message: 'Block created successfully',
      data: {
        id: result.id
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to create page block:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
