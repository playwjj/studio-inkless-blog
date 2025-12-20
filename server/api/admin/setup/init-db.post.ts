/**
 * Initialize database tables API endpoint
 * Creates all required tables in the correct dependency order
 * 
 * ⚠️ SECURITY: Setup operations are disabled by default in production.
 * Set SETUP_DISABLED=false to enable setup functionality.
 */
import type { DbSite } from '~/server/types/dbTypes'

interface TableDefinition {
  name: string
  sql: string
}

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    // Security check: Allow disabling setup operations completely
    const setupDisabled = config.setupDisabled !== false // Default: true (disabled)
    
    if (setupDisabled) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Setup operations are disabled for security reasons. The database initialization functionality has been permanently disabled.'
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

    // Safety check: Prevent re-initialization if database already has data
    try {
      const tablesResponse = await $fetch<any>(`${apiUrl}/api/tables`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      })

      console.log('Existing tables response:', tablesResponse)

      const existingTables = tablesResponse.data?.map((t: any) => t.name) || []
      console.log('Existing tables:', existingTables)
      
      // If site table exists, check if it has data
      if (existingTables.includes('site')) {
        try {
          const siteResponse = await fetchFromDb<DbSite>('site', {
              page: 1,
              limit: 1,
              sortBy: 'id',
              sortOrder: 'desc'
            })
          
          console.log('Site data response:', siteResponse)
          
          // If site data exists, prevent initialization
          if (siteResponse.success && siteResponse.data && siteResponse.data.length > 0) {
            console.log('Site table has data, preventing re-initialization')
            throw createError({
              statusCode: 409,
              statusMessage: 'Database initialization failed: Database tables already exist with data. Prevent re-initialization to avoid data loss.'
            })
          }
        } catch (siteError: any) {
          // If this is our intentional 409 error, re-throw it
          if (siteError.statusCode === 409) {
            throw siteError
          }
          console.log('Error checking site data:', siteError.message)
          // For other errors when checking site data, if we have other tables, also prevent initialization
          if (existingTables.length > 0) {
            throw createError({
              statusCode: 409,
              statusMessage: 'Database initialization failed: Database tables already exist. Prevent re-initialization to avoid data loss.'
            })
          }
        }
      }
    } catch (checkError: any) {
      // If this is our intentional error, re-throw it
      if (checkError.statusCode === 409) {
        throw checkError
      }
      // Otherwise, continue with initialization (tables might not exist yet)
      console.log('Check error (continuing with init):', checkError.message)
    }

    // Define all tables in dependency order
    const tables: TableDefinition[] = [
      // Level 1: No dependencies
      {
        name: 'site',
        sql: `CREATE TABLE "site" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "og_site_name" TEXT,
  "og_title" TEXT,
  "og_description" TEXT,
  "og_image" TEXT,
  "og_url" TEXT,
  "twitter_title" TEXT,
  "twitter_description" TEXT,
  "twitter_image" TEXT,
  "logo_url" TEXT,
  "favicon_url" TEXT,
  "keywords" TEXT,
  "email" TEXT,
  "copyright_text" TEXT,
  "twitter_handle" TEXT,
  "gtm_code" TEXT
)`
      },
      {
        name: 'users',
        sql: `CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'admin' CHECK(role IN ('admin', 'editor', 'viewer')),
  is_active INTEGER DEFAULT 1,
  last_login_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now')),
  bio TEXT
)`
      },
      {
        name: 'authors',
        sql: `CREATE TABLE authors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`
      },
      {
        name: 'categories',
        sql: `CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    count INTEGER DEFAULT 0
)`
      },
      {
        name: 'tags',
        sql: `CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`
      },

      // Level 2: Depend on Level 1 tables
      {
        name: 'articles',
        sql: `CREATE TABLE articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    cover_image_url TEXT,
    published_at TIMESTAMP NOT NULL,
    read_time INTEGER DEFAULT 0,
    tag_names TEXT DEFAULT '', 
    author_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'published',
    "content" TEXT,
    is_featured INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0
)`
      },
      {
        name: 'files',
        sql: `CREATE TABLE files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_name VARCHAR(255) NOT NULL,
    file_key VARCHAR(500) NOT NULL UNIQUE,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    url VARCHAR(1000) NOT NULL,
    width INTEGER,
    height INTEGER,
    uploaded_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
)`
      },
      {
        name: 'pages',
        sql: `CREATE TABLE pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    author_id INTEGER,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
    published_at TEXT,
    content TEXT,
    blocks TEXT,
    template TEXT DEFAULT 'default',
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT,
    og_image TEXT,
    og_title TEXT,
    og_description TEXT,
    canonical_url TEXT,
    cover_image TEXT,
    theme TEXT DEFAULT 'light',
    layout TEXT DEFAULT 'default',
    custom_css TEXT,
    custom_js TEXT,
    show_header INTEGER DEFAULT 1,
    show_footer INTEGER DEFAULT 1,
    show_breadcrumb INTEGER DEFAULT 0,
    enable_comments INTEGER DEFAULT 0,
    enable_sharing INTEGER DEFAULT 1,
    is_password_protected INTEGER DEFAULT 0,
    password_hash TEXT,
    settings TEXT,
    cta_config TEXT,
    view_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    "updated_at" TEXT DEFAULT (datetime('now')),
    type TEXT DEFAULT 'page' CHECK(type IN ('page', 'url')),
    show_to_header_menu INTEGER DEFAULT 0,
    show_to_footer_menu INTEGER DEFAULT 0,
    sort INTEGER DEFAULT 0,
    target TEXT
)`
      },
      {
        name: 'api_tokens',
        sql: `CREATE TABLE api_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  scopes TEXT,
  expires_at TEXT,
  last_used_at TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT NOT NULL,
  "updated_at" TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)`
      },
      {
        name: 'newsletters',
        sql: `CREATE TABLE newsletters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,                                                                                                                                                            
       email TEXT NOT NULL UNIQUE,                                                                                                                                                                      
       status TEXT NOT NULL DEFAULT 'active',                                                                                                                                                           
       source TEXT DEFAULT 'homepage',                                                                                                                                                                  
       ip_address TEXT,                                                                                                                                                                                 
       user_agent TEXT,                                                                                                                                                                                 
       subscribed_at TEXT NOT NULL,                                                                                                                                                                     
       unsubscribed_at TEXT,                                                                                                                                                                            
       created_at TEXT NOT NULL,                                                                                                                                                                        
       updated_at TEXT NOT NULL       
)`
      },

      // Level 3: Depend on Level 2 tables
      {
        name: 'page_blocks',
        sql: `CREATE TABLE page_blocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_id INTEGER NOT NULL,
    block_type TEXT NOT NULL,
    block_order INTEGER NOT NULL DEFAULT 0,
    title TEXT,
    subtitle TEXT,
    content TEXT,
    config TEXT,
    background_color TEXT,
    background_image TEXT,
    text_color TEXT,
    is_visible INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    "updated_at" TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
)`
      }
    ]

    // Drop existing tables in reverse order (to handle dependencies)
    const tableNames = tables.map(t => t.name).reverse()
    for (const tableName of tableNames) {
      try {
        await $fetch(`${apiUrl}/api/tables/${tableName}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        })
        console.log(`Existing ${tableName} table dropped`)
      } catch (error) {
        console.log(`${tableName} table does not exist yet`)
      }
    }

    // Create tables in forward order
    const createdTables: string[] = []
    for (const table of tables) {
      try {
        await $fetch(`${apiUrl}/api/tables`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: {
            sql: table.sql
          }
        })
        createdTables.push(table.name)
        console.log(`Table '${table.name}' created successfully`)
      } catch (error: any) {
        console.error(`Failed to create table '${table.name}':`, error)
        throw createError({
          statusCode: 500,
          statusMessage: `Failed to create table '${table.name}': ${error.message}`
        })
      }
    }

    return {
      success: true,
      message: `All ${createdTables.length} database tables created successfully`,
      tables: createdTables
    }
  } catch (error: any) {
    console.error('Database initialization error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to initialize database'
    })
  }
})
