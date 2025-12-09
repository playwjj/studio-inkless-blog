<template>
  <div class="px-8 py-6">
    <!-- Page title -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Profile Settings</h1>
      <p class="mt-1 text-sm text-gray-500">Manage your account information and preferences</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Profile Picture -->
      <div class="bg-white border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Profile Picture</h2>
        <div class="flex items-center space-x-6">
          <div class="relative">
            <img
              v-if="formData.avatar_url"
              :src="formData.avatar_url"
              alt="Profile picture"
              class="w-24 h-24 object-cover border border-gray-200"
            />
            <div
              v-else
              class="w-24 h-24 bg-gray-100 border border-gray-200 flex items-center justify-center"
            >
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <div class="flex-1">
            <div class="flex items-center space-x-3">
              <button
                type="button"
                @click="triggerFileUpload"
                class="px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
              >
                Upload Photo
              </button>
              <button
                v-if="formData.avatar_url"
                type="button"
                @click="removeAvatar"
                class="px-3 py-1.5 border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors"
              >
                Remove
              </button>
            </div>
            <p class="mt-2 text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileChange"
            />
          </div>
        </div>
      </div>

      <!-- Basic Information -->
      <div class="bg-white border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1.5">
              Username <span class="text-red-500">*</span>
            </label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              required
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="johndoe"
              @blur="() => { setTouched('username'); validateField('username', formData) }"
            />
            <p v-if="touched.username && errors.username" class="mt-1 text-xs text-red-600">{{ errors.username }}</p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="john@example.com"
              @blur="() => { setTouched('email'); validateField('email', formData) }"
            />
            <p v-if="touched.email && errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
          </div>

          <div>
            <label for="display_name" class="block text-sm font-medium text-gray-700 mb-1.5">
              Display Name
            </label>
            <input
              id="display_name"
              v-model="formData.display_name"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label for="role" class="block text-sm font-medium text-gray-700 mb-1.5">
              Role
            </label>
            <input
              id="role"
              v-model="formData.role"
              type="text"
              disabled
              class="w-full px-3 py-2 text-sm border border-gray-200 bg-gray-50 text-gray-500 outline-none cursor-not-allowed"
            />
          </div>

          <div class="md:col-span-2">
            <label for="bio" class="block text-sm font-medium text-gray-700 mb-1.5">
              Bio
            </label>
            <textarea
              id="bio"
              v-model="formData.bio"
              rows="4"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none resize-none"
              placeholder="Write a short bio about yourself..."
            ></textarea>
            <p class="mt-1 text-xs text-gray-500">{{ formData.bio?.length || 0 }}/200 characters</p>
          </div>
        </div>
      </div>

      <!-- Social Links -->
      <div class="bg-white border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Social Links</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="website" class="block text-sm font-medium text-gray-700 mb-1.5">
              Website
            </label>
            <input
              id="website"
              v-model="formData.website"
              type="url"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label for="twitter" class="block text-sm font-medium text-gray-700 mb-1.5">
              Twitter
            </label>
            <input
              id="twitter"
              v-model="formData.twitter"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="@username"
            />
          </div>

          <div>
            <label for="github" class="block text-sm font-medium text-gray-700 mb-1.5">
              GitHub
            </label>
            <input
              id="github"
              v-model="formData.github"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="username"
            />
          </div>

          <div>
            <label for="linkedin" class="block text-sm font-medium text-gray-700 mb-1.5">
              LinkedIn
            </label>
            <input
              id="linkedin"
              v-model="formData.linkedin"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="username"
            />
          </div>
        </div>
      </div>

      <!-- Change Password -->
      <div class="bg-white border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>
        <div class="space-y-4">
          <div>
            <label for="current_password" class="block text-sm font-medium text-gray-700 mb-1.5">
              Current Password
            </label>
            <input
              id="current_password"
              v-model="passwordForm.current_password"
              type="password"
              class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              placeholder="Enter current password"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="new_password" class="block text-sm font-medium text-gray-700 mb-1.5">
                New Password
              </label>
              <input
                id="new_password"
                v-model="passwordForm.new_password"
                type="password"
                class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label for="confirm_password" class="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm New Password
              </label>
              <input
                id="confirm_password"
                v-model="passwordForm.confirm_password"
                type="password"
                class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <div class="pt-2">
            <button
              type="button"
              @click="handlePasswordChange"
              :disabled="passwordLoading"
              class="px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!passwordLoading">Update Password</span>
              <span v-else>Updating...</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Account Settings -->
      <div class="bg-white border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Account Settings</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Email Notifications</h3>
              <p class="text-xs text-gray-500">Receive email notifications for new comments and updates</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="formData.email_notifications"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
              <p class="text-xs text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <button
              type="button"
              class="px-3 py-1.5 border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors"
            >
              {{ formData.two_factor_enabled ? 'Disable' : 'Enable' }}
            </button>
          </div>

          <div class="pt-4 border-t border-gray-200">
            <h3 class="text-sm font-medium text-gray-900 mb-2">Danger Zone</h3>
            <p class="text-xs text-gray-500 mb-3">Once you delete your account, there is no going back. Please be certain.</p>
            <button
              type="button"
              @click="handleDeleteAccount"
              class="px-3 py-1.5 border border-red-200 text-red-600 text-sm hover:bg-red-50 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <!-- Account Info -->
      <div class="bg-white border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Account Information</h2>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between py-1.5 border-b border-gray-100">
            <span class="text-gray-500">Account Created</span>
            <span class="font-medium text-gray-900">{{ formatDate(accountInfo.created_at) }}</span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-gray-100">
            <span class="text-gray-500">Last Login</span>
            <span class="font-medium text-gray-900">{{ formatDate(accountInfo.last_login) }}</span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-gray-100">
            <span class="text-gray-500">Total Posts</span>
            <span class="font-medium text-gray-900">{{ accountInfo.total_posts }}</span>
          </div>
          <div class="flex justify-between py-1.5">
            <span class="text-gray-500">Total Comments</span>
            <span class="font-medium text-gray-900">{{ accountInfo.total_comments }}</span>
          </div>
        </div>
      </div>

      <!-- Save buttons -->
      <div class="flex items-center justify-end space-x-3">
        <button
          type="button"
          @click="handleReset"
          class="px-3 py-1.5 border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!loading">Save Changes</span>
          <span v-else>Saving...</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

