import type { DbFile } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Get query parameters
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const search = query.search as string
    const mimeType = query.mime_type as string

    // Build where clause for filtering
    const where: Record<string, any> = {}
    if (mimeType) {
      where.mime_type = mimeType
    }

    // Fetch files from database
    const files = await fetchFromDb<DbFile>('files', {
      page,
      limit,
      sortBy: 'created_at',
      sortOrder: 'desc',
      search: search ? { field: 'file_name', value: search } : undefined,
      where: Object.keys(where).length > 0 ? where : undefined
    })

    // Calculate total size
    const totalSize = files.reduce((sum, file) => sum + file.file_size, 0)

    return {
      success: true,
      files,
      total: files.length,
      totalSize,
      page,
      limit
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to fetch files:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
