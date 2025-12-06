<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
      <p class="text-xl text-gray-600">
        Explore our collection of articles on web development and technology
      </p>
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

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BlogCard
            v-for="post in filteredPosts"
            :key="post.id"
            :post="post"
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

const { data, pending, error } = await useFetch('/api/posts')
const { data: categoriesData } = await useFetch('/api/categories')
const { data: tagsData } = await useFetch('/api/tags')

const filteredPosts = computed(() => {
  if (!data.value?.posts) return []

  let posts = data.value.posts as BlogListItem[]

  if (selectedCategory.value) {
    posts = posts.filter(post => post.category === selectedCategory.value)
  }

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
}
</script>
