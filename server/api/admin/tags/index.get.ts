import type { DbTag } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Get pagination and search parameters from query
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 50
    const sortBy = (query.sortBy as string) || 'created_at'
    const sortOrder = (query.sortOrder as 'asc' | 'desc') || 'desc'
    const search = query.search as string

    // Fetch tags
    const tagsResponse = await fetchFromDb<DbTag>('tags', {
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      searchFields: search ? ['name', 'slug'] : undefined
    })

    const tags = tagsResponse.data

    return {
      success: true,
      tags: tags,
      pagination: {
        page: tagsResponse.meta?.page || page,
        limit: tagsResponse.meta?.limit || limit,
        total: tagsResponse.meta?.total || tags.length,
        totalPages: Math.ceil((tagsResponse.meta?.total || tags.length) / limit)
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to fetch tags:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
