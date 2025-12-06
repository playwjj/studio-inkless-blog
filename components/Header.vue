<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <NuxtLink to="/" class="flex items-center space-x-3">
          <img src="/favicon.svg" alt="Studio Inkless Logo" class="w-10 h-10">
          <span class="text-2xl font-bold text-primary-600">Studio Inkless Blog</span>
        </NuxtLink>

        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink
            to="/"
            class="text-gray-700 hover:text-primary-600 transition-colors"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/blog"
            class="text-gray-700 hover:text-primary-600 transition-colors"
          >
            Blog
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="text-gray-700 hover:text-primary-600 transition-colors"
          >
            About
          </NuxtLink>
        </div>

        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          <svg
            class="h-6 w-6"
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

      <div v-if="mobileMenuOpen" class="md:hidden py-4 space-y-2">
        <NuxtLink
          to="/"
          class="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
          @click="mobileMenuOpen = false"
        >
          Home
        </NuxtLink>
        <NuxtLink
          to="/blog"
          class="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
          @click="mobileMenuOpen = false"
        >
          Blog
        </NuxtLink>
        <NuxtLink
          to="/about"
          class="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
          @click="mobileMenuOpen = false"
        >
          About
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>
