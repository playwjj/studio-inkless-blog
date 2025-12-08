<template>
  <div class="px-8 py-6">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <p class="mt-1 text-sm text-gray-500">Overview of your site's performance</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="py-12 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <p class="mt-2 text-sm text-gray-500">Loading dashboard...</p>
    </div>

    <!-- Stats Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      <StatCard
        title="Total Posts"
        :value="stats.totalPosts"
        color="blue"
      />
      <StatCard
        title="Total Views"
        :value="stats.totalViews"
        color="green"
      />
      <StatCard
        title="Categories"
        :value="stats.totalCategories"
        color="purple"
      />
      <StatCard
        title="Pages"
        :value="stats.totalPages"
        color="orange"
      />
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Posts -->
      <div class="lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-medium text-gray-900">Recent Posts</h2>
          <NuxtLink to="/admin/posts" class="text-xs text-gray-500 hover:text-gray-900">
            View all
          </NuxtLink>
        </div>

        <div v-if="!loading && recentPosts.length === 0" class="border border-gray-200 py-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No posts yet</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating a new post.</p>
        </div>

        <div v-else class="space-y-px border border-gray-200">
          <div
            v-for="(post, index) in recentPosts"
            :key="post.id"
            class="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            :class="{ 'border-t border-gray-200': index > 0 }"
          >
            <img
              v-if="post.cover_image"
              :src="post.cover_image"
              :alt="post.title"
              class="w-16 h-16 object-cover bg-gray-100"
            />
            <div
              v-else
              class="w-16 h-16 bg-gray-100 flex items-center justify-center"
            >
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ post.title }}</p>
              <div class="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span>{{ formatDate(post.created_at) }}</span>
                <span>·</span>
                <span>{{ post.category }}</span>
                <span>·</span>
                <span>{{ post.view_count }} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions & System Info -->
      <div class="space-y-8">
        <!-- Quick Actions -->
        <div>
          <h2 class="text-sm font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div class="space-y-2">
            <NuxtLink
              to="/admin/posts/new"
              class="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>New Post</span>
            </NuxtLink>
            <NuxtLink
              to="/admin/pages/new"
              class="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>New Page</span>
            </NuxtLink>
            <NuxtLink
              to="/admin/site"
              class="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </NuxtLink>
          </div>
        </div>

        <!-- System Info -->
        <div>
          <h2 class="text-sm font-medium text-gray-900 mb-4">System Info</h2>
          <div class="space-y-2 text-xs">
            <div class="flex justify-between py-1.5 border-b border-gray-100">
              <span class="text-gray-500">Nuxt Version</span>
              <span class="font-medium text-gray-900">3.13.0</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-gray-100">
              <span class="text-gray-500">Database</span>
              <span class="font-medium text-gray-900">Cloudflare D1</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-gray-100">
              <span class="text-gray-500">Deploy Platform</span>
              <span class="font-medium text-gray-900">Cloudflare Pages</span>
            </div>
            <div class="flex justify-between py-1.5">
              <span class="text-gray-500">Last Update</span>
              <span class="font-medium text-gray-900">2 hours ago</span>
            </div>
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

// Check authentication
const { data: userData, error: authError } = await useFetch('/api/auth/user')

if (authError.value) {
  // Redirect to login if not authenticated
  await navigateTo('/admin/login')
}

interface DashboardStats {
  totalPosts: number
  totalViews: string
  totalCategories: number
  totalTags: number
  totalPages: number
}

interface RecentArticle {
  id: number
  title: string
  slug: string
  cover_image?: string
  view_count: number
  created_at: string
  category: string
}

const loading = ref(true)
const stats = ref<DashboardStats>({
  totalPosts: 0,
  totalViews: '0',
  totalCategories: 0,
  totalTags: 0,
  totalPages: 0
})
const recentPosts = ref<RecentArticle[]>([])

// Load dashboard data
onMounted(() => {
  loadDashboardData()
})

async function loadDashboardData() {
  loading.value = true
  try {
    const response = await $fetch('/api/admin/dashboard/stats')
    stats.value = response.stats
    recentPosts.value = response.recentArticles
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
    alert('Failed to load dashboard data. Please try again.')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
