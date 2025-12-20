import type { DbCategory } from '~/server/types/dbTypes'

export default defineEventHandler(async () => {
  try {
    // Fetch categories and articles
    const [categoriesResponse] = await Promise.all([
      fetchFromDb<DbCategory>('categories', { limit: 100 })
    ])

    const categories = categoriesResponse.data

    // Count articles per category
    return categories.map(category => ({
      name: category.name,
      slug: category.slug,
      count: category.count
    }))
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
})
