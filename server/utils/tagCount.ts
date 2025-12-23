/**
 * Update usage_count for multiple tags based on article tag_names
 * Optimized for Cloudflare Workers to avoid "Too many subrequests" error
 */
export async function updateTagUsageCounts(tagNames: string[]): Promise<void> {
  if (tagNames.length === 0) return

  try {
    // Fetch tags and articles in parallel
    const placeholders = tagNames.map(() => '?').join(',')
    const [tags, allArticles] = await Promise.all([
      executeQuery<{ id: number, name: string }>(
        `SELECT id, name FROM tags WHERE name IN (${placeholders})`,
        tagNames
      ),
      executeQuery<{ tag_names: string }>(
        'SELECT tag_names FROM articles WHERE status = ?',
        ['published']
      )
    ])

    if (tags.length === 0) return

    // Calculate usage count for each tag in memory
    const tagCounts = new Map<number, number>()

    for (const tag of tags) {
      let count = 0
      for (const article of allArticles) {
        if (article.tag_names) {
          const articleTags = article.tag_names
            .split(',')
            .map(t => t.trim())
            .filter(Boolean)

          if (articleTags.includes(tag.name)) {
            count++
          }
        }
      }
      tagCounts.set(tag.id, count)
    }

    // Batch update using a single SQL statement
    const now = new Date().toISOString()
    const whenClauses = tags.map(tag =>
      `WHEN id = ${tag.id} THEN ${tagCounts.get(tag.id) || 0}`
    ).join(' ')

    const updateSql = `
      UPDATE tags
      SET usage_count = CASE ${whenClauses} ELSE usage_count END,
          updated_at = ?
      WHERE id IN (${tags.map(t => t.id).join(',')})
    `

    await executeQuery(updateSql, [now])
  } catch (error) {
    console.error('Failed to update usage counts for tags:', error)
  }
}

/**
 * Decrement usage_count for tags when an article is deleted
 * Optimized for Cloudflare Workers to avoid "Too many subrequests" error
 */
export async function decrementTagUsageCounts(tagNamesString: string): Promise<void> {
  if (!tagNamesString) return

  const tagNames = tagNamesString
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)

  if (tagNames.length === 0) return

  try {
    // Fetch all tags in one query
    const placeholders = tagNames.map(() => '?').join(',')
    const tags = await executeQuery<{ id: number, name: string, usage_count: number }>(
      `SELECT id, name, usage_count FROM tags WHERE name IN (${placeholders})`,
      tagNames
    )

    if (tags.length === 0) return

    // Filter tags that need to be updated (usage_count > 0)
    const tagsToUpdate = tags.filter(tag => tag.usage_count > 0)

    if (tagsToUpdate.length === 0) return

    // Batch update using a single SQL statement
    const now = new Date().toISOString()
    const whenClauses = tagsToUpdate.map(tag =>
      `WHEN id = ${tag.id} THEN ${tag.usage_count - 1}`
    ).join(' ')

    const updateSql = `
      UPDATE tags
      SET usage_count = CASE ${whenClauses} ELSE usage_count END,
          updated_at = ?
      WHERE id IN (${tagsToUpdate.map(t => t.id).join(',')})
    `

    await executeQuery(updateSql, [now])
  } catch (error) {
    console.error('Failed to decrement usage counts for tags:', error)
  }
}

/**
 * Delete tags that are not used by any articles
 * Uses article_tags many-to-many relationship
 */
export async function cleanupUnusedTags(): Promise<number> {
  try {
    // Find tags that have no relationships in article_tags
    const unusedTags = await executeQuery<{ id: number }>(
      `SELECT id FROM tags
       WHERE id NOT IN (SELECT DISTINCT tag_id FROM article_tags)`
    )

    if (unusedTags.length === 0) return 0

    // Delete unused tags
    const tagIds = unusedTags.map(t => t.id).join(',')
    const deleteSql = `DELETE FROM tags WHERE id IN (${tagIds})`
    await executeQuery(deleteSql)

    return unusedTags.length
  } catch (error) {
    console.error('Failed to cleanup unused tags:', error)
    return 0
  }
}

/**
 * Recalculate usage_count for all tags
 * Useful for fixing inconsistencies
 * Uses article_tags many-to-many relationship
 */
export async function recalculateAllTagCounts(): Promise<void> {
  try {
    // Update all tag counts using a single SQL query
    const now = new Date().toISOString()

    const updateSql = `
      UPDATE tags
      SET usage_count = (
        SELECT COUNT(DISTINCT at.article_id)
        FROM article_tags at
        INNER JOIN articles a ON a.id = at.article_id
        WHERE at.tag_id = tags.id
          AND a.status = 'published'
      ),
      updated_at = ?
    `

    await executeQuery(updateSql, [now])

    console.log('Successfully recalculated all tag counts')
  } catch (error) {
    console.error('Failed to recalculate tag counts:', error)
    throw error
  }
}
