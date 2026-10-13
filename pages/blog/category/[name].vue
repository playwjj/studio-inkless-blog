<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 md:py-16">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-indigo-500/5 to-purple-600/5"></div>
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.1) 1px, transparent 0); background-size: 40px 40px;"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumb -->
        <nav class="mb-6">
          <ol class="flex items-center gap-2 text-sm">
            <li>
              <NuxtLink to="/blog" class="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Blog
              </NuxtLink>
            </li>
            <li class="text-gray-400">/</li>
            <li>
              <NuxtLink to="/blog/categories" class="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Categories
              </NuxtLink>
            </li>
            <li class="text-gray-400">/</li>
            <li class="text-gray-900 font-semibold">{{ categoryName }}</li>
          </ol>
        </nav>

        <div class="max-w-3xl">
          <div class="inline-flex items-center px-4 py-1.5 text-sm font-semibold bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 text-primary-600 shadow-sm mb-4">
            {{ categoryName }}
          </div>
          <h1 class="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            {{ categoryName }} Articles
          </h1>
          <p v-if="categoryDescription" class="text-base md:text-lg text-gray-700 mb-2">
            {{ categoryDescription }}
          </p>
          <p class="text-base md:text-lg text-gray-600">
            Explore {{ totalPosts }} article{{ totalPosts !== 1 ? 's' : '' }} in {{ categoryName }}
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <!-- Search & Filter Bar -->
      <div class="mb-8 space-y-4">
        <!-- Search Box -->
        <div class="max-w-2xl">
          <div class="relative">
            <input
              :value="searchInput"
              @input="setSearch(($event.target as HTMLInputElement).value)"
              type="text"
              placeholder="Search articles by title or excerpt..."
              class="w-full px-5 py-3.5 pl-12 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm hover:border-gray-300"
            />
            <svg
              class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <button
              v-if="searchInput"
              @click="setSearch('')"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Active Filters & Sort -->
        <div class="flex flex-wrap items-center gap-3">
          <!-- Active Tag Filters -->
          <div v-if="selectedTags.length > 0" class="flex items-center gap-2 flex-wrap">
            <span class="text-sm text-gray-600 font-medium">Tags:</span>
            <button
              v-for="tagSlug in selectedTags"
              :key="tagSlug"
              @click="toggleTag(tagSlug)"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
            >
              #{{ getTagName(tagSlug) }}
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              @click="clearFilters"
              class="text-sm text-gray-600 hover:text-gray-900 font-medium underline"
            >
              Clear filters
            </button>
          </div>

          <!-- Sort Dropdown -->
          <div class="ml-auto">
            <select
              v-model="sortBy"
              class="px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm font-medium text-gray-700 cursor-pointer hover:border-gray-300 transition-colors"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        <!-- Results Count -->
        <div v-if="!pending" class="text-sm text-gray-600">
          Showing <span class="font-semibold text-gray-900">{{ totalPosts }}</span>
          {{ totalPosts === 1 ? 'article' : 'articles' }}
          <span v-if="hasActiveFilters"> (filtered)</span>
        </div>
      </div>

      <!-- Grid Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar -->
        <aside class="lg:col-span-1">
          <div class="space-y-6">
            <!-- Categories Card -->
            <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div class="bg-gradient-to-r from-primary-50 to-primary-100 px-5 py-4 border-b border-primary-200">
                <h2 class="text-lg font-bold text-primary-900 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Categories
                </h2>
              </div>
              <div v-if="categoriesData" class="p-3 space-y-1">
                <NuxtLink
                  to="/blog"
                  :class="[
                    'block w-full text-left px-4 py-2.5 rounded-lg transition-all font-medium text-sm',
                    'text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <span class="flex items-center justify-between">
                    <span>All Posts</span>
                    <span class="text-gray-500">
                      {{ allPostsCount }}
                    </span>
                  </span>
                </NuxtLink>
                <NuxtLink
                  v-for="category in categoriesData"
                  :key="category.slug"
                  :to="`/blog/category/${category.slug}`"
                  :class="[
                    'block w-full text-left px-4 py-2.5 rounded-lg transition-all font-medium text-sm',
                    categorySlug === category.slug
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <span class="flex items-center justify-between">
                    <span>{{ category.name }}</span>
                    <span :class="categorySlug === category.slug ? 'text-primary-100' : 'text-gray-500'">
                      {{ category.count }}
                    </span>
                  </span>
                </NuxtLink>
              </div>
            </div>

            <!-- Tags Card -->
            <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden sticky top-20">
              <div class="bg-gradient-to-r from-purple-50 to-purple-100 px-5 py-4 border-b border-purple-200">
                <h2 class="text-lg font-bold text-purple-900 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  Tags in {{ categoryName }}
                </h2>
              </div>
              <div v-if="categoryTags && categoryTags.length > 0" class="p-4">
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="tag in categoryTags"
                    :key="tag.slug"
                    @click="toggleTag(tag.slug)"
                    :class="[
                      'px-3 py-1.5 text-sm font-medium rounded-lg transition-all',
                      selectedTags.includes(tag.slug)
                        ? 'bg-purple-600 text-white shadow-md scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    ]"
                  >
                    #{{ tag.name }} ({{ tag.count }})
                  </button>
                </div>
              </div>
              <div v-else class="p-4 text-sm text-gray-500 text-center">
                No tags in this category
              </div>
            </div>
          </div>
        </aside>

        <!-- Posts Grid -->
        <div class="lg:col-span-3">
          <!-- Loading State -->
          <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div v-for="i in 4" :key="i" class="animate-pulse">
              <div class="bg-gray-200 aspect-video rounded-xl mb-4"></div>
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-16 bg-red-50 rounded-xl border border-red-200">
            <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-red-600 font-medium">Failed to load posts. Please try again later.</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="posts.length === 0" class="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p class="text-gray-600 mb-6">
              {{ hasActiveFilters ? 'Try adjusting your search terms or filters' : `No posts in ${categoryName} category yet` }}
            </p>
            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Clear all filters
            </button>
          </div>

          <!-- Posts Grid -->
          <div v-else>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <BlogCard
                v-for="post in posts"
                :key="post.id"
                :post="post"
              />
            </div>

            <Pagination
              v-if="data?.pagination"
              :current-page="currentPage"
              :total-pages="data.pagination.totalPages"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogListItem } from '~/types/blog'

