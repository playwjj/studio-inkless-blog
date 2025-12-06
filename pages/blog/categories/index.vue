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
            <li class="text-gray-900 font-semibold">Categories</li>
          </ol>
        </nav>

        <div class="max-w-3xl">
          <div class="inline-flex items-center px-4 py-1.5 text-sm font-semibold bg-white/80 backdrop-blur-sm rounded-lg border border-primary-200 text-primary-600 shadow-sm mb-4">
            <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            All Categories
          </div>
          <h1 class="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            Explore by Categories
          </h1>
          <p class="text-base md:text-lg text-gray-600">
            Browse {{ filteredCategories.length }} categor{{ filteredCategories.length !== 1 ? 'ies' : 'y' }} to find articles that interest you
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <!-- Search & Sort Bar -->
      <div class="mb-8 space-y-4">
        <!-- Search Box -->
        <div class="max-w-2xl">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search categories..."
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

        <!-- Sort & Display Options -->
        <div class="flex flex-wrap items-center gap-3">
          <!-- Results Count -->
          <div v-if="!pending" class="text-sm text-gray-600">
            Showing <span class="font-semibold text-gray-900">{{ filteredCategories.length }}</span>
            {{ filteredCategories.length === 1 ? 'category' : 'categories' }}
            <span v-if="searchQuery"> (filtered)</span>
          </div>

          <!-- Sort Dropdown -->
          <div class="ml-auto">
            <select
              v-model="sortBy"
              class="px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm font-medium text-gray-700 cursor-pointer hover:border-gray-300 transition-colors"
            >
              <option value="popular">Most Popular</option>
              <option value="name">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="bg-gray-200 h-40 rounded-xl"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16 bg-red-50 rounded-xl border border-red-200">
        <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-600 font-medium">Failed to load categories. Please try again later.</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredCategories.length === 0" class="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
        <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
        <p class="text-gray-600 mb-6">
          {{ searchQuery ? 'Try adjusting your search terms' : 'No categories available' }}
        </p>
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Clear search
        </button>
      </div>

      <!-- Categories Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="category in sortedCategories"
          :key="category.slug"
          :to="`/blog/category/${category.slug}`"
          class="group relative bg-white rounded-xl p-6 shadow-md border-2 border-gray-100 hover:border-primary-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <!-- Category Icon -->
          <div class="mb-4">
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-indigo-100 text-primary-600 group-hover:from-primary-200 group-hover:to-indigo-200 transition-colors">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>

          <!-- Category Name -->
          <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {{ category.name }}
          </h3>

          <!-- Post Count -->
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{{ category.count }} {{ category.count === 1 ? 'article' : 'articles' }}</span>
          </div>

          <!-- Progress Bar -->
          <div class="mt-4 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              class="bg-gradient-to-r from-primary-500 to-indigo-500 h-full transition-all duration-500"
              :style="{ width: getProgressWidth(category.count) + '%' }"
            ></div>
          </div>

          <!-- Hover Arrow -->
          <div class="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </NuxtLink>
      </div>

      <!-- Back to Blog Link -->
      <div class="mt-12 text-center">
        <NuxtLink
          to="/blog"
          class="inline-flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-primary-700 font-semibold transition-colors group"
        >
          <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to all articles
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const searchQuery = ref('')
const sortBy = ref('popular')

// Fetch all categories
const { data, pending, error } = await useFetch('/api/categories')

const filteredCategories = computed(() => {
  if (!data.value) return []

  let categories = [...data.value]

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    categories = categories.filter(category =>
      category.name.toLowerCase().includes(query)
    )
  }

  return categories
})

const sortedCategories = computed(() => {
  const categories = [...filteredCategories.value]

  switch (sortBy.value) {
    case 'popular':
      return categories.sort((a, b) => b.count - a.count)
    case 'name':
      return categories.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return categories.sort((a, b) => b.name.localeCompare(a.name))
    default:
      return categories
  }
})

// Calculate progress bar width based on article count
const getProgressWidth = (count: number) => {
  const maxCount = Math.max(...(data.value?.map(c => c.count) || [1]))
  return (count / maxCount) * 100
}

useSeoMeta({
  title: 'Categories - Blog - Studio Inkless Blog',
  ogTitle: 'Browse Categories - Studio Inkless Blog',
  description: 'Explore all categories and find articles on topics that interest you. Browse by technology, framework, or topic.',
  ogDescription: 'Explore all categories and find articles on topics that interest you.',
  ogImage: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1200',
  twitterCard: 'summary_large_image',
})
</script>
