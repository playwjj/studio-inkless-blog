<template>
  <div class="px-8 py-6">
    <!-- Page title -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">New Post</h1>
        <p class="mt-1 text-sm text-gray-500">Create a new blog post</p>
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

    <!-- Error message -->
    <div v-if="errorMessage" class="border border-red-200 bg-red-50 p-3 mb-6">
      <p class="text-sm text-red-600">{{ errorMessage }}</p>
    </div>

    <form @submit.prevent="publish" class="space-y-6">
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
                />
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
                />
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
                <label for="cover_image" class="block text-xs font-medium text-gray-700 mb-1.5">
                  Image URL
                </label>
                <input
                  id="cover_image"
                  v-model="formData.cover_image_url"
                  type="url"
                  class="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                  placeholder="https://example.com/image.jpg"
                />
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
                class="w-full px-3 py-2 border-2 border-dashed border-gray-200 text-sm text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors"
              >
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
                {{ submitting ? 'Publishing...' : 'Publish Post' }}
              </button>
              <button
                type="button"
                :disabled="submitting"
                @click="saveDraft"
                class="w-full px-3 py-2 border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ submitting ? 'Saving...' : 'Save Draft' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const router = useRouter()
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

const handleSubmit = async () => {
  if (submitting.value) return

  try {
    submitting.value = true
    errorMessage.value = ''

    // Validate required fields
    if (!formData.title || !formData.slug || !formData.content) {
      errorMessage.value = 'Please fill in all required fields'
      return
    }

    // Create article
    const response = await $fetch('/api/admin/posts', {
      method: 'POST',
      body: formData
    })

    if (response.success) {
      // Redirect to posts list
      router.push('/admin/posts')
    }
  } catch (error: any) {
    console.error('Failed to create post:', error)
    errorMessage.value = error.data?.statusMessage || 'Failed to create post. Please try again.'
  } finally {
    submitting.value = false
  }
}

const saveDraft = async () => {
  formData.status = 'draft'
  await handleSubmit()
}

const publish = async () => {
  formData.status = 'published'
  if (!formData.published_at) {
    formData.published_at = new Date().toISOString().slice(0, 16)
  }
  await handleSubmit()
}

// Auto-generate slug
watch(() => formData.title, (newTitle) => {
  if (newTitle && !formData.slug) {
    // Simple slug generation logic
    formData.slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '')
  }
})
</script>
