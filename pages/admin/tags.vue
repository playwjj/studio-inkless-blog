<template>
  <div class="px-8 py-6">
    <!-- Page title -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Tags</h1>
        <p class="mt-1 text-sm text-gray-500">Manage blog post tags</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Tag
      </button>
    </div>

    <!-- Search -->
    <div class="border border-gray-200 p-4 mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search tags..."
        class="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
      />
    </div>

    <!-- Tags list -->
    <div class="border border-gray-200">
      <!-- Loading state -->
      <div v-if="loading" class="py-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p class="mt-2 text-sm text-gray-500">Loading tags...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="tags.length === 0" class="py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No tags</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new tag.</p>
        <div class="mt-6">
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New Tag
          </button>
        </div>
      </div>

      <!-- No results state -->
      <div v-else-if="filteredTags.length === 0" class="py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No tags found</h3>
        <p class="mt-1 text-sm text-gray-500">Try adjusting your search query.</p>
      </div>

      <!-- Tags table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tag Name
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usage Count
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="tag in filteredTags"
              :key="tag.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="text-sm font-medium text-gray-900">
                  {{ tag.name }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <code class="text-xs text-gray-600">
                  {{ tag.slug }}
                </code>
              </td>
              <td class="px-4 py-3">
                <span class="text-xs text-gray-500">{{ tag.description || '-' }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="text-xs text-gray-900">{{ tag.usage_count }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                {{ formatDate(tag.created_at) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-right">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="editTag(tag)"
                    class="text-gray-400 hover:text-gray-900"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteTag(tag.id)"
                    class="text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit modal -->
    <div
      v-if="showCreateModal || editingTag"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white border border-gray-200 max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ editingTag ? 'Edit Tag' : 'New Tag' }}
          </h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-900"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="tag_name" class="block text-sm font-medium text-gray-700 mb-1.5">
              Tag Name <span class="text-red-500">*</span>
            </label>
            <input
              id="tag_name"
              v-model="tagForm.name"
              type="text"
              required
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="Vue.js"
            />
          </div>

          <div>
            <label for="tag_slug" class="block text-sm font-medium text-gray-700 mb-1.5">
              URL Slug <span class="text-red-500">*</span>
            </label>
            <input
              id="tag_slug"
              v-model="tagForm.slug"
              type="text"
              required
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none font-mono"
              placeholder="vuejs"
            />
          </div>

          <div>
            <label for="tag_description" class="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              id="tag_description"
              v-model="tagForm.description"
              rows="3"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none resize-none"
              placeholder="Tag description (optional)"
            ></textarea>
          </div>

          <div class="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              :disabled="submitting"
              class="px-3 py-1.5 border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!submitting">{{ editingTag ? 'Save' : 'Create' }}</span>
              <span v-else>{{ editingTag ? 'Saving...' : 'Creating...' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

// Check authentication
const { data: userData, error: authError } = await useFetch('/api/auth/user')

if (authError.value) {
  // Redirect to login if not authenticated
  await navigateTo('/admin/login')
}

interface Tag {
  id: number
  name: string
  slug: string
  description?: string
  usage_count: number
  created_at: string
  updated_at: string
}

const searchQuery = ref('')
const showCreateModal = ref(false)
const editingTag = ref<Tag | null>(null)
const loading = ref(false)
const submitting = ref(false)

const tagForm = reactive({
  name: '',
  slug: '',
  description: ''
})

const tags = ref<Tag[]>([])

// Load tags on mount
onMounted(() => {
  loadTags()
})

async function loadTags() {
  loading.value = true
  try {
    const response = await $fetch('/api/admin/tags')
    tags.value = response.tags || []
  } catch (error) {
    console.error('Failed to load tags:', error)
    alert('Failed to load tags. Please try again.')
  } finally {
    loading.value = false
  }
}

const filteredTags = computed(() => {
  if (!searchQuery.value) return tags.value

  return tags.value.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    tag.slug.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const closeModal = () => {
  showCreateModal.value = false
  editingTag.value = null
  tagForm.name = ''
  tagForm.slug = ''
  tagForm.description = ''
}

const editTag = (tag: Tag) => {
  editingTag.value = tag
  tagForm.name = tag.name
  tagForm.slug = tag.slug
  tagForm.description = tag.description || ''
}

const handleSubmit = async () => {
  if (submitting.value) return

  submitting.value = true

  try {
    if (editingTag.value) {
      // Update existing tag
      await $fetch(`/api/admin/tags/${editingTag.value.id}`, {
        method: 'PUT',
        body: {
          name: tagForm.name,
          slug: tagForm.slug,
          description: tagForm.description
        }
      })

      alert('Tag updated successfully!')
    } else {
      // Create new tag
      await $fetch('/api/admin/tags', {
        method: 'POST',
        body: {
          name: tagForm.name,
          slug: tagForm.slug,
          description: tagForm.description
        }
      })

      alert('Tag created successfully!')
    }

    closeModal()
    await loadTags()
  } catch (error: any) {
    if (error.statusCode === 409) {
      alert(error.statusMessage || 'A tag with this slug already exists')
    } else if (error.statusCode === 400) {
      alert(error.statusMessage || 'Please fill in all required fields')
    } else {
      alert('Failed to save tag. Please try again.')
    }
    console.error('Submit tag error:', error)
  } finally {
    submitting.value = false
  }
}

const deleteTag = async (id: number) => {
  if (!confirm('Are you sure you want to delete this tag? This action cannot be undone.')) {
    return
  }

  try {
    await $fetch(`/api/admin/tags/${id}`, {
      method: 'DELETE'
    })

    alert('Tag deleted successfully!')
    await loadTags()
  } catch (error: any) {
    if (error.statusCode === 409) {
      alert(error.statusMessage || 'Cannot delete tag that is being used')
    } else if (error.statusCode === 404) {
      alert('Tag not found')
    } else {
      alert('Failed to delete tag. Please try again.')
    }
    console.error('Delete tag error:', error)
  }
}

// Auto-generate slug from name
watch(() => tagForm.name, (newName) => {
  if (newName && !editingTag.value) {
    tagForm.slug = newName
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '')
  }
})
</script>
