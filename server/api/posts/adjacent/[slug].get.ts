export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
  }

  try {
    // Fetch the full chronological list of published articles. The list is
    // small (hundreds of rows), so locating the neighbours in memory is
    // simpler and more deterministic than window queries with tie-breaking.
    const rows = await executeQuery<{ id: string, slug: string, title: string, published_at: string }>(
      `SELECT id, slug, title, published_at
       FROM articles
       WHERE status = 'published'
       ORDER BY published_at ASC, created_at ASC, id ASC`
    )

    const idx = rows.findIndex(r => r.slug === slug)
    if (idx === -1) return { prev: null, next: null }

    const toItem = (r: typeof rows[number] | undefined) =>
      r ? { slug: r.slug, title: r.title, publishedAt: r.published_at } : null

    return {
      prev: toItem(rows[idx - 1]),
      next: toItem(rows[idx + 1])
    }
  } catch (error) {
    console.error('Failed to fetch adjacent posts:', error)
    return { prev: null, next: null }
  }
})
