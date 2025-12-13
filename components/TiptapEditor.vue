<template>
  <div class="tiptap-editor border border-gray-200">
    <!-- Toolbar -->
    <div v-if="editor" class="bg-gray-50 border-b border-gray-200 p-2 flex items-center gap-1 flex-wrap">
      <!-- Text formatting -->
      <div class="flex items-center gap-1 border-r border-gray-300 pr-2">
        <button
          type="button"
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'bg-gray-200': editor.isActive('bold') }"
          class="p-1.5 hover:bg-gray-200 transition-colors"
          title="Bold"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M12.22 4h-2.44v12h2.44a4.5 4.5 0 100-9 3 3 0 000-3zm0 6a1.5 1.5 0 110 3H9.78v-3h2.44z"/>
          </svg>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'bg-gray-200': editor.isActive('italic') }"
          class="p-1.5 hover:bg-gray-200 transition-colors"
          title="Italic"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M12.22 5l-1.5 10h-2l1.5-10h2z"/>
          </svg>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'bg-gray-200': editor.isActive('strike') }"
          class="p-1.5 hover:bg-gray-200 transition-colors"
          title="Strikethrough"
        >
          <span class="text-xs font-semibold px-1">S</span>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleCode().run()"
          :class="{ 'bg-gray-200': editor.isActive('code') }"
          class="p-1.5 hover:bg-gray-200 transition-colors"
          title="Inline Code"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"/>
          </svg>
        </button>
      </div>

      <!-- Headings -->
      <div class="flex items-center gap-1 border-r border-gray-300 pr-2">
        <button
          type="button"
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'bg-gray-200': editor.isActive('heading', { level: 1 }) }"
          class="p-1.5 hover:bg-gray-200 transition-colors text-xs font-semibold"
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'bg-gray-200': editor.isActive('heading', { level: 2 }) }"
          class="p-1.5 hover:bg-gray-200 transition-colors text-xs font-semibold"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'bg-gray-200': editor.isActive('heading', { level: 3 }) }"
          class="p-1.5 hover:bg-gray-200 transition-colors text-xs font-semibold"
          title="Heading 3"
        >
          H3
        </button>
      </div>

      <!-- Lists -->
      <div class="flex items-center gap-1 border-r border-gray-300 pr-2">
        <button
          type="button"
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'bg-gray-200': editor.isActive('bulletList') }"
          class="p-1.5 hover:bg-gray-200 transition-colors"
          title="Bullet List"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
          </svg>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'bg-gray-200': editor.isActive('orderedList') }"
          class="p-1.5 hover:bg-gray-200 transition-colors"
          title="Numbered List"
        >
          <span class="text-xs font-semibold px-1">1.</span>
        </button>
      </div>

      <!-- Blocks -->
      <div class="flex items-center gap-1 border-r border-gray-300 pr-2">
        <button
          type="button"
          @click="editor.chain().focus().toggleCodeBlock().run()"
          :class="{ 'bg-gray-200': editor.isActive('codeBlock') }"
          class="p-1.5 hover:bg-gray-200 transition-colors"
          title="Code Block"
        >
          <span class="text-xs font-mono">&lt;/&gt;</span>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'bg-gray-200': editor.isActive('blockquote') }"
          class="p-1.5 hover:bg-gray-200 transition-colors"
          title="Quote"
        >
          <span class="text-xs font-semibold">"</span>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().setHorizontalRule().run()"
          class="p-1.5 hover:bg-gray-200 transition-colors"
          title="Horizontal Rule"
        >
          <span class="text-xs font-semibold">—</span>
        </button>
      </div>

      <!-- Link, Image & File -->
      <div class="flex items-center gap-1 border-r border-gray-300 pr-2">
        <button
          type="button"
          @click="setLink"
          :class="{ 'bg-gray-200': editor.isActive('link') }"
          class="p-1.5 hover:bg-gray-200 transition-colors"
          title="Insert Link"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          </svg>
        </button>
        <button
          type="button"
          @click="addImage"
          class="p-1.5 hover:bg-gray-200 transition-colors"
          title="Insert Image"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </button>
        <button
          type="button"
          @click="addFile"
          class="p-1.5 hover:bg-gray-200 transition-colors"
          title="Insert File"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      <!-- Undo/Redo -->
      <div class="flex items-center gap-1 border-r border-gray-300 pr-2">
        <button
          type="button"
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().undo()"
          class="p-1.5 hover:bg-gray-200 transition-colors disabled:opacity-30"
          title="Undo"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
          </svg>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().redo().run()"
          :disabled="!editor.can().redo()"
          class="p-1.5 hover:bg-gray-200 transition-colors disabled:opacity-30"
          title="Redo"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"/>
          </svg>
        </button>
      </div>

      <!-- View Source -->
      <div class="flex items-center">
        <button
          type="button"
          @click="toggleSourceView"
          :class="{ 'bg-gray-200': showSource }"
          class="p-1.5 hover:bg-gray-200 transition-colors text-xs font-medium"
          title="View Source"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Editor content -->
    <div v-show="!showSource">
      <EditorContent :editor="editor" class="prose prose-sm max-w-none p-4" />
    </div>

    <!-- Source code view -->
    <div v-show="showSource" class="p-4">
      <textarea
        v-model="sourceCode"
        class="w-full min-h-[400px] px-3 py-2 font-mono text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none resize-y"
        @input="updateFromSource"
      ></textarea>
      <p class="mt-2 text-xs text-gray-500">
        Edit the HTML source code directly. Switch back to visual editor to see the changes.
      </p>
    </div>

    <!-- Image Dialog -->
    <AdminEditorImageDialog
      :show="showImageDialog"
      @close="showImageDialog = false"
      @insert="handleImageInsert"
      @open-file-picker="openFilePicker"
      ref="imageDialogRef"
    />

    <!-- File Picker for Images -->
    <AdminFilePicker
      :show="showFilePicker"
      @close="handleFilePickerClose"
      @select="handleFileSelected"
    />

    <!-- File Dialog -->
    <AdminEditorFileDialog
      :show="showFileDialog"
      @close="showFileDialog = false"
      @insert="handleFileInsert"
      @open-file-picker="openFilePickerForFile"
      ref="fileDialogRef"
    />

    <!-- File Picker for Files -->
    <AdminFilePicker
      :show="showFilePickerForFile"
      @close="handleFilePickerForFileClose"
      @select="handleFileSelectedForLink"
    />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'

