import type { DbTag } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Fetch tags
    const tagsResponse = await fetchFromDb<DbTag>('tags', {
      limit: 100,
      sortBy: 'created_at',
      sortOrder: 'desc'
    })

    const tags = tagsResponse.data

    return {
      success: true,
      tags: tags,
      total: tagsResponse.meta?.total || tags.length
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
