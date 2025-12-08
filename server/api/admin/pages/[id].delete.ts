import type { DbPage } from '~/server/types/dbTypes'

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

    // Fetch the page to verify it exists
    const page = await fetchOneFromDb<DbPage>('pages', pageId)

    if (!page) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found'
      })
    }

    // Delete the page
    await deleteRow('pages', pageId)

    return {
      success: true,
      message: 'Page deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to delete page:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
