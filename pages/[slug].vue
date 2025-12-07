<template>
  <div>
    <!-- Loading State -->
    <div v-if="pending" class="min-h-screen flex items-center justify-center">
      <div class="animate-pulse space-y-4 w-full max-w-4xl px-4">
        <div class="h-12 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        <div class="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center py-12 px-4">
        <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h2>
        <p class="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </NuxtLink>
      </div>
    </div>

    <!-- Page Content -->
    <div v-else-if="page" :class="pageClasses">
      <!-- Custom CSS -->
      <component :is="'style'" v-if="page.custom_css" scoped>
        {{ page.custom_css }}
      </component>

      <!-- Cover Image (if exists) -->
      <div v-if="page.cover_image" class="relative h-64 md:h-96 overflow-hidden">
        <NuxtImg
          :src="page.cover_image"
          :alt="page.title"
          class="w-full h-full object-cover"
          loading="eager"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
        <div class="absolute bottom-0 left-0 right-0 p-8">
          <div class="max-w-7xl mx-auto">
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-2">{{ page.title }}</h1>
            <p v-if="page.description" class="text-xl text-white/90">{{ page.description }}</p>
          </div>
        </div>
      </div>

      <!-- Page Header (if no cover image) -->
      <div v-else-if="page.template !== 'minimal'" class="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{{ page.title }}</h1>
          <p v-if="page.description" class="text-xl text-gray-600">{{ page.description }}</p>
        </div>
      </div>

      <!-- Breadcrumb -->
      <nav v-if="page.show_breadcrumb" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <NuxtLink to="/" class="hover:text-primary-600">Home</NuxtLink>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <span class="text-gray-900 font-medium">{{ page.title }}</span>
        </div>
      </nav>

      <!-- Main Content -->
      <div :class="contentClasses">
        <!-- HTML Content (if using content field) -->
        <div v-if="page.content && !hasBlocks" class="prose prose-lg max-w-none" v-html="page.content"></div>

        <!-- Block-based Content -->
        <div v-else-if="blocks && blocks.length > 0" class="space-y-0">
          <PageBlock
            v-for="block in blocks"
            :key="block.id"
            :block="block"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16 text-gray-500">
          <p>No content available</p>
        </div>
      </div>

      <!-- Author Info (if exists) -->
      <div v-if="page.author && page.template !== 'minimal'" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 flex items-center gap-4">
          <img
            v-if="page.author.avatar"
            :src="page.author.avatar"
            :alt="page.author.name"
            class="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow"
          />
          <div>
            <p class="text-sm text-primary-700 font-medium">Created by</p>
            <h3 class="text-xl font-bold text-gray-900">{{ page.author.name }}</h3>
            <p v-if="page.author.bio" class="text-gray-700 text-sm mt-1">{{ page.author.bio }}</p>
          </div>
        </div>
      </div>

      <!-- Custom JavaScript -->
      <component :is="'script'" v-if="page.custom_js" type="text/javascript">
        {{ page.custom_js }}
      </component>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { getTitle, siteConfig } = useSiteConfig()

// Fetch page data
const { data: page, pending, error } = await useFetch(`/api/pages/${slug}`)

// Fetch blocks if page exists
const { data: blocksData } = await useFetch(`/api/pages/${page.value?.id}/blocks`, {
  lazy: true,
  server: false,
  immediate: !!page.value?.id
})

const blocks = computed(() => blocksData.value?.blocks || [])
const hasBlocks = computed(() => blocks.value.length > 0)

// Computed classes based on page settings
const pageClasses = computed(() => {
  const classes = ['min-h-screen']

  if (page.value?.theme === 'dark') {
    classes.push('bg-gray-900 text-white')
  } else {
    classes.push('bg-white text-gray-900')
  }

  return classes.join(' ')
})

const contentClasses = computed(() => {
  const classes = ['mx-auto px-4 sm:px-6 lg:px-8 py-12']

  if (page.value?.layout === 'wide') {
    classes.push('max-w-full')
  } else if (page.value?.layout === 'narrow') {
    classes.push('max-w-3xl')
  } else {
    classes.push('max-w-7xl')
  }

  return classes.join(' ')
})

// SEO Meta
useSeoMeta({
  title: () => page.value ? getTitle(page.value.meta_title || page.value.title) : 'Page',
  description: () => page.value?.meta_description || page.value?.description || siteConfig.value?.description || '',
  keywords: () => page.value?.meta_keywords || '',
  ogTitle: () => page.value?.og_title || page.value?.title || '',
  ogDescription: () => page.value?.og_description || page.value?.description || '',
  ogImage: () => page.value?.og_image || page.value?.cover_image || siteConfig.value?.og_image || '',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: () => page.value?.og_title || page.value?.title || '',
  twitterDescription: () => page.value?.og_description || page.value?.description || '',
  twitterImage: () => page.value?.og_image || page.value?.cover_image || ''
})

// Set canonical URL if specified
if (page.value?.canonical_url) {
  useHead({
    link: [
      {
        rel: 'canonical',
        href: page.value.canonical_url
      }
    ]
  })
}
</script>

<style scoped>
/* Prose styling for content */
.prose {
  @apply text-gray-700;
}

.prose h1 {
  @apply text-3xl font-bold mb-4 text-gray-900;
}

.prose h2 {
  @apply text-2xl font-bold mb-3 mt-8 text-gray-900;
}

.prose h3 {
  @apply text-xl font-bold mb-2 mt-6 text-gray-900;
}

.prose p {
  @apply mb-4 leading-relaxed;
}

.prose a {
  @apply text-primary-600 hover:text-primary-700 underline;
}

.prose ul, .prose ol {
  @apply mb-4 ml-6;
}

.prose li {
  @apply mb-2;
}

.prose img {
  @apply rounded-lg shadow-md my-6;
}

.prose blockquote {
  @apply border-l-4 border-primary-500 pl-4 italic my-6 text-gray-600;
}

.prose code {
  @apply bg-gray-100 text-primary-700 px-2 py-1 rounded text-sm font-mono;
}

.prose pre {
  @apply bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto my-6;
}
</style>
