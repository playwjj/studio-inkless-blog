<template>
  <div v-if="aiAvailable" class="border border-purple-200 bg-purple-50 p-5">
    <div class="flex items-center gap-2 mb-4">
      <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <h3 class="text-sm font-semibold text-purple-900">AI Generate</h3>
    </div>

    <div class="space-y-3">
      <div>
        <label class="block text-xs font-medium text-purple-800 mb-1">Topic / Keywords</label>
        <input
          v-model="topic"
          type="text"
          class="w-full px-3 py-2 border border-purple-200 bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
          placeholder="e.g. Cloudflare Workers AI, Vue 3 performance tips..."
          :disabled="generating || generatingImage"
        />
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block text-xs font-medium text-purple-800 mb-1">Category</label>
          <select
            v-model="categoryName"
            class="w-full px-3 py-1.5 text-sm border border-purple-200 bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none"
            :disabled="generating || generatingImage"
          >
            <option value="">Auto</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-purple-800 mb-1">Language</label>
          <select
            v-model="language"
            class="w-full px-3 py-1.5 text-sm border border-purple-200 bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none"
            :disabled="generating || generatingImage"
          >
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
        </div>
      </div>

      <div v-if="errorMessage" class="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2">
        {{ errorMessage }}
      </div>

      <div class="flex gap-2">
        <button
          type="button"
          :disabled="!topic.trim() || generating || generatingImage"
          @click="generateArticle"
          class="flex-1 px-3 py-2 bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg v-if="generating" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ generating ? 'Generating...' : 'Generate Article' }}
        </button>

        <button
          type="button"
          :disabled="!topic.trim() || generating || generatingImage"
          @click="generateImage"
          title="Generate cover image"
          class="px-3 py-2 border border-purple-300 text-purple-700 text-sm hover:bg-purple-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          <svg v-if="generatingImage" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ generatingImage ? 'Generating...' : 'Cover Image' }}
        </button>
      </div>

      <p class="text-xs text-purple-600">
        Generated content will fill the form fields. Review and edit before publishing.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  categories: Array<{ id: number; name: string }>
}>()

const emit = defineEmits<{
  generated: [data: { title: string; excerpt: string; content: string; tags: string; readTime: number }]
  imageGenerated: [url: string]
}>()

const aiAvailable = ref(false)
const topic = ref('')
const categoryName = ref('')
const language = ref('en')
const generating = ref(false)
const generatingImage = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  try {
    const res = await $fetch<{ available: boolean }>('/api/admin/ai/status')
    aiAvailable.value = res.available
  } catch {
    aiAvailable.value = false
  }
})

// Sync categoryName when categories load
watch(() => props.categories, (cats) => {
  if (!categoryName.value && cats.length > 0) {
    categoryName.value = ''
  }
})

async function generateArticle() {
  if (!topic.value.trim() || generating.value) return
  generating.value = true
  errorMessage.value = ''
  try {
    const res = await $fetch<{
      success: boolean
      data: { title: string; excerpt: string; content: string; tags: string; readTime: number }
    }>('/api/admin/ai/generate', {
      method: 'POST',
      body: {
        topic: topic.value,
        categoryName: categoryName.value,
        language: language.value,
      }
    })
    if (res.success) {
      emit('generated', res.data)
    }
  } catch (err: unknown) {
    const e = err as { data?: { statusMessage?: string } }
    errorMessage.value = e.data?.statusMessage || 'Generation failed. Please try again.'
  } finally {
    generating.value = false
  }
}

async function generateImage() {
  if (!topic.value.trim() || generatingImage.value) return
  generatingImage.value = true
  errorMessage.value = ''
  try {
    const res = await $fetch<{ success: boolean; data: { url: string } }>('/api/admin/ai/generate-image', {
      method: 'POST',
      body: { topic: topic.value }
    })
    if (res.success) {
      emit('imageGenerated', res.data.url)
    }
  } catch (err: unknown) {
    const e = err as { data?: { statusMessage?: string } }
    errorMessage.value = e.data?.statusMessage || 'Image generation failed. Please try again.'
  } finally {
    generatingImage.value = false
  }
}
</script>
