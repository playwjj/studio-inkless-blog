<template>
  <div class="min-h-screen bg-white">
    <!-- Top Navigation Bar -->
    <header class="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200">
      <div class="flex items-center justify-between px-6 h-14">
        <div class="flex items-center space-x-6">
          <button
            @click="sidebarOpen = !sidebarOpen"
            class="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 class="text-sm font-semibold text-gray-900">Studio Inkless</h1>
        </div>

        <div class="flex items-center space-x-4">
          <NuxtLink to="/" target="_blank" class="text-xs text-gray-500 hover:text-gray-900 transition-colors">
            View Site →
          </NuxtLink>
          <div class="relative" v-click-outside="() => profileMenuOpen = false">
            <button
              @click="profileMenuOpen = !profileMenuOpen"
              class="flex items-center space-x-2 text-xs text-gray-700 hover:text-gray-900 transition-colors"
            >
              <img
                v-if="currentUser?.avatar_url"
                :src="currentUser.avatar_url"
                :alt="currentUser.username"
                class="w-6 h-6 rounded-full object-cover border border-gray-200"
              />
              <div
                v-else
                class="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-medium"
              >
                {{ getUserInitial(currentUser?.username || 'A') }}
              </div>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="profileMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg py-1"
            >
              <div class="px-4 py-2 border-b border-gray-100">
                <p class="text-xs font-medium text-gray-900">{{ currentUser?.username || 'Admin' }}</p>
                <p class="text-xs text-gray-500">{{ currentUser?.email || '' }}</p>
              </div>
              <NuxtLink
                to="/admin/profile"
                class="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                @click="profileMenuOpen = false"
              >
                Profile
              </NuxtLink>
              <button
                @click="handleLogout"
                :disabled="loggingOut"
                class="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loggingOut ? 'Logging out...' : 'Logout' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex pt-14">
      <!-- Sidebar -->
      <aside
        :class="[
          'fixed lg:static inset-y-0 left-0 z-20 w-56 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out mt-14 lg:mt-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        ]"
      >
        <nav class="p-3 space-y-0.5">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center space-x-3 px-3 py-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            active-class="bg-gray-100 text-gray-900 font-medium"
          >
            <component :is="item.icon" class="w-4 h-4" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>
      </aside>

      <!-- Overlay (mobile) -->
      <div
        v-if="sidebarOpen"
        @click="sidebarOpen = false"
        class="fixed inset-0 bg-black bg-opacity-25 z-10 lg:hidden mt-14"
      ></div>

      <!-- Main Content Area -->
      <main class="flex-1 min-h-screen">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const sidebarOpen = ref(false)
const profileMenuOpen = ref(false)
const loggingOut = ref(false)
const currentUser = ref<any>(null)

// Fetch current user
onMounted(async () => {
  try {
    const { data } = await useFetch('/api/auth/user')
    if (data.value?.user) {
      currentUser.value = data.value.user
    }
  } catch (error) {
    console.error('Failed to fetch user:', error)
  }
})

// Handle logout
const handleLogout = async () => {
  if (loggingOut.value) return

  loggingOut.value = true

  try {
    await $fetch('/api/auth/logout', {
      method: 'POST'
    })

    // Redirect to login page
    await navigateTo('/admin/login')
  } catch (error) {
    console.error('Logout error:', error)
    alert('Failed to logout. Please try again.')
  } finally {
    loggingOut.value = false
  }
}

// Get user initial for avatar
const getUserInitial = (username: string) => {
  return username.charAt(0).toUpperCase()
}

// Click outside directive
const vClickOutside = {
  mounted(el: any, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

const menuItems = [
  {
    path: '/admin',
    label: 'Dashboard',
    icon: 'IconDashboard'
  },
  {
    path: '/admin/posts',
    label: 'Posts',
    icon: 'IconDocument'
  },
  {
    path: '/admin/pages',
    label: 'Pages',
    icon: 'IconPages'
  },
  {
    path: '/admin/categories',
    label: 'Categories',
    icon: 'IconFolder'
  },
  {
    path: '/admin/tags',
    label: 'Tags',
    icon: 'IconTag'
  },
  {
    path: '/admin/site',
    label: 'Settings',
    icon: 'IconSettings'
  }
]

// Icon components
const IconDashboard = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
    </svg>
  `
}

const IconDocument = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  `
}

const IconPages = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  `
}

const IconFolder = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  `
}

const IconTag = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  `
}

const IconSettings = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  `
}
</script>
