import type { DbArticle } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required'
    })
  }

  try {
    // Fetch the article by slug
    const article = await fetchByField<DbArticle>('articles', 'slug', slug)

    if (!article) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article not found'
      })
    }

    // Only count views for published articles
    if (article.status !== 'published') {
      return {
        success: false,
        message: 'Article not published'
      }
    }

    // Increment view count
    // Note: Duplicate prevention is handled by client-side localStorage
    const newViewCount = (article.view_count || 0) + 1
    await updateRow('articles', article.id, {
      view_count: newViewCount,
      updated_at: new Date().toISOString()
    })

    return {
      success: true,
      message: 'View counted',
      viewCount: newViewCount
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to increment view count:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to increment view count'
    })
  }
})
