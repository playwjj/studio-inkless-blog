<template>
  <div class="px-8 py-6">
    <!-- Page title -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Posts</h1>
        <p class="mt-1 text-sm text-gray-500">Manage your blog posts</p>
      </div>
      <button
        @click="navigateTo('/admin/posts/new')"
        class="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Post
      </button>
    </div>

    <!-- Filters and Search -->
    <div class="border border-gray-200 p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Search -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search posts by title..."
          class="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
        />

        <!-- Status Filter -->
        <select
          v-model="statusFilter"
          class="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>
    </div>

    <!-- Posts list -->
    <div class="border border-gray-200">
      <!-- Loading state -->
      <div v-if="loading" class="py-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p class="mt-2 text-sm text-gray-500">Loading posts...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="posts.length === 0" class="py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No posts</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new post.</p>
        <div class="mt-6">
          <button
            @click="navigateTo('/admin/posts/new')"
            class="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </button>
        </div>
      </div>

      <!-- No results state -->
      <div v-else-if="filteredPosts.length === 0" class="py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No posts found</h3>
        <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter.</p>
      </div>

      <!-- Posts table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
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
                Views
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
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
              <!-- Post (with cover image and title) -->
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img
                    v-if="post.cover_image"
                    :src="post.cover_image"
                    :alt="post.title"
                    class="w-12 h-12 object-cover bg-gray-100"
                  />
                  <div
                    v-else
                    class="w-12 h-12 bg-gray-100 flex items-center justify-center flex-shrink-0"
                  >
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ post.title }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ post.slug }}</p>
                  </div>
                </div>
              </td>

              <!-- Category -->
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="text-xs text-gray-600">{{ post.category_name }}</span>
              </td>

              <!-- Status -->
              <td class="px-4 py-3 whitespace-nowrap">
                <button
                  @click="toggleStatus(post)"
                  class="inline-flex px-2 py-0.5 text-xs font-medium transition-colors"
                  :class="{
                    'bg-green-100 text-green-800 hover:bg-green-200': post.status === 'published',
                    'bg-yellow-100 text-yellow-800 hover:bg-yellow-200': post.status === 'draft',
                    'bg-gray-100 text-gray-800 hover:bg-gray-200': post.status === 'archived'
                  }"
                >
                  {{ post.status === 'published' ? 'Published' : post.status === 'draft' ? 'Draft' : 'Archived' }}
                </button>
              </td>

              <!-- Views -->
              <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-900">
                {{ post.view_count }}
              </td>

              <!-- Created -->
              <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                {{ formatDate(post.created_at) }}
              </td>

              <!-- Actions -->
              <td class="px-4 py-3 whitespace-nowrap text-right">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="navigateTo(`/admin/posts/${post.id}`)"
                    class="text-gray-400 hover:text-gray-900"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="deletePost(post.id, post.title)"
                    class="text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

// Check authentication
const { data: userData, error: authError } = await useFetch('/api/auth/user')

if (authError.value) {
  // Redirect to login if not authenticated
  await navigateTo('/admin/login')
}

interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  cover_image?: string
  category_id: number
  category_name: string
  status: 'draft' | 'published' | 'archived'
  view_count: number
  created_at: string
  updated_at: string
}

const searchQuery = ref('')
const statusFilter = ref('all')
const loading = ref(false)
const posts = ref<Post[]>([])

// Load posts on mount
onMounted(() => {
  loadPosts()
})

async function loadPosts() {
  loading.value = true
  try {
    const response = await $fetch('/api/admin/posts')
    posts.value = response.articles || []
  } catch (error) {
    console.error('Failed to load posts:', error)
    alert('Failed to load posts. Please try again.')
  } finally {
    loading.value = false
  }
}

const filteredPosts = computed(() => {
  let filtered = posts.value

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(post =>
      post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filter by status
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(post => post.status === statusFilter.value)
  }

  return filtered
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

async function toggleStatus(post: Post) {
  // Cycle through statuses: draft -> published -> archived -> draft
  const statusCycle: Record<string, 'draft' | 'published' | 'archived'> = {
    'draft': 'published',
    'published': 'archived',
    'archived': 'draft'
  }

  const newStatus = statusCycle[post.status]

  try {
    await $fetch(`/api/admin/posts/${post.id}`, {
      method: 'PUT',
      body: { status: newStatus }
    })

    // Update local state
    post.status = newStatus
  } catch (error: any) {
    alert('Failed to update post status. Please try again.')
    console.error('Update status error:', error)
  }
}

async function deletePost(id: number, title: string) {
  if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
    return
  }

  try {
    await $fetch(`/api/admin/posts/${id}`, {
      method: 'DELETE'
    })

    alert('Post deleted successfully')
    await loadPosts()
  } catch (error: any) {
    alert('Failed to delete post. Please try again.')
    console.error('Delete post error:', error)
  }
}
</script>
