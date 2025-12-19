import { requireAuth } from '~/server/utils/auth'
import { deleteRow, fetchOneFromDb } from '~/server/utils/dbApi'
import type { DbNewsletter } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Get newsletter ID from route params
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Newsletter ID is required'
      })
    }

    // Check if newsletter exists
    const newsletter = await fetchOneFromDb<DbNewsletter>('newsletters', parseInt(id))

    if (!newsletter) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Newsletter subscriber not found'
      })
    }

    // Delete the newsletter
    await deleteRow('newsletters', parseInt(id))

    return {
      success: true,
      message: 'Subscriber deleted successfully'
    }
  } catch (error: any) {
    console.error('Failed to delete newsletter:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete subscriber'
    })
  }
})
