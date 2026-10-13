/**
 * Slug generation utilities
 * Supports both English and Chinese text
 */

import { pinyin } from 'pinyin-pro'

/**
 * Generate a URL-friendly slug from text
 * Supports Chinese characters by converting them to pinyin
 *
 * @param text - The text to convert to slug
 * @param options - Optional configuration
 * @returns URL-friendly slug
 *
 * @example
 * generateSlug('Hello World')  // 'hello-world'
 * generateSlug('中文标签')      // 'zhong-wen-biao-qian'
 * generateSlug('AI技术')        // 'ai-ji-shu'
 */
export function generateSlug(
  text: string,
  options: {
    lowercase?: boolean
    separator?: string
    maxLength?: number
  } = {}
): string {
  const {
    lowercase = true,
    separator = '-',
    maxLength = 100
  } = options

  if (!text || !text.trim()) {
    return ''
  }

  let slug = text.trim()

  // Convert Chinese characters to pinyin
  // Only convert if the text contains Chinese characters
  if (/[\u4e00-\u9fa5]/.test(slug)) {
    slug = pinyin(slug, {
      toneType: 'none',    // No tone marks
      type: 'array'        // Return as array
    }).join(' ')
  }

  // Convert to lowercase if specified
  if (lowercase) {
    slug = slug.toLowerCase()
  }

  // Replace spaces and special characters with separator
  slug = slug
    .replace(/[\s\W_]+/g, separator)  // Replace spaces and non-word chars with separator
    .replace(new RegExp(`\\${separator}+`, 'g'), separator)  // Remove duplicate separators
    .replace(new RegExp(`^\\${separator}|\\${separator}$`, 'g'), '')  // Remove leading/trailing separators

  // Limit length
  if (maxLength > 0 && slug.length > maxLength) {
    slug = slug.substring(0, maxLength)
    // Remove trailing separator if cut in the middle
    slug = slug.replace(new RegExp(`\\${separator}$`), '')
  }

  return slug
}

/**
 * Generate a unique slug by appending a number if the slug already exists
 *
 * @param baseSlug - The base slug to make unique
 * @param checkExists - Async function to check if slug exists
 * @returns Unique slug
 *
 * @example
 * await generateUniqueSlug('test', async (slug) => slug === 'test')
 * // Returns 'test-1'
 */
export async function generateUniqueSlug(
  baseSlug: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = baseSlug
  let counter = 1

  // Keep trying until we find a unique slug
  while (await checkExists(slug)) {
    slug = `${baseSlug}-${counter}`
    counter++

    // Safety limit to prevent infinite loops
    if (counter > 1000) {
      // Append timestamp as last resort
      slug = `${baseSlug}-${Date.now()}`
      break
    }
  }

  return slug
}

/**
 * Check if a slug is valid
 *
 * @param slug - The slug to validate
 * @returns True if valid, false otherwise
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || slug.trim().length === 0) {
    return false
  }

  // Slug should only contain lowercase letters, numbers, and hyphens
  // Should not start or end with a hyphen
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)
}
