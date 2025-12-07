<template>
  <div class="px-8 py-6">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <p class="mt-1 text-sm text-gray-500">Overview of your site's performance</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      <StatCard
        title="Total Posts"
        :value="stats.totalPosts"
        color="blue"
        :trend="{ value: 12, isPositive: true }"
      />
      <StatCard
        title="Total Views"
        :value="stats.totalViews"
        color="green"
        :trend="{ value: 8, isPositive: true }"
      />
      <StatCard
        title="Comments"
        :value="stats.totalComments"
        color="purple"
        :trend="{ value: 3, isPositive: false }"
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

        <div class="space-y-px border border-gray-200">
          <div
            v-for="(post, index) in recentPosts"
            :key="post.id"
            class="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            :class="{ 'border-t border-gray-200': index > 0 }"
          >
            <img
              v-if="post.cover_image_url"
              :src="post.cover_image_url"
              :alt="post.title"
              class="w-16 h-16 object-cover"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ post.title }}</p>
              <div class="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span>{{ formatDate(post.published_at) }}</span>
                <span>·</span>
                <span>{{ post.read_time }} min read</span>
                <span>·</span>
                <span :class="post.status === 'published' ? 'text-green-600' : 'text-yellow-600'">
                  {{ post.status === 'published' ? 'Published' : 'Draft' }}
                </span>
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

// Mock data
const stats = reactive({
  totalPosts: 42,
  totalViews: '12.5K',
  totalComments: 186,
  totalPages: 8
})

const recentPosts = ref([
  {
    id: 1,
    title: 'How to Build a Modern Blog with Nuxt 3',
    excerpt: 'This article will introduce how to build a fully functional blog system from scratch using Nuxt 3 framework...',
    cover_image_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400',
    published_at: '2024-01-15',
    read_time: 8,
    status: 'published'
  },
  {
    id: 2,
    title: 'Tailwind CSS Best Practices Guide',
    excerpt: 'In-depth discussion of Tailwind CSS application tips and best practices in real projects...',
    cover_image_url: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400',
    published_at: '2024-01-12',
    read_time: 6,
    status: 'published'
  },
  {
    id: 3,
    title: 'Deep Dive into Vue 3 Composition API',
    excerpt: 'Comprehensive analysis of Vue 3 Composition API design philosophy and usage methods...',
    cover_image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    published_at: '2024-01-10',
    read_time: 10,
    status: 'draft'
  }
])

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
