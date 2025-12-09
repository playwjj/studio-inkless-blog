import type { DbArticle, DbCategory, DbTag, DbPage } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Fetch all data in parallel
    const [articlesResponse, categoriesResponse, tagsResponse, pagesResponse] = await Promise.all([
      fetchFromDb<DbArticle>('articles'),
      fetchFromDb<DbCategory>('categories'),
      fetchFromDb<DbTag>('tags'),
      fetchFromDb<DbPage>('pages')
    ])

    // Extract data arrays from responses
    const articles = articlesResponse.data || []
    const categories = categoriesResponse.data || []
    const tags = tagsResponse.data || []
    const pages = pagesResponse.data || []

    // Calculate total views
    const totalViews = articles.reduce((sum, article) => sum + (article.view_count || 0), 0)

    // Format total views (e.g., 1000 -> "1K", 12500 -> "12.5K")
    const formatViews = (views: number): string => {
      if (views >= 1000000) {
        return `${(views / 1000000).toFixed(1)}M`
      } else if (views >= 1000) {
        return `${(views / 1000).toFixed(1)}K`
      }
      return views.toString()
    }

    // Get recent articles (5 most recent, published only)
    const publishedArticles = articles
      .filter(article => article.status === 'published')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)

    // Enhance recent articles with category names
    const recentArticles = publishedArticles.map(article => {
      const category = categories.find(cat => cat.id === article.category_id)
      return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        // Normalize to `cover_image_url` (fall back to older `cover_image` if present)
        cover_image_url: (article as any).cover_image_url || (article as any).cover_image || null,
        view_count: article.view_count || 0,
        created_at: article.created_at,
        category: category?.name || 'Uncategorized'
      }
    })

    return {
      stats: {
        totalPosts: articles.filter(a => a.status === 'published').length,
        totalViews: formatViews(totalViews),
        totalCategories: categories.length,
        totalTags: tags.length,
        totalPages: pages.length
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
