import { updateRow } from '~/server/utils/dbApi'

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

    const body = await readBody(event)
    const { status } = body

    // Validate status
    const validStatuses = ['new', 'read', 'replied', 'archived']
    if (!status || !validStatuses.includes(status)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid status. Must be one of: new, read, replied, archived'
      })
    }

    const now = new Date().toISOString()
    const updateData: any = {
      status,
      updated_at: now
    }

    // Update read_at when status changes to 'read' or 'replied'
    if ((status === 'read' || status === 'replied') && !body.read_at) {
      updateData.read_at = now
    }

    // Update replied_at when status changes to 'replied'
    if (status === 'replied' && !body.replied_at) {
      updateData.replied_at = now
    }

    await updateRow('contact_us', id, updateData)

    return {
      success: true,
      message: 'Contact message updated successfully'
    }
  } catch (error: any) {
    console.error('Update contact message error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update contact message'
    })
  }
})
