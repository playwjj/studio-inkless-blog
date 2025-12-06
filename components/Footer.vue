<template>
  <footer class="bg-gradient-to-br from-gray-50 to-white border-t border-gray-200 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        <!-- About Section -->
        <div class="lg:col-span-1">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900">Studio Inkless</h3>
          </div>
          <p class="text-gray-600 text-sm leading-relaxed mb-4">
            A modern blog built with Nuxt 3, Vue 3, and Tailwind CSS. Exploring web development, design, and technology.
          </p>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              <span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
              Active
            </span>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Quick Links</h3>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/" class="group inline-flex items-center text-gray-600 hover:text-primary-600 text-sm transition-colors">
                <svg class="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Home
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/blog" class="group inline-flex items-center text-gray-600 hover:text-primary-600 text-sm transition-colors">
                <svg class="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Blog
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about" class="group inline-flex items-center text-gray-600 hover:text-primary-600 text-sm transition-colors">
                <svg class="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                About
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Categories -->
        <div>
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Categories</h3>
          <ul v-if="categories" class="space-y-3">
            <li v-for="category in categories.slice(0, 4)" :key="category.slug">
              <NuxtLink
                :to="`/blog/category/${category.slug}`"
                class="group inline-flex items-center text-gray-600 hover:text-primary-600 text-sm transition-colors"
              >
                <svg class="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                {{ category.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Connect & Resources -->
        <div>
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Connect</h3>
          <div class="space-y-4">
            <a
              href="https://github.com/playwjj/studio-inkless-blog"
              target="_blank"
              rel="noopener noreferrer"
              class="group inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-900 text-gray-700 hover:text-white rounded-lg border border-gray-200 hover:border-gray-900 transition-all shadow-sm hover:shadow-md"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
              </svg>
              <span class="text-sm font-medium">GitHub</span>
            </a>
            <div class="pt-2">
              <p class="text-xs text-gray-500 mb-2">Built with</p>
              <div class="flex flex-wrap gap-2">
                <span class="inline-flex items-center px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium border border-green-200">
                  Nuxt 3
                </span>
                <span class="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-200">
                  Vue 3
                </span>
                <span class="inline-flex items-center px-2.5 py-1 bg-cyan-50 text-cyan-700 rounded-md text-xs font-medium border border-cyan-200">
                  Tailwind
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-12 pt-8 border-t border-gray-200">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-center md:text-left text-gray-500 text-sm">
            &copy; {{ currentYear }} Studio Inkless Blog. All rights reserved.
          </p>
          <div class="flex items-center gap-6 text-sm">
            <a href="https://github.com/playwjj/studio-inkless-blog" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-gray-900 transition-colors">
              View Source
            </a>
            <span class="text-gray-300">•</span>
            <span class="text-gray-500">
              Deployed on
              <a href="https://pages.cloudflare.com" target="_blank" rel="noopener noreferrer" class="text-orange-600 hover:text-orange-700 font-medium transition-colors">
                Cloudflare Pages
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()

// Fetch categories for footer
const { data: categories } = await useFetch('/api/categories')
</script>
