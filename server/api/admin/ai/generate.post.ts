export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const ai = getAI(event)
  if (!ai) {
    throw createError({ statusCode: 503, statusMessage: 'AI binding not configured' })
  }

  const body = await readBody(event)
  const topic: string = body.topic?.trim()
  const categoryName: string = body.categoryName?.trim() || 'Programming'
  const language: string = body.language || 'en'

  if (!topic) {
    throw createError({ statusCode: 400, statusMessage: 'Topic is required' })
  }

  let rawOutput = ''
  try {
    // Single call: returns TAGS line + separator + article HTML
    const result = await ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [
        { role: 'user', content: buildArticlePrompt(topic, categoryName, language) }
      ],
      max_tokens: 1500,
    }) as { response: string }

    rawOutput = result?.response || ''
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    throw createError({ statusCode: 500, statusMessage: `AI generation failed: ${msg}` })
  }

  if (!rawOutput) {
    throw createError({ statusCode: 500, statusMessage: 'AI returned empty response' })
  }

  // Parse: split on first "---" separator
  const separatorIndex = rawOutput.indexOf('---')
  let tagsLine = ''
  let articleRaw = rawOutput

  if (separatorIndex !== -1) {
    tagsLine = rawOutput.slice(0, separatorIndex).trim()
    articleRaw = rawOutput.slice(separatorIndex + 3).trim()
  }

  // Extract tags from "TAGS: tag1, tag2, ..." line
  const tags = tagsLine
    .replace(/^tags?:?\s*/i, '')
    .replace(/\n[\s\S]*/g, '') // only first line
    .trim()

  const content = extractArticleHTML(articleRaw)
  const title = extractTitle(content) || topic
  const excerpt = extractExcerpt(content)

  const wordCount = content.replace(/<[^>]+>/g, '').split(/\s+/).length
  const readTime = Math.max(1, Math.round(wordCount / 200))

  return {
    success: true,
    data: { title, excerpt, content, tags, readTime }
  }
})