const route = useRoute()
const router = useRouter()
const categorySlug = computed(() => route.params.name as string)

// Filters are read from URL query parameters (mirrors pages/blog/index.vue)
const currentPage = computed(() => {
  const page = parseInt(route.query.page as string)
  return page > 0 ? page : 1
})
const searchQuery = computed(() => (route.query.search as string) || '')
const selectedTags = computed<string[]>(() => {
  const tags = route.query.tags
  if (!tags) return []
  return (Array.isArray(tags) ? tags : [tags]) as string[]
})
const hasActiveFilters = computed(() => selectedTags.value.length > 0 || searchQuery.value.trim() !== '')

// Local search input for debouncing
const searchInput = ref(searchQuery.value)
const sortBy = ref('newest')

// Keep local search input in sync with URL (e.g. browser back/forward)
watch(searchQuery, (newVal) => {
  searchInput.value = newVal
})

const apiQuery = computed(() => ({
  category: categorySlug.value,
  page: currentPage.value,
  limit: 12,
  tags: selectedTags.value.length > 0 ? selectedTags.value : undefined,
  search: searchQuery.value.trim() || undefined,
  sortBy: sortBy.value === 'title' ? 'title' : 'published_at',
  sortOrder: sortBy.value === 'oldest' || sortBy.value === 'title' ? 'asc' : 'desc'
}))

// Fetch categories, the current page of posts, and posts for the tag sidebar in parallel
const [{ data: categoriesData }, { data, pending, error }, { data: allCategoryPosts }] = await Promise.all([
  useFetch('/api/categories'),
  useFetch('/api/posts', {
    query: apiQuery,
    watch: [currentPage, categorySlug, selectedTags, searchQuery, sortBy]
  }),
  // Tags for the sidebar are aggregated from the category's posts
  // (the paginated fetch above only returns the current page)
  useFetch('/api/posts', {
    query: computed(() => ({ category: categorySlug.value, limit: 100 })),
    watch: [categorySlug]
  })
])

