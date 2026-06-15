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

  // Step 1: Generate article HTML
  const articleResult = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [
      { role: 'user', content: buildArticlePrompt(topic, categoryName, language) }
    ],
    max_tokens: 2048,
    temperature: 0.7,
  }) as { response: string }

  const rawContent = articleResult?.response || ''
  const content = extractArticleHTML(rawContent)
  const title = extractTitle(content) || topic
  const excerpt = extractExcerpt(content)

  // Step 2: Generate tags
  let tags = ''
  try {
    const tagsResult = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'user', content: buildTagsPrompt(topic, excerpt) }
      ],
      max_tokens: 60,
      temperature: 0.3,
    }) as { response: string }

    tags = (tagsResult?.response || '')
      .replace(/\n/g, '')
      .replace(/^tags?:?\s*/i, '')
      .trim()
  } catch {
    // tags are non-critical
  }

  // Estimate reading time (~200 words/min)
  const wordCount = content.replace(/<[^>]+>/g, '').split(/\s+/).length
  const readTime = Math.max(1, Math.round(wordCount / 200))

  return {
    success: true,
    data: { title, excerpt, content, tags, readTime }
  }
})
