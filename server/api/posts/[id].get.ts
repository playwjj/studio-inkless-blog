import type { DbArticle, DbAuthor, DbCategory, DbTag } from '~/server/types/dbTypes'
import type { BlogPost } from '~/types/blog'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post ID is required'
    })
  }

  try {
    let article: DbArticle | null = null

    // Try to fetch by ID if it's a number
    if (/^\d+$/.test(id)) {
      article = await fetchOneFromDb<DbArticle>('articles', id)
    }
    // Otherwise, fetch by slug
    else {
      article = await fetchByField<DbArticle>('articles', 'slug', id)
    }

    if (!article) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found'
      })
    }

    // Fetch related data
    const [author, category, articleTags] = await Promise.all([
      fetchOneFromDb<DbAuthor>('authors', article.author_id),
      fetchOneFromDb<DbCategory>('categories', article.category_id),
      getArticleTagNames(article.id)
    ])

    // Map to BlogPost format
    const post: BlogPost = {
      id: article.id.toString(),
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      author: {
        name: author?.name || 'Unknown Author',
        avatar: author?.avatar_url || '/default-avatar.png'
      },
      coverImage: article.cover_image_url,
      category: category?.name || 'Uncategorized',
      tags: articleTags,
      publishedAt: article.published_at,
      readTime: article.read_time,
      viewCount: article.view_count || 0
    }

    return post
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    console.error('Failed to fetch post:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch post'
    })
  }
})