// Find current category by slug
const currentCategory = computed(() => {
  if (!categoriesData.value) return null
  return categoriesData.value.find(cat => cat.slug === categorySlug.value)
})

const categoryName = computed(() => currentCategory.value?.name || '')
const categoryDescription = computed(() => currentCategory.value?.description || '')

// Calculate all posts count
const allPostsCount = computed(() => {
  if (!categoriesData.value) return 0
  return categoriesData.value.reduce((sum, cat) => sum + cat.count, 0)
})

// Get tags specific to this category
const categoryTags = computed(() => {
  const categoryPosts = (allCategoryPosts.value?.posts as BlogListItem[] | undefined) ?? []

  const tagCounts = new Map<string, { name: string, slug: string, count: number }>()
  categoryPosts.forEach((post: BlogListItem) => {
    post.tags.forEach(tag => {
      const existing = tagCounts.get(tag.slug)
      if (existing) {
        existing.count++
      } else {
        tagCounts.set(tag.slug, { name: tag.name, slug: tag.slug, count: 1 })
      }
    })
  })

  return Array.from(tagCounts.values())
    .sort((a, b) => b.count - a.count)
})

const posts = computed(() => (data.value?.posts as BlogListItem[] | undefined) ?? [])
const totalPosts = computed(() => data.value?.pagination?.total ?? 0)

// Update filters in URL
const updateFiltersInUrl = (updates: { tags?: string[], search?: string, resetPage?: boolean }) => {
  const query: Record<string, any> = { ...route.query }

  if (updates.tags !== undefined) {
    if (updates.tags.length > 0) {
      query.tags = updates.tags
    } else {
      delete query.tags
    }
  }

  if (updates.search !== undefined) {
    if (updates.search.trim()) {
      query.search = updates.search.trim()
    } else {
      delete query.search
    }
  }

  if (updates.resetPage) {
    delete query.page
  }

  router.push({ query })
}

const toggleTag = (tagSlug: string) => {
  const currentTags = [...selectedTags.value]
  const index = currentTags.indexOf(tagSlug)
  if (index > -1) {
    currentTags.splice(index, 1)
  } else {
    currentTags.push(tagSlug)
  }
  updateFiltersInUrl({ tags: currentTags, resetPage: true })
}

// Helper to get tag name from slug
const getTagName = (tagSlug: string) => {
  const tag = categoryTags.value.find(t => t.slug === tagSlug)
  return tag?.name || tagSlug
}

// Debounced search: wait 500ms after user stops typing
let searchTimeout: ReturnType<typeof setTimeout> | null = null
const setSearch = (search: string) => {
  searchInput.value = search
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  if (search.trim().length === 0) {
    updateFiltersInUrl({ search: '', resetPage: true })
  } else if (search.trim().length >= 2) {
    searchTimeout = setTimeout(() => {
      updateFiltersInUrl({ search, resetPage: true })
    }, 500)
  }
}

const clearFilters = () => {
  searchInput.value = ''
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  updateFiltersInUrl({ tags: [], search: '', resetPage: true })
}

// Changing sort restarts from page 1
watch(sortBy, () => {
  if (currentPage.value > 1) {
    const query = { ...route.query }
    delete query.page
    router.push({ query })
  }
})

const { siteConfig } = useSiteConfig()

useSeoMeta({
  title: () => `${categoryName.value} - Blog - Studio Inkless Blog`,
  ogTitle: () => `${categoryName.value} Articles - Studio Inkless Blog`,
  description: () => categoryDescription.value || `Explore articles in ${categoryName.value} category. Find tutorials, guides, and insights about ${categoryName.value}.`,
  ogDescription: () => categoryDescription.value || `Explore articles in ${categoryName.value} category.`,
  ogImage: () => siteConfig.value?.og_image || '',
  twitterCard: 'summary_large_image',
})

const { origin } = useRequestURL()
useHead(() => ({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${origin}/blog` },
        { '@type': 'ListItem', position: 3, name: 'Categories', item: `${origin}/blog/categories` },
        { '@type': 'ListItem', position: 4, name: categoryName.value, item: `${origin}/blog/category/${categorySlug.value}` },
      ],
    }),
  }],
}))
</script>
