<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="close"
  >
    <div class="bg-white border border-gray-200 max-w-5xl w-full max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Select Image from Library</h2>
        <button
          @click="close"
          class="text-gray-400 hover:text-gray-900"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Search and Filter -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex gap-3">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search files..."
            class="flex-1 px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
          />
          <select
            v-model="filterMimeType"
            class="px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
          >
            <option value="">All Images</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/gif">GIF</option>
            <option value="image/webp">WebP</option>
            <option value="image/svg+xml">SVG</option>
          </select>
        </div>
      </div>

      <!-- Files Grid -->
      <div class="flex-1 overflow-y-auto p-4">
        <!-- Loading state -->
        <div v-if="loading" class="py-12 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p class="mt-2 text-sm text-gray-500">Loading images...</p>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredFiles.length === 0" class="py-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No images found</h3>
          <p class="mt-1 text-sm text-gray-500">Try adjusting your search or upload new images.</p>
        </div>

        <!-- Files Grid -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div
            v-for="file in filteredFiles"
            :key="file.id"
            @click="selectFile(file)"
            :class="[
              'relative cursor-pointer group border-2 transition-all',
              selectedFile?.id === file.id
                ? 'border-gray-900 ring-2 ring-gray-900'
                : 'border-gray-200 hover:border-gray-400'
            ]"
          >
            <!-- Image -->
            <div class="aspect-square overflow-hidden bg-gray-50">
              <img
                :src="file.url"
                :alt="file.file_name"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <!-- File info -->
            <div class="p-2 bg-white">
              <p class="text-xs font-medium text-gray-900 truncate" :title="file.file_name">
                {{ file.file_name }}
              </p>
              <p class="text-xs text-gray-500">
                {{ formatFileSize(file.file_size) }}
                <span v-if="file.width && file.height">
                  · {{ file.width }}×{{ file.height }}
                </span>
              </p>
            </div>

            <!-- Selected indicator -->
            <div
              v-if="selectedFile?.id === file.id"
              class="absolute top-2 right-2 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-gray-200 flex justify-end gap-3">
        <button
          @click="close"
          class="px-4 py-2 text-sm border border-gray-200 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          @click="confirmSelection"
          :disabled="!selectedFile"
          class="px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Select Image
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DbFile } from '~/server/types/dbTypes'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  'close': []
  'select': [file: DbFile]
}>()

// State
const files = ref<DbFile[]>([])
const loading = ref(true)
const searchQuery = ref('')
const filterMimeType = ref('')
const selectedFile = ref<DbFile | null>(null)

// Computed
const filteredFiles = computed(() => {
  let result = files.value.filter(file => file.mime_type.startsWith('image/'))

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(file =>
      file.file_name.toLowerCase().includes(query)
    )
  }

  if (filterMimeType.value) {
    result = result.filter(file => file.mime_type === filterMimeType.value)
  }

  return result
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
        limit: 1000
      }
    })
    files.value = response.files || []
  } catch (err: any) {
    console.error('Failed to load files:', err)
  } finally {
    loading.value = false
  }
}

const selectFile = (file: DbFile) => {
  selectedFile.value = file
}

const confirmSelection = () => {
  if (selectedFile.value) {
    emit('select', selectedFile.value)
    close()
  }
}

const close = () => {
  emit('close')
  selectedFile.value = null
}

// Watch for show prop changes
watch(() => props.show, (newShow) => {
  if (newShow) {
    fetchFiles()
    selectedFile.value = null
  }
})
</script>
