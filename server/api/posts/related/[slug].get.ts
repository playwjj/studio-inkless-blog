import type { BlogListItem } from '~/types/blog'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
  }

  try {
    // 1. Get the current article's id, category_id and tag ids
    const current = await executeQuery<{ id: string, category_id: number }>(
      `SELECT id, category_id FROM articles WHERE slug = ? LIMIT 1`,
      [slug]
    )
    if (current.length === 0) return []
    const currentId = current[0].id.toString()
    const categoryId = current[0].category_id

    const tagRows = await executeQuery<{ tag_id: string }>(
      `SELECT tag_id FROM article_tags WHERE article_id = ?`,
      [currentId]
    )
    const tagIds = tagRows.map(r => r.tag_id.toString())

    // 2. Rank by shared tag count first, then same category, then recency;
    //    same-category posts fill in when there are not enough tag matches
    let rows: Array<{
      id: string
      title: string
      slug: string
      excerpt: string
      cover_image_url: string
      published_at: string
      read_time: number
      view_count: number
      author_name: string
      author_avatar: string
      category_name: string
      category_slug: string
    }>

    if (tagIds.length > 0) {
      const placeholders = tagIds.map(() => '?').join(',')
      rows = await executeQuery(`
        SELECT
          a.id, a.title, a.slug, a.excerpt, a.cover_image_url, a.published_at, a.read_time, a.view_count,
          au.name AS author_name, au.avatar_url AS author_avatar,
          c.name AS category_name, c.slug AS category_slug,
          COUNT(DISTINCT shared.tag_id) AS shared_tags
        FROM articles a
        JOIN authors au ON a.author_id = au.id
        JOIN categories c ON a.category_id = c.id
        LEFT JOIN article_tags shared ON shared.article_id = a.id AND shared.tag_id IN (${placeholders})
        WHERE a.id != ?
          AND a.status = 'published'
          AND (
            shared.tag_id IS NOT NULL
            OR a.category_id = ?
          )
        GROUP BY a.id
        ORDER BY
          shared_tags DESC,
          CASE WHEN a.category_id = ? THEN 1 ELSE 0 END DESC,
          a.published_at DESC
        LIMIT 3
      `, [...tagIds, currentId, categoryId, categoryId])
    } else {
      // No tags: fall back to latest posts in the same category
      rows = await executeQuery(`
        SELECT
          a.id, a.title, a.slug, a.excerpt, a.cover_image_url, a.published_at, a.read_time, a.view_count,
          au.name AS author_name, au.avatar_url AS author_avatar,
          c.name AS category_name, c.slug AS category_slug
        FROM articles a
        JOIN authors au ON a.author_id = au.id
        JOIN categories c ON a.category_id = c.id
        WHERE a.category_id = ?
          AND a.id != ?
          AND a.status = 'published'
        ORDER BY a.published_at DESC
        LIMIT 3
      `, [categoryId, currentId])
    }

    if (rows.length === 0) return []

    const articleIds = rows.map(r => r.id.toString())
    const tagsMap = await getTagsForArticles(articleIds)

    const posts: BlogListItem[] = rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt || '',
      author: {
        name: row.author_name,
        avatar: row.author_avatar || '/default-avatar.png',
      },
      coverImage: row.cover_image_url,
      category: {
        name: row.category_name,
        slug: row.category_slug,
      },
      tags: tagsMap.get(row.id.toString()) || [],
      publishedAt: row.published_at,
      readTime: row.read_time,
      viewCount: row.view_count || 0,
    }))

    return posts
  } catch (error) {
    console.error('Failed to fetch related posts:', error)
    return []
  }
})
