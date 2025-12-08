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

    // Get request body
    const body = await readBody(event)

    // Fetch the page to verify it exists
    const page = await fetchOneFromDb<DbPage>('pages', pageId)

    if (!page) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found'
      })
    }

    // Prepare update data
    const updateData: Record<string, any> = {}

    // Allow updating status
    if (body.status && ['draft', 'published', 'archived'].includes(body.status)) {
      updateData.status = body.status

      // Update published_at when publishing
      if (body.status === 'published' && !page.published_at) {
        updateData.published_at = new Date().toISOString()
      }
    }

    // If no valid updates provided
    if (Object.keys(updateData).length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No valid update data provided'
      })
    }

    // Update the page
    await updateRow('pages', pageId, updateData)

    return {
      success: true,
      message: 'Page updated successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to update page:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
