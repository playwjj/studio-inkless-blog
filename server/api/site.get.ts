import type { DbSite } from '~/server/types/dbTypes'

export default defineEventHandler(async () => {
  try {
    // Fetch site configuration (get the latest one)
    const siteResponse = await fetchFromDb<DbSite>('site', {
      page: 1,
      limit: 1,
      sortBy: 'id',
      sortOrder: 'desc'
    })

    if (siteResponse.data.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Site configuration not found'
      })
    }

    return siteResponse.data[0]
  } catch (error: any) {
    console.error('Failed to fetch site config:', error)
    
    // If it's already an error with statusCode, pass it through
    if (error.statusCode) {
      throw error
    }
    
    // For other errors, return 500
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch site configuration'
    })
  }
})
