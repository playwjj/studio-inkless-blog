<template>
  <div>
    <!-- Page title -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Edit Post</h1>
        <p class="mt-2 text-gray-600">Modify post content and settings</p>
      </div>
      <NuxtLink
        to="/admin/posts"
        class="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to List
      </NuxtLink>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <svg class="animate-spin h-12 w-12 text-primary-600 mx-auto" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main content area -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Title and Slug -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="space-y-4">
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                  Post Title <span class="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  v-model="formData.title"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-lg"
                  placeholder="Enter post title"
                />
              </div>

              <div>
                <label for="slug" class="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug <span class="text-red-500">*</span>
                </label>
                <input
                  id="slug"
                  v-model="formData.slug"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none font-mono text-sm"
                  placeholder="url-friendly-slug"
                />
                <p class="mt-1 text-sm text-gray-500">URL path for the post, use lowercase letters and hyphens</p>
              </div>
            </div>
          </div>

          <!-- Excerpt -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <label for="excerpt" class="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              v-model="formData.excerpt"
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              placeholder="Brief description of the post..."
            ></textarea>
          </div>

          <!-- Content editor -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
              Post Content <span class="text-red-500">*</span>
            </label>
            <div class="border border-gray-300 rounded-lg overflow-hidden">
              <!-- Editor toolbar -->
              <div class="bg-gray-50 border-b border-gray-300 p-2 flex items-center space-x-1">
                <button type="button" class="p-2 hover:bg-gray-200 rounded" title="Bold">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M12.22 4h-2.44v12h2.44a4.5 4.5 0 100-9 3 3 0 000-3zm0 6a1.5 1.5 0 110 3H9.78v-3h2.44z" />
                  </svg>
                </button>
                <button type="button" class="p-2 hover:bg-gray-200 rounded" title="Italic">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M12.22 5l-1.5 10h-2l1.5-10h2z" />
                  </svg>
                </button>
                <button type="button" class="p-2 hover:bg-gray-200 rounded" title="Link">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" />
                  </svg>
                </button>
              </div>

              <!-- Markdown editor -->
              <textarea
                id="content"
                v-model="formData.content"
                rows="20"
                required
                class="w-full px-4 py-3 outline-none resize-none font-mono text-sm"
                placeholder="Write post content using Markdown..."
              ></textarea>
            </div>
            <p class="mt-2 text-sm text-gray-500">Supports Markdown format</p>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Publish settings -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Publish Settings</h3>
            <div class="space-y-4">
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  v-model="formData.status"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label for="published_at" class="block text-sm font-medium text-gray-700 mb-2">
                  Publish Date
                </label>
                <input
                  id="published_at"
                  v-model="formData.published_at"
                  type="datetime-local"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label for="read_time" class="block text-sm font-medium text-gray-700 mb-2">
                  Reading Time (minutes)
                </label>
                <input
                  id="read_time"
                  v-model="formData.read_time"
                  type="number"
                  min="1"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          <!-- Categories and tags -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Categories and Tags</h3>
            <div class="space-y-4">
              <div>
                <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  v-model="formData.category_id"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="">Select category</option>
                  <option value="1">Technology</option>
                  <option value="2">Design</option>
                  <option value="3">Life</option>
                </select>
              </div>

              <div>
                <label for="tags" class="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  id="tags"
                  v-model="formData.tags"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="Enter tags separated by commas"
                />
                <p class="mt-1 text-sm text-gray-500">Example: Vue, Nuxt, TypeScript</p>
              </div>
            </div>
          </div>

          <!-- Cover image -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Cover Image</h3>
            <div class="space-y-4">
              <div>
                <label for="cover_image" class="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  id="cover_image"
                  v-model="formData.cover_image_url"
                  type="url"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div
                v-if="formData.cover_image_url"
                class="relative aspect-video rounded-lg overflow-hidden bg-gray-100"
              >
                <img
                  :src="formData.cover_image_url"
                  alt="Cover preview"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="space-y-3">
              <button
                type="submit"
                class="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Update Post
              </button>
              <button
                type="button"
                class="w-full px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors"
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

const route = useRoute()
const postId = route.params.id

const loading = ref(true)

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
  // TODO: Load post data from API
  await new Promise(resolve => setTimeout(resolve, 500))

  // Mock loaded data
  Object.assign(formData, {
    title: 'How to Build a Modern Blog System with Nuxt 3',
    slug: 'nuxt3-blog-system',
    excerpt: 'This article will introduce how to build a full-featured blog system from scratch using the Nuxt 3 framework...',
    content: '# How to Build a Modern Blog System with Nuxt 3\n\nThis article will introduce how to build a full-featured blog system from scratch using the Nuxt 3 framework.',
    status: 'published',
    published_at: '2024-01-15T10:00',
    read_time: 8,
    category_id: '1',
    tags: 'Vue, Nuxt, TypeScript',
    cover_image_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'
  })

  loading.value = false
})

const handleSubmit = async () => {
  // TODO: Implement update logic
  console.log('Update post:', postId, formData)
}
</script>
