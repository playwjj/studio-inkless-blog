import { categories, mockPosts } from '~/server/utils/mockData'

export default defineEventHandler(() => {
  return categories.map(category => ({
    name: category.name,
    slug: category.slug,
    count: mockPosts.filter(post => post.category === category.name).length
  }))
})
