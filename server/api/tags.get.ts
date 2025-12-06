import { mockPosts } from '~/server/utils/mockData'

export default defineEventHandler(() => {
  const allTags = mockPosts.flatMap(post => post.tags)
  const uniqueTags = [...new Set(allTags)]

  return uniqueTags.map(tag => ({
    name: tag,
    count: allTags.filter(t => t === tag).length
  }))
})
