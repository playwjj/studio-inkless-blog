/**
 * Batch tag operations to reduce N+1 queries
 * Instead of querying each tag individually, we batch all operations
 */

interface TagOperation {
  name: string
  action: 'increment' | 'decrement' | 'ensure'
}

/**
 * Process multiple tag operations in batches to minimize database calls
 */
export async function processBatchTagOperations(operations: TagOperation[]): Promise<void> {
  if (operations.length === 0) return

  const tagNames = [...new Set(operations.map(op => op.name))]

  // Step 1: Fetch all relevant tags in a single query
  const placeholders = tagNames.map(() => '?').join(',')
  const existingTags = await executeQuery<{ id: number, name: string, usage_count: number }>(
    `SELECT id, name, usage_count FROM tags WHERE name IN (${placeholders})`,
    tagNames
  )

  // Step 2: Build a map for quick lookup
  const tagMap = new Map<string, { id: number, usage_count: number }>()
  existingTags.forEach(tag => {
    tagMap.set(tag.name, { id: tag.id, usage_count: tag.usage_count || 0 })
  })

  // Step 3: Calculate net changes for each tag
  const changes = new Map<string, number>()
  const ensureOnly = new Set<string>()

  operations.forEach(({ name, action }) => {
    if (action === 'ensure') {
      ensureOnly.add(name)
    } else {
      const currentChange = changes.get(name) || 0
      changes.set(name, currentChange + (action === 'increment' ? 1 : -1))
    }
  })

  // Step 4: Prepare batch updates and inserts
  const updates: Array<{ id: number, newCount: number }> = []
  const inserts: Array<{ name: string, count: number }> = []

  // Process changes
  changes.forEach((delta, name) => {
    const existing = tagMap.get(name)
    if (existing) {
      const newCount = Math.max(0, existing.usage_count + delta)
      updates.push({ id: existing.id, newCount })
    } else {
      // Tag doesn't exist, create it
      inserts.push({ name, count: Math.max(0, delta) })
    }
  })

  // Process ensure-only tags (tags that should exist with count 0)
  ensureOnly.forEach(name => {
    if (!tagMap.has(name) && !changes.has(name)) {
      inserts.push({ name, count: 0 })
    }
  })

  // Step 5: Execute batch updates
  const now = new Date().toISOString()

  // Batch update existing tags
  for (const { id, newCount } of updates) {
    await updateRow('tags', id, {
      usage_count: newCount,
      updated_at: now
    })
  }

  // Batch insert new tags
  for (const { name, count } of inserts) {
    await insertRow('tags', {
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      usage_count: count,
      created_at: now,
      updated_at: now
    })
  }
}

/**
 * Sync tags when creating or updating an article
 * This replaces the N+1 query pattern with batch operations
 */
export async function batchSyncTags(
  newTagsString: string,
  oldTagsString: string,
  oldStatus: string,
  newStatus: string
): Promise<void> {
  const newTagNames = newTagsString
    ? newTagsString.split(',').map(tag => tag.trim()).filter(Boolean)
    : []

  const oldTagNames = oldTagsString
    ? oldTagsString.split(',').map(tag => tag.trim()).filter(Boolean)
    : []

  const operations: TagOperation[] = []

  // Find tags to add (in new but not in old)
  const tagsToAdd = newTagNames.filter(
    tag => !oldTagNames.some(oldTag => oldTag.toLowerCase() === tag.toLowerCase())
  )

  // Find tags to remove (in old but not in new)
  const tagsToRemove = oldTagNames.filter(
    tag => !newTagNames.some(newTag => newTag.toLowerCase() === tag.toLowerCase())
  )

  // Tags that remain unchanged
  const tagsUnchanged = newTagNames.filter(
    tag => oldTagNames.some(oldTag => oldTag.toLowerCase() === tag.toLowerCase())
  )

  // Handle added tags
  tagsToAdd.forEach(tagName => {
    if (newStatus === 'published') {
      operations.push({ name: tagName, action: 'increment' })
    } else {
      operations.push({ name: tagName, action: 'ensure' })
    }
  })

  // Handle removed tags
  tagsToRemove.forEach(tagName => {
    if (oldStatus === 'published') {
      operations.push({ name: tagName, action: 'decrement' })
    }
  })

  // Handle unchanged tags when status changes
  if (oldStatus !== newStatus && tagsUnchanged.length > 0) {
    tagsUnchanged.forEach(tagName => {
      if (oldStatus === 'published' && newStatus !== 'published') {
        operations.push({ name: tagName, action: 'decrement' })
      } else if (oldStatus !== 'published' && newStatus === 'published') {
        operations.push({ name: tagName, action: 'increment' })
      }
    })
  }

  await processBatchTagOperations(operations)
}

/**
 * Handle status change when tags don't change
 */
export async function batchHandleStatusChangeForTags(
  tagsString: string,
  oldStatus: string,
  newStatus: string
): Promise<void> {
  if (!tagsString || oldStatus === newStatus) return

  const tagNames = tagsString.split(',').map(tag => tag.trim()).filter(Boolean)
  const operations: TagOperation[] = []

  if (oldStatus === 'published' && newStatus !== 'published') {
    tagNames.forEach(tagName => {
      operations.push({ name: tagName, action: 'decrement' })
    })
  } else if (oldStatus !== 'published' && newStatus === 'published') {
    tagNames.forEach(tagName => {
      operations.push({ name: tagName, action: 'increment' })
    })
  }

  await processBatchTagOperations(operations)
}
