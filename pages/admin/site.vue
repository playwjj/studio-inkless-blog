<template>
  <div class="px-8 py-6">
    <!-- Page title -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Site Settings</h1>
      <p class="mt-1 text-sm text-gray-500">Configure your website's basic information and SEO settings</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="py-12 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <p class="mt-2 text-sm text-gray-500">Loading settings...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic information -->
      <div class="bg-white border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label for="site_name" class="block text-sm font-medium text-gray-700 mb-1.5">
              Site Name <span class="text-red-500">*</span>
            </label>
            <input
              id="site_name"
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="Studio Inkless"
              @blur="() => { setTouched('name'); validateField('name', formData) }"
            />
            <p v-if="touched.name && errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
          </div>

          <div class="md:col-span-2">
            <label for="site_title" class="block text-sm font-medium text-gray-700 mb-1.5">
              Site Title <span class="text-red-500">*</span>
            </label>
            <input
              id="site_title"
              v-model="formData.title"
              type="text"
              required
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="Studio Inkless - Creative Design and Technology Blog"
              @blur="() => { setTouched('title'); validateField('title', formData) }"
            />
            <p v-if="touched.title && errors.title" class="mt-1 text-xs text-red-600">{{ errors.title }}</p>
          </div>

          <div class="md:col-span-2">
            <label for="site_description" class="block text-sm font-medium text-gray-700 mb-1.5">
              Site Description <span class="text-red-500">*</span>
            </label>
            <textarea
              id="site_description"
              v-model="formData.description"
              rows="3"
              required
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none resize-none"
              placeholder="Sharing insights on design, technology, and creativity..."
              @blur="() => { setTouched('description'); validateField('description', formData) }"
            ></textarea>
            <p v-if="touched.description && errors.description" class="mt-1 text-xs text-red-600">{{ errors.description }}</p>
          </div>

          <div>
            <label for="logo_url" class="block text-sm font-medium text-gray-700 mb-1.5">
              Logo URL
            </label>
            <input
              id="logo_url"
              v-model="formData.logo_url"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="/images/logo.png or https://example.com/logo.png"
            />
            <p class="mt-1 text-xs text-gray-500">Supports both relative (/images/logo.png) and absolute URLs</p>
          </div>

          <div>
            <label for="favicon_url" class="block text-sm font-medium text-gray-700 mb-1.5">
              Favicon URL
            </label>
            <input
              id="favicon_url"
              v-model="formData.favicon_url"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="/favicon.ico or https://example.com/favicon.ico"
            />
            <p class="mt-1 text-xs text-gray-500">Supports both relative and absolute URLs</p>
          </div>

          <div class="md:col-span-2">
            <label for="keywords" class="block text-sm font-medium text-gray-700 mb-1.5">
              Keywords
            </label>
            <input
              id="keywords"
              v-model="formData.keywords"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="design, technology, blog, creativity"
            />
            <p class="mt-1 text-xs text-gray-500">Separate multiple keywords with commas</p>
          </div>

          <div class="md:col-span-2">
            <label for="copyright_text" class="block text-sm font-medium text-gray-700 mb-1.5">
              Copyright Text
            </label>
            <input
              id="copyright_text"
              v-model="formData.copyright_text"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="© 2024 Studio Inkless. All rights reserved."
            />
          </div>
        </div>
      </div>

      <!-- Open Graph settings -->
      <div class="bg-white border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Open Graph (Social Media)</h2>
        <div class="space-y-4">
          <div>
            <label for="og_site_name" class="block text-sm font-medium text-gray-700 mb-1.5">
              OG Site Name
            </label>
            <input
              id="og_site_name"
              v-model="formData.og_site_name"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="Studio Inkless"
            />
          </div>

          <div>
            <label for="og_title" class="block text-sm font-medium text-gray-700 mb-1.5">
              OG Title
            </label>
            <input
              id="og_title"
              v-model="formData.og_title"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="Studio Inkless - Creative Blog"
            />
          </div>

          <div>
            <label for="og_description" class="block text-sm font-medium text-gray-700 mb-1.5">
              OG Description
            </label>
            <textarea
              id="og_description"
              v-model="formData.og_description"
              rows="3"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none resize-none"
              placeholder="Sharing insights on design, technology, and creativity..."
            ></textarea>
          </div>

          <div>
            <label for="og_url" class="block text-sm font-medium text-gray-700 mb-1.5">
              OG URL
            </label>
            <input
              id="og_url"
              v-model="formData.og_url"
              type="url"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="https://studioinkless.com"
            />
            <p class="mt-1 text-xs text-gray-500">The canonical URL of your site</p>
          </div>

          <div>
            <label for="og_image" class="block text-sm font-medium text-gray-700 mb-1.5">
              OG Image
            </label>
            <input
              id="og_image"
              v-model="formData.og_image"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="/images/og-image.jpg or https://example.com/og-image.jpg"
            />
            <p class="mt-1 text-xs text-gray-500">Recommended size: 1200x630 pixels. Supports relative and absolute URLs</p>
            <div
              v-if="formData.og_image"
              class="mt-4 relative aspect-[1200/630] max-w-md rounded-lg overflow-hidden bg-gray-100"
            >
              <img
                :src="formData.og_image"
                alt="OG image preview"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Twitter Card settings -->
      <div class="bg-white border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Twitter Card</h2>
        <div class="space-y-4">
          <div>
            <label for="twitter_title" class="block text-sm font-medium text-gray-700 mb-1.5">
              Twitter Title
            </label>
            <input
              id="twitter_title"
              v-model="formData.twitter_title"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="Studio Inkless - Creative Blog"
            />
          </div>

          <div>
            <label for="twitter_description" class="block text-sm font-medium text-gray-700 mb-1.5">
              Twitter Description
            </label>
            <textarea
              id="twitter_description"
              v-model="formData.twitter_description"
              rows="3"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none resize-none"
              placeholder="Sharing insights on design, technology, and creativity..."
            ></textarea>
          </div>

          <div>
            <label for="twitter_image" class="block text-sm font-medium text-gray-700 mb-1.5">
              Twitter Image
            </label>
            <input
              id="twitter_image"
              v-model="formData.twitter_image"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="/images/twitter-image.jpg or https://example.com/twitter-image.jpg"
            />
            <p class="mt-1 text-xs text-gray-500">Recommended size: 1200x600 pixels. Supports relative and absolute URLs</p>
          </div>
        </div>
      </div>

      <!-- Save buttons -->
      <div class="flex items-center justify-end space-x-3">
        <button
          type="button"
          @click="handleReset"
          :disabled="submitting"
          class="px-3 py-1.5 border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
        <button
          type="submit"
          :disabled="submitting"
          class="px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!submitting">Save Settings</span>
          <span v-else>Saving...</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

