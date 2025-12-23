export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name')

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Document name is required'
    })
  }

  // Validate name to prevent path traversal
  if (name.includes('..') || name.includes('/') || name.includes('\\')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid document name'
    })
  }

  try {
    // Get the request URL to construct absolute URL for fetching
    const host = getRequestHeader(event, 'host')
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
    const baseUrl = `${protocol}://${host}`

    // Fetch markdown file from public/docs directory via HTTP
    const docUrl = `${baseUrl}/docs/${name}.md`
    const response = await $fetch(docUrl, {
      method: 'GET',
      responseType: 'text'
    })

    return {
      name,
      content: response,
      raw: response
    }
  } catch (error: any) {
    console.error(`Failed to read document ${name}:`, error)

    if (error.status === 404 || error.statusCode === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Document not found'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to read document'
    })
  }
})
