export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const ai = getAI(event)
  if (!ai) {
    throw createError({ statusCode: 503, statusMessage: 'AI binding not configured' })
  }

  const body = await readBody(event)
  const topic: string = body.topic?.trim()

  if (!topic) {
    throw createError({ statusCode: 400, statusMessage: 'Topic is required' })
  }

  const prompt = buildCoverImagePrompt(topic)

  const imageStream = await ai.run('@cf/bytedance/stable-diffusion-xl-lightning', {
    prompt,
    negative_prompt: COVER_IMAGE_NEGATIVE_PROMPT,
    num_steps: 4,
    width: 896,
    height: 512,
  })

  // Convert ReadableStream to Uint8Array
  const response = new Response(imageStream as unknown as ReadableStream)
  const arrayBuffer = await response.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)

  // Upload to R2
  const key = generateFileKey(`ai-cover-${Date.now()}.png`)
  await uploadToR2(event, buffer, key, 'image/png')

  const publicUrl = getPublicUrl(key)

  // Save file record to database
  try {
    await createRow('files', {
      file_name: `ai-cover-${topic.slice(0, 30)}.png`,
      file_key: key,
      url: publicUrl,
      mime_type: 'image/png',
      file_size: buffer.length,
      uploaded_by: user.id,
      created_at: new Date().toISOString(),
    })
  } catch {
    // file record is non-critical
  }

  return {
    success: true,
    data: { url: publicUrl }
  }
})
