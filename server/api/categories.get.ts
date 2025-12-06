import type { DbCategory, DbArticle } from '~/server/types/dbTypes'

export default defineEventHandler(async () => {
  try {
    // Fetch categories and articles
    const [categoriesResponse, articlesResponse] = await Promise.all([
      fetchFromDb<DbCategory>('categories', { limit: 100 }),
      fetchFromDb<DbArticle>('articles', { limit: 1000 })
    ])

    const categories = categoriesResponse.data
    const articles = articlesResponse.data

    // Count articles per category
    return categories.map(category => ({
      name: category.name,
      slug: category.slug,
      count: articles.filter(article => article.category_id === category.id).length
    }))
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
})
