/**
 * Setup check API endpoint
 * Checks if DB_API_KEY and DB_API_URL are configured
 * Checks if all required tables exist with proper schema using /api/tables and /api/tables/:tableName/schema
 * 
 * ⚠️ SECURITY: Setup operations are disabled by default in production.
 * Set SETUP_DISABLED=false to enable setup functionality.
 */

import { validateTableSchema, getTableSchema } from '~/server/utils/dbSchema'

export default defineEventHandler(async (event) => {
  try {
    // Security check: Allow disabling setup operations completely
    const config = useRuntimeConfig()
    const setupDisabled = config.setupDisabled !== false // Default: true (disabled)
    
    if (setupDisabled) {
      return {
        status: 'setup-disabled',
        message: 'Setup operations are disabled for security reasons',
        details: {
          reason: 'The setup functionality has been permanently disabled after successful initial configuration.',
          instruction: 'If you need to enable setup again, set SETUP_DISABLED=false in your environment variables.'
        }
      }
    }

    const apiUrl = config.dbApiUrl
    const apiKey = config.dbApiKey

    // Check if environment variables are set
    if (!apiUrl || !apiKey) {
      return {
        status: 'missing-env',
        message: 'Database API configuration is missing',
        details: {
          dbApiUrlSet: !!apiUrl,
          dbApiKeySet: !!apiKey
        }
      }
    }

    // Check which tables exist using the /api/tables endpoint
    try {
      const tablesResponse = await $fetch<any>(`${apiUrl}/api/tables`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      })
      const existingTables = tablesResponse.data?.map((t: any) => t.name) || []
      console.log('Existing tables:', existingTables)

      // Check if all required tables exist
      const requiredTables = [
        'site', 'users', 'authors', 'categories', 'tags',
        'articles', 'files', 'pages', 'api_tokens', 'page_blocks', 'newsletters'
      ]
      const allTablesExist = requiredTables.every(table => existingTables.includes(table))

      if (!allTablesExist) {
        console.log('Not all required tables exist, setup needed')
        return {
          status: 'needs-setup',
          message: 'Database tables need to be initialized',
          details: {
            existingTables,
            requiredTables,
            missingTables: requiredTables.filter(t => !existingTables.includes(t))
          }
        }
      }

      // All tables exist, now validate their schemas
      console.log('Validating table schemas...')
      const invalidTables: string[] = []
      
      for (const tableName of requiredTables) {
        const schema = await getTableSchema(apiUrl, apiKey, tableName)
        if (!schema || !validateTableSchema(tableName, schema)) {
          invalidTables.push(tableName)
        }
      }

      if (invalidTables.length > 0) {
        console.log('Some tables have invalid schema:', invalidTables)
        return {
          status: 'needs-setup',
          message: 'Database tables exist but have invalid structure',
          details: {
            invalidTables,
            reason: 'Table schemas do not match expected structure. Re-initialization recommended.'
          }
        }
      }

      // All tables exist with valid schemas, check if site table has data
      try {
        const siteResponse = await $fetch('/api/site')
        if (siteResponse) {
          console.log('Setup is complete and ready')
          return {
            status: 'ready',
            message: 'Database is properly configured with all tables initialized',
            data: siteResponse
          }
        }
      } catch (siteError: any) {
        const statusCode = siteError.status
        // If we get 404 on site, it means site table exists but has no data
        if (statusCode === 404) {
          console.log('Site table exists but has no data, needs configuration')
          return {
            status: 'needs-setup',
            message: 'Database tables exist but need to be configured with site data'
          }
        }
        // For other errors, pass them up
        throw siteError
      }
    } catch (dbError: any) {
      // Database connection failed
      console.error('Database check error:', dbError)
      throw dbError
    }
  } catch (error: any) {
    console.error('Setup check error:', error)
    return {
      status: 'error',
      message: error.message || 'Failed to check setup status'
    }
  }
})
