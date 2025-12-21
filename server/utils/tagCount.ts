/**
 * Update usage_count for multiple tags based on article tag_names
 * Optimized to use batch queries
 */
export async function updateTagUsageCounts(tagNames: string[]): Promise<void> {
  if (tagNames.length === 0) return

  try {
    // Fetch all relevant tags in one query
    const placeholders = tagNames.map(() => '?').join(',')
    const tags = await executeQuery<{ id: number, name: string }>(
      `SELECT id, name FROM tags WHERE name IN (${placeholders})`,
      tagNames
    )

    const now = new Date().toISOString()

    // Update each tag's count
    for (const tag of tags) {
      const articles = await executeQuery<{ count: number }>(
        `SELECT COUNT(*) as count FROM articles WHERE tag_names LIKE ? AND status = ?`,
        [`%${tag.name}%`, 'published']
      )

      const count = articles[0]?.count || 0

      await updateRow('tags', tag.id, {
        usage_count: count,
        updated_at: now
      })
    }
  } catch (error) {
    console.error('Failed to update usage counts for tags:', error)
  }
}

/**
 * Decrement usage_count for tags when an article is deleted
 * Optimized to use batch queries
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

    const now = new Date().toISOString()

    // Batch update
    for (const tag of tags) {
      if (tag.usage_count > 0) {
        await updateRow('tags', tag.id, {
          usage_count: tag.usage_count - 1,
          updated_at: now
        })
      }
    }
  } catch (error) {
    console.error('Failed to decrement usage counts for tags:', error)
  }
}

/**
 * Delete tags that are not used by any articles
 * Optimized with batch queries
 */
export async function cleanupUnusedTags(): Promise<number> {
  try {
    // Find all tags with usage_count = 0
    const unusedTags = await executeQuery<{ id: number, name: string }>(
      'SELECT id, name FROM tags WHERE usage_count = 0 OR usage_count IS NULL'
    )

    if (unusedTags.length === 0) return 0

    let deletedCount = 0
    const now = new Date().toISOString()

    // Process in batches to avoid too many concurrent queries
    for (const tag of unusedTags) {
      // Double-check: verify no articles are using this tag
      const articles = await executeQuery<{ count: number }>(
        'SELECT COUNT(*) as count FROM articles WHERE tag_names LIKE ?',
        [`%${tag.name}%`]
      )

      const count = articles[0]?.count || 0

      if (count === 0) {
        await deleteRow('tags', tag.id)
        deletedCount++
      } else {
        // Update the count if it was incorrect
        await updateRow('tags', tag.id, {
          usage_count: count,
          updated_at: now
        })
      }
    }

    return deletedCount
  } catch (error) {
    console.error('Failed to cleanup unused tags:', error)
    return 0
  }
}

/**
 * Recalculate usage_count for all tags
 * Useful for fixing inconsistencies
 */
export async function recalculateAllTagCounts(): Promise<void> {
  try {
    // Get all tags
    const allTags = await fetchAllFromDb<{ id: number, name: string }>('tags')

    for (const tag of allTags) {
      // Count how many published articles use this tag
      const articles = await executeQuery<{ count: number }>(
        'SELECT COUNT(*) as count FROM articles WHERE tag_names LIKE ? AND status = ?',
        [`%${tag.name}%`, 'published']
      )

      const count = articles[0]?.count || 0

      await updateRow('tags', tag.id, {
        usage_count: count,
        updated_at: new Date().toISOString()
      })

      console.log(`Updated tag "${tag.name}" usage_count to ${count}`)
    }

    console.log('Successfully recalculated all tag counts')
  } catch (error) {
    console.error('Failed to recalculate tag counts:', error)
    throw error
  }
}
