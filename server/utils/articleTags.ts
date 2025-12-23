/**
 * Article-Tag relationship utilities
 * Handles many-to-many relationship between articles and tags
 */

import type { DbTag } from '~/server/types/dbTypes'

/**
 * Sync article tags using many-to-many relationship
 * This function handles creating/updating tag relationships for an article
 *
 * @param articleId - The article ID
 * @param tagsString - Comma-separated tag names (from API input)
 * @param oldTagsString - Previous comma-separated tag names (for updates)
 * @param articleStatus - Current article status (published/draft/archived)
 */
export async function syncArticleTags(
  articleId: string,
  tagsString: string,
  oldTagsString: string = '',
  articleStatus: string = 'draft'
): Promise<void> {
  // Parse new and old tag names
  const newTagNames = tagsString
    ? tagsString.split(',').map(tag => tag.trim()).filter(Boolean)
    : []

  const oldTagNames = oldTagsString
    ? oldTagsString.split(',').map(tag => tag.trim()).filter(Boolean)
    : []

  // Step 1: Find or create tags
  const tagIds = await findOrCreateTags(newTagNames)

  // Step 2: Get existing tag relationships for this article
  const existingRelations = await executeQuery<{ tag_id: number }>(
    `SELECT tag_id FROM article_tags WHERE article_id = ?`,
    [articleId]
  )
  const existingTagIds = new Set(existingRelations.map(r => r.tag_id))

  // Step 3: Determine which relationships to add and remove
  const tagIdsToAdd = tagIds.filter(id => !existingTagIds.has(id))
  const tagIdsToRemove = Array.from(existingTagIds).filter(id => !tagIds.includes(id))

  // Step 4: Remove old relationships
  if (tagIdsToRemove.length > 0) {
    const placeholders = tagIdsToRemove.map(() => '?').join(',')
    await executeQuery(
      `DELETE FROM article_tags WHERE article_id = ? AND tag_id IN (${placeholders})`,
      [articleId, ...tagIdsToRemove]
    )

    // Decrement usage count for removed tags if article is published
    if (articleStatus === 'published') {
      await decrementTagUsageCount(tagIdsToRemove)
    }
  }

  // Step 5: Add new relationships
  if (tagIdsToAdd.length > 0) {
    const now = new Date().toISOString()
    const values = tagIdsToAdd.map(() => '(?, ?, ?)').join(', ')
    const params: any[] = []
    tagIdsToAdd.forEach(tagId => {
      params.push(articleId, tagId, now)
    })

    await executeQuery(
      `INSERT INTO article_tags (article_id, tag_id, created_at) VALUES ${values}`,
      params
    )

    // Increment usage count for new tags if article is published
    if (articleStatus === 'published') {
      await incrementTagUsageCount(tagIdsToAdd)
    }
  }
}

/**
 * Handle tag count updates when article status changes
 *
 * @param articleId - The article ID
 * @param oldStatus - Previous article status
 * @param newStatus - New article status
 */
export async function handleArticleStatusChangeForTags(
  articleId: string,
  oldStatus: string,
  newStatus: string
): Promise<void> {
  if (oldStatus === newStatus) return

  // Get all tag IDs for this article
  const relations = await executeQuery<{ tag_id: number }>(
    `SELECT tag_id FROM article_tags WHERE article_id = ?`,
    [articleId]
  )

  const tagIds = relations.map(r => r.tag_id)
  if (tagIds.length === 0) return

  // Update usage counts based on status change
  if (oldStatus === 'published' && newStatus !== 'published') {
    // Article unpublished - decrement counts
    await decrementTagUsageCount(tagIds)
  } else if (oldStatus !== 'published' && newStatus === 'published') {
    // Article published - increment counts
    await incrementTagUsageCount(tagIds)
  }
}

/**
 * Find or create tags by name, returns array of tag IDs
 *
 * @param tagNames - Array of tag names
 * @returns Array of tag IDs
 */
