<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-indigo-500/10 to-purple-600/10"></div>
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.15) 1px, transparent 0); background-size: 40px 40px;"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 shadow-lg shadow-primary-500/50 mb-8">
            <img src="/favicon.svg" alt="Studio Inkless" class="w-12 h-12 brightness-0 invert">
          </div>
          <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Studio Inkless Blog
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
            A modern blogging platform crafted with passion, powered by cutting-edge technologies
          </p>
          <div class="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Always Learning</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span>Open Source</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div class="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
          <div class="text-3xl font-bold text-primary-600 mb-2">100%</div>
          <div class="text-sm text-gray-600">Type Safe</div>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
          <div class="text-3xl font-bold text-primary-600 mb-2">SSR</div>
          <div class="text-sm text-gray-600">Optimized</div>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
          <div class="text-3xl font-bold text-primary-600 mb-2">Fast</div>
          <div class="text-sm text-gray-600">Performance</div>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
          <div class="text-3xl font-bold text-primary-600 mb-2">Modern</div>
          <div class="text-sm text-gray-600">Design</div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Mission Section -->
      <div class="mb-20">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <div class="w-20 h-1 bg-gradient-to-r from-primary-500 to-indigo-500 mx-auto rounded-full"></div>
        </div>
        <div class="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <p class="text-lg md:text-xl text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
            We're dedicated to sharing knowledge about web development, design, and technology.
            Our goal is to create high-quality content that helps developers of all skill levels
            grow and succeed in their careers. Through thoughtful writing and practical examples,
            we aim to make complex concepts accessible to everyone.
          </p>
        </div>
      </div>

      <!-- Technology Stack -->
      <div class="mb-20">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Technology Stack</h2>
          <div class="w-20 h-1 bg-gradient-to-r from-primary-500 to-indigo-500 mx-auto rounded-full"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Nuxt 3</h3>
            <p class="text-gray-600 leading-relaxed">
              The intuitive Vue framework for building modern web applications with server-side rendering.
            </p>
          </div>

          <div class="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Tailwind CSS</h3>
            <p class="text-gray-600 leading-relaxed">
              A utility-first CSS framework for rapidly building custom user interfaces.
            </p>
          </div>

          <div class="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">TypeScript</h3>
            <p class="text-gray-600 leading-relaxed">
              Strongly typed JavaScript that scales with type safety and enhanced developer experience.
            </p>
          </div>

          <div class="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Cloudflare</h3>
            <p class="text-gray-600 leading-relaxed">
              Global deployment platform ensuring fast, secure access from anywhere in the world.
            </p>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="mb-20">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
          <div class="w-20 h-1 bg-gradient-to-r from-primary-500 to-indigo-500 mx-auto rounded-full"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Server-Side Rendering</h3>
              <p class="text-gray-600">Optimal SEO and performance with SSR and static generation</p>
            </div>
          </div>

          <div class="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">RESTful API</h3>
              <p class="text-gray-600">Scalable architecture for efficient data management</p>
            </div>
          </div>

          <div class="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Responsive Design</h3>
              <p class="text-gray-600">Beautiful experience on all devices and screen sizes</p>
            </div>
          </div>

          <div class="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Smart Filtering</h3>
              <p class="text-gray-600">Category and tag-based filtering for easy content discovery</p>
            </div>
          </div>

          <div class="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Global CDN</h3>
              <p class="text-gray-600">Lightning-fast load times powered by Cloudflare's network</p>
            </div>
          </div>

          <div class="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Type Safety</h3>
              <p class="text-gray-600">Full TypeScript support for reliable, maintainable code</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Note Section -->
      <div class="max-w-4xl mx-auto">
        <div class="relative overflow-hidden bg-gradient-to-br from-primary-50 to-indigo-50 rounded-3xl p-8 md:p-12 border border-primary-100 shadow-lg">
          <div class="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary-200 rounded-full opacity-20 blur-2xl"></div>
          <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-indigo-200 rounded-full opacity-20 blur-2xl"></div>
          <div class="relative">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">Demo Project</h3>
                <p class="text-gray-700 leading-relaxed">
                  This is a demonstration project showcasing modern web development practices and design patterns.
                  The blog posts are mock data created for illustration purposes to demonstrate the platform's capabilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { siteConfig } = useSiteConfig()

// Try to fetch page-specific data from pages table (slug = '/about')
// If not found, will fall back to site config
const { data: pageData } = await useFetch(`/api/pages/page?slug=${encodeURIComponent('/about')}`).catch(() => ({ data: null }))

// Configure SEO Meta tags
if (pageData.value) {
  // Use page-specific SEO data from pages table
  const metaTitle = pageData.value.meta_title || pageData.value.title || 'About - Studio Inkless Blog'
  const metaDescription = pageData.value.meta_description || pageData.value.description || siteConfig.value?.description || 'Learn about Studio Inkless Blog'
  const ogImage = pageData.value.og_image || pageData.value.cover_image || siteConfig.value?.og_image || 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1200'

  useSeoMeta({
    title: () => metaTitle,
    ogTitle: () => pageData.value?.og_title || metaTitle,
    description: () => metaDescription,
    ogDescription: () => pageData.value?.og_description || metaDescription,
    ogImage: () => ogImage,
    ogUrl: () => pageData.value?.canonical_url || siteConfig.value?.og_url || '',
    twitterCard: 'summary_large_image',
    twitterTitle: () => pageData.value?.og_title || metaTitle,
    twitterDescription: () => pageData.value?.og_description || metaDescription,
    twitterImage: () => ogImage,
  })

  // Add keywords meta tag if available
  if (pageData.value.meta_keywords) {
    useHead({
      meta: [
        { name: 'keywords', content: pageData.value.meta_keywords }
      ]
    })
  }

  // Add canonical URL if specified
  if (pageData.value.canonical_url) {
    useHead({
      link: [
        { rel: 'canonical', href: pageData.value.canonical_url }
      ]
    })
  }
} else {
  // Fall back to site-wide config with hardcoded defaults
  useSeoMeta({
    title: () => siteConfig.value?.title?.replace('${title}', 'About') || 'About - Studio Inkless Blog',
    ogTitle: () => siteConfig.value?.og_title || 'About Studio Inkless Blog',
    description: () => siteConfig.value?.description || 'Learn about Studio Inkless Blog - a modern blogging platform built with Nuxt 3, Tailwind CSS, and cutting-edge technologies.',
    ogDescription: () => siteConfig.value?.og_description || 'A modern blogging platform built with Nuxt 3, Tailwind CSS, and deployed on Cloudflare Pages.',
    ogImage: () => siteConfig.value?.og_image || 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1200',
    twitterCard: 'summary_large_image',
    twitterTitle: () => siteConfig.value?.twitter_title || 'About Studio Inkless Blog',
    twitterDescription: () => siteConfig.value?.twitter_description || 'A modern blogging platform built with Nuxt 3, Tailwind CSS, and deployed on Cloudflare Pages.',
    twitterImage: () => siteConfig.value?.twitter_image || 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1200',
  })
}
</script>