interface Props {
  modelValue: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Write your content here...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// State for dialogs
const showImageDialog = ref(false)
const showFilePicker = ref(false)
const imageDialogRef = ref<any>(null)
const showFileDialog = ref(false)
const showFilePickerForFile = ref(false)
const fileDialogRef = ref<any>(null)

// State for source view
const showSource = ref(false)
const sourceCode = ref('')

const editor = useEditor({
  extensions: [
    StarterKit,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-blue-600 underline hover:text-blue-700'
      }
    }),
    Image.configure({
      HTMLAttributes: {
        class: 'max-w-full h-auto'
      }
    }),
    Placeholder.configure({
      placeholder: props.placeholder
    })
  ],
  content: props.modelValue,
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

// Watch for external changes
watch(() => props.modelValue, (value) => {
  if (editor.value && editor.value.getHTML() !== value) {
    editor.value.commands.setContent(value, false)
  }
})

// Set link
const setLink = () => {
  if (!editor.value) return

  const previousUrl = editor.value.getAttributes('link').href
  const url = window.prompt('URL:', previousUrl)

  if (url === null) return

  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

// Add image
const addImage = () => {
  if (!editor.value) return
  showImageDialog.value = true
}

const handleImageInsert = (url: string) => {
  if (editor.value && url) {
    editor.value.chain().focus().setImage({ src: url }).run()
  }
}

const openFilePicker = () => {
  showImageDialog.value = false
  showFilePicker.value = true
}

const handleFilePickerClose = () => {
  showFilePicker.value = false
}

const handleFileSelected = (file: any) => {
  if (file.mime_type.startsWith('image/')) {
    // Set the URL in the image dialog and reopen it
    nextTick(() => {
      if (imageDialogRef.value) {
        imageDialogRef.value.setImageUrl(file.url)
      }
      showImageDialog.value = true
    })
  }
}

// Add file
const addFile = () => {
  if (!editor.value) return
  showFileDialog.value = true
}

const handleFileInsert = (text: string, url: string) => {
  if (editor.value && text && url) {
    editor.value.chain().focus().setLink({ href: url }).insertContent(text).run()
  }
}

const openFilePickerForFile = () => {
  showFileDialog.value = false
  showFilePickerForFile.value = true
}

const handleFilePickerForFileClose = () => {
  showFilePickerForFile.value = false
}

const handleFileSelectedForLink = (file: any) => {
  // Set the file info in the file dialog and reopen it
  nextTick(() => {
    if (fileDialogRef.value) {
      fileDialogRef.value.setFileInfo(file.file_name, file.url)
    }
    showFileDialog.value = true
  })
}

// Source view
const toggleSourceView = () => {
  if (!editor.value) return

  if (!showSource.value) {
    // Switching to source view - get HTML from editor
    sourceCode.value = editor.value.getHTML()
  } else {
    // Switching back to visual editor - set HTML from source
    editor.value.commands.setContent(sourceCode.value, false)
  }

  showSource.value = !showSource.value
}

const updateFromSource = () => {
  // Update is handled when switching back to visual editor
  // This just keeps the sourceCode ref in sync with textarea
}

// Initialize source code when editor is ready
watch(() => editor.value?.getHTML(), (html) => {
  if (html && !showSource.value) {
    sourceCode.value = html
  }
})

// Cleanup
onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style>
/* Tiptap editor styles */
.tiptap {
  outline: none;
  min-height: 400px;
}

.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #9ca3af;
  pointer-events: none;
  height: 0;
}

.tiptap h1 {
  font-size: 2em;
  font-weight: 700;
  margin-top: 0.67em;
  margin-bottom: 0.67em;
  line-height: 1.2;
}

.tiptap h2 {
  font-size: 1.5em;
  font-weight: 600;
  margin-top: 0.83em;
  margin-bottom: 0.83em;
  line-height: 1.3;
}

.tiptap h3 {
  font-size: 1.25em;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 1em;
  line-height: 1.4;
}

.tiptap p {
  margin-bottom: 1em;
}

.tiptap ul,
.tiptap ol {
  padding-left: 2em;
  margin-bottom: 1em;
}

.tiptap ul {
  list-style-type: disc;
}

.tiptap ol {
  list-style-type: decimal;
}

.tiptap code {
  background-color: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 0.25em;
  font-family: 'Courier New', monospace;
  font-size: 0.875em;
}

.tiptap pre {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1em;
  border-radius: 0.375em;
  overflow-x: auto;
  margin: 1em 0;
}

.tiptap pre code {
  background: none;
  color: inherit;
  padding: 0;
  font-size: 0.875em;
}

.tiptap blockquote {
  border-left: 4px solid #d1d5db;
  padding-left: 1em;
  margin: 1em 0;
  color: #6b7280;
  font-style: italic;
}

.tiptap hr {
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 2em 0;
}

.tiptap img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1em auto;
}

.tiptap a {
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
}

.tiptap a:hover {
  color: #1d4ed8;
}
</style>
