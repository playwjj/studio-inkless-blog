<template>
  <div class="px-8 py-6">
    <!-- Page title -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Site Settings</h1>
      <p class="mt-1 text-sm text-gray-500">Configure your website's basic information and SEO settings</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
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
              v-model="formData.site_name"
              type="text"
              required
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="Studio Inkless"
            />
          </div>

          <div class="md:col-span-2">
            <label for="site_title" class="block text-sm font-medium text-gray-700 mb-1.5">
              Site Title
            </label>
            <input
              id="site_title"
              v-model="formData.site_title"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="Studio Inkless - Creative Design and Technology Blog"
            />
          </div>

          <div class="md:col-span-2">
            <label for="site_description" class="block text-sm font-medium text-gray-700 mb-1.5">
              Site Description
            </label>
            <textarea
              id="site_description"
              v-model="formData.site_description"
              rows="3"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none resize-none"
              placeholder="Sharing insights on design, technology, and creativity..."
            ></textarea>
          </div>

          <div>
            <label for="logo_url" class="block text-sm font-medium text-gray-700 mb-1.5">
              Logo URL
            </label>
            <input
              id="logo_url"
              v-model="formData.logo_url"
              type="url"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <label for="favicon_url" class="block text-sm font-medium text-gray-700 mb-1.5">
              Favicon URL
            </label>
            <input
              id="favicon_url"
              v-model="formData.favicon_url"
              type="url"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="https://example.com/favicon.ico"
            />
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
        </div>
      </div>

      <!-- SEO settings -->
      <div class="bg-white border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">SEO Settings</h2>
        <div class="space-y-4">
          <div>
            <label for="meta_title" class="block text-sm font-medium text-gray-700 mb-1.5">
              Default Meta Title
            </label>
            <input
              id="meta_title"
              v-model="formData.meta_title"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="Studio Inkless - Creative Design and Technology Blog"
            />
          </div>

          <div>
            <label for="meta_description" class="block text-sm font-medium text-gray-700 mb-1.5">
              Default Meta Description
            </label>
            <textarea
              id="meta_description"
              v-model="formData.meta_description"
              rows="3"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none resize-none"
              placeholder="Sharing insights on design, technology, and creativity..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Open Graph settings -->
      <div class="bg-white border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Open Graph (Social Media)</h2>
        <div class="space-y-4">
          <div>
            <label for="og_title" class="block text-sm font-medium text-gray-700 mb-1.5">
              OG Title
            </label>
            <input
              id="og_title"
              v-model="formData.og_title"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="Studio Inkless"
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
            ></textarea>
          </div>

          <div>
            <label for="og_image" class="block text-sm font-medium text-gray-700 mb-1.5">
              OG Image
            </label>
            <input
              id="og_image"
              v-model="formData.og_image"
              type="url"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="https://example.com/og-image.jpg"
            />
            <p class="mt-1 text-xs text-gray-500">Recommended size: 1200x630 pixels</p>
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
            <label for="twitter_card" class="block text-sm font-medium text-gray-700 mb-1.5">
              Card Type
            </label>
            <select
              id="twitter_card"
              v-model="formData.twitter_card"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
            >
              <option value="summary">Summary</option>
              <option value="summary_large_image">Summary Large Image</option>
            </select>
          </div>

          <div>
            <label for="twitter_site" class="block text-sm font-medium text-gray-700 mb-1.5">
              Twitter Account
            </label>
            <input
              id="twitter_site"
              v-model="formData.twitter_site"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="@studioinkless"
            />
          </div>

          <div>
            <label for="twitter_title" class="block text-sm font-medium text-gray-700 mb-1.5">
              Twitter Title
            </label>
            <input
              id="twitter_title"
              v-model="formData.twitter_title"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
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
            ></textarea>
          </div>

          <div>
            <label for="twitter_image" class="block text-sm font-medium text-gray-700 mb-1.5">
              Twitter Image
            </label>
            <input
              id="twitter_image"
              v-model="formData.twitter_image"
              type="url"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="https://example.com/twitter-image.jpg"
            />
          </div>
        </div>
      </div>

      <!-- Other settings -->
      <div class="bg-white border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Other Settings</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Enable Comments</h3>
              <p class="text-sm text-gray-500">Allow users to post comments on articles</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="formData.enable_comments"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Show Reading Time</h3>
              <p class="text-sm text-gray-500">Display estimated reading time on article pages</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="formData.show_read_time"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Show Author Info</h3>
              <p class="text-sm text-gray-500">Display author information on article pages</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="formData.show_author"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Save buttons -->
      <div class="flex items-center justify-end space-x-3">
        <button
          type="button"
          class="px-3 py-1.5 border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button
          type="submit"
          class="px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const formData = reactive({
  site_name: 'Studio Inkless',
  site_title: 'Studio Inkless - 创意设计与技术博客',
  site_description: '分享关于设计、技术和创意的见解与思考',
  logo_url: '',
  favicon_url: '',
  keywords: '设计, 技术, 博客, 创意',
  meta_title: 'Studio Inkless - 创意设计与技术博客',
  meta_description: '分享关于设计、技术和创意的见解与思考',
  og_title: 'Studio Inkless',
  og_description: '分享关于设计、技术和创意的见解与思考',
  og_image: '',
  twitter_card: 'summary_large_image',
  twitter_site: '@studioinkless',
  twitter_title: '',
  twitter_description: '',
  twitter_image: '',
  enable_comments: true,
  show_read_time: true,
  show_author: true
})

const handleSubmit = async () => {
  // TODO: Implement save logic
  console.log('Save settings:', formData)
  alert('Settings saved!')
}
</script>
