import { mockPosts, categories } from '~/server/utils/mockData'

export default defineEventHandler((event) => {
  const query = getQuery(event)

  let posts = mockPosts.map(({ content, ...post }) => post)

  // Filter by category (supports both slug and name)
  if (query.category && typeof query.category === 'string') {
    const categorySlug = query.category.toString().toLowerCase()
    // Find category by slug
    const category = categories.find(cat => cat.slug === categorySlug)
    if (category) {
      posts = posts.filter(post => post.category === category.name)
    } else {
      // Fallback to filter by name (case-insensitive)
      posts = posts.filter(post =>
        post.category.toLowerCase() === categorySlug
      )
    }
  }

  // Filter by tag
  if (query.tag && typeof query.tag === 'string') {
    posts = posts.filter(post =>
      post.tags.some(tag => tag.toLowerCase() === query.tag.toString().toLowerCase())
    )
  }

  // Sort by date (newest first)
  posts.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  // Pagination
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  const paginatedPosts = posts.slice(startIndex, endIndex)

  return {
    posts: paginatedPosts,
    pagination: {
      page,
      limit,
      total: posts.length,
      totalPages: Math.ceil(posts.length / limit)
    }
  }
})
