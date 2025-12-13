<template>
  <div class="px-8 py-6">
    <!-- Page title -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">New Page</h1>
        <p class="mt-1 text-sm text-gray-500">Create a new custom page</p>
      </div>
      <NuxtLink
        to="/admin/pages"
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
                  Page Title <span class="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  v-model="formData.title"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-base"
                  placeholder="Enter page title"
                  @blur="() => { setTouched('title'); validateField('title', formData) }"
                />
                <p v-if="touched.title && errors.title" class="mt-1 text-xs text-red-600">{{ errors.title }}</p>
              </div>

              <div>
                <label for="slug" class="block text-xs font-medium text-gray-700 mb-1.5">
                  URL Slug <span class="text-red-500">*</span>
                </label>
                <div class="flex gap-2">
                  <input
                    id="slug"
                    v-model="formData.slug"
                    type="text"
                    class="flex-1 px-3 py-1.5 border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none font-mono text-sm"
                    placeholder="url-friendly-slug"
                    @input="onSlugInput"
                    @blur="() => { setTouched('slug'); validateField('slug', formData) }"
                  />
                  <button
                    type="button"
                    @click="generateSlug"
                    class="px-3 py-1.5 border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
                    title="Generate slug from title"
                  >
                    Generate
                  </button>
                </div>
                <p v-if="touched.slug && errors.slug" class="mt-1 text-xs text-red-600">{{ errors.slug }}</p>
                <p class="mt-1 text-xs text-gray-500">URL path for the page, use lowercase letters and hyphens</p>
                <a
                  v-if="formData.slug"
                  :href="`/${formData.slug}`"
                  target="_blank"
                  class="mt-2 inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Preview: {{ formData.slug }}
                </a>
              </div>

              <div>
                <label for="description" class="block text-xs font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  id="description"
                  v-model="formData.description"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none resize-none text-sm"
                  placeholder="Brief description of the page..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Content editor -->
          <div class="border border-gray-200 p-5">
            <label for="content" class="block text-xs font-medium text-gray-700 mb-1.5">
              Page Content
            </label>
            <TiptapEditor
              v-model="formData.content"
              placeholder="Write your page content here..."
            />
            <p class="mt-1.5 text-xs text-gray-500">Rich text editor with formatting support</p>
          </div>

          <!-- SEO Settings -->
          <details class="border border-gray-200">
            <summary class="px-5 py-3 cursor-pointer hover:bg-gray-50 font-medium text-sm text-gray-900">
              SEO Settings
            </summary>
            <div class="p-5 pt-0 space-y-4">
              <div>
                <label for="meta_title" class="block text-xs font-medium text-gray-700 mb-1.5">
                  Meta Title
                </label>
                <input
                  id="meta_title"
                  v-model="formData.meta_title"
                  type="text"
                  class="w-full px-3 py-1.5 border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                  placeholder="SEO optimized title"
                />
              </div>

              <div>
                <label for="meta_description" class="block text-xs font-medium text-gray-700 mb-1.5">
                  Meta Description
                </label>
                <textarea
                  id="meta_description"
                  v-model="formData.meta_description"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none resize-none text-sm"
                  placeholder="SEO description (150-160 characters)"
                ></textarea>
              </div>

              <div>
                <label for="meta_keywords" class="block text-xs font-medium text-gray-700 mb-1.5">
                  Meta Keywords
                </label>
                <input
                  id="meta_keywords"
                  v-model="formData.meta_keywords"
                  type="text"
                  class="w-full px-3 py-1.5 border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              <div>
                <label for="canonical_url" class="block text-xs font-medium text-gray-700 mb-1.5">
                  Canonical URL
                </label>
                <input
                  id="canonical_url"
                  v-model="formData.canonical_url"
                  type="text"
                  class="w-full px-3 py-1.5 border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                  placeholder="https://example.com/canonical-url"
                />
              </div>
            </div>
          </details>

          <!-- Open Graph Settings -->
          <details class="border border-gray-200">
            <summary class="px-5 py-3 cursor-pointer hover:bg-gray-50 font-medium text-sm text-gray-900">
              Open Graph / Social Media
            </summary>
            <div class="p-5 pt-0 space-y-4">
              <div>
                <label for="og_title" class="block text-xs font-medium text-gray-700 mb-1.5">
                  OG Title
                </label>
                <input
                  id="og_title"
                  v-model="formData.og_title"
                  type="text"
                  class="w-full px-3 py-1.5 border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                  placeholder="Title for social media sharing"
                />
              </div>

              <div>
                <label for="og_description" class="block text-xs font-medium text-gray-700 mb-1.5">
                  OG Description
                </label>
                <textarea
                  id="og_description"
                  v-model="formData.og_description"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none resize-none text-sm"
                  placeholder="Description for social media sharing"
                ></textarea>
              </div>

              <div>
                <label for="og_image" class="block text-xs font-medium text-gray-700 mb-1.5">
                  OG Image URL
                </label>
                <input
                  id="og_image"
                  v-model="formData.og_image"
                  type="text"
                  class="w-full px-3 py-1.5 border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                  placeholder="https://example.com/og-image.jpg"
                />
              </div>
            </div>
          </details>
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
                  <option value="archived">Archived</option>
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
            </div>
          </div>

          <!-- Author selection -->
          <div class="border border-gray-200 p-5">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Author</h3>
            <div>
              <label for="author" class="block text-xs font-medium text-gray-700 mb-1.5">
                Author
              </label>
              <select
                id="author"
                v-model="formData.author_id"
                class="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              >
                <option value="">None</option>
                <option v-for="author in authors" :key="author.id" :value="author.id">
                  {{ author.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Cover image -->
          <div class="border border-gray-200 p-5">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Cover Image</h3>
            <AdminImageUploader
              v-model="formData.cover_image"
              label="Image URL"
              input-id="cover_image"
              placeholder="https://example.com/image.jpg"
              alt-text="Cover preview"
              upload-button-text="Upload Image"
            />
          </div>

          <!-- Appearance -->
          <div class="border border-gray-200 p-5">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Appearance</h3>
            <div class="space-y-3">
              <div>
                <label for="template" class="block text-xs font-medium text-gray-700 mb-1.5">
                  Template
                </label>
                <select
                  id="template"
                  v-model="formData.template"
                  class="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                >
                  <option value="default">Default</option>
                  <option value="minimal">Minimal</option>
                  <option value="full-width">Full Width</option>
                  <option value="landing">Landing Page</option>
                </select>
              </div>

              <div>
                <label for="layout" class="block text-xs font-medium text-gray-700 mb-1.5">
                  Layout
                </label>
                <select
                  id="layout"
                  v-model="formData.layout"
                  class="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                >
                  <option value="default">Default</option>
                  <option value="wide">Wide</option>
                  <option value="narrow">Narrow</option>
                  <option value="landing">Landing</option>
                </select>
              </div>

              <div>
                <label for="theme" class="block text-xs font-medium text-gray-700 mb-1.5">
                  Theme
                </label>
                <select
                  id="theme"
                  v-model="formData.theme"
                  class="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Page Options -->
          <div class="border border-gray-200 p-5">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Page Options</h3>
            <div class="space-y-2">
              <label class="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  v-model="formData.show_header"
                  class="mr-2"
                />
                Show Header
              </label>
              <label class="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  v-model="formData.show_footer"
                  class="mr-2"
                />
                Show Footer
              </label>
              <label class="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  v-model="formData.show_breadcrumb"
                  class="mr-2"
                />
                Show Breadcrumb
              </label>
              <label class="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  v-model="formData.enable_comments"
                  class="mr-2"
                />
                Enable Comments
              </label>
              <label class="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  v-model="formData.enable_sharing"
                  class="mr-2"
                />
                Enable Sharing
              </label>
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
                {{ submitting ? 'Publishing...' : 'Publish Page' }}
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

import { createValidation, required, pattern, minLength } from '~/composables/useFormValidation'

const { errors, touched, validateField, validateAll, setTouched } = createValidation<{
  title: string
  slug: string
}>({
  title: [required('Please enter a title'), minLength(3, 'Title is too short')],
  slug: [required('Please enter a slug'), pattern(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers and hyphens')]
})

const router = useRouter()
const submitting = ref(false)
const errorMessage = ref('')
const authors = ref<Array<{ id: number; name: string }>>([])
const isSlugManuallyEdited = ref(false)

// Fetch authors
onMounted(async () => {
  try {
    const authorsResponse = await $fetch('/api/admin/authors')

    if (authorsResponse.success && authorsResponse.data) {
      authors.value = authorsResponse.data
    }
  } catch (error) {
    console.error('Failed to fetch authors:', error)
  }
})

const formData = reactive({
  title: '',
  slug: '',
  description: '',
  author_id: '',
  status: 'draft',
  published_at: '',
  content: '',
  template: 'default',

  // SEO
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  canonical_url: '',

  // Open Graph
  og_title: '',
  og_description: '',
  og_image: '',

  // Appearance
  cover_image: '',
  theme: 'light',
  layout: 'default',

  // Options
  show_header: true,
  show_footer: true,
  show_breadcrumb: false,
  enable_comments: false,
  enable_sharing: true
})

const handleSubmit = async () => {
  if (submitting.value) return

  // mark common fields as touched so errors will show
  setTouched('title')
  setTouched('slug')

  if (!validateAll(formData as any)) {
    errorMessage.value = 'Please correct the highlighted fields.'
    return
  }

  try {
    submitting.value = true
    errorMessage.value = ''

    // Create page
    const response = await $fetch('/api/admin/pages', {
      method: 'POST',
      body: formData
    })

    if ((response as any).success) {
      // Redirect to pages list
      router.push('/admin/pages')
    }
  } catch (error: any) {
    console.error('Failed to create page:', error)
    errorMessage.value = error.data?.statusMessage || 'Failed to create page. Please try again.'
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

// Slug generation function
const generateSlug = () => {
  if (!formData.title) return

  formData.slug = formData.title
    .toLowerCase()
    .trim()
    // Remove special characters, keep only alphanumeric and spaces
    .replace(/[^\w\s-]/g, '')
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '')

  // Reset manual edit flag when using generate button
  isSlugManuallyEdited.value = false
}

// Mark slug as manually edited when user types in it
const onSlugInput = () => {
  isSlugManuallyEdited.value = true
}

// Auto-generate slug when title changes (only if not manually edited)
watch(() => formData.title, (newTitle: string) => {
  if (newTitle && !isSlugManuallyEdited.value) {
    formData.slug = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
})
</script>