import { createValidation, required } from '~/composables/useFormValidation'

const { errors, touched, validateField, validateAll, setTouched } = createValidation<{
  name: string
  title: string
  description: string
}>({
  name: [required('Please enter site name')],
  title: [required('Please enter site title')],
  description: [required('Please enter site description')]
})

// Check authentication
const { data: userData, error: authError } = await useFetch('/api/auth/user')

if (authError.value) {
  // Redirect to login if not authenticated
  await navigateTo('/admin/login')
}

const { error: showError, success: showSuccess } = useNotification()

interface SiteSettings {
  id?: number
  name: string
  title: string
  description: string
  logo_url?: string
  favicon_url?: string
  keywords?: string
  copyright_text?: string
  og_site_name: string
  og_title: string
  og_description: string
  og_image: string
  og_url: string
  twitter_title: string
  twitter_description: string
  twitter_image: string
}

const loading = ref(false)
const submitting = ref(false)

// Store original data for reset functionality
let originalData: SiteSettings | null = null

const formData = reactive<SiteSettings>({
  name: '',
  title: '',
  description: '',
  logo_url: '',
  favicon_url: '',
  keywords: '',
  copyright_text: '',
  og_site_name: '',
  og_title: '',
  og_description: '',
  og_image: '',
  og_url: '',
  twitter_title: '',
  twitter_description: '',
  twitter_image: ''
})

// Load site settings on mount
onMounted(() => {
  loadSettings()
})

async function loadSettings() {
  loading.value = true
  try {
    const response = await $fetch('/api/admin/site')

    if (response.site) {
      // Populate form with existing settings
      Object.assign(formData, response.site)
      // Store original data for reset
      originalData = { ...response.site }
    }
  } catch (error) {
    console.error('Failed to load site settings:', error)
    showError('Failed to load site settings. Please try again.')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (submitting.value) return

  // mark required fields touched and validate
  setTouched('name')
  setTouched('title')
  setTouched('description')
  if (!validateAll(formData as any)) {
    showError('Please correct the highlighted fields')
    return
  }

  submitting.value = true

  try {
    await $fetch('/api/admin/site', {
      method: 'PUT',
      body: {
        name: formData.name,
        title: formData.title,
        description: formData.description,
        logo_url: formData.logo_url,
        favicon_url: formData.favicon_url,
        keywords: formData.keywords,
        copyright_text: formData.copyright_text,
        og_site_name: formData.og_site_name,
        og_title: formData.og_title,
        og_description: formData.og_description,
        og_image: formData.og_image,
        og_url: formData.og_url,
        twitter_title: formData.twitter_title,
        twitter_description: formData.twitter_description,
        twitter_image: formData.twitter_image
      }
    })

    showSuccess('Site settings saved successfully!')

    // Reload settings to get updated data
    await loadSettings()
  } catch (error: any) {
    if (error.statusCode === 400) {
      showError(error.statusMessage || 'Please fill in all required fields')
    } else {
      showError('Failed to save settings. Please try again.')
    }
    console.error('Save settings error:', error)
  } finally {
    submitting.value = false
  }
}

const handleReset = () => {
  if (originalData) {
    Object.assign(formData, originalData)
  }
}
</script>
