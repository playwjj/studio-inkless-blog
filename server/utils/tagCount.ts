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
