import type { DbArticle, DbAuthor, DbCategory, DbTag } from '~/server/types/dbTypes'
import type { BlogListItem } from '~/types/blog'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  try {
    // Fetch articles from database
    const articlesResponse = await fetchFromDb<DbArticle>('articles', {
      page: 1,
      limit: 100,
      sortBy: 'published_at',
      sortOrder: 'desc',
      search: query.search ? String(query.search) : undefined
    })

    // Fetch related data
    const [authorsResponse, categoriesResponse, tagsResponse] = await Promise.all([
      fetchFromDb<DbAuthor>('authors', { limit: 100 }),
      fetchFromDb<DbCategory>('categories', { limit: 100 }),
      fetchFromDb<DbTag>('tags', { limit: 100 })
    ])

    const authors = authorsResponse.data
    const categories = categoriesResponse.data
    const tags = tagsResponse.data

    // Map articles to BlogListItem format
    let posts: BlogListItem[] = articlesResponse.data.map((article) => {
      const author = authors.find(a => a.id === article.author_id)
      const category = categories.find(c => c.id === article.category_id)

      // Parse tag_names field and match with tags from database
      let articleTags: string[] = []
      if (article.tag_names) {
        const tagNames = article.tag_names.split(',').map(name => name.trim())
        articleTags = tagNames
          .map(name => {
            const tag = tags.find(t => t.name.toLowerCase() === name.toLowerCase())
            return tag ? tag.name : name
          })
          .filter(Boolean)
      }

      return {
        id: article.id.toString(),
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        author: {
          name: author?.name || 'Unknown Author',
          avatar: author?.avatar_url || '/default-avatar.png'
        },
        coverImage: article.cover_image_url,
        category: category?.name || 'Uncategorized',
        tags: articleTags,
        publishedAt: article.published_at,
        readTime: article.read_time
      }
    })

    // Filter by category
    if (query.category && typeof query.category === 'string') {
      const categorySlug = query.category.toString().toLowerCase()
      const category = categories.find(cat => cat.slug === categorySlug)
      if (category) {
        posts = posts.filter(post => post.category === category.name)
      }
    }

    // Filter by tag
    if (query.tag && typeof query.tag === 'string') {
      const tagSlug = query.tag.toString().toLowerCase()
      const tag = tags.find(t => t.slug === tagSlug)
      if (tag) {
        // Note: This requires article_tags junction table
        // For now, we'll skip tag filtering until we have that data
        posts = posts.filter(post => post.tags.includes(tag.name))
      }
    }

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
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    // Fallback to empty response
    return {
      posts: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      }
    }
  }
})
