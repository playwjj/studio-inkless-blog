<template>
  <div>
    <!-- Loading state -->
    <div v-if="pending" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p class="mt-4 text-gray-600">Loading page...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p class="text-gray-600 mb-8">The page you're looking for doesn't exist or has been removed.</p>
        <NuxtLink to="/" class="inline-block px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors">
          Go Home
        </NuxtLink>
      </div>
    </div>

    <!-- Page content -->
    <div v-else-if="page">
      <!-- Header (if enabled) -->
      <Header v-if="page.show_header" />

      <!-- Cover image -->
      <div v-if="page.cover_image_url" class="w-full h-96 bg-gray-100">
        <img
          :src="page.cover_image_url"
          :alt="page.title"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Page header -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {{ page.title }}
        </h1>

        <p v-if="page.description" class="text-xl text-gray-600 mb-8">
          {{ page.description }}
        </p>

        <!-- Author info -->
        <div v-if="page.author" class="flex items-center gap-4 pb-8 border-b border-gray-200">
          <img
            v-if="page.author.avatar"
            :src="page.author.avatar"
            :alt="page.author.name"
            class="w-12 h-12 rounded-full"
          />
          <div>
            <p class="font-medium text-gray-900">{{ page.author.name }}</p>
            <p v-if="page.author.bio" class="text-sm text-gray-600">{{ page.author.bio }}</p>
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div v-if="page.content" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="prose prose-lg max-w-none" v-html="page.content"></div>
      </div>

      <!-- Page Blocks -->
      <div v-if="page.blocks && page.blocks.length > 0">
        <PageBlock
          v-for="block in page.blocks"
          :key="block.id"
          :block="block"
        />
      </div>

      <!-- Footer (if enabled) -->
      <Footer v-if="page.show_footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

// Fetch page data
const { data: page, pending, error } = await useFetch(`/api/pages/${slug}`)

// Set page metadata
if (page.value) {
  const metaTitle = page.value.meta_title || page.value.title
  const metaDescription = page.value.meta_description || page.value.description
  const ogImage = page.value.og_image || page.value.cover_image_url

  useHead({
    title: metaTitle,
    meta: [
      { name: 'description', content: metaDescription },
      { name: 'keywords', content: page.value.meta_keywords },

      // Open Graph
      { property: 'og:title', content: page.value.og_title || metaTitle },
      { property: 'og:description', content: page.value.og_description || metaDescription },
      { property: 'og:image', content: ogImage },
      { property: 'og:type', content: 'website' },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: page.value.og_title || metaTitle },
      { name: 'twitter:description', content: page.value.og_description || metaDescription },
      { name: 'twitter:image', content: ogImage }
    ],
    link: page.value.canonical_url ? [
      { rel: 'canonical', href: page.value.canonical_url }
    ] : []
  })
}

// Apply theme if specified
if (page.value?.theme && page.value.theme !== 'light') {
  useHead({
    bodyAttrs: {
      class: `theme-${page.value.theme}`
    }
  })
}

// Apply custom CSS if provided
if (page.value?.custom_css) {
  useHead({
    style: [
      { children: page.value.custom_css }
    ]
  })
}

// Apply custom JS if provided (be careful with this in production)
if (page.value?.custom_js) {
  onMounted(() => {
    try {
      // Execute custom JavaScript (use with caution)
      const script = document.createElement('script')
      script.textContent = page.value.custom_js
      document.body.appendChild(script)
    } catch (error) {
      console.error('Failed to execute custom JS:', error)
    }
  })
}
</script>
