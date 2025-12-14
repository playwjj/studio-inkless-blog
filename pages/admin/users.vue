<template>
	<div class="px-8 py-6">
		<div class="flex items-center justify-between mb-8">
			<div>
				<h1 class="text-2xl font-semibold text-gray-900">Users</h1>
				<p class="mt-1 text-sm text-gray-500">Manage application users</p>
			</div>
			<button
				@click="showCreateModal = true"
				class="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
			>
				<svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				New User
			</button>
		</div>

		<div class="border border-gray-200">
			<div v-if="loading" class="py-12 text-center">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
				<p class="mt-2 text-sm text-gray-500">Loading users...</p>
			</div>

			<div v-else-if="users.length === 0" class="py-12 text-center">
				<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
				</svg>
				<h3 class="mt-2 text-sm font-medium text-gray-900">No users</h3>
				<p class="mt-1 text-sm text-gray-500">Create your first user account.</p>
				<div class="mt-6">
					<button
						@click="showCreateModal = true"
						class="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
					>
						<svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
						</svg>
						New User
					</button>
				</div>
			</div>

			<div v-else class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-gray-50 border-b border-gray-200">
						<tr>
							<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
							<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
							<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
							<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
							<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
							<th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						<tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
							<td class="px-4 py-3">
								<div class="flex items-center space-x-3">
									<img v-if="user.avatar_url" :src="user.avatar_url" :alt="user.username" class="w-10 h-10 rounded-full object-cover" />
									<div v-else class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
										<svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
										</svg>
									</div>
									<div>
										<div class="text-sm font-medium text-gray-900">{{ user.full_name || user.username }}</div>
										<div class="text-xs text-gray-500">@{{ user.username }}</div>
									</div>
								</div>
							</td>
							<td class="px-4 py-3 text-sm text-gray-700">{{ user.email }}</td>
							<td class="px-4 py-3 text-sm text-gray-700">{{ user.role }}</td>
							<td class="px-4 py-3 text-sm">
								<span v-if="user.is_active" class="text-green-600">Active</span>
								<span v-else class="text-gray-500">Inactive</span>
							</td>
							<td class="px-4 py-3 whitespace-nowrap text-xs text-gray-500">{{ formatDate(user.created_at) }}</td>
							<td class="px-4 py-3 whitespace-nowrap text-right">
								<div class="flex items-center justify-end space-x-2">
									<button @click="editUser(user)" class="text-gray-400 hover:text-gray-900" title="Edit">
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
										</svg>
									</button>
									<button @click="deleteUser(user.id)" class="text-gray-400 hover:text-red-600" title="Delete">
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
		<div v-if="showCreateModal || editingUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeModal">
			<div class="bg-white border border-gray-200 max-w-lg w-full p-6">
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-lg font-semibold text-gray-900">{{ editingUser ? 'Edit User' : 'New User' }}</h2>
					<button @click="closeModal" class="text-gray-400 hover:text-gray-900">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<form @submit.prevent="handleSubmit" class="space-y-4" novalidate>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1.5">Username <span class="text-red-500">*</span></label>
							<input v-model="userForm.username" type="text" class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none" placeholder="username" @blur="() => { setTouched('username'); validateField('username', userForm) }" />
							<p v-if="touched.username && errors.username" class="mt-1 text-xs text-red-600">{{ errors.username }}</p>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1.5">Email <span class="text-red-500">*</span></label>
							<input v-model="userForm.email" type="text" class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none" placeholder="user@example.com" @blur="() => { setTouched('email'); validateField('email', userForm) }" />
							<p v-if="touched.email && errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
						</div>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
						<input v-model="userForm.full_name" type="text" class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none" placeholder="Full name" />
					</div>

					<div>
						<AdminImageUploader v-model="userForm.avatar_url" label="Avatar" input-id="user_avatar" placeholder="https://example.com/avatar.jpg" alt-text="User avatar" upload-button-text="Upload Avatar" :compact="true" />
						<p v-if="touched.avatar_url && errors.avatar_url" class="mt-1 text-xs text-red-600">{{ errors.avatar_url }}</p>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
							<select v-model="userForm.role" class="w-full px-3 py-2 border border-gray-200 text-sm outline-none">
								<option value="admin">admin</option>
								<option value="editor">editor</option>
								<option value="viewer">viewer</option>
							</select>
						</div>
						<div class="flex items-start">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1.5">Active</label>
								<input type="checkbox" v-model="userForm.is_active" class="mt-2" />
							</div>
						</div>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1.5">Password <span v-if="!editingUser" class="text-red-500">*</span></label>
						<input v-model="userForm.password" type="password" :placeholder="editingUser ? 'Leave blank to keep current password' : 'At least 8 characters'" class="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none" @blur="() => { setTouched('password'); validateField('password', userForm) }" />
						<p v-if="touched.password && errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</p>
					</div>

					<div class="flex items-center justify-end space-x-3 pt-4">
						<button type="button" @click="closeModal" :disabled="submitting" class="px-3 py-1.5 border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
						<button type="submit" :disabled="submitting" class="px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
							<span v-if="!submitting">{{ editingUser ? 'Save' : 'Create' }}</span>
							<span v-else>{{ editingUser ? 'Saving...' : 'Creating...' }}</span>
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

