<template>
  <div class="min-h-screen">
    <!-- Hero Section - Simplified -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-700 text-white">
      <!-- Subtle Background Elements -->
      <div class="absolute inset-0 overflow-hidden opacity-30">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div class="text-center max-w-3xl mx-auto">
          <!-- Main Heading -->
          <h1 class="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Modern Web Development
            <span class="block mt-1 text-primary-100 text-2xl md:text-3xl font-normal">
              Insights & Tutorials
            </span>
          </h1>

          <p class="text-base md:text-lg text-primary-100 mb-8 leading-relaxed">
            Learn Nuxt, Vue, TypeScript, and modern web technologies through practical tutorials and best practices.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <NuxtLink
              to="/blog"
              class="group inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl"
            >
              Explore Articles
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
            <NuxtLink
              to="/about"
              class="inline-flex items-center gap-2 text-white hover:text-primary-100 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              About Us
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Post Section -->
    <section class="bg-gray-50 py-16 md:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3 mb-12">
          <div class="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Featured Article</h2>
        </div>

        <div v-if="pending" class="animate-pulse">
          <div class="bg-gray-200 rounded-2xl h-96"></div>
        </div>

        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-600">Failed to load featured post. Please try again later.</p>
        </div>

        <FeaturedPostCard
          v-else-if="data?.posts && data.posts.length > 0"
          :post="data.posts[0]"
        />
      </div>
    </section>

    <!-- Latest Posts Section -->
    <section class="bg-white py-16 md:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Latest Posts</h2>
          </div>
          <NuxtLink
            to="/blog"
            class="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold group"
          >
            View all articles
            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
        </div>

        <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 3" :key="i" class="animate-pulse">
            <div class="bg-gray-200 aspect-video rounded-lg mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>

        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-600">Failed to load posts. Please try again later.</p>
        </div>

        <div v-else-if="data?.posts" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <BlogCard
            v-for="post in data.posts.slice(1, 4)"
            :key="post.id"
            :post="post"
          />
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="bg-gradient-to-br from-gray-50 to-white py-16 md:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Browse by Category</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our diverse range of topics and find exactly what you're looking for
          </p>
        </div>

        <div v-if="categoriesPending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="animate-pulse">
            <div class="bg-gray-200 rounded-xl h-40"></div>
          </div>
        </div>

        <div v-else-if="categories" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CategoryCard
            v-for="category in categories"
            :key="category.name"
            :name="category.name"
            :count="category.count"
          />
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="bg-white py-16 md:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewsletterSection />
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="bg-gray-50 py-16 md:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Read Our Blog?</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to providing high-quality content that helps you grow as a developer
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200">
            <div class="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Fast & Modern</h3>
            <p class="text-gray-600 leading-relaxed">
              Built with cutting-edge technologies like Nuxt 3 and Vue for the best reading experience
            </p>
          </div>

          <div class="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200">
            <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Expert Content</h3>
            <p class="text-gray-600 leading-relaxed">
              Every article is written and reviewed by experienced developers with real-world expertise
            </p>
          </div>

          <div class="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200">
            <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Practical Tutorials</h3>
            <p class="text-gray-600 leading-relaxed">
              Learn through hands-on examples and real-world projects you can apply immediately
            </p>
          </div>

          <div class="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200">
            <div class="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Global Reach</h3>
            <p class="text-gray-600 leading-relaxed">
              Deployed on Cloudflare's edge network for lightning-fast access from anywhere in the world
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="bg-gradient-to-r from-primary-600 to-primary-700 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-3xl md:text-4xl font-bold text-white mb-2">
              {{ data?.posts?.length || 0 }}
            </div>
            <div class="text-primary-100 text-sm md:text-base">Articles Published</div>
          </div>
          <div>
            <div class="text-3xl md:text-4xl font-bold text-white mb-2">
              {{ categories?.length || 0 }}
            </div>
            <div class="text-primary-100 text-sm md:text-base">Categories</div>
          </div>
          <div>
            <div class="text-3xl md:text-4xl font-bold text-white mb-2">
              50K+
            </div>
            <div class="text-primary-100 text-sm md:text-base">Monthly Readers</div>
          </div>
          <div>
            <div class="text-3xl md:text-4xl font-bold text-white mb-2">
              100%
            </div>
            <div class="text-primary-100 text-sm md:text-base">Free Content</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Fetch posts
const { data, pending, error } = await useFetch('/api/posts', {
  query: { limit: 10 }
})

// Fetch categories
const { data: categories, pending: categoriesPending } = await useFetch('/api/categories')

// SEO Meta
useSeoMeta({
  title: 'Studio Inkless Blog - Web Development & Technology Articles',
  ogTitle: 'Studio Inkless Blog',
  description: 'Discover articles about web development, design, and technology. Learn Nuxt 3, Vue, Tailwind CSS, and modern web development practices.',
  ogDescription: 'Discover articles about web development, design, and technology. Learn Nuxt 3, Vue, Tailwind CSS, and modern web development practices.',
  ogImage: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ogUrl: 'https://studio-inkless-blog.pages.dev',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Studio Inkless Blog',
  twitterDescription: 'Discover articles about web development, design, and technology.',
  twitterImage: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1200',
})
</script>
