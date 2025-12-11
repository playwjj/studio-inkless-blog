<template>
  <div class="px-8 py-6">
    <!-- Page title -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Files</h1>
        <p class="mt-1 text-sm text-gray-500">Manage uploaded files and images</p>
      </div>
      <button
        @click="showUploadModal = true"
        class="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Upload Files
      </button>
    </div>

    <!-- Search and filter -->
    <div class="border border-gray-200 p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search files..."
          class="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
        />
        <select
          v-model="filterMimeType"
          class="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
        >
          <option value="">All Types</option>
          <option value="image/">Images Only</option>
        </select>
      </div>
    </div>

    <!-- Files list -->
    <div class="border border-gray-200">
      <!-- Loading state -->
      <div v-if="loading" class="py-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p class="mt-2 text-sm text-gray-500">Loading files...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="files.length === 0" class="py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No files</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by uploading your first file.</p>
        <div class="mt-6">
          <button
            @click="showUploadModal = true"
            class="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Files
          </button>
        </div>
      </div>

      <!-- No results state -->
      <div v-else-if="filteredFiles.length === 0" class="py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No files found</h3>
        <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter.</p>
      </div>

      <!-- Files table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Preview
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                File Name
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dimensions
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
              v-for="file in paginatedFiles"
              :key="file.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-3">
                <div class="w-16 h-16 border border-gray-200 flex items-center justify-center overflow-hidden">
                  <img
                    v-if="file.mime_type.startsWith('image/')"
                    :src="file.url"
                    :alt="file.file_name"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <svg v-else class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="text-sm font-medium text-gray-900">
                  {{ file.file_name }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ file.mime_type }}
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">
                {{ formatFileSize(file.file_size) }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">
                <span v-if="file.width && file.height">
                  {{ file.width }} × {{ file.height }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-500">
                {{ formatDate(file.created_at) }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="copyUrl(file.url)"
                    class="text-gray-400 hover:text-gray-900 transition-colors"
                    title="Copy URL"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <a
                    :href="file.url"
                    target="_blank"
                    class="text-gray-400 hover:text-gray-900 transition-colors"
                    title="Open in new tab"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <button
                    @click="deleteFile(file)"
                    class="text-gray-400 hover:text-red-600 transition-colors"
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
      <div v-if="totalPages > 1" class="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-500">
          Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, filteredFiles.length) }} of {{ filteredFiles.length }} files
        </div>
        <div class="flex space-x-1">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 text-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            v-for="page in pageNumbers"
            :key="page"
            @click="typeof page === 'number' && (currentPage = page)"
            :class="[
              'px-3 py-1 text-sm border border-gray-200',
              currentPage === page ? 'bg-gray-900 text-white' : 'hover:bg-gray-50',
              typeof page !== 'number' && 'cursor-default'
            ]"
            :disabled="typeof page !== 'number'"
          >
            {{ page }}
          </button>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 text-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div
      v-if="showUploadModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeUploadModal"
    >
      <div class="bg-white border border-gray-200 max-w-2xl w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Upload Files</h2>
          <button
            @click="closeUploadModal"
            class="text-gray-400 hover:text-gray-900"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Drag and drop area -->
        <div
          @drop.prevent="handleDrop"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          :class="[
            'border-2 border-dashed p-12 text-center transition-colors',
            isDragging ? 'border-gray-900 bg-gray-50' : 'border-gray-300'
          ]"
        >
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="mt-2 text-sm text-gray-600">
            Drop files here or
            <label class="text-gray-900 font-medium cursor-pointer hover:underline">
              browse
              <input
                ref="fileInput"
                type="file"
                multiple
                accept="image/*"
                class="hidden"
                @change="handleFileSelect"
              />
            </label>
          </p>
          <p class="mt-1 text-xs text-gray-500">
            Images only, up to 10MB each
          </p>
        </div>

        <!-- Upload queue -->
        <div v-if="uploadQueue.length > 0" class="mt-4 space-y-2">
          <div
            v-for="(item, index) in uploadQueue"
            :key="index"
            class="flex items-center justify-between p-2 border border-gray-200 text-sm"
          >
            <div class="flex items-center space-x-2 flex-1">
              <svg v-if="item.status === 'pending'" class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div v-else-if="item.status === 'uploading'" class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              <svg v-else-if="item.status === 'success'" class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else-if="item.status === 'error'" class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span class="truncate">{{ item.file.name }}</span>
              <span class="text-gray-500">({{ formatFileSize(item.file.size) }})</span>
            </div>
            <button
              v-if="item.status === 'pending'"
              @click="removeFromQueue(index)"
              class="text-gray-400 hover:text-red-600"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="closeUploadModal"
            class="px-4 py-2 text-sm border border-gray-200 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="uploadFiles"
            :disabled="uploading || uploadQueue.length === 0"
            class="px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ uploading ? 'Uploading...' : `Upload ${uploadQueue.length} file(s)` }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast notification -->
    <AdminToast />

    <!-- Confirm dialog -->
    <AdminConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import type { DbFile } from '~/server/types/dbTypes'

