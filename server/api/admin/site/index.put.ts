import type { DbSite } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    const body = await readBody(event)
    const {
      name,
      title,
      description,
      logo_url,
      favicon_url,
      keywords,
      copyright_text,
      og_site_name,
      og_title,
      og_description,
      og_image,
      og_url,
      twitter_title,
      twitter_description,
      twitter_image
    } = body

    // Validate required fields
    if (!name || !title || !description) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, title, and description are required'
      })
    }

    // Check if site config exists
    const siteResponse = await fetchFromDb<DbSite>('site', {
      page: 1,
      limit: 1,
      sortBy: 'id',
      sortOrder: 'desc'
    })

    const siteData = {
      name: name.trim(),
      title: title.trim(),
      description: description.trim(),
      logo_url: logo_url?.trim() || '',
      favicon_url: favicon_url?.trim() || '',
      keywords: keywords?.trim() || '',
      copyright_text: copyright_text?.trim() || '',
      og_site_name: og_site_name?.trim() || name.trim(),
      og_title: og_title?.trim() || title.trim(),
      og_description: og_description?.trim() || description.trim(),
      og_image: og_image?.trim() || '',
      og_url: og_url?.trim() || '',
      twitter_title: twitter_title?.trim() || title.trim(),
      twitter_description: twitter_description?.trim() || description.trim(),
      twitter_image: twitter_image?.trim() || ''
    }

    let updatedSite: DbSite

    if (siteResponse.data.length > 0) {
      // Update existing configuration
      const existingSite = siteResponse.data[0]
      updatedSite = await updateRow<DbSite>('site', existingSite.id, siteData)
    } else {
      // Create new configuration
      updatedSite = await createRow<DbSite>('site', siteData)
    }

    return {
      success: true,
      site: updatedSite,
      message: 'Site settings updated successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Failed to update site config:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update site configuration'
    })
  }
})
