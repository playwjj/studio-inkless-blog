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

    <!-- Posts list -->
    <div class="border border-gray-200">
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
                <span class="text-xs text-gray-600">{{ post.category }}</span>
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

// 模拟数据
const posts = ref([
  {
    id: 1,
    title: '如何使用 Nuxt 3 构建现代化博客系统',
    excerpt: '本文将介绍如何使用 Nuxt 3 框架从零开始构建一个功能完整的博客系统...',
    slug: 'nuxt3-blog-system',
    cover_image_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400',
    category: '技术',
    status: 'published',
    published_at: '2024-01-15',
    views: 1234
  },
  {
    id: 2,
    title: 'Tailwind CSS 最佳实践指南',
    excerpt: '深入探讨 Tailwind CSS 在实际项目中的应用技巧和最佳实践...',
    slug: 'tailwind-css-best-practices',
    cover_image_url: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400',
    category: '设计',
    status: 'published',
    published_at: '2024-01-12',
    views: 856
  },
  {
    id: 3,
    title: 'Vue 3 Composition API 深度解析',
    excerpt: '全面解析 Vue 3 Composition API 的设计理念和使用方法...',
    slug: 'vue3-composition-api',
    cover_image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    category: '技术',
    status: 'draft',
    published_at: '2024-01-10',
    views: 423
  },
  {
    id: 4,
    title: 'TypeScript 进阶技巧',
    excerpt: '提升 TypeScript 开发效率的高级技巧和模式...',
    slug: 'typescript-advanced-tips',
    cover_image_url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
    category: '技术',
    status: 'published',
    published_at: '2024-01-08',
    views: 965
  },
  {
    id: 5,
    title: '响应式设计的未来',
    excerpt: '探索现代响应式设计的发展趋势和新技术...',
    slug: 'future-of-responsive-design',
    cover_image_url: 'https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?w=400',
    category: '设计',
    status: 'draft',
    published_at: '2024-01-05',
    views: 321
  }
])

const filteredPosts = computed(() => {
  return posts.value.filter(post => {
    const matchesSearch = !searchQuery.value ||
      post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus = !filterStatus.value || post.status === filterStatus.value
    const matchesCategory = !filterCategory.value // TODO: 实现分类过滤

    return matchesSearch && matchesStatus && matchesCategory
  })
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

const deletePost = (id: number) => {
  if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
    // TODO: Implement delete functionality
    console.log('Delete post:', id)
  }
}
</script>
