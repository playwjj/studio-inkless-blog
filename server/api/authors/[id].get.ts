import type { DbAuthor } from '~/server/types/dbTypes'
import type { BlogListItem } from '~/types/blog'

export interface AuthorDetail {
  id: number
  name: string
  avatar: string
  bio: string
  postCount: number
  posts: BlogListItem[]
}

export default defineEventHandler(async (event): Promise<AuthorDetail> => {
  const id = getRouterParam(event, 'id')
  const authorId = parseInt(id || '', 10)

  if (!authorId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Author ID is required'
    })
  }

  try {
    const author = await fetchOneFromDb<DbAuthor>('authors', authorId)

    if (!author) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Author not found'
      })
    }

    const rows = await executeQuery<{
      id: string
      title: string
      slug: string
      excerpt: string
      cover_image_url: string
      published_at: string
      read_time: number
      view_count: number
      category_name: string
      category_slug: string
    }>(`
      SELECT
        a.id, a.title, a.slug, a.excerpt, a.cover_image_url, a.published_at, a.read_time, a.view_count,
        c.name AS category_name, c.slug AS category_slug
      FROM articles a
      JOIN categories c ON a.category_id = c.id
      WHERE a.author_id = ? AND a.status = 'published'
      ORDER BY a.published_at DESC
    `, [authorId])

    const articleIds = rows.map(r => r.id.toString())
    const tagsMap = await getTagsForArticles(articleIds)

    const posts: BlogListItem[] = rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt || '',
      author: {
        id: author.id,
        name: author.name,
        avatar: author.avatar_url || '/default-avatar.png',
        bio: author.bio || ''
      },
      coverImage: row.cover_image_url,
      category: {
        name: row.category_name,
        slug: row.category_slug
      },
      tags: tagsMap.get(row.id.toString()) || [],
      publishedAt: row.published_at,
      readTime: row.read_time,
      viewCount: row.view_count || 0
    }))

    return {
      id: author.id,
      name: author.name,
      avatar: author.avatar_url || '/default-avatar.png',
      bio: author.bio || '',
      postCount: posts.length,
      posts
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Failed to fetch author:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch author'
    })
  }
})
