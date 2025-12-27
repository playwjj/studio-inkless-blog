<template>
  <div>
    <!-- Hero Section - Lightweight -->
    <section class="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 md:py-16">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-indigo-500/5 to-purple-600/5"></div>
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.1) 1px, transparent 0); background-size: 40px 40px;"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <h1 class="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            Blog Articles
          </h1>
          <p class="text-base md:text-lg text-gray-600">
            Explore our collection of {{ data?.posts?.length || 0 }} articles on web development and technology
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
              placeholder="Search articles (min 2 characters)..."
              class="w-full px-5 py-3.5 pl-12 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm hover:border-gray-300"
            />
            <!-- Search Icon or Loading Spinner -->
            <svg
              v-if="!isSearching"
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
            <svg
              v-else
              class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
          <!-- Active Filters Display -->
          <div v-if="hasActiveFilters" class="flex items-center gap-2 flex-wrap">
            <span class="text-sm text-gray-600 font-medium">Active filters:</span>

            <button
              v-if="selectedCategory"
              @click="setCategory(null)"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-200 transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {{ selectedCategoryName }}
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

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
              @click="clearAllFilters"
              class="text-sm text-gray-600 hover:text-gray-900 font-medium underline"
            >
              Clear all
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
          Showing <span class="font-semibold text-gray-900">{{ filteredPosts.length }}</span>
          {{ filteredPosts.length === 1 ? 'article' : 'articles' }}
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
                <button
                  @click="setCategory(null)"
                  :class="[
                    'block w-full text-left px-4 py-2.5 rounded-lg transition-all font-medium text-sm',
                    !selectedCategory
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <span class="flex items-center justify-between">
                    <span>All Posts</span>
                    <span :class="!selectedCategory ? 'text-primary-100' : 'text-gray-500'">
                      {{ data?.posts?.length || 0 }}
                    </span>
                  </span>
                </button>
                <button
                  v-for="category in categoriesData"
                  :key="category.slug"
                  @click="setCategory(category.slug)"
                  :class="[
                    'block w-full text-left px-4 py-2.5 rounded-lg transition-all font-medium text-sm',
                    selectedCategory === category.slug
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <span class="flex items-center justify-between">
                    <span>{{ category.name }}</span>
                    <span :class="selectedCategory === category.slug ? 'text-primary-100' : 'text-gray-500'">
                      {{ category.count }}
                    </span>
                  </span>
                </button>
              </div>
            </div>

            <!-- Tags Card -->
            <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden sticky top-20">
              <div class="bg-gradient-to-r from-purple-50 to-purple-100 px-5 py-4 border-b border-purple-200">
                <h2 class="text-lg font-bold text-purple-900 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  Popular Tags
                </h2>
              </div>
              <div v-if="tagsData" class="p-4">
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="tag in tagsData"
                    :key="tag.slug"
                    @click="toggleTag(tag.slug)"
                    :class="[
                      'px-3 py-1.5 text-sm font-medium rounded-lg transition-all',
                      selectedTags.includes(tag.slug)
                        ? 'bg-purple-600 text-white shadow-md scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    ]"
                  >
                    #{{ tag.name }}
                  </button>
                </div>
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
          <div v-else-if="filteredPosts.length === 0" class="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p class="text-gray-600 mb-6">
              {{ searchQuery ? 'Try adjusting your search terms or filters' : 'No posts match your criteria' }}
            </p>
            <button
              v-if="hasActiveFilters"
              @click="clearAllFilters"
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
                v-for="post in sortedPosts"
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

const { getTitle, siteConfig } = useSiteConfig()
const route = useRoute()
const router = useRouter()

// Read all filters from URL query parameters
const currentPage = computed(() => {
  const page = parseInt(route.query.page as string)
  return page > 0 ? page : 1
})

const selectedCategory = computed(() => {
  return route.query.category as string || null
})

const selectedTags = computed(() => {
  const tags = route.query.tags
  if (!tags) return []
  return Array.isArray(tags) ? tags : [tags]
})

const searchQuery = computed(() => {
  return route.query.search as string || ''
})

// Local search input for debouncing
const searchInput = ref(searchQuery.value)
const isSearching = ref(false)
let searchTimeout: NodeJS.Timeout | null = null

const sortBy = ref('newest')

// Watch URL changes to update local input
watch(searchQuery, (newVal) => {
  searchInput.value = newVal
  isSearching.value = false
})

