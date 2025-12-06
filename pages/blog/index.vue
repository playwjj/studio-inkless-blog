<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
      <p class="text-xl text-gray-600 mb-6">
        Explore our collection of articles on web development and technology
      </p>

      <div class="max-w-2xl">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search articles..."
            class="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all"
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
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <aside class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-md p-6 sticky top-20">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
          <div v-if="categoriesData" class="space-y-2">
            <button
              @click="selectedCategory = null"
              :class="[
                'block w-full text-left px-3 py-2 rounded transition-colors',
                !selectedCategory
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              ]"
            >
              All Posts
            </button>
            <button
              v-for="category in categoriesData"
              :key="category.name"
              @click="selectedCategory = category.name"
              :class="[
                'block w-full text-left px-3 py-2 rounded transition-colors',
                selectedCategory === category.name
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              ]"
            >
              {{ category.name }}
              <span class="text-sm text-gray-500">({{ category.count }})</span>
            </button>
          </div>

          <h2 class="text-lg font-semibold text-gray-900 mb-4 mt-8">Tags</h2>
          <div v-if="tagsData" class="flex flex-wrap gap-2">
            <button
              v-for="tag in tagsData"
              :key="tag.name"
              @click="toggleTag(tag.name)"
              :class="[
                'px-3 py-1 text-sm rounded-full transition-colors',
                selectedTags.includes(tag.name)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              #{{ tag.name }}
            </button>
          </div>
        </div>
      </aside>

      <div class="lg:col-span-3">
        <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="i in 4" :key="i" class="animate-pulse">
            <div class="bg-gray-200 aspect-video rounded-lg mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>

        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-600">Failed to load posts. Please try again later.</p>
        </div>

        <div v-else-if="filteredPosts.length === 0" class="text-center py-12">
          <p class="text-gray-600">No posts found matching your criteria.</p>
        </div>

        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BlogCard
              v-for="post in filteredPosts"
              :key="post.id"
              :post="post"
            />
          </div>

          <Pagination
            v-if="data?.pagination"
            :current-page="currentPage"
            :total-pages="data.pagination.totalPages"
            @update:page="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogListItem } from '~/types/blog'

const selectedCategory = ref<string | null>(null)
const selectedTags = ref<string[]>([])
const currentPage = ref(1)
const searchQuery = ref('')

const { data, pending, error, refresh } = await useFetch('/api/posts', {
  query: {
    page: currentPage,
    limit: 10
  },
  watch: [currentPage]
})
const { data: categoriesData } = await useFetch('/api/categories')
const { data: tagsData } = await useFetch('/api/tags')

const filteredPosts = computed(() => {
  if (!data.value?.posts) return []

  let posts = data.value.posts as BlogListItem[]

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    posts = posts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Category filter
  if (selectedCategory.value) {
    posts = posts.filter(post => post.category === selectedCategory.value)
  }

  // Tag filter
  if (selectedTags.value.length > 0) {
    posts = posts.filter(post =>
      selectedTags.value.some(tag => post.tags.includes(tag))
    )
  }

  return posts
})

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  // Scroll to top of page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Watch category and search changes, reset page number
watch([selectedCategory, searchQuery], () => {
  currentPage.value = 1
})

useSeoMeta({
  title: 'Blog - Studio Inkless Blog',
  ogTitle: 'Blog Articles - Studio Inkless Blog',
  description: 'Explore our collection of articles on web development, design, and technology. Filter by categories and tags to find what interests you.',
  ogDescription: 'Explore our collection of articles on web development, design, and technology.',
  ogImage: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1200',
  twitterCard: 'summary_large_image',
})
</script>
