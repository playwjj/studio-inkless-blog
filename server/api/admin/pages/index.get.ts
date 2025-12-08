import type { DbPage } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Fetch pages
    const pagesResponse = await fetchFromDb<DbPage>('pages', {
      limit: 1000,
      sortBy: 'created_at',
      sortOrder: 'desc'
    })

    const pages = pagesResponse.data || []

    return {
      success: true,
      pages: pages,
      total: pagesResponse.meta?.total || pages.length
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
