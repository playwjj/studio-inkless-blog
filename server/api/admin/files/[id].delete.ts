import type { DbFile } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Get file ID from route params
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File ID is required'
      })
    }

    // Get file record from database
    const file = await fetchOneFromDb<DbFile>('files', parseInt(id))

    if (!file) {
      throw createError({
        statusCode: 404,
        statusMessage: 'File not found'
      })
    }

    // Delete from R2 storage
    try {
      await deleteFromR2(file.file_key)
    } catch (error) {
      // Log R2 deletion error but continue with database deletion
      console.error('R2 deletion failed for file:', file.file_key, error)
    }

    // Delete from database
    await deleteRow('files', parseInt(id))

    return {
      success: true,
      message: 'File deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to delete file:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
