<template>
  <div class="px-8 py-6">
    <!-- Page title -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Tags</h1>
        <p class="mt-1 text-sm text-gray-500">Manage blog post tags</p>
      </div>
      <div class="flex items-center gap-2">
        <!-- Maintenance buttons -->
        <button
          @click="recalculateCounts"
          :disabled="isRecalculating"
          class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Recalculate usage counts for all tags"
        >
          <svg class="w-4 h-4 mr-1.5" :class="{ 'animate-spin': isRecalculating }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ isRecalculating ? 'Recalculating...' : 'Recalculate Counts' }}
        </button>

        <button
          @click="cleanupUnusedTags"
          :disabled="isCleaning"
          class="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-700 text-sm hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete tags with usage count = 0"
        >
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {{ isCleaning ? 'Cleaning...' : 'Clean Unused' }}
        </button>

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
      <div v-else-if="tags.length === 0 && !loading" class="py-12 text-center">
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
                ID
              </th>
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
              v-for="tag in paginatedTags"
              :key="tag.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="text-xs text-gray-500">{{ tag.id }}</span>
              </td>
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

      <!-- Pagination -->
      <div class="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 border border-gray-300 text-xs bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="ml-3 px-3 py-1.5 border border-gray-300 text-xs bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-xs text-gray-500">
              Showing <span class="font-medium">{{ paginationStart }}</span> to <span class="font-medium">{{ paginationEnd }}</span> of
              <span class="font-medium">{{ totalItems }}</span> results
            </p>
          </div>
          <div v-if="totalPages > 1">
            <nav class="relative z-0 inline-flex -space-x-px">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-3 py-1.5 border border-gray-200 bg-white text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                v-for="(page, index) in pageNumbers"
                :key="index"
                @click="typeof page === 'number' ? goToPage(page) : null"
                :disabled="page === '...'"
                :class="[
                  'px-3 py-1.5 border border-gray-200 text-xs',
                  page === currentPage
                    ? 'bg-gray-900 text-white'
                    : page === '...'
                    ? 'bg-white text-gray-400 cursor-default'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1.5 border border-gray-200 bg-white text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
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
              @blur="() => { setTouched('name'); validateField('name', tagForm) }"
            />
            <p v-if="touched.name && errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
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
              @blur="() => { setTouched('slug'); validateField('slug', tagForm) }"
            />
            <p v-if="touched.slug && errors.slug" class="mt-1 text-xs text-red-600">{{ errors.slug }}</p>
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

import { createValidation, required, pattern } from '~/composables/useFormValidation'

