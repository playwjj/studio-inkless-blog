<template>
  <div class="px-8 py-6">
    <!-- Page title -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">API Tokens</h1>
      <p class="mt-1 text-sm text-gray-500">Manage API tokens for programmatic access to your blog</p>
    </div>

    <!-- Create Token Button -->
    <div class="mb-6">
      <button
        @click="showCreateModal = true"
        class="px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
      >
        Create New Token
      </button>
    </div>

    <!-- Tokens List -->
    <div class="bg-white border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Last Used</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="tokens.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-sm text-gray-500">
                No API tokens yet. Create one to get started.
              </td>
            </tr>
            <tr v-for="token in tokens" :key="token.id" class="hover:bg-gray-50">
              <td class="px-4 py-2 text-sm font-medium text-gray-900">{{ token.name }}</td>
              <td class="px-4 py-2 text-sm text-gray-500">{{ token.description || '-' }}</td>
              <td class="px-4 py-2 text-sm text-gray-500">{{ formatDate(token.created_at) }}</td>
              <td class="px-4 py-2 text-sm text-gray-500">{{ token.last_used_at ? formatDate(token.last_used_at) : 'Never' }}</td>
              <td class="px-4 py-2 text-sm">
                <span v-if="token.is_active" class="inline-flex px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
                <span v-else class="inline-flex px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                  Inactive
                </span>
              </td>
              <td class="px-4 py-2 text-sm">
                <button
                  @click="confirmDelete(token)"
                  class="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Token Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 max-w-md w-full mx-4">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Create New API Token</h2>

        <form @submit.prevent="createToken" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Token Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="newToken.name"
              type="text"
              required
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="My API Token"
              @blur="() => { setTouched('name'); validateField('name', newToken) }"
            />
            <p v-if="touched.name && errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              v-model="newToken.description"
              rows="3"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none resize-none"
              placeholder="Optional description"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Expires In (days)
            </label>
            <input
              v-model.number="newToken.expires_in_days"
              type="number"
              min="0"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="0 = never expires"
              @blur="() => { setTouched('expires_in_days'); validateField('expires_in_days', newToken) }"
            />
            <p v-if="touched.expires_in_days && errors.expires_in_days" class="mt-1 text-xs text-red-600">{{ errors.expires_in_days }}</p>
            <p class="mt-1 text-xs text-gray-500">Leave as 0 for tokens that never expire</p>
          </div>

          <div class="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="cancelCreate"
              class="px-3 py-1.5 border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!creating">Create Token</span>
              <span v-else>Creating...</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Token Created Modal -->
    <div v-if="showTokenModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 max-w-lg w-full mx-4">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Token Created Successfully</h2>

        <div class="bg-yellow-50 border border-yellow-200 p-4 mb-4">
          <p class="text-sm text-yellow-800 mb-2 font-medium">
            Important: Save this token now. You won't be able to see it again!
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            Your API Token
          </label>
          <div class="flex items-center space-x-2">
            <input
              :value="createdToken"
              type="text"
              readonly
              class="flex-1 px-3 py-2 text-sm border border-gray-200 bg-gray-50 font-mono"
            />
            <button
              @click="copyToken"
              class="px-3 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
            >
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>

        <div class="bg-gray-50 border border-gray-200 p-4 mb-4">
          <p class="text-sm text-gray-700 mb-2 font-medium">Usage Example:</p>
          <pre class="text-xs font-mono bg-white p-2 border border-gray-200 overflow-x-auto">curl -X GET "{{ apiBaseUrl }}/api/articles" \
  -H "Authorization: Bearer {{ createdToken }}"</pre>
        </div>

        <div class="flex items-center justify-end">
          <button
            @click="closeTokenModal"
            class="px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

import { createValidation, required, minNumber } from '~/composables/useFormValidation'

const { errors, touched, validateField, validateAll, setTouched } = createValidation<{
  name: string
  description?: string
  expires_in_days: number
}>({
  name: [required('Please enter a token name')],
  description: [],
  expires_in_days: [minNumber(0, 'Expires in days must be 0 or greater')]
})

const { success, error: showError, confirm: showConfirm } = useNotification()

// Check authentication
const { data: userData, error: authError } = await useFetch('/api/auth/user')

if (authError.value) {
  // Redirect to login if not authenticated
  await navigateTo('/admin/login')
}

interface Token {
  id: number
  name: string
  description?: string
  scopes?: string[]
  expires_at?: string
  last_used_at?: string
  is_active: number
  created_at: string
}

const tokens = ref<Token[]>([])
const showCreateModal = ref(false)
const showTokenModal = ref(false)
const createdToken = ref('')
const copied = ref(false)
const creating = ref(false)

const newToken = reactive({
  name: '',
  description: '',
  expires_in_days: 0
})

const apiBaseUrl = ref('')

onMounted(() => {
  apiBaseUrl.value = window.location.origin
  loadTokens()
})

async function loadTokens() {
  try {
    const response = await $fetch('/api/tokens')
    tokens.value = response.tokens || []
  } catch (error) {
    console.error('Failed to load tokens:', error)
    showError('Failed to load tokens', 'Please try again.')
  }
}

async function createToken() {
  // mark fields touched and validate
  setTouched('name')
  setTouched('expires_in_days')
  if (!validateAll(newToken as any)) {
    return
  }

  creating.value = true

  try {
    const response = await $fetch('/api/tokens', {
      method: 'POST',
      body: {
        name: newToken.name,
        description: newToken.description || undefined,
        expires_in_days: newToken.expires_in_days || undefined
      }
    })

    createdToken.value = (response as any).token
    showCreateModal.value = false
    showTokenModal.value = true

    // Reload tokens list
    await loadTokens()

    // Reset form
    newToken.name = ''
    newToken.description = ''
    newToken.expires_in_days = 0
  } catch (error: any) {
    showError('Failed to create token', 'Please try again.')
    console.error('Create token error:', error)
  } finally {
    creating.value = false
  }
}

function cancelCreate() {
  showCreateModal.value = false
  newToken.name = ''
  newToken.description = ''
  newToken.expires_in_days = 0
}

function closeTokenModal() {
  showTokenModal.value = false
  createdToken.value = ''
  copied.value = false
}

async function copyToken() {
  try {
    await navigator.clipboard.writeText(createdToken.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy token:', error)
  }
}

async function confirmDelete(token: Token) {
  await showConfirm({
    title: 'Delete API Token',
    message: `Are you sure you want to delete the token "${token.name}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
    onConfirm: async () => {
      try {
        await $fetch(`/api/tokens/${token.id}`, {
          method: 'DELETE'
        })

        success('Token deleted successfully')
        await loadTokens()
      } catch (error: any) {
        showError('Failed to delete token', 'Please try again.')
        console.error('Delete token error:', error)
      }
    }
  })
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
