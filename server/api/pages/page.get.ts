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
      // Slugs may be stored with or without a leading slash
      if (!page) {
        const altSlug = slug.startsWith('/') ? slug.slice(1) : `/${slug}`
        if (altSlug) page = await fetchByField<DbPage>('pages', 'slug', altSlug)
      }
    }

    if (!page) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found'
      })
    }

    // Only return published pages
    if (page.status !== 'published') {
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
    // fetchFromDb has no WHERE support, so filter by page in SQL
    const blocks = await executeQuery<DbPageBlock>(
      'SELECT * FROM page_blocks WHERE page_id = ? AND is_visible = 1 ORDER BY block_order ASC',
      [page.id]
    )

    // Increment view count (fire and forget)
    // Note: This would need a custom update endpoint in your DB API
    // For now, we'll skip this or implement it later

    const { password_hash, ...publicPage } = page

    return {
      ...publicPage,
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