async function findOrCreateTags(tagNames: string[]): Promise<number[]> {
  if (tagNames.length === 0) return []

  const tagIds: number[] = []
  const now = new Date().toISOString()

  // Fetch existing tags
  const placeholders = tagNames.map(() => '?').join(',')
  const existingTags = await executeQuery<DbTag>(
    `SELECT id, name FROM tags WHERE name IN (${placeholders})`,
    tagNames
  )

  // Build map of existing tags
  const existingTagMap = new Map<string, number>()
  existingTags.forEach(tag => {
    existingTagMap.set(tag.name.toLowerCase(), tag.id)
  })

  // Process each tag name
  for (const tagName of tagNames) {
    const existingId = existingTagMap.get(tagName.toLowerCase())

    if (existingId) {
      tagIds.push(existingId)
    } else {
      // Create new tag
      const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

      const result = await executeQuery<{ id: number }>(
        `INSERT INTO tags (name, slug, usage_count, created_at, updated_at)
         VALUES (?, ?, 0, ?, ?)
         RETURNING id`,
        [tagName, slug, now, now]
      )

      if (result && result[0]) {
        tagIds.push(result[0].id)
      }
    }
  }

  return tagIds
}

/**
 * Increment usage count for multiple tags
 */
async function incrementTagUsageCount(tagIds: number[]): Promise<void> {
  if (tagIds.length === 0) return

  const placeholders = tagIds.map(() => '?').join(',')
  await executeQuery(
    `UPDATE tags
     SET usage_count = usage_count + 1,
         updated_at = ?
     WHERE id IN (${placeholders})`,
    [new Date().toISOString(), ...tagIds]
  )
}

/**
 * Decrement usage count for multiple tags
 */
async function decrementTagUsageCount(tagIds: number[]): Promise<void> {
  if (tagIds.length === 0) return

  const placeholders = tagIds.map(() => '?').join(',')
  await executeQuery(
    `UPDATE tags
     SET usage_count = CASE
       WHEN usage_count > 0 THEN usage_count - 1
       ELSE 0
     END,
     updated_at = ?
     WHERE id IN (${placeholders})`,
    [new Date().toISOString(), ...tagIds]
  )
}

/**
 * Get tag names for an article (for reading)
 *
 * @param articleId - The article ID
 * @returns Array of tag names
 */
export async function getArticleTagNames(articleId: string): Promise<string[]> {
  const result = await executeQuery<{ name: string }>(
    `SELECT t.name
     FROM tags t
     INNER JOIN article_tags at ON t.id = at.tag_id
     WHERE at.article_id = ?
     ORDER BY t.name`,
    [articleId]
  )

  return result.map(r => r.name)
}

/**
 * Get articles by tag (for filtering)
 *
 * @param tagSlug - The tag slug
 * @returns Array of article IDs
 */
export async function getArticleIdsByTag(tagSlug: string): Promise<string[]> {
  const result = await executeQuery<{ article_id: string }>(
    `SELECT at.article_id
     FROM article_tags at
     INNER JOIN tags t ON at.tag_id = t.id
     WHERE t.slug = ?`,
    [tagSlug]
  )

  return result.map(r => r.article_id)
}

/**
 * Get tags for multiple articles (batch operation for performance)
 *
 * @param articleIds - Array of article IDs
 * @returns Map of article ID to tag names array
 */
export async function getTagsForArticles(articleIds: string[]): Promise<Map<string, string[]>> {
  if (articleIds.length === 0) return new Map()

  const placeholders = articleIds.map(() => '?').join(',')
  const result = await executeQuery<{ article_id: string, name: string }>(
    `SELECT at.article_id, t.name
     FROM article_tags at
     INNER JOIN tags t ON at.tag_id = t.id
     WHERE at.article_id IN (${placeholders})
     ORDER BY t.name`,
    articleIds
  )

  // Build map of article ID to tag names
  const tagsMap = new Map<string, string[]>()
  result.forEach(row => {
    if (!tagsMap.has(row.article_id)) {
      tagsMap.set(row.article_id, [])
    }
    tagsMap.get(row.article_id)!.push(row.name)
  })

  return tagsMap
}
