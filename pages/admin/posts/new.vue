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
            <div class="border border-gray-200">
              <!-- Editor toolbar -->
              <div class="bg-gray-50 border-b border-gray-200 p-1.5 flex items-center space-x-1">
                <button type="button" class="p-1.5 hover:bg-gray-200" title="Bold">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M12.22 4h-2.44v12h2.44a4.5 4.5 0 100-9 3 3 0 000-3zm0 6a1.5 1.5 0 110 3H9.78v-3h2.44z" />
                  </svg>
                </button>
                <button type="button" class="p-1.5 hover:bg-gray-200" title="Italic">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M12.22 5l-1.5 10h-2l1.5-10h2z" />
                  </svg>
                </button>
                <button type="button" class="p-1.5 hover:bg-gray-200" title="Link">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" />
                  </svg>
                </button>
                <div class="w-px h-5 bg-gray-300"></div>
                <button type="button" class="p-1.5 hover:bg-gray-200 text-xs font-medium" title="Heading">H</button>
                <button type="button" class="p-1.5 hover:bg-gray-200" title="List">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                  </svg>
                </button>
                <button type="button" class="p-1.5 hover:bg-gray-200" title="Code">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" />
                  </svg>
                </button>
              </div>

              <!-- Markdown editor -->
              <textarea
                id="content"
                v-model="formData.content"
                rows="20"
                required
                class="w-full px-3 py-2 outline-none resize-none font-mono text-sm"
                placeholder="Write post content using Markdown..."
              ></textarea>
            </div>
            <p class="mt-1.5 text-xs text-gray-500">Supports Markdown format</p>
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

              <div>
                <label for="tags" class="block text-xs font-medium text-gray-700 mb-1.5">
                  Tags
                </label>
                <input
                  id="tags"
                  v-model="formData.tags"
                  type="text"
                  class="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                  placeholder="Enter tags separated by commas"
                />
                <p class="mt-1 text-xs text-gray-500">Example: Vue, Nuxt, TypeScript</p>
              </div>
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
                class="w-full px-3 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
              >
                Publish Post
              </button>
              <button
                type="button"
                class="w-full px-3 py-2 border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors"
              >
                Save Draft
              </button>
              <button
                type="button"
                class="w-full px-3 py-2 text-gray-600 text-sm hover:text-gray-900 transition-colors"
              >
                Preview
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
  // TODO: Implement submit logic
  console.log('Submit form:', formData)
}

// Auto-generate slug
watch(() => formData.title, (newTitle) => {
  if (newTitle && !formData.slug) {
    // Simple slug generation logic
    formData.slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }
})
</script>
