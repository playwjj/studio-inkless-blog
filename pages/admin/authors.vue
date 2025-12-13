<template>
  <div class="px-8 py-6">
    <!-- Page title -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Authors</h1>
        <p class="mt-1 text-sm text-gray-500">Manage blog post authors</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Author
      </button>
    </div>

    <!-- Authors list -->
    <div class="border border-gray-200">
      <!-- Loading state -->
      <div v-if="loading" class="py-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p class="mt-2 text-sm text-gray-500">Loading authors...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="authors.length === 0" class="py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No authors</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new author.</p>
        <div class="mt-6">
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New Author
          </button>
        </div>
      </div>

      <!-- Authors table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bio
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
              v-for="author in authors"
              :key="author.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-3">
                <div class="flex items-center space-x-3">
                  <img
                    v-if="author.avatar_url"
                    :src="author.avatar_url"
                    :alt="author.name"
                    class="w-10 h-10 rounded-full object-cover"
                  />
                  <div
                    v-else
                    class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ author.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="text-xs text-gray-500 line-clamp-2">{{ author.bio || '-' }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                {{ formatDate(author.created_at) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-right">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="editAuthor(author)"
                    class="text-gray-400 hover:text-gray-900"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteAuthor(author.id)"
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
      v-if="showCreateModal || editingAuthor"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white border border-gray-200 max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ editingAuthor ? 'Edit Author' : 'New Author' }}
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
            <label for="author_name" class="block text-sm font-medium text-gray-700 mb-1.5">
              Name <span class="text-red-500">*</span>
            </label>
            <input
              id="author_name"
              v-model="authorForm.name"
              type="text"
              required
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="John Doe"
              @blur="() => { setTouched('name'); validateField('name', authorForm) }"
            />
            <p v-if="touched.name && errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
          </div>

          <div>
            <AdminImageUploader
              v-model="authorForm.avatar_url"
              label="Avatar"
              input-id="author_avatar"
              placeholder="https://example.com/avatar.jpg"
              alt-text="Author avatar"
              upload-button-text="Upload Avatar"
              :compact="true"
            />
            <p v-if="touched.avatar_url && errors.avatar_url" class="mt-1 text-xs text-red-600">{{ errors.avatar_url }}</p>
          </div>

          <div>
            <label for="author_bio" class="block text-sm font-medium text-gray-700 mb-1.5">
              Bio
            </label>
            <textarea
              id="author_bio"
              v-model="authorForm.bio"
              rows="3"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none resize-none"
              placeholder="Short bio about the author (optional)"
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
              <span v-if="!submitting">{{ editingAuthor ? 'Save' : 'Create' }}</span>
              <span v-else>{{ editingAuthor ? 'Saving...' : 'Creating...' }}</span>
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

import { createValidation, required, isUrl } from '~/composables/useFormValidation'

const { errors, touched, validateField, validateAll, setTouched } = createValidation<{
  name: string
  avatar_url?: string
  bio?: string
}>({
  name: [required('Please enter an author name')],
  avatar_url: [isUrl('Avatar URL must be a valid URL')],
  bio: []
})

const { success, error: showError, confirm: showConfirm } = useNotification()

// Check authentication
const { data: userData, error: authError } = await useFetch('/api/auth/user')

if (authError.value) {
  // Redirect to login if not authenticated
  await navigateTo('/admin/login')
}

interface Author {
  id: number
  name: string
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

const showCreateModal = ref(false)
const editingAuthor = ref<Author | null>(null)
const loading = ref(false)
const submitting = ref(false)

const authorForm = reactive({
  name: '',
  avatar_url: '',
  bio: ''
})

const authors = ref<Author[]>([])

// Load authors on mount
onMounted(() => {
  loadAuthors()
})

async function loadAuthors() {
  loading.value = true
  try {
    const response = await $fetch('/api/admin/authors')
    authors.value = response.data || []
  } catch (error) {
    console.error('Failed to load authors:', error)
    showError('Failed to load authors', 'Please try again.')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const closeModal = () => {
  showCreateModal.value = false
  editingAuthor.value = null
  authorForm.name = ''
  authorForm.avatar_url = ''
  authorForm.bio = ''
}

const editAuthor = (author: Author) => {
  editingAuthor.value = author
  authorForm.name = author.name
  authorForm.avatar_url = author.avatar_url || ''
  authorForm.bio = author.bio || ''
}

const handleSubmit = async () => {
  if (submitting.value) return

  // mark fields as touched so errors show
  setTouched('name')
  setTouched('avatar_url')
  if (!validateAll(authorForm as any)) {
    return
  }

  submitting.value = true

  try {
    if (editingAuthor.value) {
      // Update existing author
      await $fetch(`/api/admin/authors/${editingAuthor.value.id}`, {
        method: 'PUT',
        body: {
          name: authorForm.name,
          avatar_url: authorForm.avatar_url,
          bio: authorForm.bio
        }
      })

      success('Author updated successfully!')
    } else {
      // Create new author
      await $fetch('/api/admin/authors', {
        method: 'POST',
        body: {
          name: authorForm.name,
          avatar_url: authorForm.avatar_url,
          bio: authorForm.bio
        }
      })

      success('Author created successfully!')
    }

    closeModal()
    await loadAuthors()
  } catch (error: any) {
    if (error.statusCode === 400) {
      showError('Invalid input', error.statusMessage || 'Please fill in all required fields')
    } else {
      showError('Failed to save author', 'Please try again.')
    }
    console.error('Submit author error:', error)
  } finally {
    submitting.value = false
  }
}

const deleteAuthor = async (id: number) => {
  const author = authors.value.find(a => a.id === id)
  const authorName = author?.name || 'this author'

  await showConfirm({
    title: 'Delete Author',
    message: `Are you sure you want to delete "${authorName}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
    onConfirm: async () => {
      try {
        await $fetch(`/api/admin/authors/${id}`, {
          method: 'DELETE'
        })

        success('Author deleted successfully!')
        await loadAuthors()
      } catch (error: any) {
        if (error.statusCode === 409) {
          showError('Cannot delete author', error.statusMessage || 'This author has articles')
        } else if (error.statusCode === 404) {
          showError('Author not found', 'The author may have been deleted already')
        } else {
          showError('Failed to delete author', 'Please try again.')
        }
        console.error('Delete author error:', error)
      }
    }
  })
}
</script>
