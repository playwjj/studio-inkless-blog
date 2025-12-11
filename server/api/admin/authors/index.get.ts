import type { DbAuthor } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Fetch all authors from database
    const authors = await fetchAllFromDb<DbAuthor>('authors')

    return {
      success: true,
      data: authors || []
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to fetch authors:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
