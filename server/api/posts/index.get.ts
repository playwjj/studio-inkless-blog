import type { DbArticle, DbAuthor, DbCategory } from '~/server/types/dbTypes'
import type { BlogListItem } from '~/types/blog'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  try {
    const page = Math.max(1, parseInt(query.page as string) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 10))
    const sortBy = query.sortBy === 'title' ? 'title' : 'published_at'
    const sortOrder = query.sortOrder === 'asc' || (query.sortBy === 'title' && query.sortOrder !== 'desc') ? 'ASC' : 'DESC'

    // Filtering and pagination are done in SQL so results are not capped
    // by the DB API's page size
    const filters: string[] = ['status = ?']
    const filterParams: Array<string | number> = ['published']

    if (query.search && typeof query.search === 'string' && query.search.trim()) {
      filters.push('(title LIKE ? OR excerpt LIKE ?)')
      const search = `%${query.search.trim()}%`
      filterParams.push(search, search)
    }

    if (query.category && typeof query.category === 'string') {
      const category = await fetchByField<DbCategory>('categories', 'slug', query.category.toLowerCase())
      if (!category) {
        return emptyResponse(page, limit)
      }
      filters.push('category_id = ?')
      filterParams.push(category.id)
    }

    // Filter by tag(s) - supports single or multiple tags (OR logic); accepts ?tag= or ?tags=
    const rawTags = query.tag ?? query.tags
    if (rawTags) {
      const tagSlugs = (Array.isArray(rawTags) ? rawTags : [rawTags])
        .map(tag => String(tag).toLowerCase())
        .filter(Boolean)

      if (tagSlugs.length > 0) {
        const placeholders = tagSlugs.map(() => '?').join(', ')
        filters.push(`EXISTS (
          SELECT 1 FROM article_tags at
          INNER JOIN tags t ON t.id = at.tag_id
          WHERE at.article_id = articles.id AND t.slug IN (${placeholders})
        )`)
        filterParams.push(...tagSlugs)
      }
    }

    const whereClause = filters.join(' AND ')
    const offset = (page - 1) * limit
    const [articles, countRows, featuredRows, authorsResponse, categoriesResponse] = await Promise.all([
      executeQuery<DbArticle>(
        `SELECT * FROM articles WHERE ${whereClause} ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`,
        [...filterParams, limit, offset]
      ),
      executeQuery<{ total: number }>(
        `SELECT COUNT(*) as total FROM articles WHERE ${whereClause}`,
        filterParams
      ),
      // Featured article (is_featured=1, most recent)
      executeQuery<DbArticle>(
        'SELECT * FROM articles WHERE status = ? AND is_featured = 1 ORDER BY published_at DESC LIMIT 1',
        ['published']
      ),
      fetchFromDb<DbAuthor>('authors', { limit: 100 }),
      fetchFromDb<DbCategory>('categories', { limit: 100 })
    ])

    const authors = authorsResponse.data
    const categories = categoriesResponse.data
    const featuredArticle = featuredRows[0] || null

    // Batch fetch tags for the current page (plus the featured article)
    const articleIds = articles.map(a => a.id)
    if (featuredArticle && !articleIds.includes(featuredArticle.id)) {
      articleIds.push(featuredArticle.id)
    }
    const articleTagsMap = await getTagsForArticles(articleIds)

    // Helper function to convert article to BlogListItem
    const mapArticleToBlogItem = (article: DbArticle): BlogListItem => {
      const author = authors.find(a => a.id === article.author_id)
      const category = categories.find(c => c.id === article.category_id)

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
        category: {
          name: category?.name || 'Uncategorized',
          slug: category?.slug || 'uncategorized'
        },
        tags: articleTagsMap.get(article.id) || [],
        publishedAt: article.published_at,
        readTime: article.read_time,
        viewCount: article.view_count || 0
      }
    }

    const total = Number(countRows[0]?.total || 0)

    return {
      featuredPost: featuredArticle ? mapArticleToBlogItem(featuredArticle) : null,
      posts: articles.map(mapArticleToBlogItem),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    // Fallback to empty response
    return emptyResponse(1, 10)
  }
})

function emptyResponse(page: number, limit: number) {
  return {
    featuredPost: null,
    posts: [] as BlogListItem[],
    pagination: {
      page,
      limit,
      total: 0,
      totalPages: 0
    }
  }
}
