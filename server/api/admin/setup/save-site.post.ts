/**
 * Save site configuration and create initial admin user API endpoint
 * Saves the initial site configuration to the database
 * Creates the first admin user for the blog
 * 
 * ⚠️ SECURITY: Setup operations are disabled by default in production.
 * Set SETUP_DISABLED=false to enable setup functionality.
 */

import type { DbSite, DbUser } from '~/server/types/dbTypes'

interface SiteSetupData {
  name: string
  title: string
  description: string
  // Admin user info
  admin_username: string
  admin_email: string
  admin_password: string
}

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    // Security check: Allow disabling setup operations completely
    const setupDisabled = config.setupDisabled !== false // Default: true (disabled)
    
    if (setupDisabled) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Setup operations are disabled for security reasons. Site configuration changes are not allowed.'
      })
    }

    const apiUrl = config.dbApiUrl
    const apiKey = config.dbApiKey

    if (!apiUrl || !apiKey) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Database API configuration is missing'
      })
    }

    const body = await readBody<SiteSetupData>(event)

    // Validate required fields
    if (!body.name || !body.title || !body.description) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: name, title, description'
      })
    }

    // Validate admin credentials
    if (!body.admin_username || !body.admin_email || !body.admin_password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'All admin fields are required: admin_username, admin_email, admin_password'
      })
    }

    // 1. Save site configuration (only required fields)
    const siteResult = await createRow<DbSite>('site', {
        name: String(body.name).trim(),
        title: String(body.title).trim(),
        description: String(body.description).trim()
     })
    console.log('Site configuration saved')

    // 2. Create initial admin user
    const password_hash = await hashPassword(body.admin_password)   
    const adminResult = await createRow<DbUser>('users', {
      username: body.admin_username,
      email: body.admin_email,
      password_hash: password_hash,
      full_name: body.admin_username,
      role: 'admin',
      is_active: 1
    })

    console.log('Admin user created')

    return {
      success: true,
      message: 'Site configuration saved successfully and admin user created',
      data: {
        site: siteResult,
        admin: adminResult
      }
    }
  } catch (error: any) {
    console.error('Site configuration save error:', error)

    // If it's already a createError error, pass it through
    if (error.statusCode) {
      throw error
    }

    // Extract meaningful error message from database API errors
    const errorMessage = error?.data?.error || error?.message || 'Failed to save site configuration'

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: errorMessage
    })
  }
})
