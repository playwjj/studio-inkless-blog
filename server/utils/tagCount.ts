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
 * Optimized for Cloudflare Workers to avoid "Too many subrequests" error
 */
export async function cleanupUnusedTags(): Promise<number> {
  try {
    // Fetch unused tags and all articles in parallel
    const [unusedTags, allArticles] = await Promise.all([
      executeQuery<{ id: number, name: string }>(
        'SELECT id, name FROM tags WHERE usage_count = 0 OR usage_count IS NULL'
      ),
      executeQuery<{ tag_names: string }>(
        'SELECT tag_names FROM articles'
      )
    ])

    if (unusedTags.length === 0) return 0

    const now = new Date().toISOString()
    const tagsToDelete: number[] = []
    const tagsToUpdate: Array<{ id: number, count: number }> = []

    // Calculate actual usage for each "unused" tag
    for (const tag of unusedTags) {
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

      if (count === 0) {
        tagsToDelete.push(tag.id)
      } else {
        // Tag was incorrectly marked as unused
        tagsToUpdate.push({ id: tag.id, count })
      }
    }

    // Batch delete unused tags
    if (tagsToDelete.length > 0) {
      const deleteSql = `DELETE FROM tags WHERE id IN (${tagsToDelete.join(',')})`
      await executeQuery(deleteSql)
    }

    // Batch update incorrectly marked tags
    if (tagsToUpdate.length > 0) {
      const whenClauses = tagsToUpdate.map(tag =>
        `WHEN id = ${tag.id} THEN ${tag.count}`
      ).join(' ')

      const updateSql = `
        UPDATE tags
        SET usage_count = CASE ${whenClauses} ELSE usage_count END,
            updated_at = ?
        WHERE id IN (${tagsToUpdate.map(t => t.id).join(',')})
      `

      await executeQuery(updateSql, [now])
    }

    return tagsToDelete.length
  } catch (error) {
    console.error('Failed to cleanup unused tags:', error)
    return 0
  }
}

/**
 * Recalculate usage_count for all tags
 * Useful for fixing inconsistencies
 * Optimized for Cloudflare Workers to avoid "Too many subrequests" error
 */
export async function recalculateAllTagCounts(): Promise<void> {
  try {
    // Get all tags and articles in parallel
    const [allTags, allArticles] = await Promise.all([
      fetchAllFromDb<{ id: number, name: string }>('tags'),
      executeQuery<{ tag_names: string }>(
        'SELECT tag_names FROM articles WHERE status = ?',
        ['published']
      )
    ])

    if (allTags.length === 0) {
      console.log('No tags to recalculate')
      return
    }

    // Calculate usage count for each tag in memory
    const tagCounts = new Map<number, number>()

    for (const tag of allTags) {
      let count = 0
      for (const article of allArticles) {
        if (article.tag_names) {
          // Split tag_names and check if this tag is present
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
      console.log(`Updated tag "${tag.name}" usage_count to ${count}`)
    }

    // Batch update using a single SQL statement with CASE WHEN
    const now = new Date().toISOString()
    const whenClauses = allTags.map(tag =>
      `WHEN id = ${tag.id} THEN ${tagCounts.get(tag.id) || 0}`
    ).join(' ')

    const updateSql = `
      UPDATE tags
      SET usage_count = CASE ${whenClauses} ELSE usage_count END,
          updated_at = ?
      WHERE id IN (${allTags.map(t => t.id).join(',')})
    `

    await executeQuery(updateSql, [now])

    console.log('Successfully recalculated all tag counts')
  } catch (error) {
    console.error('Failed to recalculate tag counts:', error)
    throw error
  }
}
