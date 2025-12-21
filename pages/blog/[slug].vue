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
              <NuxtLink
                :to="`/blog/category/${data.category.toLowerCase().replace(/\s+/g, '-')}`"
                class="inline-flex items-center px-4 py-1.5 text-sm font-semibold bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 text-primary-600 shadow-sm hover:bg-primary-50 hover:border-primary-300 transition-all"
              >
                {{ data.category }}
              </NuxtLink>
              <span class="text-gray-600 text-sm flex items-center gap-1.5 hidden">
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
              <div class="article-content">
                <div v-html="formattedContent"></div>
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
                      <NuxtLink
                        :to="`/blog/category/${data.category.toLowerCase().replace(/\s+/g, '-')}`"
                        class="text-gray-900 font-medium hover:text-primary-600 transition-colors"
                      >
                        {{ data.category }}
                      </NuxtLink>
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
const { getTitle, siteConfig } = useSiteConfig()

const linkCopied = ref(false)

// Track view count when article loads
onMounted(async () => {
  if (data.value && slug) {
    try {
      // Check localStorage to prevent duplicate counting
      const viewedArticlesKey = 'viewed_articles'
      const viewedData = localStorage.getItem(viewedArticlesKey)
      const viewedArticles = viewedData ? JSON.parse(viewedData) : {}

      // Check if article was viewed in the last 24 hours
      const articleId = data.value.id
      const lastViewed = viewedArticles[articleId]
      const now = Date.now()
      const twentyFourHours = 24 * 60 * 60 * 1000

      if (lastViewed && (now - lastViewed) < twentyFourHours) {
        // Already viewed within 24 hours, don't count
        return
      }

      // Track the view
      await $fetch(`/api/posts/${slug}/view`, {
        method: 'POST'
      })

      // Save to localStorage
      viewedArticles[articleId] = now

      // Clean up old entries (older than 7 days)
      const sevenDays = 7 * 24 * 60 * 60 * 1000
      Object.keys(viewedArticles).forEach(key => {
        if (now - viewedArticles[key] > sevenDays) {
          delete viewedArticles[key]
        }
      })

      localStorage.setItem(viewedArticlesKey, JSON.stringify(viewedArticles))
    } catch (error) {
      console.error('Failed to track view:', error)
    }
  }
})

// Content is already HTML from TiptapEditor, no conversion needed
const formattedContent = computed(() => data.value?.content || '')

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
  title: () => data.value ? getTitle(data.value.title) : getTitle('Post'),
  ogTitle: () => data.value?.title || siteConfig.value?.og_title || 'Blog Post',
  description: () => data.value?.excerpt || siteConfig.value?.description || '',
  ogDescription: () => data.value?.excerpt || siteConfig.value?.og_description || '',
  ogImage: () => data.value?.coverImage || siteConfig.value?.og_image || '',
  ogType: 'article',
  articlePublishedTime: () => data.value?.publishedAt,
  articleAuthor: () => data.value?.author.name,
  articleTag: () => data.value?.tags,
  twitterCard: 'summary_large_image',
  twitterTitle: () => data.value?.title || siteConfig.value?.twitter_title || '',
  twitterDescription: () => data.value?.excerpt || siteConfig.value?.twitter_description || '',
  twitterImage: () => data.value?.coverImage || siteConfig.value?.twitter_image || '',
})
</script>

<style scoped>
.article-content {
  @apply text-gray-700 leading-relaxed;
}

/* 标题样式 */
.article-content :deep(h1) {
  @apply text-4xl font-bold text-gray-900 mt-12 mb-6 leading-tight;
  @apply first:mt-0;
}

.article-content :deep(h2) {
  @apply text-3xl font-bold text-gray-900 mt-10 mb-5 leading-tight;
  @apply border-b-2 border-gray-200 pb-3;
}

.article-content :deep(h3) {
  @apply text-2xl font-bold text-gray-800 mt-8 mb-4 leading-snug;
}

