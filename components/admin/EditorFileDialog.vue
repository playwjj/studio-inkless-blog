<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="close"
  >
    <div class="bg-white border border-gray-200 max-w-lg w-full">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Insert File Link</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-900">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-4 space-y-4">
        <!-- Link Text -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Link Text <span class="text-red-500">*</span>
          </label>
          <input
            v-model="linkText"
            type="text"
            placeholder="Download PDF"
            class="w-full px-3 py-2 border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
          />
        </div>

        <!-- File URL -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            File URL
          </label>
          <input
            v-model="fileUrl"
            type="url"
            placeholder="https://example.com/document.pdf"
            class="w-full px-3 py-2 border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
            @keydown.enter="insertFile"
          />
        </div>

        <!-- Divider -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <!-- Upload Section -->
        <div>
          <div
            @drop.prevent="handleDrop"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            :class="[
              'border-2 border-dashed p-8 text-center transition-colors',
              isDragging ? 'border-gray-900 bg-gray-50' : 'border-gray-300'
            ]"
          >
            <svg class="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p class="mt-2 text-sm text-gray-600">
              Drop file or
              <label class="text-gray-900 font-medium cursor-pointer hover:underline">
                browse
                <input
                  ref="fileInput"
                  type="file"
                  class="hidden"
                  @change="handleFileSelect"
                />
              </label>
            </p>
            <p class="mt-1 text-xs text-gray-500">Up to 10MB</p>
          </div>

          <!-- Upload Progress -->
          <div v-if="uploading" class="mt-3 flex items-center justify-center py-2">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
            <span class="ml-2 text-sm text-gray-600">Uploading...</span>
          </div>

          <!-- Upload Error -->
          <p v-if="uploadError" class="mt-2 text-xs text-red-600">{{ uploadError }}</p>
        </div>

        <!-- Select from Library Button -->
        <button
          type="button"
          @click="openFilePicker"
          class="w-full px-4 py-2 border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors flex items-center justify-center"
        >
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          Select from Library
        </button>
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
          @click="insertFile"
          :disabled="!linkText || !fileUrl || uploading"
          class="px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Insert
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  'close': []
  'insert': [text: string, url: string]
  'open-file-picker': []
}>()

// State
const linkText = ref('')
const fileUrl = ref('')
const uploading = ref(false)
const uploadError = ref('')
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement>()

// Methods
const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    await uploadFile(file)
  }
}

const handleDrop = async (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) {
    await uploadFile(file)
  } else {
    uploadError.value = 'Please drop a file'
  }
}

const uploadFile = async (file: File) => {
  if (file.size > 10 * 1024 * 1024) {
    uploadError.value = 'File size exceeds 10MB limit'
    return
  }

  try {
    uploading.value = true
    uploadError.value = ''

    const formData = new FormData()
    formData.append('files', file)

    const response = await $fetch<any>('/api/admin/files/upload', {
      method: 'POST',
      body: formData
    })

    if (response?.success && response?.files && response.files.length > 0) {
      const uploadedFile = response.files[0]
      fileUrl.value = uploadedFile.url
      if (!linkText.value) {
        linkText.value = uploadedFile.file_name
      }
    } else {
      uploadError.value = 'Upload failed. Please try again.'
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    uploadError.value = error.data?.statusMessage || 'Failed to upload file'
  } finally {
    uploading.value = false
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const openFilePicker = () => {
  emit('open-file-picker')
}

const insertFile = () => {
  if (linkText.value && fileUrl.value && !uploading.value) {
    emit('insert', linkText.value, fileUrl.value)
    close()
  }
}

const close = () => {
  emit('close')
  // Reset state
  linkText.value = ''
  fileUrl.value = ''
  uploadError.value = ''
}

// Set file info from external source
const setFileInfo = (fileName: string, url: string) => {
  linkText.value = fileName
  fileUrl.value = url
}

// Expose method for parent component
defineExpose({
  setFileInfo
})
</script>
