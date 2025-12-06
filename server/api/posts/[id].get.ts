import { mockPosts } from '~/server/utils/mockData'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  const post = mockPosts.find(p => p.id === id || p.slug === id)

  if (!post) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Post not found'
    })
  }

  return post
})
