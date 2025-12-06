<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-12 md:py-16">
      <div class="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-pink-500/5 to-indigo-600/5"></div>
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgb(168 85 247 / 0.1) 1px, transparent 0); background-size: 40px 40px;"></div>

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
              <NuxtLink to="/blog/tags" class="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Tags
              </NuxtLink>
            </li>
            <li class="text-gray-400">/</li>
            <li class="text-gray-900 font-semibold">{{ tagName }}</li>
          </ol>
        </nav>

        <div class="max-w-3xl">
          <div class="inline-flex items-center px-4 py-1.5 text-sm font-semibold bg-white/80 backdrop-blur-sm rounded-lg border border-purple-200 text-purple-700 shadow-sm mb-4">
            <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            {{ tagName }}
          </div>
          <h1 class="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            Articles tagged with "{{ tagName }}"
          </h1>
          <p class="text-base md:text-lg text-gray-600">
            Explore {{ filteredPosts.length }} article{{ filteredPosts.length !== 1 ? 's' : '' }} about {{ tagName }}
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
              v-model="searchQuery"
              type="text"
              placeholder="Search articles by title or content..."
              class="w-full px-5 py-3.5 pl-12 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all shadow-sm hover:border-gray-300"
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
              v-if="searchQuery"
              @click="searchQuery = ''"
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
          <!-- Active Category Filter -->
          <div v-if="selectedCategory" class="flex items-center gap-2">
            <span class="text-sm text-gray-600 font-medium">Category:</span>
            <button
              @click="selectedCategory = null"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-200 transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {{ selectedCategory }}
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              @click="clearFilters"
              class="text-sm text-gray-600 hover:text-gray-900 font-medium underline"
            >
              Clear filter
            </button>
          </div>

          <!-- Sort Dropdown -->
          <div class="ml-auto">
            <select
              v-model="sortBy"
              class="px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm font-medium text-gray-700 cursor-pointer hover:border-gray-300 transition-colors"
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
          <span v-if="searchQuery || selectedCategory"> (filtered)</span>
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
                  Filter by Category
                </h2>
              </div>
              <div v-if="categoriesData" class="p-3 space-y-1">
                <button
                  @click="selectedCategory = null"
                  :class="[
                    'block w-full text-left px-4 py-2.5 rounded-lg transition-all font-medium text-sm',
                    !selectedCategory
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <span class="flex items-center justify-between">
                    <span>All Categories</span>
                  </span>
                </button>
                <button
                  v-for="category in categoriesData"
                  :key="category.slug"
                  @click="selectedCategory = category.name"
                  :class="[
                    'block w-full text-left px-4 py-2.5 rounded-lg transition-all font-medium text-sm',
                    selectedCategory === category.name
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <span class="flex items-center justify-between">
                    <span>{{ category.name }}</span>
                    <span :class="selectedCategory === category.name ? 'text-primary-100' : 'text-gray-500'">
                      {{ getCategoryCount(category.name) }}
                    </span>
                  </span>
                </button>
              </div>
            </div>

            <!-- Related Tags Card -->
            <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden sticky top-20">
              <div class="bg-gradient-to-r from-purple-50 to-purple-100 px-5 py-4 border-b border-purple-200">
                <h2 class="text-lg font-bold text-purple-900 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  Related Tags
                </h2>
              </div>
              <div v-if="relatedTags && relatedTags.length > 0" class="p-4">
                <div class="flex flex-wrap gap-2">
                  <NuxtLink
                    v-for="tag in relatedTags"
                    :key="tag.name"
                    :to="`/blog/tag/${tag.slug}`"
                    :class="[
                      'px-3 py-1.5 text-sm font-medium rounded-lg transition-all',
                      tagSlug === tag.slug
                        ? 'bg-purple-600 text-white shadow-md scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    ]"
                  >
                    #{{ tag.name }}
                  </NuxtLink>
                </div>
              </div>
              <div v-else class="p-4 text-sm text-gray-500 text-center">
                No related tags
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
              {{ searchQuery || selectedCategory ? 'Try adjusting your search terms or filters' : `No posts tagged with "${tagName}" yet` }}
            </p>
            <button
              v-if="searchQuery || selectedCategory"
              @click="clearFilters"
              class="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogListItem } from '~/types/blog'

const route = useRoute()
const tagSlug = computed(() => route.params.name as string)

const searchQuery = ref('')
const selectedCategory = ref<string | null>(null)
const sortBy = ref('newest')

// Fetch all tags for sidebar
const { data: tagsData } = await useFetch('/api/tags')

// Find current tag by slug
const currentTag = computed(() => {
  if (!tagsData.value) return null
  return tagsData.value.find(tag => tag.slug === tagSlug.value)
})

const tagName = computed(() => currentTag.value?.name || '')

// Fetch posts for this tag
const { data, pending, error } = await useFetch('/api/posts', {
  query: {
    tag: tagSlug,
  }
})

// Fetch all categories for sidebar
const { data: categoriesData } = await useFetch('/api/categories')

// Get related tags (tags that appear with current tag)
const relatedTags = computed(() => {
  if (!tagsData.value || !data.value?.posts) return []

  // Get all tags from posts with current tag
  const tagCounts = new Map<string, number>()
  data.value.posts.forEach((post: BlogListItem) => {
    post.tags.forEach(tag => {
      if (tag !== tagName.value) { // Exclude current tag
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      }
    })
  })

  // Convert to array and add slugs
  return Array.from(tagCounts.entries())
    .map(([name, count]) => {
      const tagData = tagsData.value?.find(t => t.name === name)
      return {
        name,
        slug: tagData?.slug || name.toLowerCase().replace(/\s+/g, '-'),
        count
      }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // Show top 10 related tags
})

const filteredPosts = computed(() => {
  if (!data.value?.posts) return []

  let posts = data.value.posts as BlogListItem[]

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    posts = posts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query)
    )
  }

  // Category filter
  if (selectedCategory.value) {
    posts = posts.filter(post => post.category === selectedCategory.value)
  }

  return posts
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

// Get count of posts in a category (from current tag's posts)
const getCategoryCount = (categoryName: string) => {
  if (!data.value?.posts) return 0
  return data.value.posts.filter((post: BlogListItem) => post.category === categoryName).length
}

const clearFilters = () => {
  selectedCategory.value = null
  searchQuery.value = ''
}

useSeoMeta({
  title: `${tagName.value} - Blog - Studio Inkless Blog`,
  ogTitle: `${tagName.value} Articles - Studio Inkless Blog`,
  description: `Explore articles tagged with ${tagName.value}. Find tutorials, guides, and insights about ${tagName.value}.`,
  ogDescription: `Explore articles tagged with ${tagName.value}.`,
  ogImage: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1200',
  twitterCard: 'summary_large_image',
})
</script>
