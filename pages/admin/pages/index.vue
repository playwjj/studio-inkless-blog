<template>
  <div class="px-8 py-6">
    <!-- Page title -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Pages</h1>
        <p class="mt-1 text-sm text-gray-500">Manage custom pages - Drag rows to reorder</p>
      </div>
      <button
        @click="navigateTo('/admin/pages/new')"
        class="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Page
      </button>
    </div>

    <!-- Filters and Search -->
    <div class="border border-gray-200 p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Search -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search pages by title..."
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

    <!-- Pages list -->
    <div class="border border-gray-200">
      <!-- Loading state -->
      <div v-if="loading" class="py-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p class="mt-2 text-sm text-gray-500">Loading pages...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="pages.length === 0" class="py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No pages</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new page.</p>
        <div class="mt-6">
          <button
            @click="navigateTo('/admin/pages/new')"
            class="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New Page
          </button>
        </div>
      </div>

      <!-- No results state -->
      <div v-else-if="displayPages.length === 0" class="py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No pages found</h3>
        <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter.</p>
      </div>

      <!-- Pages table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-2 py-2 w-8"></th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Page
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sort
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
          <draggable
            v-model="displayPages"
            tag="tbody"
            item-key="id"
            handle=".drag-handle"
            class="divide-y divide-gray-200"
            @end="onDragEnd"
          >
            <template #item="{ element: page }">
              <tr class="hover:bg-gray-50 transition-colors">
              <!-- Drag Handle -->
              <td class="px-2 py-3">
                <div class="drag-handle cursor-move text-gray-400 hover:text-gray-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                  </svg>
                </div>
              </td>

              <!-- Page (with cover image and title) -->
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img
                    v-if="page.cover_image"
                    :src="page.cover_image"
                    :alt="page.title"
                    class="w-12 h-12 object-cover bg-gray-100"
                  />
                  <div
                    v-else
                    class="w-12 h-12 bg-gray-100 flex items-center justify-center flex-shrink-0"
                  >
                    <!-- Page icon -->
                    <svg v-if="page.type === 'page'" class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <!-- URL/Link icon -->
                    <svg v-else class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ page.title }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ page.slug }}</p>
                  </div>
                </div>
              </td>

              <!-- Status -->
              <td class="px-4 py-3 whitespace-nowrap">
                <button
                  @click="toggleStatus(page)"
                  class="inline-flex px-2 py-0.5 text-xs font-medium transition-colors"
                  :class="{
                    'bg-green-100 text-green-800 hover:bg-green-200': page.status === 'published',
                    'bg-yellow-100 text-yellow-800 hover:bg-yellow-200': page.status === 'draft',
                    'bg-gray-100 text-gray-800 hover:bg-gray-200': page.status === 'archived'
                  }"
                >
                  {{ page.status === 'published' ? 'Published' : page.status === 'draft' ? 'Draft' : 'Archived' }}
                </button>
              </td>

              <!-- Sort -->
              <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-900">
                {{ page.sort || 0 }}
              </td>

              <!-- Views -->
              <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-900">
                {{ page.view_count }}
              </td>

              <!-- Created -->
              <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                {{ formatDate(page.created_at) }}
              </td>

              <!-- Actions -->
              <td class="px-4 py-3 whitespace-nowrap text-right">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="navigateTo(`/admin/pages/${page.id}/edit`)"
                    class="text-gray-400 hover:text-gray-900"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="deletePage(page.id, page.title)"
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
            </template>
          </draggable>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'

definePageMeta({
  layout: 'admin'
})

const { success, error: showError, confirm: showConfirm } = useNotification()

// Check authentication
const { data: userData, error: authError } = await useFetch('/api/auth/user')

if (authError.value) {
  // Redirect to login if not authenticated
  await navigateTo('/admin/login')
}

interface Page {
  id: number
  title: string
  slug: string
  description?: string
  status: 'draft' | 'published' | 'archived'
  type: 'page' | 'url'
  template: string
  cover_image_url?: string
  sort: number
  view_count: number
  created_at: string
  updated_at: string
}

const searchQuery = ref('')
const statusFilter = ref('all')
const loading = ref(false)
const pages = ref<Page[]>([])

// Load pages on mount
onMounted(() => {
  loadPages()
})

async function loadPages() {
  loading.value = true
  try {
    const response = await $fetch('/api/admin/pages')
    pages.value = response.pages || []
  } catch (error) {
    console.error('Failed to load pages:', error)
    showError('Failed to load pages. Please try again.')
  } finally {
    loading.value = false
  }
}

// Display pages for drag and drop
const displayPages = ref<Page[]>([])

const filteredPages = computed(() => {
  let filtered = pages.value

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(page =>
      page.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filter by status
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(page => page.status === statusFilter.value)
  }

  return filtered
})

// Sync displayPages with filteredPages
watch(filteredPages, (newFiltered) => {
  displayPages.value = [...newFiltered]
}, { immediate: true })

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

async function toggleStatus(page: Page) {
  // Cycle through statuses: draft -> published -> archived -> draft
  const statusCycle: Record<string, 'draft' | 'published' | 'archived'> = {
    'draft': 'published',
    'published': 'archived',
    'archived': 'draft'
  }

  const newStatus = statusCycle[page.status]

  try {
    await $fetch(`/api/admin/pages/${page.id}`, {
      method: 'PUT',
      body: { status: newStatus }
    })

    // Update local state
    page.status = newStatus
  } catch (error: any) {
    showError('Failed to update page status. Please try again.')
    console.error('Update status error:', error)
  }
}

async function deletePage(id: number, title: string) {
  await showConfirm({
    title: 'Delete Page',
    message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
    onConfirm: async () => {
      try {
          await $fetch(`/api/admin/pages/${id}`, {
            method: 'DELETE'
          })

          success('Page deleted successfully')
          await loadPages()
        } catch (error: any) {
          showError('Failed to delete page. Please try again.')
          console.error('Delete page error:', error)
        }
    }
  })
}

// Handle drag and drop reordering
const isSorting = ref(false)

async function onDragEnd() {
  if (isSorting.value) return

  try {
    isSorting.value = true

    // Update sort values based on new order (use index * 10 for spacing)
    const updates = displayPages.value.map((page, index) => ({
      id: page.id,
      sort: index * 10
    }))

    // Update each page's sort value
    await Promise.all(
      updates.map(update =>
        $fetch(`/api/admin/pages/${update.id}`, {
          method: 'PUT',
          body: { sort: update.sort }
        })
      )
    )

    // Update local state
    updates.forEach(update => {
      const page = pages.value.find(p => p.id === update.id)
      if (page) {
        page.sort = update.sort
      }
    })

    success('Order updated successfully')
  } catch (error: any) {
    showError('Failed to update order. Please try again.')
    console.error('Update order error:', error)
    // Reload pages to restore original order
    await loadPages()
  } finally {
    isSorting.value = false
  }
}
</script>
