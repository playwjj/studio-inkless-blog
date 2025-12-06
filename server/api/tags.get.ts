import { mockPosts } from '~/server/utils/mockData'

export default defineEventHandler(() => {
  const allTags = mockPosts.flatMap(post => post.tags)
  const uniqueTags = [...new Set(allTags)]

  return uniqueTags.map(tag => ({
    name: tag,
    slug: tag.toLowerCase().replace(/\s+/g, '-'),
    count: allTags.filter(t => t === tag).length
  })).sort((a, b) => b.count - a.count)
})
