import type { DbPage } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const type = query.type as 'header' | 'footer'

    if (!type || !['header', 'footer'].includes(type)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid menu type. Must be "header" or "footer"'
      })
    }

    // Determine which field to filter by
    const filterField = type === 'header' ? 'show_to_header_menu' : 'show_to_footer_menu'

    // Execute SQL query using executeQuery utility
    const sqlQuery = `SELECT id, title, slug, type, target, sort FROM pages WHERE status = 'published' AND ${filterField} = 1 ORDER BY sort ASC`

    const pages = await executeQuery<DbPage>(sqlQuery, [])

    // Transform the data
    const menuItems = pages.map(page => ({
      id: page.id,
      title: page.title,
      slug: page.slug,
      type: page.type,
      target: page.target || undefined,
      // Generate URL based on type
      url: page.type === 'url' ? page.slug : `/${page.slug}`
    }))

    return {
      success: true,
      items: menuItems
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to fetch menu items:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
