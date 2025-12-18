import type { DbPage, DbAuthor, DbPageBlock } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  const slug = getQuery(event).slug as string

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Page slug is required'
    })
  }

  try {
    let page: DbPage | null = null

    // Try to fetch by ID if it's a number
    if (/^\d+$/.test(slug)) {
      page = await fetchOneFromDb<DbPage>('pages', slug)
    }
    // Otherwise, fetch by slug
    else {
      page = await fetchByField<DbPage>('pages', 'slug', slug)
    }

    if (!page) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found'
      })
    }

    // Only return published pages unless explicitly requesting draft
    const query = getQuery(event)
    if (page.status !== 'published' && query.preview !== 'true') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found'
      })
    }

    // Fetch author if available
    let author = null
    if (page.author_id) {
      author = await fetchOneFromDb<DbAuthor>('authors', page.author_id)
    }

    // Fetch page blocks (only visible ones)
    const blocksResponse = await fetchFromDb<DbPageBlock>('page_blocks', {
      where: { page_id: page.id, is_visible: 1 },
      sortBy: 'block_order',
      sortOrder: 'asc',
      limit: 100
    })
    const blocks = blocksResponse.data || []

    // Increment view count (fire and forget)
    // Note: This would need a custom update endpoint in your DB API
    // For now, we'll skip this or implement it later

    return {
      ...page,
      author: author ? {
        name: author.name,
        avatar: author.avatar_url,
        bio: author.bio
      } : null,
      blocks: blocks
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    console.error('Failed to fetch page:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch page'
    })
  }
})
