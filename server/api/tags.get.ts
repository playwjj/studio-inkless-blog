import type { DbTag } from '~/server/types/dbTypes'

export default defineEventHandler(async () => {
  try {
    // Fetch tags
    const tagsResponse = await fetchFromDb<DbTag>('tags', { limit: 100 })
    const tags = tagsResponse.data

    // Note: Tag count would require article_tags junction table
    // For now, return tags with count = 0 or implement counting logic if available
    return tags.map(tag => ({
      name: tag.name,
      slug: tag.slug,
      count: 0 // TODO: Implement counting with article_tags table
    })).sort((a, b) => b.count - a.count)
  } catch (error) {
    console.error('Failed to fetch tags:', error)
    return []
  }
})
