import type { H3Event } from 'h3'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAI(event: H3Event): any | null {
  return event.context.cloudflare?.env?.AI ?? null
}

export function isAIAvailable(event: H3Event): boolean {
  return !!event.context.cloudflare?.env?.AI
}

/**
 * Extract <h1> text content from HTML string
 */
export function extractTitle(html: string): string {
  const match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  if (!match) return ''
  return match[1].replace(/<[^>]+>/g, '').trim()
}

/**
 * Extract first <p> text content from HTML string as excerpt
 */
export function extractExcerpt(html: string): string {
  const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
  if (!match) return ''
  return match[1].replace(/<[^>]+>/g, '').trim().slice(0, 300)
}

/**
 * Extract <article>...</article> block from raw model output
 */
export function extractArticleHTML(raw: string): string {
  const match = raw.match(/<article[\s\S]*<\/article>/i)
  return match ? match[0].trim() : raw.trim()
}

/**
 * Build text generation prompt for blog articles
 */
export function buildArticlePrompt(topic: string, categoryName: string, language: string): string {
  const langInstruction = language === 'zh'
    ? 'Write the entire article in Simplified Chinese.'
    : 'Write the entire article in English.'

  return `You are a professional technical writer specializing in developer content.

Write a comprehensive, practical blog post in clean semantic HTML.

Topic: "${topic}"
Category: "${categoryName || 'Programming'}"
${langInstruction}

CONTENT STRUCTURE:
1. Introduction (1-2 paragraphs): hook the reader, explain why this matters
2. Main Content (4-6 sections with <h2> headings): concrete examples, code snippets where relevant
3. Conclusion: 2-3 key takeaways in a <ul> list

HTML RULES:
- Wrap everything in <article>
- ONE <h1> only (the article title)
- Use <h2> for sections, <h3> for subsections
- Use <pre><code class="language-xxx">...</code></pre> for code blocks
- Use <ul>/<ol>/<li> for lists, <strong> for emphasis
- NO inline styles, NO markdown, NO emojis
- Aim for 700-1000 words

Output ONLY the HTML, starting with <article> and ending with </article>.`
}

/**
 * Build prompt to generate tags from article content
 */
export function buildTagsPrompt(topic: string, excerpt: string): string {
  return `Given this blog post topic and excerpt, generate 3-5 relevant tags.

Topic: "${topic}"
Excerpt: "${excerpt}"

Rules:
- Use lowercase
- 1-3 words per tag
- Focus on technical terms and technologies
- Avoid generic tags like "tutorial" or "guide"

Return ONLY a comma-separated list, no explanation. Example: vue, nuxt, typescript`
}

/**
 * Build image generation prompt for blog cover
 */
export function buildCoverImagePrompt(topic: string): string {
  const visualMappings: Record<string, string> = {
    'react': 'modern web interface, component-based design',
    'vue': 'progressive web framework, modular interface',
    'nuxt': 'modern server-side rendering, web framework',
    'node': 'server architecture, backend infrastructure',
    'typescript': 'structured code environment, type system',
    'javascript': 'dynamic programming, web development',
    'css': 'visual styling, design system, color palette',
    'python': 'clean code workspace, data flow',
    'docker': 'containerized environment, cloud infrastructure',
    'kubernetes': 'orchestration system, distributed architecture',
    'cloudflare': 'edge computing, global network, cloud infrastructure',
    'api': 'data connection, network communication',
    'database': 'data storage, structured information',
    'performance': 'speed optimization, efficient workflow',
    'security': 'protected system, encrypted data',
    'ai': 'artificial intelligence, neural network, machine learning',
  }

  const topicLower = topic.toLowerCase()
  let visualConcept = 'modern technology workspace, clean digital environment'
  for (const [keyword, visual] of Object.entries(visualMappings)) {
    if (topicLower.includes(keyword)) {
      visualConcept = visual
      break
    }
  }

  const styles = ['editorial', 'cinematic', 'modern', 'atmospheric']
  const moods = ['cool', 'neutral', 'sophisticated', 'warm']
  const style = styles[Math.floor(Math.random() * styles.length)]
  const mood = moods[Math.floor(Math.random() * moods.length)]

  const styleMap: Record<string, string> = {
    editorial: 'magazine photography, professional composition, natural lighting',
    cinematic: 'cinematic color grading, dramatic lighting, film atmosphere',
    modern: 'contemporary design, clean lines, minimalist',
    atmospheric: 'dreamy atmosphere, soft focus, ambient mood',
  }
  const moodMap: Record<string, string> = {
    cool: 'cool tones, blue-gray palette, silver accents',
    neutral: 'neutral tones, beige and gray, balanced',
    sophisticated: 'muted tones, navy and charcoal, elegant',
    warm: 'warm tones, golden hour, amber colors',
  }

  return `A professional blog cover image featuring ${visualConcept}, ${styleMap[style]}, ${moodMap[mood]}, photorealistic, 16:9 landscape, editorial quality, clean composition, modern aesthetic, high detail, Unsplash style`
}

export const COVER_IMAGE_NEGATIVE_PROMPT = 'text, letters, words, watermark, logo, blurry, low quality, distorted, oversaturated, cartoonish, deformed'
