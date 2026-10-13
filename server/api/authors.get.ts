import type { DbAuthor } from '~/server/types/dbTypes'

export interface AuthorListItem {
  id: number
  name: string
  avatar: string
  bio: string
  postCount: number
}

export default defineEventHandler(async (): Promise<AuthorListItem[]> => {
  try {
    const rows = await executeQuery<DbAuthor & { post_count: number }>(`
      SELECT a.id, a.name, a.avatar_url, a.bio,
             COUNT(ar.id) AS post_count
      FROM authors a
      LEFT JOIN articles ar ON ar.author_id = a.id AND ar.status = 'published'
      GROUP BY a.id
      ORDER BY post_count DESC, a.name ASC
    `)

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      avatar: row.avatar_url || '/default-avatar.png',
      bio: row.bio || '',
      postCount: Number(row.post_count) || 0
    }))
  } catch (error) {
    console.error('Failed to fetch authors:', error)
    return []
  }
})
