import type { H3Event } from 'h3'

/**
 * Cache configuration for different resource types
 */
export const CACHE_CONFIG = {
  // 静态资源 - 长期缓存
  STATIC_ASSETS: 'public, max-age=31536000, immutable',

  // HTML 页面 - 短缓存 + CDN 缓存
  HTML_PAGES: 'public, max-age=0, s-maxage=300, must-revalidate',

  // 公共只读 API - 短缓存 + stale-while-revalidate
  PUBLIC_API_SHORT: 'public, max-age=300, s-maxage=600, stale-while-revalidate=300',
  PUBLIC_API_MEDIUM: 'public, max-age=600, s-maxage=1800, stale-while-revalidate=600',
  PUBLIC_API_LONG: 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=900',

  // 私有 API - 禁止缓存
  NO_CACHE: 'no-store, no-cache, must-revalidate, private',
} as const

/**
 * Cache tags for different resource types
 */
export const CACHE_TAGS = {
  POSTS: 'posts',
  POST: (id: string) => `post-${id}`,
  CATEGORIES: 'categories',
  CATEGORY: (id: string) => `category-${id}`,
  TAGS: 'tags',
  TAG: (id: string) => `tag-${id}`,
  PAGES: 'pages',
  PAGE: (id: string) => `page-${id}`,
  SITE: 'site',
  MENU: 'menu',
} as const

/**
 * Cloudflare Cache API utilities
 */
export class CloudflareCache {
  private caches?: CacheStorage

  constructor() {
    // Cloudflare Workers 环境中的 caches API
    if (typeof caches !== 'undefined') {
      this.caches = caches
    }
  }

  /**
   * 检查是否在 Cloudflare 环境
   */
  isAvailable(): boolean {
    return this.caches !== undefined
  }

  /**
   * 从缓存中获取响应
   */
  async get(request: Request | string): Promise<Response | undefined> {
    if (!this.isAvailable()) return undefined

    try {
      const cache = await this.caches!.open('default')
      const response = await cache.match(request)
      return response
    } catch (error) {
      console.error('Cache get error:', error)
      return undefined
    }
  }

  /**
   * 将响应存入缓存
   */
  async put(request: Request | string, response: Response): Promise<void> {
    if (!this.isAvailable()) return

    try {
      const cache = await this.caches!.open('default')
      await cache.put(request, response)
    } catch (error) {
      console.error('Cache put error:', error)
    }
  }

  /**
   * 删除单个缓存项
   */
  async delete(url: string): Promise<boolean> {
    if (!this.isAvailable()) return false

    try {
      const cache = await this.caches!.open('default')
      const request = new Request(url)
      return await cache.delete(request)
    } catch (error) {
      console.error('Cache delete error:', error)
      return false
    }
  }

  /**
   * 批量删除缓存（通过 URL 模式）
   */
  async deleteByPattern(pattern: RegExp): Promise<number> {
    if (!this.isAvailable()) return 0

    try {
      const cache = await this.caches!.open('default')
      const requests = await cache.keys()
      let deletedCount = 0

      for (const request of requests) {
        if (pattern.test(request.url)) {
          await cache.delete(request)
          deletedCount++
        }
      }

      return deletedCount
    } catch (error) {
      console.error('Cache deleteByPattern error:', error)
      return 0
    }
  }

  /**
   * 清除所有缓存
   */
  async purgeAll(): Promise<void> {
    if (!this.isAvailable()) return

    try {
      const cache = await this.caches!.open('default')
      const requests = await cache.keys()
      await Promise.all(requests.map(request => cache.delete(request)))
    } catch (error) {
      console.error('Cache purgeAll error:', error)
    }
  }
}

/**
 * 创建全局缓存实例
 */
export const cfCache = new CloudflareCache()

/**
 * 设置缓存头的辅助函数
 */
export function setCacheHeaders(
  event: H3Event,
  cacheControl: string,
  tags?: string[]
) {
  setResponseHeader(event, 'Cache-Control', cacheControl)

  if (tags && tags.length > 0) {
    setResponseHeader(event, 'Cache-Tag', tags.join(','))
  }
}

/**
 * 为公共 API 设置缓存
 */
export function setCacheForPublicAPI(
  event: H3Event,
  duration: 'short' | 'medium' | 'long' = 'short',
  tags?: string[]
) {
  const cacheConfig = {
    short: CACHE_CONFIG.PUBLIC_API_SHORT,
    medium: CACHE_CONFIG.PUBLIC_API_MEDIUM,
    long: CACHE_CONFIG.PUBLIC_API_LONG,
  }

  setCacheHeaders(event, cacheConfig[duration], tags)
}

/**
 * 禁用缓存
 */
export function disableCache(event: H3Event) {
  setCacheHeaders(event, CACHE_CONFIG.NO_CACHE)
}

/**
 * 清除相关缓存的辅助函数
 */
export async function purgeCacheForPost(postId: string, origin: string) {
  const urlsToPurge = [
    `${origin}/api/posts`,
    `${origin}/api/posts/${postId}`,
  ]

  const results = await Promise.all(
    urlsToPurge.map(url => cfCache.delete(url))
  )

  return results.some(r => r)
}

export async function purgeCacheForCategory(categoryId: string, origin: string) {
  const urlsToPurge = [
    `${origin}/api/categories`,
  ]

  const results = await Promise.all(
    urlsToPurge.map(url => cfCache.delete(url))
  )

  return results.some(r => r)
}

export async function purgeCacheForTag(tagId: string, origin: string) {
  const urlsToPurge = [
    `${origin}/api/tags`,
  ]

  const results = await Promise.all(
    urlsToPurge.map(url => cfCache.delete(url))
  )

  return results.some(r => r)
}

export async function purgeCacheForPage(pageId: string, origin: string) {
  const urlsToPurge = [
    `${origin}/api/pages`,
    `${origin}/api/pages/${pageId}`,
  ]

  const results = await Promise.all(
    urlsToPurge.map(url => cfCache.delete(url))
  )

  return results.some(r => r)
}

export async function purgeCacheForSite(origin: string) {
  const urlsToPurge = [
    `${origin}/api/site`,
    `${origin}/api/menu`,
  ]

  const results = await Promise.all(
    urlsToPurge.map(url => cfCache.delete(url))
  )

  return results.some(r => r)
}
