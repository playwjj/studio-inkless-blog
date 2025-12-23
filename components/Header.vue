<template>
  <header class="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <NuxtLink to="/" class="group flex items-center gap-3" style="gap: 0.75rem;">
          <NuxtImg
            :src="siteConfig?.logo_url || '/favicon.svg'"
            :alt="`${siteConfig?.name || 'Studio Inkless'} Logo`"
            class="w-10 h-10 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
            width="40"
            height="40"
            style="width: 2.5rem; height: 2.5rem;"
          />
          <span class="text-2xl font-bold bg-gradient-to-r from-ai-purple via-ai-cyan to-ai-pink bg-clip-text text-transparent whitespace-nowrap" style="font-size: 1.5rem;">
            {{ siteConfig?.name || 'Studio Inkless Blog' }}
          </span>
        </NuxtLink>

        <div class="hidden md:flex items-center space-x-1">
          <NuxtLink
            v-for="item in headerMenu"
            :key="item.id"
            :to="item.url"
            :target="item.target"
            class="relative px-4 py-2 font-medium transition-all duration-300 group"
          >
            <span
              class="relative z-10 transition-all duration-300"
              :class="isActive(item.url)
                ? 'text-transparent bg-gradient-to-r from-ai-purple via-ai-cyan to-ai-pink bg-clip-text font-semibold'
                : 'text-gray-700 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-ai-purple group-hover:via-ai-cyan group-hover:to-ai-pink group-hover:bg-clip-text'"
            >
              {{ item.title }}
            </span>

            <!-- Animated underline -->
            <span
              class="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-ai-purple via-ai-cyan to-ai-pink transition-all duration-300 rounded-full"
              :class="isActive(item.url) ? 'w-full' : 'w-0 group-hover:w-full'"
            ></span>

            <!-- Glow effect on hover -->
            <span class="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-ai-purple/5 via-ai-cyan/5 to-ai-pink/5 transition-opacity duration-300"></span>
          </NuxtLink>
        </div>

        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-ai-purple/10 hover:via-ai-cyan/10 hover:to-ai-pink/10 transition-all duration-300"
        >
          <svg
            class="h-6 w-6 transition-transform duration-300"
            :class="{ 'rotate-90': mobileMenuOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              v-if="!mobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile menu with slide animation -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="mobileMenuOpen" class="md:hidden py-4 space-y-1 border-t border-gray-100">
          <NuxtLink
            v-for="item in headerMenu"
            :key="item.id"
            :to="item.url"
            :target="item.target"
            class="block px-4 py-2.5 font-medium hover:bg-gradient-to-r hover:from-ai-purple/10 hover:via-ai-cyan/10 hover:to-ai-pink/10 transition-all duration-300"
            :class="isActive(item.url)
              ? 'bg-gradient-to-r from-ai-purple/10 via-ai-cyan/10 to-ai-pink/10'
              : ''"
            @click="mobileMenuOpen = false"
          >
            <span
              :class="isActive(item.url)
                ? 'text-transparent bg-gradient-to-r from-ai-purple via-ai-cyan to-ai-pink bg-clip-text font-semibold'
                : 'text-gray-700'"
            >
              {{ item.title }}
            </span>
          </NuxtLink>
        </div>
      </transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
const { siteConfig } = useSiteConfig()
const route = useRoute()

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Check if menu item is active
const isActive = (url: string) => {
  // Exact match for home page
  if (url === '/' && route.path === '/') return true
  // For other pages, check if current path starts with the menu URL
  if (url !== '/' && route.path.startsWith(url)) return true
  return false
}

// Fetch header menu items
const { data: menuData } = await useFetch('/api/menu?type=header')
const headerMenu = computed(() => menuData.value?.items || [])
</script>
