import type { DbArticle, DbCategory } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Format total views (e.g., 1000 -> "1K", 12500 -> "12.5K")
    const formatViews = (views: number): string => {
      if (views >= 1000000) {
        return `${(views / 1000000).toFixed(1)}M`
      } else if (views >= 1000) {
        return `${(views / 1000).toFixed(1)}K`
      }
      return views.toString()
    }

    // Execute queries in parallel
    const [
      publishedPostsResult,
      totalViewsResult,
      categoriesResult,
      tagsResult,
      pagesResult,
      articlesResponse,
      categoriesResponse
    ] = await Promise.all([
      // Use SQL for statistics
      executeQuery<{ count: number }>(`
        SELECT COUNT(*) as count
        FROM articles
        WHERE status = 'published'
      `),

      executeQuery<{ total: number }>(`
        SELECT COALESCE(SUM(view_count), 0) as total
        FROM articles
      `),

      executeQuery<{ count: number }>(`
        SELECT COUNT(*) as count
        FROM categories
      `),

      executeQuery<{ count: number }>(`
        SELECT COUNT(*) as count
        FROM tags
      `),

      executeQuery<{ count: number }>(`
        SELECT COUNT(*) as count
        FROM pages
      `),

      // Use fetchFromDb for recent articles
      fetchFromDb<DbArticle>('articles', {
        limit: 1000,
        sortBy: 'created_at',
        sortOrder: 'desc'
      }),

      fetchFromDb<DbCategory>('categories')
    ])

    // Extract data
    const articles = articlesResponse.data || []
    const categories = categoriesResponse.data || []

    // Get recent 5 published articles
    const publishedArticles = articles
      .filter(article => article.status === 'published')
      .slice(0, 5)

    // Enhance recent articles with category names
    const recentArticles = publishedArticles.map(article => {
      const category = categories.find(cat => cat.id === article.category_id)
      return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        cover_image_url: (article as any).cover_image_url || (article as any).cover_image || null,
        view_count: article.view_count || 0,
        created_at: article.created_at,
        category: category?.name || 'Uncategorized'
      }
    })

    return {
      stats: {
        totalPosts: publishedPostsResult[0]?.count || 0,
        totalViews: formatViews(totalViewsResult[0]?.total || 0),
        totalCategories: categoriesResult[0]?.count || 0,
        totalTags: tagsResult[0]?.count || 0,
        totalPages: pagesResult[0]?.count || 0
      },
      recentArticles
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to fetch dashboard stats:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