definePageMeta({
  layout: 'admin'
})

// Authentication check
const { data: userData, error: authError } = await useFetch('/api/auth/user')
if (authError.value) {
  await navigateTo('/admin/login')
}

const { success, error: showError, confirm } = useNotification()
const { formatDate } = useFormatDate()

// State
const files = ref<DbFile[]>([])
const loading = ref(true)
const searchQuery = ref('')
const filterMimeType = ref('')
const currentPage = ref(1)
const pageSize = ref(20)

// Upload state
const showUploadModal = ref(false)
const uploading = ref(false)
const isDragging = ref(false)
const uploadQueue = ref<Array<{ file: File; status: 'pending' | 'uploading' | 'success' | 'error' }>>([])
const fileInput = ref<HTMLInputElement>()

// Computed
const filteredFiles = computed(() => {
  let result = files.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(file =>
      file.file_name.toLowerCase().includes(query)
    )
  }

  if (filterMimeType.value) {
    result = result.filter(file =>
      file.mime_type.startsWith(filterMimeType.value)
    )
  }

  return result
})

const totalPages = computed(() =>
  Math.ceil(filteredFiles.value.length / pageSize.value)
)

const paginatedFiles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredFiles.value.slice(start, start + pageSize.value)
})

const pageNumbers = computed(() => {
  const pages: (number | string)[] = []
  if (totalPages.value <= 5) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    if (currentPage.value <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages.value)
    } else if (currentPage.value >= totalPages.value - 2) {
      pages.push(1, '...', totalPages.value - 3, totalPages.value - 2, totalPages.value - 1, totalPages.value)
    } else {
      pages.push(1, '...', currentPage.value - 1, currentPage.value, currentPage.value + 1, '...', totalPages.value)
    }
  }
  return pages
})

// Methods
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}

const fetchFiles = async () => {
  try {
    loading.value = true
    const response = await $fetch<{ files: DbFile[] }>('/api/admin/files', {
      query: {
        page: 1,
        limit: 1000 // Fetch all files for client-side filtering
      }
    })
    files.value = response.files || []
  } catch (err: any) {
    showError('Failed to load files', err.statusMessage || 'Please try again')
  } finally {
    loading.value = false
  }
}

const copyUrl = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url)
    success('URL copied to clipboard!')
  } catch (err) {
    showError('Failed to copy URL', 'Please try again')
  }
}

const deleteFile = async (file: DbFile) => {
  await confirm({
    title: 'Delete file',
    message: `Are you sure you want to delete "${file.file_name}"? This action cannot be undone.`,
    confirmText: 'Delete',
    variant: 'danger',
    onConfirm: async () => {
      try {
        await $fetch(`/api/admin/files/${file.id}`, { method: 'DELETE' })
        success('File deleted successfully')
        await fetchFiles()
      } catch (err: any) {
        showError('Failed to delete file', err.statusMessage || 'Please try again')
      }
    }
  })
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addFilesToQueue(Array.from(target.files))
    target.value = ''
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files) {
    addFilesToQueue(Array.from(event.dataTransfer.files))
  }
}

const addFilesToQueue = (newFiles: File[]) => {
  for (const file of newFiles) {
    if (file.size > 10 * 1024 * 1024) {
      showError('File too large', `${file.name} exceeds 10MB limit`)
      continue
    }
    if (!file.type.startsWith('image/')) {
      showError('Invalid file type', `${file.name} is not an image`)
      continue
    }
    uploadQueue.value.push({ file, status: 'pending' })
  }
}

const removeFromQueue = (index: number) => {
  uploadQueue.value.splice(index, 1)
}

const uploadFiles = async () => {
  uploading.value = true

  try {
    for (const item of uploadQueue.value) {
      if (item.status !== 'pending') continue

      item.status = 'uploading'

      try {
        const formData = new FormData()
        formData.append('files', item.file)

        await $fetch('/api/admin/files/upload', {
          method: 'POST',
          body: formData
        })

        item.status = 'success'
      } catch (err) {
        item.status = 'error'
        console.error('Upload failed:', err)
      }
    }

    const successCount = uploadQueue.value.filter(item => item.status === 'success').length
    const errorCount = uploadQueue.value.filter(item => item.status === 'error').length

    if (successCount > 0) {
      success(`${successCount} file(s) uploaded successfully`)
      await fetchFiles()
    }

    if (errorCount > 0) {
      showError(`${errorCount} file(s) failed to upload`, 'Please try again')
    }

    // Clear successful uploads
    uploadQueue.value = uploadQueue.value.filter(item => item.status === 'error')

    if (uploadQueue.value.length === 0) {
      closeUploadModal()
    }
  } finally {
    uploading.value = false
  }
}

const closeUploadModal = () => {
  if (!uploading.value) {
    showUploadModal.value = false
    uploadQueue.value = []
  }
}

// Initial fetch
onMounted(() => {
  fetchFiles()
})

// Watch for filter/search changes to reset page
watch([searchQuery, filterMimeType], () => {
  currentPage.value = 1
})
</script>
