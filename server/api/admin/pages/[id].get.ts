import type { DbPage, DbPageBlock } from '~/server/types/dbTypes'

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

    // Fetch the page
    const page = await fetchOneFromDb<DbPage>('pages', pageId)

    if (!page) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found'
      })
    }

    // Fetch page blocks
    // fetchFromDb has no WHERE support, so filter by page in SQL
    const blocks = await executeQuery<DbPageBlock>(
      'SELECT * FROM page_blocks WHERE page_id = ? ORDER BY block_order ASC',
      [parseInt(pageId)]
    )

    return {
      success: true,
      data: {
        ...page,
        page_blocks: blocks
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to fetch page:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
