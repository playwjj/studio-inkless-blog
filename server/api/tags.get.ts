import type { DbTag } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event)
    const limit = query.limit ? parseInt(query.limit as string) : 1000
    const page = query.page ? parseInt(query.page as string) : 1

    // Fetch tags with sorting by usage_count in descending order
    const tagsResponse = await fetchFromDb<DbTag>('tags', {
      limit,
      page,
      sortBy: 'usage_count',
      sortOrder: 'desc'
    })
    const tags = tagsResponse.data

    // Return tags with usage_count from database (already sorted)
    return tags.map(tag => ({
      name: tag.name,
      slug: tag.slug,
      count: tag.usage_count || 0
    }))
  } catch (error) {
    console.error('Failed to fetch tags:', error)
    return []
  }
})