const { errors, touched, validateField, validateAll, setTouched } = createValidation<{
  name: string
  slug: string
  description?: string
}>({
  name: [required('Please enter a tag name')],
  slug: [required('Please enter a slug'), pattern(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers and hyphens')],
  description: []
})

const { success, error: showError, confirm: showConfirm } = useNotification()

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
const isRecalculating = ref(false)
const isCleaning = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)
const totalItems = ref(0)

const tagForm = reactive({
  name: '',
  slug: '',
  description: ''
})

const tags = ref<Tag[]>([])

async function loadTags() {
  loading.value = true
  try {
    const response = await $fetch('/api/admin/tags', {
      query: {
        page: currentPage.value,
        limit: pageSize.value,
        search: searchQuery.value || undefined
      }
    })

    tags.value = response.tags || []
    totalPages.value = response.pagination?.totalPages || 1
    totalItems.value = response.pagination?.total || 0
  } catch (error) {
    console.error('Failed to load tags:', error)
    showError('Failed to load tags', 'Please try again.')
  } finally {
    loading.value = false
  }
}

// Load tags on mount
onMounted(() => {
  loadTags()
})

// Server-side pagination - tags are already filtered and paginated by API
const paginatedTags = computed(() => tags.value)

const paginationStart = computed(() => {
  if (totalItems.value === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const paginationEnd = computed(() => {
  const end = currentPage.value * pageSize.value
  return Math.min(end, totalItems.value)
})

const pageNumbers = computed(() => {
  const pages = []
  const maxVisible = 5

  if (totalPages.value <= maxVisible) {
    // Show all pages if total is less than max
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    // Show smart pagination
    if (currentPage.value <= 3) {
      // Near the beginning
      for (let i = 1; i <= Math.min(4, totalPages.value); i++) {
        pages.push(i)
      }
      if (totalPages.value > 4) {
        pages.push('...')
        pages.push(totalPages.value)
      }
    } else if (currentPage.value >= totalPages.value - 2) {
      // Near the end
      pages.push(1)
      pages.push('...')
      for (let i = totalPages.value - 3; i <= totalPages.value; i++) {
        pages.push(i)
      }
    } else {
      // In the middle
      pages.push(1)
      pages.push('...')
      pages.push(currentPage.value - 1)
      pages.push(currentPage.value)
      pages.push(currentPage.value + 1)
      pages.push('...')
      pages.push(totalPages.value)
    }
  }

  return pages
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Reset to page 1 and reload when search changes
watch(searchQuery, () => {
  if (currentPage.value === 1) {
    // If already on page 1, manually reload
    loadTags()
  } else {
    // Otherwise, setting page to 1 will trigger reload
    currentPage.value = 1
  }
})

// Reload when page changes (skip initial trigger)
watch(currentPage, (newPage, oldPage) => {
  // Only reload if the page actually changed (not initial setup)
  if (oldPage !== undefined) {
    loadTags()
  }
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

  // mark fields as touched so errors show
  setTouched('name')
  setTouched('slug')
  if (!validateAll(tagForm as any)) {
    return
  }

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

      success('Tag updated successfully!')
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

      success('Tag created successfully!')
    }

    closeModal()
    await loadTags()
  } catch (error: any) {
    if (error.statusCode === 409) {
      showError('Duplicate tag', error.statusMessage || 'A tag with this slug already exists')
    } else if (error.statusCode === 400) {
      showError('Invalid input', error.statusMessage || 'Please fill in all required fields')
    } else {
      showError('Failed to save tag', 'Please try again.')
    }
    console.error('Submit tag error:', error)
  } finally {
    submitting.value = false
  }
}

const deleteTag = async (id: number) => {
  const tag = tags.value.find(t => t.id === id)
  const tagName = tag?.name || 'this tag'

  await showConfirm({
    title: 'Delete Tag',
    message: `Are you sure you want to delete "${tagName}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
    onConfirm: async () => {
      try {
        await $fetch(`/api/admin/tags/${id}`, {
          method: 'DELETE'
        })

        success('Tag deleted successfully!')
        await loadTags()
      } catch (error: any) {
        if (error.statusCode === 409) {
          showError('Cannot delete tag', error.statusMessage || 'This tag is being used in articles')
        } else if (error.statusCode === 404) {
          showError('Tag not found', 'The tag may have been deleted already')
        } else {
          showError('Failed to delete tag', 'Please try again.')
        }
        console.error('Delete tag error:', error)
      }
    }
  })
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

// Recalculate tag usage counts
const recalculateCounts = async () => {
  await showConfirm({
    title: 'Recalculate Tag Counts',
    message: 'This will recalculate usage_count for all tags based on published articles. This may take a moment. Continue?',
    confirmText: 'Recalculate',
    cancelText: 'Cancel',
    variant: 'default',
    onConfirm: async () => {
      isRecalculating.value = true
      try {
        const response = await $fetch('/api/admin/tags/recalculate', {
          method: 'POST'
        })

        success('Tag counts recalculated!', response.message || 'All tag usage counts have been updated.')
        await loadTags()
      } catch (error: any) {
        showError('Failed to recalculate counts', error.statusMessage || 'Please try again.')
        console.error('Recalculate error:', error)
      } finally {
        isRecalculating.value = false
      }
    }
  })
}

// Cleanup unused tags
const cleanupUnusedTags = async () => {
  await showConfirm({
    title: 'Clean Up Unused Tags',
    message: 'This will permanently delete all tags with usage_count = 0. This action cannot be undone. Continue?',
    confirmText: 'Delete Unused Tags',
    cancelText: 'Cancel',
    variant: 'danger',
    onConfirm: async () => {
      isCleaning.value = true
      try {
        const response = await $fetch('/api/admin/tags/cleanup', {
          method: 'POST'
        })

        const deletedCount = response.data?.deletedCount || 0
        if (deletedCount > 0) {
          success('Cleanup complete!', `Deleted ${deletedCount} unused tag(s).`)
        } else {
          success('No unused tags found', 'All tags are currently in use.')
        }
        await loadTags()
      } catch (error: any) {
        showError('Failed to cleanup tags', error.statusMessage || 'Please try again.')
        console.error('Cleanup error:', error)
      } finally {
        isCleaning.value = false
      }
    }
  })
}
</script>
