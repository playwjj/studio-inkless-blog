import type { DbPage } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Get pagination parameters from query
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 50
    const sortBy = (query.sortBy as string) || 'sort'
    const sortOrder = (query.sortOrder as 'asc' | 'desc') || 'asc'

    // Fetch pages, sorted by sort order first, then by created_at
    const pagesResponse = await fetchFromDb<DbPage>('pages', {
      page,
      limit,
      sortBy,
      sortOrder
    })

    const pages = pagesResponse.data || []

    return {
      success: true,
      pages: pages,
      pagination: {
        page: pagesResponse.meta?.page || page,
        limit: pagesResponse.meta?.limit || limit,
        total: pagesResponse.meta?.total || pages.length,
        totalPages: Math.ceil((pagesResponse.meta?.total || pages.length) / limit)
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to fetch pages:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