import { createValidation, required, pattern, minLength } from '~/composables/useFormValidation'

const { errors, touched, validateField, validateAll, setTouched } = createValidation<{
  username: string
  email: string
}>({
  username: [required('Please enter a username')],
  email: [required('Please enter an email'), pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address')]
})

const { success, error: showError, warning, confirm: showConfirm } = useNotification()

const fileInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const passwordLoading = ref(false)

// Fetch current user data
const { data: userData, error } = await useFetch('/api/auth/user')

if (error.value) {
  // Redirect to login if not authenticated
  await navigateTo('/admin/login')
}

// Store original data for reset functionality
const originalData = {
  avatar_url: userData.value?.user?.avatar_url || '',
  username: userData.value?.user?.username || '',
  email: userData.value?.user?.email || '',
  display_name: userData.value?.user?.full_name || '',
  role: userData.value?.user?.role || 'admin',
  bio: '',
  website: '',
  twitter: '',
  github: '',
  linkedin: '',
  email_notifications: true,
  two_factor_enabled: false
}

const formData = reactive({
  avatar_url: userData.value?.user?.avatar_url || '',
  username: userData.value?.user?.username || '',
  email: userData.value?.user?.email || '',
  display_name: userData.value?.user?.full_name || '',
  role: userData.value?.user?.role || 'admin',
  bio: '',
  website: '',
  twitter: '',
  github: '',
  linkedin: '',
  email_notifications: true,
  two_factor_enabled: false
})

const passwordForm = reactive({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const accountInfo = reactive({
  created_at: userData.value?.user?.created_at || '',
  last_login: userData.value?.user?.last_login_at || '',
  total_posts: 0,
  total_comments: 0
})

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    // TODO: Implement file upload
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.avatar_url = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeAvatar = () => {
  formData.avatar_url = ''
}

const handleSubmit = async () => {
  // validate fields first
  setTouched('username')
  setTouched('email')
  if (!validateAll(formData as any)) {
    return
  }

  loading.value = true

  try {
    await $fetch('/api/auth/profile', {
      method: 'PUT',
      body: {
        username: formData.username,
        email: formData.email,
        full_name: formData.display_name,
        avatar_url: formData.avatar_url
      }
    })

    success('Profile updated successfully!')
  } catch (error: any) {
    if (error.statusCode === 409) {
      showError('Failed to update profile', error.statusMessage || 'Username or email already taken')
    } else {
      showError('Failed to update profile', 'Please try again.')
    }
    console.error('Update profile error:', error)
  } finally {
    loading.value = false
  }
}

const handlePasswordChange = async () => {
  if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password) {
    warning('Please fill in all password fields')
    return
  }

  if (passwordForm.new_password !== passwordForm.confirm_password) {
    showError('Passwords do not match', 'The new passwords you entered do not match')
    return
  }

  if (passwordForm.new_password.length < 8) {
    showError('Password too short', 'New password must be at least 8 characters long')
    return
  }

  passwordLoading.value = true

  try {
    await $fetch('/api/auth/password', {
      method: 'PUT',
      body: {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      }
    })

    success('Password updated successfully!')

    // Reset password form
    passwordForm.current_password = ''
    passwordForm.new_password = ''
    passwordForm.confirm_password = ''
  } catch (error: any) {
    if (error.statusCode === 401) {
      showError('Incorrect password', 'The current password you entered is incorrect')
    } else if (error.statusCode === 400) {
      showError('Invalid password', error.statusMessage || 'Please check your password')
    } else {
      showError('Failed to update password', 'Please try again.')
    }
    console.error('Change password error:', error)
  } finally {
    passwordLoading.value = false
  }
}

const handleDeleteAccount = async () => {
  const password = prompt('To delete your account, please enter your password:')

  if (!password) {
    return
  }

  await showConfirm({
    title: 'Delete Account',
    message: 'Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted.',
    confirmText: 'Delete Account',
    cancelText: 'Cancel',
    variant: 'danger',
    loadingText: 'Deleting...',
    onConfirm: async () => {
      try {
        await $fetch('/api/auth/account', {
          method: 'DELETE',
          body: { password }
        })

        success('Account deleted successfully')
        // Redirect to home page
        await navigateTo('/')
      } catch (error: any) {
        if (error.statusCode === 401) {
          showError('Incorrect password', 'The password you entered is incorrect')
        } else {
          showError('Failed to delete account', 'Please try again.')
        }
        console.error('Delete account error:', error)
      }
    }
  })
}

const handleReset = () => {
  // Reset form to original values
  Object.assign(formData, originalData)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
