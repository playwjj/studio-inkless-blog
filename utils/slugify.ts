/**
 * Client-side slug generation utility
 * Converts text (including Chinese) to URL-friendly slugs using pinyin
 */

import { pinyin } from 'pinyin-pro'

/**
 * Generate a URL-friendly slug from any text (supports Chinese)
 *
 * @param text - The text to convert to a slug
 * @returns URL-friendly slug
 *
 * @example
 * generateSlug('Hello World') // 'hello-world'
 * generateSlug('测试文章标题') // 'ce-shi-wen-zhang-biao-ti'
 * generateSlug('Hello 世界 2024') // 'hello-shi-jie-2024'
 */
export function generateSlug(text: string): string {
  if (!text) return ''

  let slug = text.trim()

  // Check if text contains Chinese characters
  if (/[\u4e00-\u9fa5]/.test(slug)) {
    // Convert Chinese characters to pinyin
    slug = pinyin(slug, {
      toneType: 'none',      // Remove tone marks
      type: 'array'          // Return as array for processing
    }).join(' ')
  }

  // Convert to lowercase and normalize
  return slug
    .toLowerCase()
    .replace(/[\s\W_]+/g, '-')  // Replace whitespace and special chars with hyphens
    .replace(/-+/g, '-')         // Remove consecutive hyphens
    .replace(/^-|-$/g, '')       // Remove leading/trailing hyphens
}
