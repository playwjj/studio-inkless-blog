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
    const response = await fetchFromDb<DbFile>('files', {
      page,
      limit,
      sortBy: 'created_at',
      sortOrder: 'desc',
      search,
      searchFields: search ? ['file_name'] : undefined,
      filters: Object.keys(where).length > 0 ? where : undefined
    })

    // Calculate total size
    const totalSize = response.data.reduce((sum, file) => sum + file.file_size, 0)

    return {
      success: true,
      files: response.data,
      totalSize,
      pagination: {
        page: response.meta?.page || page,
        limit: response.meta?.limit || limit,
        total: response.meta?.total || response.data.length,
        totalPages: Math.ceil((response.meta?.total || response.data.length) / limit)
      }
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
