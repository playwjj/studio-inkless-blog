import { fetchFromDb } from '~/server/utils/dbApi'
import type { DbContactUs } from '~/server/types/dbTypes'

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

    // Get query parameters
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 20
    const search = query.search as string | undefined
    const status = query.status as string | undefined

    // Build filter conditions
    const filters: any = {}

    if (search) {
      // Search in name, email, or subject
      filters.$or = [
        { name: { $like: `%${search}%` } },
        { email: { $like: `%${search}%` } },
        { subject: { $like: `%${search}%` } }
      ]
    }

    if (status && status !== 'all') {
      filters.status = status
    }

    // Fetch contact messages
    const response = await fetchFromDb<DbContactUs>('contact_us', {
      page,
      limit,
      sortBy: 'created_at',
      sortOrder: 'desc',
      filters: Object.keys(filters).length > 0 ? filters : undefined
    })

    return response
  } catch (error: any) {
    console.error('Fetch contact messages error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch contact messages'
    })
  }
})
