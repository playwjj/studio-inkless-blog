<template>
  <div>
    <!-- Loading State -->
    <div v-if="pending">
      <!-- Hero Skeleton -->
      <div class="bg-gradient-to-r from-gray-300 to-gray-400 py-16 animate-pulse"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2">
            <div class="animate-pulse space-y-4">
              <div class="h-8 bg-gray-200 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              <div class="bg-gray-200 aspect-video rounded-xl"></div>
              <div class="space-y-3">
                <div class="h-4 bg-gray-200 rounded"></div>
                <div class="h-4 bg-gray-200 rounded"></div>
                <div class="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
          <div class="lg:col-span-1">
            <div class="bg-gray-200 rounded-xl h-64 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error">
      <div class="relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-16">
        <div class="absolute inset-0 bg-gradient-to-br from-red-600/5 via-orange-500/5 to-yellow-600/5"></div>
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgb(239 68 68 / 0.1) 1px, transparent 0); background-size: 40px 40px;"></div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900">Article Not Found</h1>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center py-12 bg-red-50 rounded-xl border border-red-200">
          <svg class="w-20 h-20 text-red-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 class="text-2xl font-bold text-gray-900 mb-3">Oops! Article Not Found</h2>
          <p class="text-gray-600 mb-8 max-w-md mx-auto">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <NuxtLink
            to="/blog"
            class="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Article Content -->
    <article v-else-if="data">
      <!-- Hero Section -->
      <section class="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 md:py-16">
        <div class="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-indigo-500/5 to-purple-600/5"></div>
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.1) 1px, transparent 0); background-size: 40px 40px;"></div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Breadcrumb -->
          <nav class="mb-6">
            <NuxtLink
              to="/blog"
              class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Blog
            </NuxtLink>
          </nav>

          <div class="max-w-4xl">
            <!-- Category & Read Time -->
            <div class="flex items-center gap-4 mb-4">
              <span class="inline-flex items-center px-4 py-1.5 text-sm font-semibold bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 text-primary-600 shadow-sm">
                {{ data.category }}
              </span>
              <span class="text-gray-600 text-sm flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ data.readTime }} min read
              </span>
            </div>

            <!-- Title -->
            <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900">
              {{ data.title }}
            </h1>

            <!-- Author & Date -->
            <div class="flex items-center gap-4">
              <NuxtImg
                :src="data.author.avatar"
                :alt="data.author.name"
                class="w-12 h-12 rounded-full object-cover ring-2 ring-primary-200 shadow-md"
                width="48"
                height="48"
              />
              <div>
                <p class="font-semibold text-gray-900">{{ data.author.name }}</p>
                <p class="text-sm text-gray-600">{{ formatDate(data.publishedAt, 'long') }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Article Body -->
          <div class="lg:col-span-2">
            <!-- Cover Image -->
            <div class="aspect-video w-full overflow-hidden rounded-xl shadow-xl mb-8">
              <NuxtImg
                :src="data.coverImage"
                :alt="data.title"
                class="w-full h-full object-cover"
                width="1200"
                height="675"
                loading="eager"
              />
            </div>

            <!-- Article Content -->
            <div class="bg-white rounded-xl shadow-md border border-gray-100 p-8 md:p-12">
              <div class="prose prose-lg max-w-none">
                <div class="text-gray-700 leading-relaxed" v-html="formattedContent"></div>
              </div>

              <!-- Tags -->
              <div class="mt-12 pt-8 border-t border-gray-200">
                <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Tags</h3>
                <div class="flex flex-wrap gap-2">
                  <NuxtLink
                    v-for="tag in data.tags"
                    :key="tag"
                    :to="`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`"
                    class="inline-flex items-center px-4 py-2 text-sm font-medium bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 hover:shadow-md transition-all"
                  >
                    <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    {{ tag }}
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Author Card -->
            <div class="mt-8 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl shadow-md border border-primary-200 p-8">
              <div class="flex items-start gap-6">
                <NuxtImg
                  :src="data.author.avatar"
                  :alt="data.author.name"
                  class="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg flex-shrink-0"
                  width="80"
                  height="80"
                />
                <div class="flex-1">
                  <div class="flex items-start justify-between mb-2">
                    <div>
                      <p class="text-sm text-primary-700 font-medium mb-1">Written by</p>
                      <h3 class="text-2xl font-bold text-gray-900">{{ data.author.name }}</h3>
                    </div>
                  </div>
                  <p class="text-gray-700 leading-relaxed">
                    A passionate developer sharing insights and experiences in web development, design, and modern technologies.
                  </p>
                </div>
              </div>
            </div>

            <!-- Navigation -->
            <div class="mt-8 flex justify-center">
              <NuxtLink
                to="/blog"
                class="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-xl hover:bg-primary-700 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                More Articles
              </NuxtLink>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="lg:col-span-1">
            <div class="space-y-6 sticky top-20">
              <!-- Share Card -->
              <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div class="bg-gradient-to-r from-primary-50 to-primary-100 px-5 py-4 border-b border-primary-200">
                  <h3 class="text-lg font-bold text-primary-900 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share Article
                  </h3>
                </div>
                <div class="p-5 space-y-3">
                  <button
                    @click="shareOnTwitter"
                    class="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                    </svg>
                    Twitter
                  </button>
                  <button
                    @click="shareOnFacebook"
                    class="w-full flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    </svg>
                    Facebook
                  </button>
                  <button
                    @click="copyLink"
                    class="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {{ linkCopied ? 'Copied!' : 'Copy Link' }}
                  </button>
                </div>
              </div>

              <!-- Article Info Card -->
              <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div class="bg-gradient-to-r from-purple-50 to-purple-100 px-5 py-4 border-b border-purple-200">
                  <h3 class="text-lg font-bold text-purple-900 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Article Info
                  </h3>
                </div>
                <div class="p-5 space-y-4 text-sm">
                  <div class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p class="text-gray-500 mb-1">Published</p>
                      <p class="text-gray-900 font-medium">{{ formatDate(data.publishedAt, 'long') }}</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <div>
                      <p class="text-gray-500 mb-1">Category</p>
                      <p class="text-gray-900 font-medium">{{ data.category }}</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p class="text-gray-500 mb-1">Reading Time</p>
                      <p class="text-gray-900 font-medium">{{ data.readTime }} minutes</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Back to Top -->
              <button
                @click="scrollToTop"
                class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Back to Top
              </button>
            </div>
          </aside>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug

const { data, pending, error } = await useFetch(`/api/posts/${slug}`)

const { formatDate } = useFormatDate()

const linkCopied = ref(false)

const formattedContent = computed(() => {
  if (!data.value?.content) return ''

  return data.value.content
    .replace(/\n/g, '<br>')
    .replace(/#{1,6}\s+(.+)/g, (match, title) => {
      const level = match.match(/^#+/)[0].length
      const sizes = ['text-3xl', 'text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-sm']
      return `<h${level} class="${sizes[level - 1]} font-bold mt-8 mb-4 text-gray-900">${title}</h${level}>`
    })
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/```(\w+)?\n([\s\S]+?)```/g, '<pre class="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto my-6 shadow-lg"><code class="text-sm">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-primary-50 text-primary-700 px-2 py-1 rounded font-mono text-sm">$1</code>')
    .replace(/^-\s+(.+)/gm, '<li class="ml-6 mb-2">$1</li>')
    .replace(/^\d+\.\s+(.+)/gm, '<li class="ml-6 mb-2">$1</li>')
})

const shareOnTwitter = () => {
  const url = window.location.href
  const text = data.value?.title || ''
  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
}

const shareOnFacebook = () => {
  const url = window.location.href
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    linkCopied.value = true
    setTimeout(() => {
      linkCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy link:', err)
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

useSeoMeta({
  title: () => data.value ? `${data.value.title} - Studio Inkless Blog` : 'Post - Studio Inkless Blog',
  ogTitle: () => data.value?.title || 'Blog Post',
  description: () => data.value?.excerpt || 'Read this post on Studio Inkless Blog',
  ogDescription: () => data.value?.excerpt || 'Read this post on Studio Inkless Blog',
  ogImage: () => data.value?.coverImage || 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ogType: 'article',
  articlePublishedTime: () => data.value?.publishedAt,
  articleAuthor: () => data.value?.author.name,
  articleTag: () => data.value?.tags,
  twitterCard: 'summary_large_image',
  twitterTitle: () => data.value?.title,
  twitterDescription: () => data.value?.excerpt,
  twitterImage: () => data.value?.coverImage,
})
</script>
