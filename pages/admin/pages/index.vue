<template>
  <div class="px-8 py-6">
    <!-- Page title and actions -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Pages</h1>
        <p class="mt-1 text-sm text-gray-500">Manage your custom pages</p>
      </div>
      <NuxtLink
        to="/admin/pages/new"
        class="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Page
      </NuxtLink>
    </div>

    <!-- Search -->
    <div class="border border-gray-200 p-4 mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search pages..."
        class="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
      />
    </div>

    <!-- Pages list -->
    <div class="border border-gray-200">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Page Title
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Path
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Template
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="page in filteredPages"
              :key="page.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-3">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ page.title }}</p>
                  <p class="text-xs text-gray-500">{{ page.description }}</p>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <code class="text-xs text-gray-600">
                  /{{ page.slug }}
                </code>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="text-xs text-gray-900">{{ page.template }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-0.5 inline-flex text-xs font-medium border',
                    page.status === 'published'
                      ? 'border-green-200 text-green-700 bg-green-50'
                      : 'border-yellow-200 text-yellow-700 bg-yellow-50'
                  ]"
                >
                  {{ page.status === 'published' ? 'Published' : 'Draft' }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                {{ formatDate(page.updated_at) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-right">
                <div class="flex items-center justify-end space-x-2">
                  <NuxtLink
                    :to="`/${page.slug}`"
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
                    :to="`/admin/pages/${page.id}/edit`"
                    class="text-gray-400 hover:text-gray-900"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </NuxtLink>
                  <button
                    @click="deletePage(page.id)"
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

const searchQuery = ref('')

// 模拟数据
const pages = ref([
  {
    id: 1,
    title: '关于我们',
    slug: 'about',
    description: '了解我们的团队和使命',
    template: 'default',
    status: 'published',
    updated_at: '2024-01-15'
  },
  {
    id: 2,
    title: '联系我们',
    slug: 'contact',
    description: '与我们取得联系',
    template: 'minimal',
    status: 'published',
    updated_at: '2024-01-12'
  },
  {
    id: 3,
    title: '隐私政策',
    slug: 'privacy',
    description: '我们如何保护您的隐私',
    template: 'default',
    status: 'draft',
    updated_at: '2024-01-10'
  }
])

const filteredPages = computed(() => {
  if (!searchQuery.value) return pages.value

  return pages.value.filter(page =>
    page.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

const deletePage = (id: number) => {
  if (confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
    // TODO: Implement delete functionality
    console.log('Delete page:', id)
  }
}
</script>
