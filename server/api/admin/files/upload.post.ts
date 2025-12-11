import type { DbFile } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)
    const session = await getUserSession(event)

    // Read multipart form data
    const files = await readMultipartFormData(event)

    if (!files || files.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No files provided'
      })
    }

    const uploadedFiles: DbFile[] = []

    // Process each file
    for (const file of files) {
      if (!file.data || !file.filename) {
        continue
      }

      const mimeType = file.type || 'application/octet-stream'
      const fileSize = file.data.length

      // Validate file
      const validation = validateFile(fileSize, mimeType)
      if (!validation.valid) {
        throw createError({
          statusCode: 400,
          statusMessage: validation.error
        })
      }

      // Generate unique file key
      const fileKey = generateFileKey(file.filename)

      // Upload to R2
      try {
        await uploadToR2(file.data, fileKey, mimeType)
      } catch (error) {
        console.error('R2 upload failed:', error)
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to upload file to storage'
        })
      }

      // Generate public URL
      const fileUrl = getPublicUrl(fileKey)

      // Extract image dimensions if applicable
      const dimensions = await getImageDimensions(file.data, mimeType)

      // Create database record
      const dbFile = await createRow<DbFile>('files', {
        file_name: file.filename,
        file_key: fileKey,
        file_size: fileSize,
        mime_type: mimeType,
        url: fileUrl,
        width: dimensions?.width || null,
        height: dimensions?.height || null,
        uploaded_by: session.user!.id,
        created_at: new Date().toISOString()
      })

      uploadedFiles.push(dbFile)
    }

    return {
      success: true,
      files: uploadedFiles,
      count: uploadedFiles.length
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('File upload error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
