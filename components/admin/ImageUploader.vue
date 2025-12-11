<template>
  <div class="space-y-3">
    <!-- Image URL input -->
    <div>
      <label :for="inputId" class="block text-xs font-medium text-gray-700 mb-1.5">
        {{ label }}
      </label>
      <input
        :id="inputId"
        v-model="imageUrl"
        type="url"
        class="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
        :placeholder="placeholder"
      />
    </div>

    <!-- Image preview -->
    <div
      v-if="modelValue"
      class="relative aspect-video overflow-hidden bg-gray-100"
    >
      <img
        :src="modelValue"
        :alt="altText"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
      <button
        type="button"
        class="absolute top-2 right-2 p-1.5 bg-red-600 text-white hover:bg-red-700 transition-colors"
        @click="handleRemove"
        title="Remove image"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Upload button with drag and drop -->
    <div
      class="relative"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileSelect"
      />
      <button
        type="button"
        :disabled="uploading"
        :class="[
          'w-full px-3 py-2 border-2 border-dashed text-sm transition-colors',
          isDragging
            ? 'border-gray-900 bg-gray-50'
            : 'border-gray-200 hover:border-gray-300',
          uploading
            ? 'opacity-50 cursor-not-allowed'
            : 'text-gray-600 hover:text-gray-900'
        ]"
        @click="triggerFileInput"
      >
        <svg v-if="!uploading" class="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <div v-if="uploading" class="flex items-center justify-center">
          <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Uploading...</span>
        </div>
        <span v-else>{{ uploadButtonText }}</span>
      </button>
    </div>

    <!-- Error message -->
    <p v-if="uploadError" class="text-xs text-red-600">{{ uploadError }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  label?: string
  inputId?: string
  placeholder?: string
  altText?: string
  uploadButtonText?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadError = ref('')
const isDragging = ref(false)

// Use computed for two-way binding
const imageUrl = computed({
  get: () => props.modelValue,
  set: (value: string) => {
    console.log('Setting image URL:', value)
    emit('update:modelValue', value)
  }
})

const handleUrlInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  imageUrl.value = target.value
}

const handleRemove = () => {
  imageUrl.value = ''
}

const handleImageError = () => {
  uploadError.value = 'Failed to load image'
}

const triggerFileInput = () => {
  if (uploading.value) return
  fileInputRef.value?.click()
}

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
  if (file && file.type.startsWith('image/')) {
    await uploadFile(file)
  } else {
    uploadError.value = 'Please drop an image file'
  }
}

const uploadFile = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    uploadError.value = 'Please select an image file'
    return
  }

  try {
    uploading.value = true
    uploadError.value = ''

    const formData = new FormData()
    formData.append('file', file)

    const response = await $fetch<any>('/api/admin/files/upload', {
      method: 'POST',
      body: formData
    })

    console.log('Upload response:', response)

    if (response?.success && response?.files && response.files.length > 0) {
      const uploadedFile = response.files[0]
      console.log('Uploaded file:', uploadedFile)
      console.log('Setting URL:', uploadedFile.url)
      imageUrl.value = uploadedFile.url
    } else {
      console.error('Invalid response:', response)
      uploadError.value = 'Upload failed. Please try again.'
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    uploadError.value = error.data?.statusMessage || 'Failed to upload image'
  } finally {
    uploading.value = false
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}
</script>
