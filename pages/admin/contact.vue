<template>
  <div class="px-8 py-6">
    <!-- Page title -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Contact Messages</h1>
        <p class="mt-1 text-sm text-gray-500">Manage contact form submissions</p>
      </div>
    </div>

    <!-- Search and filters -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name, email, or subject..."
          class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
        />
      </div>
      <div class="sm:w-48">
        <select
          v-model="statusFilter"
          class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      </div>
    </div>

    <!-- Contact messages list -->
    <div class="border border-gray-200">
      <!-- Loading state -->
      <div v-if="loading" class="py-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p class="mt-2 text-sm text-gray-500">Loading messages...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="messages.length === 0" class="py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No messages</h3>
        <p class="mt-1 text-sm text-gray-500">Contact form submissions will appear here.</p>
      </div>

      <!-- Messages table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
              <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="message in messages"
              :key="message.id"
              class="hover:bg-gray-50 transition-colors cursor-pointer"
              @click="viewMessage(message)"
            >
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="text-xs text-gray-500">{{ message.id }}</span>
              </td>
              <td class="px-4 py-3">
                <span class="text-sm font-medium text-gray-900">{{ message.name }}</span>
              </td>
              <td class="px-4 py-3">
                <span class="text-sm text-gray-600">{{ message.email }}</span>
              </td>
              <td class="px-4 py-3">
                <span class="text-sm text-gray-600">{{ message.subject || '-' }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-0.5 text-xs font-medium rounded"
                  :class="getStatusColor(message.status)"
                >
                  {{ message.status }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                {{ formatDate(message.created_at) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-right">
                <button
                  @click.stop="deleteMessage(message.id)"
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
      <div class="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 border border-gray-300 text-xs bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="ml-3 px-3 py-1.5 border border-gray-300 text-xs bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-xs text-gray-500">
              Showing <span class="font-medium">{{ paginationStart }}</span> to <span class="font-medium">{{ paginationEnd }}</span> of
              <span class="font-medium">{{ totalItems }}</span> results
            </p>
          </div>
          <div v-if="totalPages > 1">
            <nav class="relative z-0 inline-flex -space-x-px">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-3 py-1.5 border border-gray-200 bg-white text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                v-for="(page, index) in pageNumbers"
                :key="index"
                @click="typeof page === 'number' ? goToPage(page) : null"
                :disabled="page === '...'"
                :class="[
                  'px-3 py-1.5 border border-gray-200 text-xs',
                  page === currentPage
                    ? 'bg-gray-900 text-white'
                    : page === '...'
                    ? 'bg-white text-gray-400 cursor-default'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1.5 border border-gray-200 bg-white text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Message Detail Modal -->
    <div
      v-if="selectedMessage"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-start justify-between mb-6">
            <div>
              <h2 class="text-2xl font-semibold text-gray-900">{{ selectedMessage.subject || 'No Subject' }}</h2>
              <p class="mt-1 text-sm text-gray-500">
                From {{ selectedMessage.name }} ({{ selectedMessage.email }})
              </p>
            </div>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Status Badge -->
          <div class="mb-4">
            <span
              class="inline-flex px-3 py-1 text-sm font-medium rounded-full"
              :class="getStatusColor(selectedMessage.status)"
            >
              {{ selectedMessage.status }}
            </span>
          </div>

          <!-- Message Content -->
          <div class="mb-6">
            <h3 class="text-sm font-semibold text-gray-700 mb-2">Message</h3>
            <div class="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">{{ selectedMessage.message }}</div>
          </div>

          <!-- Metadata -->
          <div class="mb-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-semibold text-gray-700">Submitted:</span>
              <span class="text-gray-600 ml-2">{{ formatDate(selectedMessage.created_at) }}</span>
            </div>
            <div v-if="selectedMessage.read_at">
              <span class="font-semibold text-gray-700">Read:</span>
              <span class="text-gray-600 ml-2">{{ formatDate(selectedMessage.read_at) }}</span>
            </div>
            <div v-if="selectedMessage.replied_at">
              <span class="font-semibold text-gray-700">Replied:</span>
              <span class="text-gray-600 ml-2">{{ formatDate(selectedMessage.replied_at) }}</span>
            </div>
            <div v-if="selectedMessage.ip_address">
              <span class="font-semibold text-gray-700">IP:</span>
              <span class="text-gray-600 ml-2">{{ selectedMessage.ip_address }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              @click="updateStatus('read')"
              :disabled="selectedMessage.status === 'read'"
              class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mark as Read
            </button>
            <button
              @click="updateStatus('replied')"
              :disabled="selectedMessage.status === 'replied'"
              class="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mark as Replied
            </button>
            <button
              @click="updateStatus('archived')"
              :disabled="selectedMessage.status === 'archived'"
              class="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Archive
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DbContactUs } from '~/server/types/dbTypes'

definePageMeta({
  layout: 'admin'
})

const { success, error: showError, confirm: showConfirm } = useNotification()

// Check authentication
const { data: userData, error: authError } = await useFetch('/api/auth/user')

if (authError.value) {
  await navigateTo('/admin/login')
}

const messages = ref<DbContactUs[]>([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref<'all' | 'new' | 'read' | 'replied' | 'archived'>('all')
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const pageSize = ref(20)
const selectedMessage = ref<DbContactUs | null>(null)

onMounted(() => {
  loadMessages()
})

watch([searchQuery, statusFilter, currentPage], () => {
  loadMessages()
})

async function loadMessages() {
  loading.value = true
  try {
    const response = await $fetch('/api/admin/contact', {
      query: {
        page: currentPage.value,
        limit: pageSize.value,
        search: searchQuery.value || undefined,
        status: statusFilter.value !== 'all' ? statusFilter.value : undefined
      }
    })

    messages.value = (response as any).data || []
    totalPages.value = (response as any).pagination?.totalPages || 1
    totalItems.value = (response as any).pagination?.total || 0
  } catch (error) {
    console.error('Failed to load contact messages:', error)
    showError('Failed to load contact messages', 'Please try again.')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'new':
      return 'bg-blue-100 text-blue-800'
    case 'read':
      return 'bg-yellow-100 text-yellow-800'
    case 'replied':
      return 'bg-green-100 text-green-800'
    case 'archived':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const viewMessage = (message: DbContactUs) => {
  selectedMessage.value = message
  // Auto-mark as read if it's new
  if (message.status === 'new') {
    updateStatus('read', false)
  }
}

const closeModal = () => {
  selectedMessage.value = null
}

const updateStatus = async (status: string, showSuccessMsg: boolean = true) => {
  if (!selectedMessage.value) return

  try {
    await $fetch(`/api/admin/contact/${selectedMessage.value.id}`, {
      method: 'PUT',
      body: { status }
    })

    if (showSuccessMsg) {
      success(`Message marked as ${status}!`)
    }

    // Update local state
    selectedMessage.value.status = status as any
    const messageIndex = messages.value.findIndex(m => m.id === selectedMessage.value!.id)
    if (messageIndex !== -1) {
      messages.value[messageIndex].status = status as any
    }
  } catch (error) {
    console.error('Failed to update status:', error)
    showError('Failed to update status', 'Please try again.')
  }
}

const deleteMessage = async (id: number) => {
  const message = messages.value.find(m => m.id === id)
  const name = message?.name || 'this message'

  await showConfirm({
    title: 'Delete Message',
    message: `Are you sure you want to delete the message from "${name}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
    onConfirm: async () => {
      try {
        await $fetch(`/api/admin/contact/${id}`, {
          method: 'DELETE'
        })

        success('Message deleted successfully!')

        // Close modal if this message is currently selected
        if (selectedMessage.value?.id === id) {
          closeModal()
        }

        await loadMessages()
      } catch (error: any) {
        if (error.statusCode === 404) {
          showError('Message not found', 'The message may have been deleted already')
        } else {
          showError('Failed to delete message', 'Please try again.')
        }
        console.error('Delete message error:', error)
      }
    }
  })
}

// Pagination computed properties
const paginationStart = computed(() => {
  if (totalItems.value === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const paginationEnd = computed(() => {
  const end = currentPage.value * pageSize.value
  return Math.min(end, totalItems.value)
})

const pageNumbers = computed(() => {
  const pages = []
  const maxVisible = 5

  if (totalPages.value <= maxVisible) {
    // Show all pages if total is less than max
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    // Show smart pagination
    if (currentPage.value <= 3) {
      // Near the beginning
      for (let i = 1; i <= Math.min(4, totalPages.value); i++) {
        pages.push(i)
      }
      if (totalPages.value > 4) {
        pages.push('...')
        pages.push(totalPages.value)
      }
    } else if (currentPage.value >= totalPages.value - 2) {
      // Near the end
      pages.push(1)
      pages.push('...')
      for (let i = totalPages.value - 3; i <= totalPages.value; i++) {
        pages.push(i)
      }
    } else {
      // In the middle
      pages.push(1)
      pages.push('...')
      pages.push(currentPage.value - 1)
      pages.push(currentPage.value)
      pages.push(currentPage.value + 1)
      pages.push('...')
      pages.push(totalPages.value)
    }
  }

  return pages
})

// Pagination functions
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}
</script>
