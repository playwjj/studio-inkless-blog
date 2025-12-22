import { deleteRow } from '~/server/utils/dbApi'

export default defineEventHandler(async (event) => {
  try {
    // Check authentication
    const user = await requireAuth(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const id = Number(getRouterParam(event, 'id'))

    if (!id || isNaN(id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid contact message ID'
      })
    }

    await deleteRow('contact_us', id)

    return {
      success: true,
      message: 'Contact message deleted successfully'
    }
  } catch (error: any) {
    console.error('Delete contact message error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete contact message'
    })
  }
})
