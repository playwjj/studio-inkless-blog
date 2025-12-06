import { mockPosts } from '~/server/utils/mockData'

export default defineEventHandler(() => {
  const categories = [...new Set(mockPosts.map(post => post.category))]

  return categories.map(category => ({
    name: category,
    count: mockPosts.filter(post => post.category === category).length
  }))
})
