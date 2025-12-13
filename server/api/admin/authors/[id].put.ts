import type { DbAuthor } from '~/server/types/dbTypes'

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

    const body = await readBody(event)
    const { name, avatar_url, bio } = body

    // Validate required fields
    if (!name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name is required'
      })
    }

    // Fetch existing author
    const existingAuthor = await fetchOneFromDb<DbAuthor>('authors', authorId)

    if (!existingAuthor) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Author not found'
      })
    }

    // Update author
    const updatedAuthor = await updateRow<DbAuthor>('authors', authorId, {
      name: name.trim(),
      avatar_url: avatar_url?.trim() || null,
      bio: bio?.trim() || null,
      updated_at: new Date().toISOString()
    })

    return {
      success: true,
      author: updatedAuthor
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to update author:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
