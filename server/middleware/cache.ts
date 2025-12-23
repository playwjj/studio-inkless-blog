import { setCacheForPublicAPI, disableCache, CACHE_TAGS } from '../utils/cache'

/**
 * 缓存中间件 - 自动为不同的 API 路由设置合适的缓存策略
 */
export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const path = url.pathname
  const method = event.method

  // 只为 GET 请求设置缓存
  if (method !== 'GET') {
    return
  }

  // 公共只读 API - 设置缓存
  // Posts API - 短缓存
  if (path === '/api/posts' || path.startsWith('/api/posts/')) {
    // 列表页短缓存
    if (path === '/api/posts') {
      setCacheForPublicAPI(event, 'short', [CACHE_TAGS.POSTS])
      return
    }

    // 单个文章短缓存
    const postIdMatch = path.match(/^\/api\/posts\/([^\/]+)$/)
    if (postIdMatch) {
      const postId = postIdMatch[1]
      setCacheForPublicAPI(event, 'short', [CACHE_TAGS.POST(postId)])
      return
    }
  }

  // Categories API - 中等缓存
  if (path === '/api/categories') {
    setCacheForPublicAPI(event, 'medium', [CACHE_TAGS.CATEGORIES])
    return
  }

  // Tags API - 中等缓存
  if (path === '/api/tags') {
    setCacheForPublicAPI(event, 'medium', [CACHE_TAGS.TAGS])
    return
  }

  // Site API - 中等缓存
  if (path === '/api/site') {
    setCacheForPublicAPI(event, 'medium', [CACHE_TAGS.SITE])
    return
  }

  // Menu API - 中等缓存
  if (path === '/api/menu') {
    setCacheForPublicAPI(event, 'medium', [CACHE_TAGS.MENU])
    return
  }

  // Pages API - 短缓存
  if (path === '/api/pages' || path.startsWith('/api/pages/')) {
    if (path === '/api/pages') {
      setCacheForPublicAPI(event, 'short', [CACHE_TAGS.PAGES])
      return
    }

    // 单个页面短缓存
    const pageMatch = path.match(/^\/api\/pages\/([^\/]+)/)
    if (pageMatch) {
      const pageId = pageMatch[1]
      setCacheForPublicAPI(event, 'short', [CACHE_TAGS.PAGE(pageId)])
      return
    }
  }

  // 管理 API - 禁止缓存
  if (
    path.startsWith('/api/admin/') ||
    path.startsWith('/api/auth/') ||
    path.startsWith('/api/newsletter/') ||
    path.startsWith('/api/contact/') ||
    path.startsWith('/api/tokens/')
  ) {
    disableCache(event)
    return
  }

  // 其他 API 路由 - 默认禁止缓存
  if (path.startsWith('/api/')) {
    disableCache(event)
  }
})
