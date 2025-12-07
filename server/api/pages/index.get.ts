import type { DbPage } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  try {
    // Fetch pages from database
    const pagesResponse = await fetchFromDb<DbPage>('pages', {
      page: query.page ? parseInt(query.page as string) : 1,
      limit: query.limit ? parseInt(query.limit as string) : 100,
      sortBy: 'created_at',
      sortOrder: 'desc'
    })

    // Filter by status (only show published by default)
    const statusFilter = query.status as string || 'published'
    let pages = pagesResponse.data

    if (statusFilter !== 'all') {
      pages = pages.filter(page => page.status === statusFilter)
    }

    return {
      pages,
      meta: pagesResponse.meta
    }
  } catch (error) {
    console.error('Failed to fetch pages:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch pages'
    })
  }
})
