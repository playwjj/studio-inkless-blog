<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
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
          class="prose prose-lg max-w-none"
          v-html="currentContent"
        ></article>

        <div v-else class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-ai-purple mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading documentation...</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'

// Configure marked with custom heading ID generation
marked.use({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert \n to <br>
  mangle: false, // Don't escape autolinked email addresses
  renderer: {
    heading({ tokens, depth }: any) {
      // Extract raw text from tokens
      const text = tokens.map((t: any) => t.text || t.raw || '').join('')

      // Generate ID from header text
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      // Parse tokens to HTML
      const html = this.parser.parseInline(tokens)

      return `<h${depth} id="${id}">${html}</h${depth}>\n`
    }
  }
})

// Get tab from URL query
const route = useRoute()
const activeTab = ref<'installation' | 'api'>((route.query.tab as string) === 'api' ? 'api' : 'installation')

// Fetch documentation content
const { data: installationData } = await useFetch('/api/docs/installation')
const { data: apiData } = await useFetch('/api/docs/api')

// Parse markdown content using marked
const installationContent = computed(() =>
  installationData.value?.content ? marked(installationData.value.content) : null
)

const apiContent = computed(() =>
  apiData.value?.content ? marked(apiData.value.content) : null
)

// Current content based on active tab
const currentContent = computed(() =>
  activeTab.value === 'installation' ? installationContent.value : apiContent.value
)

// Handle anchor link clicks
const handleAnchorClick = (e: Event) => {
  const target = e.target as HTMLElement

  // Find the closest anchor element (in case click is on child element)
  const anchor = target.closest('a')

  if (anchor) {
    const href = anchor.getAttribute('href')

    // Only handle hash links
    if (href && href.startsWith('#')) {
      e.preventDefault()
      const id = href.slice(1)

      if (id) {
        const element = document.getElementById(id)
        if (element) {
          // Scroll to element
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })

          // Update URL hash
          const currentUrl = new URL(window.location.href)
          currentUrl.hash = id
          window.history.pushState({}, '', currentUrl.toString())
        } else {
          console.warn(`Element with id "${id}" not found`)
        }
      }
    }
  }
}

// Scroll to hash on mount and when content changes
const scrollToHash = () => {
  const hash = window.location.hash
  if (hash) {
    // Use setTimeout to ensure content is rendered
    setTimeout(() => {
      const id = hash.slice(1)
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }
}

// Update URL when tab changes
watch(activeTab, (newTab) => {
  navigateTo(`/docs?tab=${newTab}`, { replace: true })
})

// Watch for content changes to scroll to hash
watch(currentContent, () => {
  scrollToHash()
})

// Scroll to hash on mount
onMounted(() => {
  scrollToHash()
  // Add click listener for anchor links
  document.addEventListener('click', handleAnchorClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleAnchorClick)
})

// SEO
useHead({
  title: 'Documentation - Studio Inkless Blog',
  meta: [
    { name: 'description', content: 'Installation guide and API documentation for Studio Inkless Blog' }
  ]
})
</script>

<style scoped>
/* Smooth scroll behavior */
:deep(html) {
  scroll-behavior: smooth;
}

/* Add scroll margin to headers for better anchor positioning */
:deep(.prose h1),
:deep(.prose h2),
:deep(.prose h3),
:deep(.prose h4),
:deep(.prose h5),
:deep(.prose h6) {
  scroll-margin-top: 2rem;
}

/* Highlight anchor links on hover */
:deep(.prose a[href^="#"]) {
  text-decoration: none;
  transition: all 0.2s;
}

:deep(.prose a[href^="#"]:hover) {
  text-decoration: underline;
  opacity: 0.8;
}

/* Fix table first column padding */
:deep(.prose table th:first-child),
:deep(.prose table td:first-child) {
  padding-left: 0.75rem !important;
}

:deep(.prose table th),
:deep(.prose table td) {
  padding: 0.5rem !important;
}
</style>
