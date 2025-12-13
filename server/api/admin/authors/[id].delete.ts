import type { DbAuthor, DbArticle } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Get author ID from route params
    const authorId = getRouterParam(event, 'id')

    if (!authorId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Author ID is required'
      })
    }

    // Fetch the author to verify it exists
    const author = await fetchOneFromDb<DbAuthor>('authors', authorId)

    if (!author) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Author not found'
      })
    }

    // Check if author has any articles
    const articlesResponse = await fetchFromDb<DbArticle>('articles', { limit: 1000 })
    const articlesWithAuthor = articlesResponse.data.filter(
      article => article.author_id === author.id
    )

    if (articlesWithAuthor.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: `Cannot delete author with ${articlesWithAuthor.length} article(s). Please reassign or delete the articles first.`
      })
    }

    // Delete the author
    await deleteRow('authors', authorId)

    return {
      success: true,
      message: 'Author deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to delete author:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
