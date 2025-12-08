import type { DbArticle } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Get article ID from route params
    const articleId = getRouterParam(event, 'id')

    if (!articleId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Article ID is required'
      })
    }

    // Fetch the article
    const article = await fetchOneFromDb<DbArticle>('articles', articleId)

    if (!article) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article not found'
      })
    }

    // Fetch article tags - handle case where no tags exist
    let tags: string[] = []
    try {
      const articleTags = await fetchAllFromDb<{ tag_id: number }>(
        'article_tags',
        { article_id: articleId }
      )

      if (articleTags.length > 0) {
        const tagIds = articleTags.map(at => at.tag_id)
        const tagRecords = await Promise.all(
          tagIds.map(id => fetchOneFromDb<{ id: number, name: string }>('tags', id))
        )
        tags = tagRecords.filter(Boolean).map(tag => tag!.name)
      }
    } catch (tagError) {
      // If tags fetch fails, just continue without tags
      console.warn('Failed to fetch tags for article:', tagError)
    }

    return {
      success: true,
      data: {
        ...article,
        tags: tags.join(', ')
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to fetch article:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
