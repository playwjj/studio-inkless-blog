<template>
  <div class="px-8 py-6">
    <!-- Page title -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Newsletter Subscribers</h1>
        <p class="mt-1 text-sm text-gray-500">Manage newsletter subscriptions</p>
      </div>
      <button
        @click="handleExport"
        :disabled="exporting"
        class="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {{ exporting ? 'Exporting...' : 'Export CSV' }}
      </button>
    </div>

    <!-- Search and filters -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by email..."
          class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
        />
      </div>
      <div class="sm:w-48">
        <select
          v-model="statusFilter"
          class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="unsubscribed">Unsubscribed</option>
        </select>
      </div>
    </div>

    <!-- Newsletters list -->
    <div class="border border-gray-200">
      <!-- Loading state -->
      <div v-if="loading" class="py-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p class="mt-2 text-sm text-gray-500">Loading subscribers...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="newsletters.length === 0" class="py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No subscribers</h3>
        <p class="mt-1 text-sm text-gray-500">Newsletter subscribers will appear here.</p>
      </div>

      <!-- Newsletters table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscribed
              </th>
              <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="newsletter in newsletters"
              :key="newsletter.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-3">
                <span class="text-sm text-gray-900">{{ newsletter.email }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-0.5 text-xs font-medium rounded"
                  :class="newsletter.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ newsletter.status }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="text-xs text-gray-500">{{ newsletter.source || 'homepage' }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                {{ formatDate(newsletter.subscribed_at) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-right">
                <button
                  @click="deleteNewsletter(newsletter.id)"
                  class="text-gray-400 hover:text-red-600"
                  title="Delete"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-500">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        <div class="flex gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 text-sm border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 text-sm border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DbNewsletter } from '~/server/types/dbTypes'

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

const newsletters = ref<DbNewsletter[]>([])
const loading = ref(true)
const exporting = ref(false)
const searchQuery = ref('')
const statusFilter = ref<'all' | 'active' | 'unsubscribed'>('all')
const currentPage = ref(1)
const totalPages = ref(1)

// Load newsletters on mount
onMounted(() => {
  loadNewsletters()
})

// Watch for search/filter changes
watch([searchQuery, statusFilter, currentPage], () => {
  loadNewsletters()
})

async function loadNewsletters() {
  loading.value = true
  try {
    const response = await $fetch('/api/admin/newsletters', {
      query: {
        page: currentPage.value,
        limit: 20,
        search: searchQuery.value || undefined,
        status: statusFilter.value !== 'all' ? statusFilter.value : undefined
      }
    })

    newsletters.value = (response as any).data || []
    totalPages.value = (response as any).pagination?.totalPages || 1
  } catch (error) {
    console.error('Failed to load newsletters:', error)
    showError('Failed to load newsletters', 'Please try again.')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const deleteNewsletter = async (id: number) => {
  const newsletter = newsletters.value.find(n => n.id === id)
  const email = newsletter?.email || 'this subscriber'

  await showConfirm({
    title: 'Delete Subscriber',
    message: `Are you sure you want to delete "${email}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
    onConfirm: async () => {
      try {
        await $fetch(`/api/admin/newsletters/${id}`, {
          method: 'DELETE'
        })

        success('Subscriber deleted successfully!')
        await loadNewsletters()
      } catch (error: any) {
        if (error.statusCode === 404) {
          showError('Subscriber not found', 'The subscriber may have been deleted already')
        } else {
          showError('Failed to delete subscriber', 'Please try again.')
        }
        console.error('Delete newsletter error:', error)
      }
    }
  })
}

const handleExport = async () => {
  exporting.value = true
  try {
    // Create a temporary link to trigger download
    const response = await fetch('/api/admin/newsletters/export', {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Export failed')
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletters-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    success('Export completed successfully!')
  } catch (error) {
    console.error('Export error:', error)
    showError('Failed to export', 'Please try again.')
  } finally {
    exporting.value = false
  }
}
</script>
