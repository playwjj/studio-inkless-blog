import type { DbAuthor } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    const body = await readBody(event)
    const { name, avatar_url, bio } = body

    // Validate required fields
    if (!name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name is required'
      })
    }

    // Create author
    const newAuthor = await createRow<DbAuthor>('authors', {
      name: name.trim(),
      avatar_url: avatar_url?.trim() || null,
      bio: bio?.trim() || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    return {
      success: true,
      author: newAuthor
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to create author:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