.article-content :deep(h4) {
  @apply text-xl font-semibold text-gray-800 mt-6 mb-3;
}

.article-content :deep(h5) {
  @apply text-lg font-semibold text-gray-800 mt-5 mb-2;
}

.article-content :deep(h6) {
  @apply text-base font-semibold text-gray-800 mt-4 mb-2;
}

/* 段落样式 */
.article-content :deep(p) {
  @apply text-base text-gray-700 leading-relaxed mb-6;
}

/* 列表样式 */
.article-content :deep(ul) {
  @apply list-none space-y-3 mb-6 pl-0;
}

.article-content :deep(ul li) {
  @apply relative pl-7 text-gray-700 leading-relaxed;
}

.article-content :deep(ul li::before) {
  content: '';
  @apply absolute left-0 top-2 w-2 h-2 bg-primary-600 rounded-full;
}

.article-content :deep(ul li p) {
  @apply mb-0;
}

.article-content :deep(ol) {
  @apply list-decimal list-inside space-y-3 mb-6 pl-2;
}

.article-content :deep(ol li) {
  @apply text-gray-700 leading-relaxed pl-2;
}

.article-content :deep(ol li p) {
  @apply inline mb-0;
}

/* 嵌套列表 */
.article-content :deep(li > ul),
.article-content :deep(li > ol) {
  @apply mt-3 mb-0;
}

/* 代码块样式 */
.article-content :deep(pre) {
  @apply bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto mb-6 shadow-lg;
  @apply border border-gray-800;
}

.article-content :deep(pre code) {
  @apply font-mono text-sm leading-relaxed block;
  @apply bg-transparent text-gray-100;
}

/* 行内代码样式 */
.article-content :deep(code) {
  @apply bg-primary-50 text-primary-700 px-2 py-1 rounded font-mono text-sm;
  @apply border border-primary-200;
}

.article-content :deep(pre code) {
  @apply bg-transparent text-gray-100 px-0 py-0 border-0;
}

/* 强调文本样式 */
.article-content :deep(strong) {
  @apply font-bold text-gray-900;
}

.article-content :deep(em) {
  @apply italic text-gray-700;
}

/* 引用块样式 */
.article-content :deep(blockquote) {
  @apply border-l-4 border-primary-600 pl-6 py-2 my-6 bg-primary-50;
  @apply italic text-gray-700 rounded-r-lg;
}

.article-content :deep(blockquote p) {
  @apply mb-0;
}

/* 链接样式 */
.article-content :deep(a) {
  @apply text-primary-600 hover:text-primary-700 underline;
  @apply transition-colors duration-200;
}

/* 图片样式 */
.article-content :deep(img) {
  @apply rounded-lg shadow-md my-6 max-w-full h-auto;
}

/* 表格样式 */
.article-content :deep(table) {
  @apply w-full border-collapse mb-6 shadow-sm rounded-lg overflow-hidden;
}

.article-content :deep(thead) {
  @apply bg-gray-50;
}

.article-content :deep(th) {
  @apply px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider;
  @apply border-b-2 border-gray-200;
}

.article-content :deep(td) {
  @apply px-6 py-4 text-sm text-gray-700 border-b border-gray-200;
}

.article-content :deep(tbody tr:hover) {
  @apply bg-gray-50;
}

/* 水平分割线 */
.article-content :deep(hr) {
  @apply my-8 border-0 border-t-2 border-gray-200;
}

/* 响应式优化 */
@media (max-width: 640px) {
  .article-content :deep(h1) {
    @apply text-3xl mt-8 mb-4;
  }

  .article-content :deep(h2) {
    @apply text-2xl mt-6 mb-3;
  }

  .article-content :deep(h3) {
    @apply text-xl mt-5 mb-3;
  }

  .article-content :deep(pre) {
    @apply p-4 text-xs;
  }

  .article-content :deep(pre code) {
    @apply text-xs;
  }
}
</style>
