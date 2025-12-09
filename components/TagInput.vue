<template>
  <div class="tag-input-container">
    <label v-if="label" :for="inputId" class="block text-xs font-medium text-gray-700 mb-1.5">
      {{ label }}
    </label>

    <!-- Selected tags display -->
    <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-2 mb-2">
      <span
        v-for="(tag, index) in selectedTags"
        :key="index"
        class="inline-flex items-center px-2 py-1 text-xs bg-gray-100 border border-gray-300 hover:bg-gray-200 transition-colors"
      >
        {{ tag }}
        <button
          type="button"
          @click="removeTag(index)"
          class="ml-1.5 text-gray-500 hover:text-gray-700"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </span>
    </div>

    <!-- Input with autocomplete -->
    <div class="relative">
      <input
        :id="inputId"
        ref="inputRef"
        v-model="inputValue"
        type="text"
        :placeholder="placeholder"
        class="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
        @input="handleInput"
        @keydown.enter.prevent="addTag"
        @keydown.comma.prevent="addTag"
        @keydown.tab="addTag"
        @keydown.down.prevent="navigateDown"
        @keydown.up.prevent="navigateUp"
        @focus="showSuggestions = true"
        @blur="handleBlur"
      />

      <!-- Autocomplete dropdown -->
      <div
        v-if="showSuggestions && filteredSuggestions.length > 0"
        class="absolute z-10 w-full mt-1 bg-white border border-gray-200 shadow-lg max-h-48 overflow-y-auto"
      >
        <button
          v-for="(suggestion, index) in filteredSuggestions"
          :key="suggestion.id"
          type="button"
          class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
          :class="{ 'bg-gray-100': index === selectedIndex }"
          @mousedown.prevent="selectSuggestion(suggestion.name)"
        >
          {{ suggestion.name }}
          <span v-if="suggestion.usage_count > 0" class="text-xs text-gray-500 ml-2">
            ({{ suggestion.usage_count }})
          </span>
        </button>
      </div>
    </div>

    <p v-if="helpText" class="mt-1 text-xs text-gray-500">{{ helpText }}</p>
  </div>
</template>

<script setup lang="ts">
interface Tag {
  id: number
  name: string
  slug: string
  usage_count: number
}

interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  helpText?: string
  inputId?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: 'Type and press Enter or comma to add tags',
  helpText: 'Example: Vue, Nuxt, TypeScript',
  inputId: 'tag-input'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const inputValue = ref('')
const showSuggestions = ref(false)
const selectedIndex = ref(0)
const availableTags = ref<Tag[]>([])
const loading = ref(false)

// Parse selected tags from modelValue
const selectedTags = computed(() => {
  if (!props.modelValue) return []
  return props.modelValue
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)
})

// Filter suggestions based on input
const filteredSuggestions = computed(() => {
  if (!inputValue.value) return availableTags.value

  const input = inputValue.value.toLowerCase().trim()
  return availableTags.value.filter(tag =>
    tag.name.toLowerCase().includes(input) &&
    !selectedTags.value.some(selected => selected.toLowerCase() === tag.name.toLowerCase())
  )
})

// Fetch available tags from API
const fetchTags = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/admin/tags')
    if (response.success && response.tags) {
      availableTags.value = response.tags
    }
  } catch (error) {
    console.error('Failed to fetch tags:', error)
  } finally {
    loading.value = false
  }
}

// Load tags on mount
onMounted(() => {
  fetchTags()
})

// Handle input changes
const handleInput = () => {
  showSuggestions.value = true
  selectedIndex.value = 0
}

// Add tag from input
const addTag = () => {
  const value = inputValue.value.trim()
  if (!value) return

  // Format tag name (capitalize first letter, remove extra spaces)
  const formattedTag = value
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

  // Check if tag already exists
  if (selectedTags.value.some(tag => tag.toLowerCase() === formattedTag.toLowerCase())) {
    inputValue.value = ''
    return
  }

  // Add new tag
  const newTags = [...selectedTags.value, formattedTag]
  emit('update:modelValue', newTags.join(', '))

  inputValue.value = ''
  showSuggestions.value = false
  selectedIndex.value = 0
}

// Select suggestion from dropdown
const selectSuggestion = (tagName: string) => {
  // Check if tag already exists
  if (selectedTags.value.some(tag => tag.toLowerCase() === tagName.toLowerCase())) {
    inputValue.value = ''
    return
  }

  const newTags = [...selectedTags.value, tagName]
  emit('update:modelValue', newTags.join(', '))

  inputValue.value = ''
  showSuggestions.value = false
  selectedIndex.value = 0
}

// Remove tag
const removeTag = (index: number) => {
  const newTags = selectedTags.value.filter((_, i) => i !== index)
  emit('update:modelValue', newTags.join(', '))
}

// Navigate dropdown with keyboard
const navigateDown = () => {
  if (selectedIndex.value < filteredSuggestions.value.length - 1) {
    selectedIndex.value++
  }
}

const navigateUp = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--
  }
}

// Handle blur event
const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

// Watch for Enter key on highlighted suggestion
watch(selectedIndex, () => {
  if (showSuggestions.value && filteredSuggestions.value.length > 0) {
    // Auto-scroll selected item into view
    const dropdown = document.querySelector('.tag-input-container .overflow-y-auto')
    if (dropdown) {
      const selectedElement = dropdown.children[selectedIndex.value] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }
})
</script>
