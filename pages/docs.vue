<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <Header />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-ai-purple via-ai-cyan to-ai-pink bg-clip-text text-transparent mb-4">
          Documentation
        </h1>
        <p class="text-gray-600 text-lg">
          Everything you need to know about setting up and using Studio Inkless Blog
        </p>
      </div>

      <!-- Tab Navigation -->
      <div class="mb-8 border-b border-gray-200">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            @click="activeTab = 'installation'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300',
              activeTab === 'installation'
                ? 'border-ai-purple text-transparent bg-gradient-to-r from-ai-purple via-ai-cyan to-ai-pink bg-clip-text'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Installation Guide
          </button>
          <button
            @click="activeTab = 'api'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300',
              activeTab === 'api'
                ? 'border-ai-purple text-transparent bg-gradient-to-r from-ai-purple via-ai-cyan to-ai-pink bg-clip-text'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            API Documentation
          </button>
        </nav>
      </div>

      <!-- Content Area -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <article
          v-if="currentContent"
          class="prose prose-lg max-w-none
            prose-headings:font-bold
            prose-h1:text-4xl prose-h1:mb-6 prose-h1:bg-gradient-to-r prose-h1:from-ai-purple prose-h1:via-ai-cyan prose-h1:to-ai-pink prose-h1:bg-clip-text prose-h1:text-transparent
            prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-gray-800 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
            prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-gray-700
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-a:text-ai-cyan prose-a:no-underline hover:prose-a:underline
            prose-code:text-ai-purple prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:shadow-lg
            prose-ul:list-disc prose-ul:pl-6
            prose-ol:list-decimal prose-ol:pl-6
            prose-li:text-gray-600
            prose-table:border-collapse prose-table:w-full
            prose-th:bg-gray-100 prose-th:border prose-th:border-gray-300 prose-th:p-2 prose-th:text-left
            prose-td:border prose-td:border-gray-300 prose-td:p-2
            prose-blockquote:border-l-4 prose-blockquote:border-ai-purple prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600"
          v-html="currentContent"
        ></article>

        <div v-else class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-ai-purple mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading documentation...</p>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
// Parse markdown to HTML (basic implementation)
const parseMarkdown = (md: string): string => {
  let html = md

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')

  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>')

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')

  // Inline code
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>')

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/gim, (match, lang, code) => {
    return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`
  })

  // Unordered lists
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

  // Ordered lists
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>')

  // Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')

  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr>')

  // Tables (basic support)
  html = html.replace(/\|(.+)\|/g, (match) => {
    const cells = match.split('|').filter(cell => cell.trim())
    const cellTags = cells.map(cell => `<td>${cell.trim()}</td>`).join('')
    return `<tr>${cellTags}</tr>`
  })

  // Paragraphs
  html = html.split('\n\n').map(para => {
    if (!para.trim()) return ''
    if (para.startsWith('<')) return para
    return `<p>${para.trim()}</p>`
  }).join('\n')

  return html
}

// Get tab from URL query
const route = useRoute()
const activeTab = ref<'installation' | 'api'>((route.query.tab as string) === 'api' ? 'api' : 'installation')

// Fetch documentation content
const { data: installationData } = await useFetch('/api/docs/installation')
const { data: apiData } = await useFetch('/api/docs/api')

// Parse markdown content
const installationContent = computed(() =>
  installationData.value?.content ? parseMarkdown(installationData.value.content) : null
)

const apiContent = computed(() =>
  apiData.value?.content ? parseMarkdown(apiData.value.content) : null
)

// Current content based on active tab
const currentContent = computed(() =>
  activeTab.value === 'installation' ? installationContent.value : apiContent.value
)

// Update URL when tab changes
watch(activeTab, (newTab) => {
  navigateTo(`/docs?tab=${newTab}`, { replace: true })
})

// SEO
useHead({
  title: 'Documentation - Studio Inkless Blog',
  meta: [
    { name: 'description', content: 'Installation guide and API documentation for Studio Inkless Blog' }
  ]
})
</script>