// Compute query parameters for API
const apiQuery = computed(() => ({
  page: currentPage.value,
  limit: 10,
  category: selectedCategory.value || undefined,
  tag: selectedTags.value.length > 0 ? selectedTags.value[0] : undefined,
  search: searchQuery.value.trim() || undefined
}))

const { data, pending, error, refresh } = await useFetch('/api/posts', {
  query: apiQuery,
  watch: [currentPage, selectedCategory, selectedTags, searchQuery]
})
const { data: categoriesData } = await useFetch('/api/categories')
const { data: tagsData } = await useFetch('/api/tags', { query: { limit: 80 } })

const filteredPosts = computed(() => {
  if (!data.value?.posts) return []
  // All filtering is handled by the API (search, category, tag)
  return data.value.posts as BlogListItem[]
})

const sortedPosts = computed(() => {
  const posts = [...filteredPosts.value]

  switch (sortBy.value) {
    case 'newest':
      return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    case 'oldest':
      return posts.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
    case 'title':
      return posts.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return posts
  }
})

const hasActiveFilters = computed(() => {
  return selectedCategory.value !== null || selectedTags.value.length > 0 || searchQuery.value.trim() !== ''
})

// Helper functions to get display names from slugs
const selectedCategoryName = computed(() => {
  if (!selectedCategory.value || !categoriesData.value) return ''
  const category = categoriesData.value.find(cat => cat.slug === selectedCategory.value)
  return category?.name || selectedCategory.value
})

const getTagName = (tagSlug: string) => {
  if (!tagsData.value) return tagSlug
  const tag = tagsData.value.find(t => t.slug === tagSlug)
  return tag?.name || tagSlug
}

// Update filters in URL
const updateFiltersInUrl = (updates: {
  category?: string | null
  tags?: string[]
  search?: string
  resetPage?: boolean
}) => {
  const query: any = { ...route.query }

  // Update category
  if (updates.category !== undefined) {
    if (updates.category) {
      query.category = updates.category
    } else {
      delete query.category
    }
  }

  // Update tags
  if (updates.tags !== undefined) {
    if (updates.tags.length > 0) {
      query.tags = updates.tags
    } else {
      delete query.tags
    }
  }

  // Update search
  if (updates.search !== undefined) {
    if (updates.search.trim()) {
      query.search = updates.search.trim()
    } else {
      delete query.search
    }
  }

  // Reset to page 1 if filter changed
  if (updates.resetPage) {
    delete query.page
  }

  router.push({ query })
}

const toggleTag = (tag: string) => {
  const currentTags = [...selectedTags.value]
  const index = currentTags.indexOf(tag)

  if (index > -1) {
    currentTags.splice(index, 1)
  } else {
    currentTags.push(tag)
  }

  updateFiltersInUrl({ tags: currentTags, resetPage: true })
}

const setCategory = (category: string | null) => {
  updateFiltersInUrl({ category, resetPage: true })
}

// Debounced search: wait 500ms after user stops typing
const setSearch = (search: string) => {
  searchInput.value = search

  // Clear existing timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  // Only search if input is empty (clear) or has 2+ characters
  if (search.trim().length === 0) {
    // Immediately clear search
    isSearching.value = false
    updateFiltersInUrl({ search: '', resetPage: true })
  } else if (search.trim().length >= 2) {
    // Show searching indicator
    isSearching.value = true

    // Debounce: wait 500ms before searching
    searchTimeout = setTimeout(() => {
      updateFiltersInUrl({ search, resetPage: true })
    }, 500)
  } else {
    // Less than 2 characters, hide indicator
    isSearching.value = false
  }
}

const clearAllFilters = () => {
  router.push({ path: route.path })
}

useSeoMeta({
  title: () => getTitle('Blog'),
  ogTitle: () => siteConfig.value?.og_title || 'Blog Articles',
  description: () => siteConfig.value?.description || 'Explore our collection of articles on web development, design, and technology.',
  ogDescription: () => siteConfig.value?.og_description || 'Explore our collection of articles on web development, design, and technology.',
  ogImage: () => siteConfig.value?.og_image || '',
  twitterCard: 'summary_large_image',
  twitterTitle: () => siteConfig.value?.twitter_title || '',
  twitterDescription: () => siteConfig.value?.twitter_description || '',
  twitterImage: () => siteConfig.value?.twitter_image || '',
})
</script>
