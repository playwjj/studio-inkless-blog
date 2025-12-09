<template>
  <div class="px-8 py-6">
    <!-- Page title -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Edit Post</h1>
        <p class="mt-1 text-sm text-gray-500">Modify post content and settings</p>
      </div>
      <NuxtLink
        to="/admin/posts"
        class="inline-flex items-center px-3 py-1.5 border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to List
      </NuxtLink>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <svg class="animate-spin h-12 w-12 text-gray-900 mx-auto" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>

    <div v-else>
      <!-- Error message -->
      <div v-if="errorMessage" class="border border-red-200 bg-red-50 p-3 mb-6">
        <p class="text-sm text-red-600">{{ errorMessage }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main content area -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Title and Slug -->
          <div class="border border-gray-200 p-5">
            <div class="space-y-4">
              <div>
                <label for="title" class="block text-xs font-medium text-gray-700 mb-1.5">
                  Post Title <span class="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  v-model="formData.title"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-base"
                  placeholder="Enter post title"
                  @blur="() => { setTouched('title'); validateField('title', formData) }"
                />
                <p v-if="touched.title && errors.title" class="mt-1 text-xs text-red-600">{{ errors.title }}</p>
              </div>

              <div>
                <label for="slug" class="block text-xs font-medium text-gray-700 mb-1.5">
                  URL Slug <span class="text-red-500">*</span>
                </label>
                <input
                  id="slug"
                  v-model="formData.slug"
                  type="text"
                  required
                  class="w-full px-3 py-1.5 border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none font-mono text-sm"
                  placeholder="url-friendly-slug"
                  @blur="() => { setTouched('slug'); validateField('slug', formData) }"
                />
                <p v-if="touched.slug && errors.slug" class="mt-1 text-xs text-red-600">{{ errors.slug }}</p>
                <p class="mt-1 text-xs text-gray-500">URL path for the post, use lowercase letters and hyphens</p>
              </div>
            </div>
          </div>

          <!-- Excerpt -->
          <div class="border border-gray-200 p-5">
            <label for="excerpt" class="block text-xs font-medium text-gray-700 mb-1.5">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              v-model="formData.excerpt"
              rows="3"
              class="w-full px-3 py-2 border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none resize-none text-sm"
              placeholder="Brief description of the post..."
            ></textarea>
          </div>

          <!-- Content editor -->
          <div class="border border-gray-200 p-5">
            <label for="content" class="block text-xs font-medium text-gray-700 mb-1.5">
              Post Content <span class="text-red-500">*</span>
            </label>
            <TiptapEditor
              v-model="formData.content"
              placeholder="Write your post content here..."
            />
             <p v-if="touched.content && errors.content" class="mt-1 text-xs text-red-600">{{ errors.content }}</p>
             <p class="mt-1.5 text-xs text-gray-500">Rich text editor with formatting support</p>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Publish settings -->
          <div class="border border-gray-200 p-5">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Publish Settings</h3>
            <div class="space-y-3">
              <div>
                <label for="status" class="block text-xs font-medium text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  id="status"
                  v-model="formData.status"
                  class="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label for="published_at" class="block text-xs font-medium text-gray-700 mb-1.5">
                  Publish Date
                </label>
                <input
                  id="published_at"
                  v-model="formData.published_at"
                  type="datetime-local"
                  class="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                />
              </div>

              <div>
                <label for="read_time" class="block text-xs font-medium text-gray-700 mb-1.5">
                  Reading Time (minutes)
                </label>
                <input
                  id="read_time"
                  v-model="formData.read_time"
                  type="number"
                  min="1"
                  class="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                />
              </div>
            </div>
          </div>

          <!-- Categories and tags -->
          <div class="border border-gray-200 p-5">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Categories and Tags</h3>
            <div class="space-y-3">
              <div>
                <label for="category" class="block text-xs font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <select
                  id="category"
                  v-model="formData.category_id"
                  class="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                >
                  <option value="">Select category</option>
                  <option value="1">Technology</option>
                  <option value="2">Design</option>
                  <option value="3">Life</option>
                </select>
              </div>

              <TagInput
                v-model="formData.tags"
                label="Tags"
                input-id="tags"
                placeholder="Type and press Enter or comma to add tags"
                help-text="Example: Vue, Nuxt, TypeScript"
              />
            </div>
          </div>

          <!-- Cover image -->
          <div class="border border-gray-200 p-5">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Cover Image</h3>
            <div class="space-y-3">
              <div>
                <label for="cover_image_url" class="block text-xs font-medium text-gray-700 mb-1.5">
                  Image URL
                </label>
                <input
                  id="cover_image_url"
                  v-model="formData.cover_image_url"
                  type="url"
                  class="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                  placeholder="https://example.com/image.jpg"
                  @blur="() => { setTouched('cover_image_url'); validateField('cover_image_url', formData) }"
                />
                 <p v-if="touched.cover_image_url && errors.cover_image_url" class="mt-1 text-xs text-red-600">{{ errors.cover_image_url }}</p>
              </div>

              <div
                v-if="formData.cover_image_url"
                class="relative aspect-video overflow-hidden bg-gray-100"
              >
                <img
                  :src="formData.cover_image_url"
                  alt="Cover preview"
                  class="w-full h-full object-cover"
                />
              </div>

              <button
                type="button"
                     class="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                     @blur="() => { setTouched('read_time'); validateField('read_time', formData) }"
              >
                   <p v-if="touched.read_time && errors.read_time" class="mt-1 text-xs text-red-600">{{ errors.read_time }}</p>
                <svg class="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Image
              </button>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="border border-gray-200 p-5">
            <div class="space-y-2">
              <button
                type="submit"
                :disabled="submitting"
                class="w-full px-3 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ submitting ? 'Updating...' : 'Update Post' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

import { createValidation, required, pattern, isUrl, minNumber, minLength } from '~/composables/useFormValidation'

const { errors, touched, validateField, validateAll, setTouched } = createValidation<{
  title: string
  slug: string
  content: string
  cover_image_url: string
  read_time: number
}>({
  title: [required('Please enter a title'), minLength(3, 'Title is too short')],
  slug: [required('Please enter a slug'), pattern(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers and hyphens')],
  content: [required('Please add post content')],
  cover_image_url: [isUrl('Cover image must be a valid URL')],
  read_time: [minNumber(1, 'Reading time must be at least 1 minute')]
})

const route = useRoute()
const router = useRouter()
const postId = route.params.id

const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref('')

const formData = reactive({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  status: 'draft',
  published_at: '',
  read_time: 5,
  category_id: '',
  tags: '',
  cover_image_url: ''
})

// Load post data
onMounted(async () => {
  try {
    loading.value = true
    errorMessage.value = ''

    const response = await $fetch(`/api/admin/posts/${postId}`)

    if (response.success && response.data) {
      const data = response.data
      Object.assign(formData, {
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        status: data.status || 'draft',
        published_at: data.published_at ? new Date(data.published_at).toISOString().slice(0, 16) : '',
        read_time: data.read_time || 5,
        category_id: data.category_id?.toString() || '',
        tags: data.tags || '',
        cover_image_url: (data as any).cover_image_url || (data as any).cover_image || ''
      })
    }
  } catch (error: any) {
    console.error('Failed to load post:', error)
    errorMessage.value = error.data?.statusMessage || 'Failed to load post data'
  } finally {
    loading.value = false
  }
})

const handleSubmit = async () => {
  if (submitting.value) return

  // mark fields as touched and validate
  setTouched('title')
  setTouched('slug')
  setTouched('content')
  setTouched('cover_image_url')
  setTouched('read_time')
  if (!validateAll(formData as any)) {
    errorMessage.value = 'Please correct the highlighted fields.'
    return
  }

  try {
    submitting.value = true
    errorMessage.value = ''

    // Update article
    const response = await $fetch(`/api/admin/posts/${postId}`, {
      method: 'PUT',
      body: formData
    })

    if ((response as any).success) {
      // Redirect to posts list
      router.push('/admin/posts')
    }
  } catch (error: any) {
    console.error('Failed to update post:', error)
    errorMessage.value = error.data?.statusMessage || 'Failed to update post. Please try again.'
  } finally {
    submitting.value = false
  }
}

// validate content as it changes so editor errors clear
watch(() => formData.content, () => {
  validateField('content', formData as any)
})
</script>
