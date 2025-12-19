import { requireAuth } from '~/server/utils/auth'
import { fetchFromDb } from '~/server/utils/dbApi'
import type { DbNewsletter } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Get query parameters
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const search = query.search as string | undefined
    const status = query.status as string | undefined
    const sortBy = (query.sortBy as string) || 'subscribed_at'
    const sortOrder = (query.sortOrder as 'asc' | 'desc') || 'desc'

    // Fetch newsletters from database
    const response = await fetchFromDb<DbNewsletter>('newsletters', {
      page,
      limit,
      search,
      sortBy,
      sortOrder
    })

    let newsletters = response.data || []

    // Filter by status if provided
    if (status && status !== 'all') {
      newsletters = newsletters.filter(n => n.status === status)
    }

    // Calculate pagination
    const total = newsletters.length
    const totalPages = Math.ceil(total / limit)

    return {
      success: true,
      data: newsletters,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    }
  } catch (error: any) {
    console.error('Failed to fetch newsletters:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch newsletters'
    })
  }
})
