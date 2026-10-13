import type { DbArticle, DbCategory } from '~/server/types/dbTypes'

const SORTABLE_COLUMNS = ['created_at', 'updated_at', 'published_at', 'title', 'view_count']
const STATUSES = ['draft', 'published', 'archived']

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Get pagination and filter parameters from query
    const query = getQuery(event)
    const page = Math.max(1, parseInt(query.page as string) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 20))
    const sortBy = SORTABLE_COLUMNS.includes(query.sortBy as string) ? query.sortBy as string : 'created_at'
    const sortOrder = query.sortOrder === 'asc' ? 'ASC' : 'DESC'
    const search = typeof query.search === 'string' ? query.search.trim() : ''
    const status = query.status as string
    const categoryId = query.category ? parseInt(query.category as string) : undefined

    // Build filter conditions (fetchFromDb does not support filters, so query directly)
    const filters: string[] = []
    const filterParams: Array<string | number> = []
    if (status && STATUSES.includes(status)) {
      filters.push('status = ?')
      filterParams.push(status)
    }
    if (categoryId) {
      filters.push('category_id = ?')
      filterParams.push(categoryId)
    }
    if (search) {
      filters.push('(title LIKE ? OR excerpt LIKE ?)')
      filterParams.push(`%${search}%`, `%${search}%`)
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : ''
    const offset = (page - 1) * limit

    // Fetch articles, total count and categories
    const [articles, countRows, categoriesResponse] = await Promise.all([
      executeQuery<DbArticle>(
        `SELECT * FROM articles ${whereClause} ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`,
        [...filterParams, limit, offset]
      ),
      executeQuery<{ total: number }>(
        `SELECT COUNT(*) as total FROM articles ${whereClause}`,
        filterParams
      ),
      fetchFromDb<DbCategory>('categories', { limit: 100 })
    ])

    const categories = categoriesResponse.data || []
    const total = Number(countRows[0]?.total || 0)

    // Enhance articles with category names
    const articlesWithCategory = articles.map(article => {
      const category = categories.find(cat => cat.id === article.category_id)
      return {
        ...article,
        category_name: category?.name || 'Uncategorized'
      }
    })

    return {
      success: true,
      articles: articlesWithCategory,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to fetch articles:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
