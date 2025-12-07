import type { DbTag } from '~/server/types/dbTypes'

export default defineEventHandler(async () => {
  try {
    // Fetch tags
    const tagsResponse = await fetchFromDb<DbTag>('tags', { limit: 100 })
    const tags = tagsResponse.data

    // Return tags with usage_count from database
    return tags.map(tag => ({
      name: tag.name,
      slug: tag.slug,
      count: tag.usage_count || 0
    })).sort((a, b) => b.count - a.count)
  } catch (error) {
    console.error('Failed to fetch tags:', error)
    return []
  }
})
