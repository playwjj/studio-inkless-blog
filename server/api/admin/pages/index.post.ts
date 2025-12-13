import type { DbPage } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Get request body
    const body = await readBody(event)

    // Validate required fields
    if (!body.title || !body.slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and slug are required'
      })
    }

    // Prepare page data
    const pageData: Partial<DbPage> = {
      title: body.title,
      slug: body.slug,
      description: body.description || null,
      author_id: body.author_id ? parseInt(body.author_id) : null,
      status: body.status || 'draft',
      content: body.content || null,
      blocks: body.blocks || null,
      template: body.template || 'default',

      // SEO fields
      meta_title: body.meta_title || null,
      meta_description: body.meta_description || null,
      meta_keywords: body.meta_keywords || null,
      og_image: body.og_image || null,
      og_title: body.og_title || null,
      og_description: body.og_description || null,
      canonical_url: body.canonical_url || null,

      // Appearance fields
      cover_image: body.cover_image || null,
      theme: body.theme || 'light',
      layout: body.layout || 'default',
      custom_css: body.custom_css || null,
      custom_js: body.custom_js || null,

      // Feature toggles (default to 1/0)
      show_header: body.show_header !== undefined ? (body.show_header ? 1 : 0) : 1,
      show_footer: body.show_footer !== undefined ? (body.show_footer ? 1 : 0) : 1,
      show_breadcrumb: body.show_breadcrumb !== undefined ? (body.show_breadcrumb ? 1 : 0) : 0,
      enable_comments: body.enable_comments !== undefined ? (body.enable_comments ? 1 : 0) : 0,
      enable_sharing: body.enable_sharing !== undefined ? (body.enable_sharing ? 1 : 0) : 1,

      // Access control
      is_password_protected: body.is_password_protected !== undefined ? (body.is_password_protected ? 1 : 0) : 0,
      password_hash: body.password_hash || null,

      // Advanced config
      settings: body.settings || null,
      cta_config: body.cta_config || null,

      // Analytics
      view_count: 0,
      conversion_count: 0,

      // Timestamps
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: body.status === 'published'
        ? (body.published_at || new Date().toISOString())
        : null
    }

    // Insert page into database
    const result = await insertRow('pages', pageData)

    return {
      success: true,
      message: 'Page created successfully',
      data: {
        id: result.id
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to create page:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
