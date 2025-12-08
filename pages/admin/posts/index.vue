<template>
  <div class="px-8 py-6">
    <!-- Page title and actions -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Posts</h1>
        <p class="mt-1 text-sm text-gray-500">Manage all your blog posts</p>
      </div>
      <NuxtLink
        to="/admin/posts/new"
        class="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Post
      </NuxtLink>
    </div>

    <!-- Search and filters -->
    <div class="border border-gray-200 p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div class="md:col-span-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search posts by title or content..."
            class="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
          />
        </div>
        <select
          v-model="filterStatus"
          class="px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select
          v-model="filterCategory"
          class="px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
        >
          <option value="">All Categories</option>
          <option value="1">Technology</option>
          <option value="2">Design</option>
          <option value="3">Life</option>
        </select>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-12 border border-gray-200">
      <div class="text-center">
        <svg class="animate-spin h-8 w-8 text-gray-900 mx-auto" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-4 text-gray-600 text-sm">Loading posts...</p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="posts.length === 0" class="border border-gray-200 p-12 text-center">
      <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
      <p class="text-sm text-gray-500 mb-4">Get started by creating your first blog post</p>
      <NuxtLink
        to="/admin/posts/new"
        class="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create First Post
      </NuxtLink>
    </div>

    <!-- Posts list -->
    <div v-else class="border border-gray-200">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-2 text-left">
                <input type="checkbox" class="w-3.5 h-3.5 text-gray-900 border-gray-300 focus:ring-gray-900" />
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Post
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Published
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="post in filteredPosts"
              :key="post.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-3">
                <input type="checkbox" class="w-3.5 h-3.5 text-gray-900 border-gray-300 focus:ring-gray-900" />
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center space-x-3">
                  <img
                    v-if="post.cover_image_url"
                    :src="post.cover_image_url"
                    :alt="post.title"
                    class="w-12 h-12 object-cover"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ post.title }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ post.excerpt }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="text-xs text-gray-600">{{ post.category_name || 'Uncategorized' }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-0.5 inline-flex text-xs font-medium border',
                    post.status === 'published'
                      ? 'border-green-200 text-green-700 bg-green-50'
                      : 'border-yellow-200 text-yellow-700 bg-yellow-50'
                  ]"
                >
                  {{ post.status === 'published' ? 'Published' : 'Draft' }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                {{ formatDate(post.published_at) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                {{ post.views }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-right text-sm">
                <div class="flex items-center justify-end space-x-2">
                  <NuxtLink
                    :to="`/blog/${post.slug}`"
                    target="_blank"
                    class="text-gray-400 hover:text-gray-900"
                    title="Preview"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </NuxtLink>
                  <NuxtLink
                    :to="`/admin/posts/${post.id}/edit`"
                    class="text-gray-400 hover:text-gray-900"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </NuxtLink>
                  <button
                    @click="deletePost(post.id)"
                    :disabled="deleting === post.id"
                    class="text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete"
                  >
                    <svg v-if="deleting === post.id" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
        <div class="flex-1 flex justify-between sm:hidden">
          <button class="px-3 py-1.5 border border-gray-300 text-xs bg-white hover:bg-gray-50">
            Previous
          </button>
          <button class="ml-3 px-3 py-1.5 border border-gray-300 text-xs bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-xs text-gray-500">
              Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of
              <span class="font-medium">{{ filteredPosts.length }}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex -space-x-px">
              <button class="px-3 py-1.5 border border-gray-200 bg-white text-xs text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button class="px-3 py-1.5 border border-gray-200 bg-gray-50 text-xs text-gray-900">
                1
              </button>
              <button class="px-3 py-1.5 border border-gray-200 bg-white text-xs text-gray-500 hover:bg-gray-50">
                2
              </button>
              <button class="px-3 py-1.5 border border-gray-200 bg-white text-xs text-gray-500 hover:bg-gray-50">
                3
              </button>
              <button class="px-3 py-1.5 border border-gray-200 bg-white text-xs text-gray-500 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const searchQuery = ref('')
const filterStatus = ref('')
const filterCategory = ref('')
const loading = ref(true)
const deleting = ref<number | null>(null)

interface Post {
  id: number
  title: string
  excerpt: string
  slug: string
  cover_image_url: string
  category_name: string
  status: string
  published_at: string
  views: number
}

const posts = ref<Post[]>([])

// Fetch posts from API
const fetchPosts = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/admin/posts')

    if (response.success && response.articles) {
      posts.value = response.articles
    }
  } catch (error) {
    console.error('Failed to fetch posts:', error)
  } finally {
    loading.value = false
  }
}

// Load posts on mount
onMounted(() => {
  fetchPosts()
})

const filteredPosts = computed(() => {
  return posts.value.filter(post => {
    const matchesSearch = !searchQuery.value ||
      post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase()))

    const matchesStatus = !filterStatus.value || post.status === filterStatus.value
    const matchesCategory = !filterCategory.value // TODO: 实现分类过滤

    return matchesSearch && matchesStatus && matchesCategory
  })
})

const formatDate = (dateString: string) => {
  if (!dateString) return 'Not published'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

const deletePost = async (id: number) => {
  if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
    return
  }

  try {
    deleting.value = id

    const response = await $fetch(`/api/admin/posts/${id}`, {
      method: 'DELETE'
    })

    if (response.success) {
      // Remove post from local list
      posts.value = posts.value.filter(post => post.id !== id)
    }
  } catch (error: any) {
    console.error('Failed to delete post:', error)
    alert(error.data?.statusMessage || 'Failed to delete post. Please try again.')
  } finally {
    deleting.value = null
  }
}
</script>
