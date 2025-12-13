<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-gray-900">Page Blocks</h3>
      <button
        type="button"
        @click="addBlock"
        class="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-xs hover:bg-gray-800 transition-colors"
      >
        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Block
      </button>
    </div>

    <!-- Blocks list -->
    <div v-if="blocks.length === 0" class="border border-gray-200 border-dashed p-8 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="mt-2 text-sm text-gray-500">No blocks yet. Add your first block to get started.</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="(block, index) in blocks"
        :key="block.id || `temp-${index}`"
        class="border border-gray-200 p-4"
        :class="{ 'opacity-50': !block.is_visible }"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            <!-- Move up/down buttons -->
            <div class="flex flex-col gap-1">
              <button
                type="button"
                @click="moveBlock(index, 'up')"
                :disabled="index === 0"
                class="text-gray-400 hover:text-gray-900 disabled:opacity-25 disabled:cursor-not-allowed"
                title="Move up"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                type="button"
                @click="moveBlock(index, 'down')"
                :disabled="index === blocks.length - 1"
                class="text-gray-400 hover:text-gray-900 disabled:opacity-25 disabled:cursor-not-allowed"
                title="Move down"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <span class="text-xs font-medium text-gray-500">
              Block {{ index + 1 }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <!-- Visibility toggle -->
            <button
              type="button"
              @click="toggleVisibility(index)"
              class="text-gray-400 hover:text-gray-900"
              :title="block.is_visible ? 'Hide block' : 'Show block'"
            >
              <svg v-if="block.is_visible" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>

            <!-- Delete button -->
            <button
              type="button"
              @click="removeBlock(index)"
              class="text-gray-400 hover:text-red-600"
              title="Delete block"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <!-- Block Type -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Block Type <span class="text-red-500">*</span>
            </label>
            <select
              v-model="block.block_type"
              class="w-full px-2 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
            >
              <option value="hero">Hero</option>
              <option value="features">Features</option>
              <option value="testimonials">Testimonials</option>
              <option value="cta">Call to Action</option>
              <option value="gallery">Gallery</option>
              <option value="text">Text</option>
              <option value="video">Video</option>
              <option value="stats">Stats</option>
              <option value="faq">FAQ</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <!-- Title -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              v-model="block.title"
              type="text"
              class="w-full px-2 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="Block title"
            />
          </div>

          <!-- Subtitle -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Subtitle
            </label>
            <input
              v-model="block.subtitle"
              type="text"
              class="w-full px-2 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="Block subtitle"
            />
          </div>

          <!-- Background Color -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <input
              v-model="block.background_color"
              type="text"
              class="w-full px-2 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="#ffffff"
            />
          </div>
        </div>

        <!-- Content -->
        <div class="mt-3">
          <label class="block text-xs font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            v-model="block.content"
            rows="3"
            class="w-full px-2 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none resize-none"
            placeholder="Block content or configuration (JSON for complex blocks)"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PageBlock {
  id?: number
  page_id?: number
  block_type: string
  block_order: number
  title?: string
  subtitle?: string
  content?: string
  config?: string
  background_color?: string
  background_image?: string
  text_color?: string
  is_visible: boolean
}

const props = defineProps<{
  modelValue: PageBlock[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: PageBlock[]]
}>()

const blocks = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

function addBlock() {
  const newBlock: PageBlock = {
    block_type: 'text',
    block_order: blocks.value.length,
    title: '',
    subtitle: '',
    content: '',
    is_visible: true
  }

  blocks.value = [...blocks.value, newBlock]
}

function removeBlock(index: number) {
  blocks.value = blocks.value.filter((_, i) => i !== index)
  // Update block_order for remaining blocks
  blocks.value = blocks.value.map((block, i) => ({
    ...block,
    block_order: i
  }))
}

function moveBlock(index: number, direction: 'up' | 'down') {
  const newBlocks = [...blocks.value]
  const targetIndex = direction === 'up' ? index - 1 : index + 1

  if (targetIndex < 0 || targetIndex >= newBlocks.length) return

  // Swap blocks
  [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]]

  // Update block_order
  blocks.value = newBlocks.map((block, i) => ({
    ...block,
    block_order: i
  }))
}

function toggleVisibility(index: number) {
  const newBlocks = [...blocks.value]
  newBlocks[index] = {
    ...newBlocks[index],
    is_visible: !newBlocks[index].is_visible
  }
  blocks.value = newBlocks
}
</script>
