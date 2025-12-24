/**
 * Article-Tag relationship utilities
 * Handles many-to-many relationship between articles and tags
 */

import type { DbTag } from '~/server/types/dbTypes'

/**
 * Sync article tags using many-to-many relationship
 * This function handles creating/updating tag relationships for an article
 * Optimized for stability and reliability in Cloudflare D1 environment
 *
 * @param articleId - The article ID
 * @param tagsString - Comma-separated tag names (from API input)
 * @param oldTagsString - Previous comma-separated tag names (for updates)
 * @param articleStatus - Current article status (published/draft/archived)
 * @param isNewArticle - Whether this is a new article (optimization hint)
 */
export async function syncArticleTags(
  articleId: string,
  tagsString: string,
  oldTagsString: string = '',
  articleStatus: string = 'draft',
  isNewArticle: boolean = false
): Promise<void> {
  console.log(`[syncArticleTags] Starting for article ${articleId}, isNew: ${isNewArticle}`)
  console.log(`[syncArticleTags] Tags: "${tagsString}", Status: ${articleStatus}`)

  // Parse new tag names
  const newTagNames = tagsString
    ? tagsString.split(',').map(tag => tag.trim()).filter(Boolean)
    : []

  if (newTagNames.length === 0) {
    console.log('[syncArticleTags] No tags to sync, skipping')
    return
  }

  try {
    // Step 1: Find or create tags (with validation)
    console.log(`[syncArticleTags] Step 1: Processing ${newTagNames.length} tag(s): ${newTagNames.join(', ')}`)
    const tagIds = await findOrCreateTags(newTagNames)

    // Critical validation: ensure we got IDs for all tags
    if (!tagIds || tagIds.length !== newTagNames.length) {
      const errorMsg = `Tag ID mismatch: expected ${newTagNames.length} IDs, got ${tagIds?.length || 0}. ` +
        `Tags: ${newTagNames.join(', ')}, IDs: ${tagIds?.join(', ') || 'none'}`
      console.error(`[syncArticleTags] VALIDATION FAILED: ${errorMsg}`)
      throw new Error(errorMsg)
    }
    console.log(`[syncArticleTags] Step 1 ✓ Got ${tagIds.length} tag ID(s): ${tagIds.join(', ')}`)

    // Fast path for new articles: skip querying existing relationships
    if (isNewArticle) {
      console.log('[syncArticleTags] Step 2: New article - using simplified path')

      // Step 2a: Insert article-tag relationships
      const now = new Date().toISOString()
      const values = tagIds.map(() => '(?, ?, ?)').join(', ')
      const params: any[] = []
      tagIds.forEach(tagId => {
        params.push(articleId, tagId, now)
      })

      console.log(`[syncArticleTags] Inserting ${tagIds.length} relationship(s)...`)
      const insertResult = await executeQuery(
        `INSERT INTO article_tags (article_id, tag_id, created_at) VALUES ${values}`,
        params
      )
      console.log(`[syncArticleTags] Step 2 ✓ Inserted ${tagIds.length} relationship(s)`)

      // Step 3: Update usage count if article is published
      // Note: Removed verification query to reduce DB requests and improve stability
      if (articleStatus === 'published') {
        console.log(`[syncArticleTags] Step 3: Updating usage counts...`)
        await incrementTagUsageCount(tagIds)
        console.log(`[syncArticleTags] Step 3 ✓ Updated usage counts`)
      }

      console.log(`[syncArticleTags] ✓ Completed successfully for article ${articleId}`)
      return
    }

    // Update path for existing articles (sequential operations for stability)
    console.log('[syncArticleTags] Step 2: Existing article - checking current relationships')

    const existingRelations = await executeQuery<{ tag_id: number }>(
      `SELECT tag_id FROM article_tags WHERE article_id = ?`,
      [articleId]
    )
    const existingTagIds = new Set(existingRelations.map(r => r.tag_id))
    console.log(`[syncArticleTags] Step 2 ✓ Found ${existingTagIds.size} existing relationship(s)`)

    // Step 3: Determine which relationships to add and remove
    const newTagIdSet = new Set(tagIds)
    const tagIdsToAdd = tagIds.filter(id => !existingTagIds.has(id))
    const tagIdsToRemove = Array.from(existingTagIds).filter(id => !newTagIdSet.has(id))

    console.log(`[syncArticleTags] Step 3: Changes needed - Add: ${tagIdsToAdd.length}, Remove: ${tagIdsToRemove.length}`)

    // Early exit if nothing to change
    if (tagIdsToAdd.length === 0 && tagIdsToRemove.length === 0) {
      console.log('[syncArticleTags] ✓ No changes needed')
      return
    }

    // Step 4: Remove old relationships (sequential, not parallel)
    if (tagIdsToRemove.length > 0) {
      console.log(`[syncArticleTags] Step 4a: Removing ${tagIdsToRemove.length} old relationship(s)...`)
      const placeholders = tagIdsToRemove.map(() => '?').join(',')
      await executeQuery(
        `DELETE FROM article_tags WHERE article_id = ? AND tag_id IN (${placeholders})`,
        [articleId, ...tagIdsToRemove]
      )
      console.log(`[syncArticleTags] Step 4a ✓ Removed ${tagIdsToRemove.length} relationship(s)`)

      // Update usage count for removed tags if article is published
      if (articleStatus === 'published') {
        console.log(`[syncArticleTags] Step 4b: Decrementing usage counts...`)
        await decrementTagUsageCount(tagIdsToRemove)
        console.log(`[syncArticleTags] Step 4b ✓ Decremented usage counts`)
      }
    }

    // Step 5: Add new relationships (sequential, after removals complete)
    if (tagIdsToAdd.length > 0) {
      console.log(`[syncArticleTags] Step 5a: Adding ${tagIdsToAdd.length} new relationship(s)...`)
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
      console.log(`[syncArticleTags] Step 5a ✓ Added ${tagIdsToAdd.length} relationship(s)`)

      // Update usage count for new tags if article is published
      if (articleStatus === 'published') {
        console.log(`[syncArticleTags] Step 5b: Incrementing usage counts...`)
        await incrementTagUsageCount(tagIdsToAdd)
        console.log(`[syncArticleTags] Step 5b ✓ Incremented usage counts`)
      }
    }

    console.log(`[syncArticleTags] ✓ Completed successfully for article ${articleId}`)
  } catch (error) {
    console.error(`[syncArticleTags] ✗ FAILED for article ${articleId}:`, error)
    // Log the full error stack for debugging
    if (error instanceof Error) {
      console.error(`[syncArticleTags] Error stack:`, error.stack)
    }
    throw error  // Re-throw to let the caller handle it
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
 * Uses batch operations for better performance
 *
 * @param tagNames - Array of tag names
 * @returns Array of tag IDs
 */
async function findOrCreateTags(tagNames: string[]): Promise<number[]> {
  if (tagNames.length === 0) return []

  const now = new Date().toISOString()

  // Step 1: Batch query existing tags
  const placeholders = tagNames.map(() => '?').join(',')
  const existingTags = await executeQuery<DbTag>(
    `SELECT id, name FROM tags WHERE name IN (${placeholders})`,
    tagNames
  )

  // Build map of existing tags (case-insensitive)
  const existingTagMap = new Map<string, number>()
  existingTags.forEach(tag => {
    existingTagMap.set(tag.name.toLowerCase(), tag.id)
  })

  console.log(`[findOrCreateTags] Found ${existingTags.length} existing tags out of ${tagNames.length}`)

  // Step 2: Identify tags that need to be created
  const tagsToCreate = tagNames.filter(name => !existingTagMap.has(name.toLowerCase()))

  // Step 3: Batch create new tags if needed
  if (tagsToCreate.length > 0) {
    console.log(`[findOrCreateTags] Creating ${tagsToCreate.length} new tags: ${tagsToCreate.join(', ')}`)

    // Build batch insert statement
    const insertValues = tagsToCreate.map(() => '(?, ?, 0, ?, ?)').join(', ')
    const insertParams: any[] = []

    tagsToCreate.forEach(tagName => {
      const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      insertParams.push(tagName, slug, now, now)
    })

    try {
      // Batch insert all new tags
      await executeQuery(
        `INSERT INTO tags (name, slug, usage_count, created_at, updated_at) VALUES ${insertValues}`,
        insertParams
      )

      // Batch query the newly created tags to get their IDs
      const newPlaceholders = tagsToCreate.map(() => '?').join(',')
      const newTags = await executeQuery<{ id: number, name: string }>(
        `SELECT id, name FROM tags WHERE name IN (${newPlaceholders})`,
        tagsToCreate
      )

      if (newTags.length !== tagsToCreate.length) {
        console.error(`[findOrCreateTags] Created ${tagsToCreate.length} tags but only retrieved ${newTags.length}`)
        throw new Error(
          `Tag creation mismatch: created ${tagsToCreate.length} tags, retrieved ${newTags.length}. ` +
          `Missing: ${tagsToCreate.filter(name => !newTags.find(t => t.name === name)).join(', ')}`
        )
      }

      // Update the map with newly created tags
      newTags.forEach(tag => {
        existingTagMap.set(tag.name.toLowerCase(), tag.id)
      })

      console.log(`[findOrCreateTags] Successfully created ${newTags.length} tags`)
    } catch (error) {
      console.error('[findOrCreateTags] Failed to create tags:', error)
      throw error
    }
  }

  // Step 4: Build tag IDs array in the original order
  const tagIds = tagNames.map(name => {
    const id = existingTagMap.get(name.toLowerCase())
    if (!id) {
      throw new Error(`Failed to get ID for tag: ${name}`)
    }
    return id
  })

  console.log(`[findOrCreateTags] Returning ${tagIds.length} tag IDs: ${tagIds.join(', ')}`)
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
 * Update usage counts for multiple tags in a single operation
 * More efficient than calling increment and decrement separately
 *
 * @param tagIdsToIncrement - Tag IDs to increment
 * @param tagIdsToDecrement - Tag IDs to decrement
 */
async function updateTagUsageCounts(
  tagIdsToIncrement: number[],
  tagIdsToDecrement: number[]
): Promise<void> {
  // If only one operation needed, use specific function
  if (tagIdsToIncrement.length === 0 && tagIdsToDecrement.length > 0) {
    return decrementTagUsageCount(tagIdsToDecrement)
  }
  if (tagIdsToDecrement.length === 0 && tagIdsToIncrement.length > 0) {
    return incrementTagUsageCount(tagIdsToIncrement)
  }
  if (tagIdsToIncrement.length === 0 && tagIdsToDecrement.length === 0) {
    return
  }

  // Execute both operations in parallel for better performance
  await Promise.all([
    incrementTagUsageCount(tagIdsToIncrement),
    decrementTagUsageCount(tagIdsToDecrement)
  ])
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
