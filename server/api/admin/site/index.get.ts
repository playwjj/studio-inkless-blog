import type { DbSite } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Fetch site configuration (get the latest one, usually id=1)
    const siteResponse = await fetchFromDb<DbSite>('site', {
      page: 1,
      limit: 1,
      sortBy: 'id',
      sortOrder: 'desc'
    })

    if (siteResponse.data.length === 0) {
      // Return default configuration if not found
      return {
        success: true,
        site: null,
        message: 'No site configuration found. Please create one.'
      }
    }

    return {
      success: true,
      site: siteResponse.data[0]
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to fetch site config:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch site configuration'
    })
  }
})
