import type { DbPage } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Get page ID from route params
    const pageId = getRouterParam(event, 'id')

    if (!pageId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Page ID is required'
      })
    }

    // Get request body
    const body = await readBody(event)

    // Fetch the page to verify it exists
    const page = await fetchOneFromDb<DbPage>('pages', pageId)

    if (!page) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found'
      })
    }

    // Prepare update data
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    }

    // Basic fields
    if (body.title !== undefined) updateData.title = body.title
    if (body.slug !== undefined) updateData.slug = body.slug
    if (body.description !== undefined) updateData.description = body.description || null
    if (body.author_id !== undefined) updateData.author_id = body.author_id ? parseInt(body.author_id) : null
    if (body.content !== undefined) updateData.content = body.content || null
    if (body.blocks !== undefined) updateData.blocks = body.blocks || null
    if (body.template !== undefined) updateData.template = body.template || 'default'

    // Status management
    if (body.status !== undefined && ['draft', 'published', 'archived'].includes(body.status)) {
      updateData.status = body.status

      // Update published_at when publishing for the first time
      if (body.status === 'published' && !page.published_at) {
        updateData.published_at = new Date().toISOString()
      }
    }
    if (body.published_at !== undefined) updateData.published_at = body.published_at || null

    // SEO fields
    if (body.meta_title !== undefined) updateData.meta_title = body.meta_title || null
    if (body.meta_description !== undefined) updateData.meta_description = body.meta_description || null
    if (body.meta_keywords !== undefined) updateData.meta_keywords = body.meta_keywords || null
    if (body.og_image !== undefined) updateData.og_image = body.og_image || null
    if (body.og_title !== undefined) updateData.og_title = body.og_title || null
    if (body.og_description !== undefined) updateData.og_description = body.og_description || null
    if (body.canonical_url !== undefined) updateData.canonical_url = body.canonical_url || null

    // Appearance fields
    if (body.cover_image !== undefined) updateData.cover_image = body.cover_image || null
    if (body.theme !== undefined) updateData.theme = body.theme || 'light'
    if (body.layout !== undefined) updateData.layout = body.layout || 'default'
    if (body.custom_css !== undefined) updateData.custom_css = body.custom_css || null
    if (body.custom_js !== undefined) updateData.custom_js = body.custom_js || null

    // Feature toggles
    if (body.show_header !== undefined) updateData.show_header = body.show_header ? 1 : 0
    if (body.show_footer !== undefined) updateData.show_footer = body.show_footer ? 1 : 0
    if (body.show_breadcrumb !== undefined) updateData.show_breadcrumb = body.show_breadcrumb ? 1 : 0
    if (body.enable_comments !== undefined) updateData.enable_comments = body.enable_comments ? 1 : 0
    if (body.enable_sharing !== undefined) updateData.enable_sharing = body.enable_sharing ? 1 : 0

    // Access control
    if (body.is_password_protected !== undefined) updateData.is_password_protected = body.is_password_protected ? 1 : 0
    if (body.password_hash !== undefined) updateData.password_hash = body.password_hash || null

    // Advanced config
    if (body.settings !== undefined) updateData.settings = body.settings || null
    if (body.cta_config !== undefined) updateData.cta_config = body.cta_config || null

    // Update the page
    await updateRow('pages', pageId, updateData)

    return {
      success: true,
      message: 'Page updated successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to update page:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
