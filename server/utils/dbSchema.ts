/**
 * Database schema validation utilities
 * Used to verify table structures match expected schemas
 */

/**
 * Expected column names for each required table
 * This helps validate that tables have the correct structure
 */
export const TABLE_SCHEMAS: Record<string, {
  columns: string[]
  critical?: string[] // Critical columns that must exist
}> = {
  site: {
    columns: ['id', 'name', 'title', 'description', 'email', 'twitter_handle', 'keywords', 'copyright_text', 'og_image', 'created_at', 'updated_at'],
    critical: ['id', 'name', 'title', 'description']
  },
  users: {
    columns: ['id', 'username', 'email', 'password_hash', 'role', 'is_active', 'full_name', 'created_at', 'updated_at'],
    critical: ['id', 'username', 'email', 'password_hash', 'role']
  },
  authors: {
    columns: ['id', 'name', 'email', 'bio', 'avatar_url', 'created_at', 'updated_at'],
    critical: ['id', 'name']
  },
  categories: {
    columns: ['id', 'name', 'slug', 'description', 'created_at', 'updated_at'],
    critical: ['id', 'name', 'slug']
  },
  tags: {
    columns: ['id', 'name', 'slug', 'created_at', 'updated_at'],
    critical: ['id', 'name', 'slug']
  },
  articles: {
    columns: ['id', 'title', 'slug', 'content', 'excerpt', 'author_id', 'category_id', 'is_published', 'published_at', 'created_at', 'updated_at'],
    critical: ['id', 'title', 'slug', 'author_id', 'category_id']
  },
  files: {
    columns: ['id', 'file_name', 'original_name', 'mime_type', 'size', 'url', 'r2_key', 'created_at', 'updated_at'],
    critical: ['id', 'file_name', 'url']
  },
  pages: {
    columns: ['id', 'title', 'slug', 'content', 'is_published', 'published_at', 'created_at', 'updated_at'],
    critical: ['id', 'title', 'slug']
  },
  api_tokens: {
    columns: ['id', 'user_id', 'token_hash', 'name', 'last_used_at', 'expires_at', 'created_at', 'updated_at'],
    critical: ['id', 'user_id', 'token_hash']
  },
  page_blocks: {
    columns: ['id', 'page_id', 'block_type', 'content', 'block_order', 'created_at', 'updated_at'],
    critical: ['id', 'page_id', 'block_type', 'content', 'block_order']
  }
}

/**
 * Validate table schema against expected structure
 * @param tableName - The name of the table to validate
 * @param schema - The actual schema returned from DB API
 * @returns true if table structure is valid, false otherwise
 */
export function validateTableSchema(tableName: string, schema: any): boolean {
  const expected = TABLE_SCHEMAS[tableName]
  if (!expected) {
    console.warn(`No schema definition found for table: ${tableName}`)
    return true // If no definition, assume it's OK
  }

  // Check if critical columns exist
  const columns = schema.data?.map((f: any) => f.name) || []
  const criticalColumns = expected.critical || expected.columns
  
  const missingCritical = criticalColumns.filter(col => !columns.includes(col))
  if (missingCritical.length > 0) {
    console.warn(`Table ${tableName} missing critical columns:`, missingCritical)
    return false
  }

  return true
}

/**
 * Get table schema from D1 API
 * @param apiUrl - The D1 API URL
 * @param apiKey - The D1 API key
 * @param tableName - The name of the table
 * @returns The table schema or null if error
 */
export async function getTableSchema(apiUrl: string, apiKey: string, tableName: string): Promise<any | null> {
  try {
    const response = await $fetch<any>(`${apiUrl}/api/tables/${tableName}/schema`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    })
    return response
  } catch (error: any) {
    console.error(`Failed to fetch schema for table ${tableName}:`, error)
    return null
  }
}