import { createValidation, required, isUrl, pattern, minLength } from '~/composables/useFormValidation'

const { errors, touched, validateField, validateAll, setTouched } = createValidation<{
	username: string
	email: string
	avatar_url?: string
	password: string
}>({
	username: [required('Please enter a username')],
	email: [required('Please enter an email'), pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email')],
	avatar_url: [isUrl('Avatar URL must be a valid URL')],
	password: []
})

const { success, error: showError, confirm: showConfirm } = useNotification()

// Check authentication
const { data: userData, error: authError } = await useFetch('/api/auth/user')

if (authError.value) {
	// Redirect to login if not authenticated
	await navigateTo('/admin/login')
}

interface User {
	id: number
	username: string
	email: string
	full_name?: string
	avatar_url?: string
	role: 'admin' | 'editor' | 'viewer'
	is_active: number
	created_at: string
	updated_at: string
}

const showCreateModal = ref(false)
const editingUser = ref<User | null>(null)
const loading = ref(false)
const submitting = ref(false)

const userForm = reactive({
	username: '',
	email: '',
	full_name: '',
	avatar_url: '',
	role: 'viewer',
	is_active: true,
	password: ''
})

const users = ref<User[]>([])

// Load users on mount
onMounted(() => {
	loadUsers()
})

async function loadUsers() {
	loading.value = true
	try {
		const response = await $fetch('/api/admin/users')
		users.value = response.data || []
	} catch (err) {
		console.error('Failed to load users:', err)
		showError('Failed to load users', 'Please try again.')
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
	editingUser.value = null
	userForm.username = ''
	userForm.email = ''
	userForm.full_name = ''
	userForm.avatar_url = ''
	userForm.role = 'viewer'
	userForm.is_active = true
	userForm.password = ''
}

const editUser = (user: User) => {
	editingUser.value = user
	userForm.username = user.username
	userForm.email = user.email
	userForm.full_name = user.full_name || ''
	userForm.avatar_url = user.avatar_url || ''
	userForm.role = user.role
	userForm.is_active = !!user.is_active
	userForm.password = ''
}

const handleSubmit = async () => {
	if (submitting.value) return

	// mark fields as touched so errors show
	setTouched('username')
	setTouched('email')
	setTouched('avatar_url')
	setTouched('password')

	// password validation
	const form = userForm as any
	let passwordValid = true
	if (!editingUser.value) {
		// For new users, password is required and must be at least 8 characters
		if (!form.password || form.password.length < 8) {
			errors.password.value = 'Password is required and must be at least 8 characters'
			passwordValid = false
		} else {
			errors.password.value = null
		}
	} else {
		// For editing, password is optional but if provided must be at least 8 characters
		if (form.password && form.password.length > 0 && form.password.length < 8) {
			errors.password.value = 'Password must be at least 8 characters'
			passwordValid = false
		} else {
			errors.password.value = null
		}
	}

	if (!validateAll(form) || !passwordValid) {
		return
	}

	submitting.value = true

	try {
		if (editingUser.value) {
			const body: any = {
				username: userForm.username,
				email: userForm.email,
				full_name: userForm.full_name,
				avatar_url: userForm.avatar_url,
				role: userForm.role,
				is_active: userForm.is_active
			}
			if (userForm.password) body.password = userForm.password

			await $fetch(`/api/admin/users/${editingUser.value.id}`, {
				method: 'PUT',
				body
			})

			success('User updated successfully!')
		} else {
			await $fetch('/api/admin/users', {
				method: 'POST',
				body: {
					username: userForm.username,
					email: userForm.email,
					full_name: userForm.full_name,
					avatar_url: userForm.avatar_url,
					role: userForm.role,
					is_active: userForm.is_active,
					password: userForm.password
				}
			})

			success('User created successfully!')
		}

		closeModal()
		await loadUsers()
	} catch (error: any) {
		if (error.statusCode === 400) {
			showError('Invalid input', error.statusMessage || 'Please fill in required fields')
		} else if (error.statusCode === 409) {
			showError('Conflict', error.statusMessage || 'A user with that username or email already exists')
		} else {
			showError('Failed to save user', 'Please try again.')
		}
		console.error('Submit user error:', error)
	} finally {
		submitting.value = false
	}
}

const deleteUser = async (id: number) => {
		const user = users.value.find((u: User) => u.id === id)
	const name = user?.full_name || user?.username || 'this user'

	await showConfirm({
		title: 'Delete User',
		message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
		confirmText: 'Delete',
		cancelText: 'Cancel',
		variant: 'danger',
		onConfirm: async () => {
			try {
				await $fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
				success('User deleted successfully!')
				await loadUsers()
			} catch (error: any) {
				if (error.statusCode === 404) {
					showError('User not found', 'This user may have already been deleted')
				} else {
					showError('Failed to delete user', 'Please try again.')
				}
				console.error('Delete user error:', error)
			}
		}
	})
}
</script>