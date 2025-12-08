<template>
  <div class="markdown-editor border border-gray-200">
    <!-- Toolbar -->
    <div class="bg-gray-50 border-b border-gray-200 p-1.5 flex items-center space-x-1 flex-wrap">
      <button
        v-for="tool in tools"
        :key="tool.name"
        type="button"
        :class="[
          'p-1.5 hover:bg-gray-200 transition-colors',
          tool.divider ? 'mr-2' : ''
        ]"
        :title="tool.title"
        @click="tool.action"
      >
        <svg v-if="tool.icon" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path :d="tool.icon" />
        </svg>
        <span v-else class="text-xs font-medium">{{ tool.label }}</span>
      </button>
      <div class="w-px h-5 bg-gray-300 mx-1"></div>
      <button
        type="button"
        class="px-2 py-1 text-xs hover:bg-gray-200 transition-colors"
        @click="togglePreview"
      >
        {{ showPreview ? 'Edit' : 'Preview' }}
      </button>
    </div>

    <!-- Editor area -->
    <div class="grid" :class="showPreview ? 'grid-cols-2' : 'grid-cols-1'">
      <!-- Editor -->
      <div v-show="!showPreview || splitView" class="relative">
        <textarea
          ref="textareaRef"
          v-model="content"
          class="w-full px-3 py-2 outline-none resize-none font-mono text-sm"
          :rows="rows"
          :placeholder="placeholder"
          @input="handleInput"
        ></textarea>
      </div>

      <!-- Preview -->
      <div
        v-show="showPreview"
        class="px-3 py-2 border-l border-gray-200 bg-gray-50 overflow-y-auto prose prose-sm max-w-none"
        :style="{ height: `${rows * 1.5}rem` }"
        v-html="renderedContent"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  rows?: number
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  rows: 20,
  placeholder: 'Write your content using Markdown...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const textareaRef = ref<HTMLTextAreaElement>()
const showPreview = ref(false)
const splitView = ref(false)

const content = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Markdown rendering (basic implementation)
const renderedContent = computed(() => {
  if (!content.value) return '<p class="text-gray-400">Nothing to preview</p>'

  let html = content.value

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/_(.+?)_/g, '<em>$1</em>')

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto" />')

  // Code blocks
  html = html.replace(/```([^`]+)```/g, '<pre class="bg-gray-100 p-2 rounded"><code>$1</code></pre>')

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')

  // Lists
  html = html.replace(/^\* (.+)$/gim, '<li>$1</li>')
  html = html.replace(/^- (.+)$/gim, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul class="list-disc pl-5">$1</ul>')

  // Blockquotes
  html = html.replace(/^> (.+)$/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')

  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>')
  html = '<p>' + html + '</p>'

  return html
})

const handleInput = () => {
  emit('update:modelValue', content.value)
}

const insertText = (before: string, after: string = '') => {
  const textarea = textareaRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = content.value.substring(start, end)
  const newText = before + selectedText + after

  content.value = content.value.substring(0, start) + newText + content.value.substring(end)

  // Set cursor position
  nextTick(() => {
    const newCursorPos = selectedText ? start + newText.length : start + before.length
    textarea.setSelectionRange(newCursorPos, newCursorPos)
    textarea.focus()
  })
}

const togglePreview = () => {
  showPreview.value = !showPreview.value
}

// Toolbar tools
const tools = [
  {
    name: 'bold',
    title: 'Bold (Ctrl+B)',
    icon: 'M12.22 4h-2.44v12h2.44a4.5 4.5 0 100-9 3 3 0 000-3zm0 6a1.5 1.5 0 110 3H9.78v-3h2.44z',
    action: () => insertText('**', '**')
  },
  {
    name: 'italic',
    title: 'Italic (Ctrl+I)',
    icon: 'M12.22 5l-1.5 10h-2l1.5-10h2z',
    action: () => insertText('*', '*')
  },
  {
    name: 'link',
    title: 'Insert Link (Ctrl+K)',
    icon: 'M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z',
    action: () => insertText('[', '](url)')
  },
  {
    name: 'h1',
    title: 'Heading 1',
    label: 'H1',
    action: () => insertText('# ')
  },
  {
    name: 'h2',
    title: 'Heading 2',
    label: 'H2',
    action: () => insertText('## ')
  },
  {
    name: 'h3',
    title: 'Heading 3',
    label: 'H3',
    action: () => insertText('### ')
  },
  {
    name: 'ul',
    title: 'Unordered List',
    icon: 'M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z',
    action: () => insertText('- ')
  },
  {
    name: 'code',
    title: 'Code Block',
    icon: 'M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z',
    action: () => insertText('```\n', '\n```')
  },
  {
    name: 'quote',
    title: 'Quote',
    label: '""',
    action: () => insertText('> ')
  }
]

// Keyboard shortcuts
onMounted(() => {
  const textarea = textareaRef.value
  if (!textarea) return

  textarea.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          insertText('**', '**')
          break
        case 'i':
          e.preventDefault()
          insertText('*', '*')
          break
        case 'k':
          e.preventDefault()
          insertText('[', '](url)')
          break
      }
    }
  })
})
</script>

<style scoped>
.prose {
  color: #374151;
}

.prose h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.prose h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
}

.prose h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
}

.prose p {
  margin-bottom: 0.75rem;
}

.prose ul {
  margin-bottom: 0.75rem;
}

.prose code {
  font-family: 'Courier New', monospace;
}
</style>
