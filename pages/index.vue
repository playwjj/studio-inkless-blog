<template>
  <div class="min-h-screen">
    <!-- Hero Section - Lightweight -->
    <section class="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <!-- Animated background gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-indigo-500/5 to-purple-600/5 animate-gradient-shift"></div>

      <!-- Dot pattern -->
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.1) 1px, transparent 0); background-size: 40px 40px;"></div>

      <!-- Animated lines background -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <!-- Lines layer with stretched aspect ratio -->
        <svg class="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="line-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:rgb(59, 130, 246);stop-opacity:0.5" />
              <stop offset="50%" style="stop-color:rgb(99, 102, 241);stop-opacity:0.3" />
              <stop offset="100%" style="stop-color:rgb(59, 130, 246);stop-opacity:0.5" />
            </linearGradient>
            <linearGradient id="line-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:rgb(139, 92, 246);stop-opacity:0.5" />
              <stop offset="50%" style="stop-color:rgb(236, 72, 153);stop-opacity:0.3" />
              <stop offset="100%" style="stop-color:rgb(139, 92, 246);stop-opacity:0.5" />
            </linearGradient>
            <linearGradient id="line-gradient-3" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:rgb(34, 211, 238);stop-opacity:0.5" />
              <stop offset="50%" style="stop-color:rgb(59, 130, 246);stop-opacity:0.3" />
              <stop offset="100%" style="stop-color:rgb(34, 211, 238);stop-opacity:0.5" />
            </linearGradient>
          </defs>

          <!-- Animated curved lines that span full width -->
          <path class="animate-line-draw-1" d="M -5 30 Q 25 20, 50 35 T 105 30" stroke="url(#line-gradient-1)" stroke-width="0.3" fill="none" opacity="0.7" />
          <path class="animate-line-draw-2" d="M -5 60 Q 25 50, 50 65 T 105 60" stroke="url(#line-gradient-2)" stroke-width="0.3" fill="none" opacity="0.65" />
          <path class="animate-line-draw-3" d="M -5 45 Q 25 35, 50 48 T 105 45" stroke="url(#line-gradient-3)" stroke-width="0.3" fill="none" opacity="0.7" />

          <!-- Additional wave lines for fullness -->
          <path class="animate-line-draw-1" d="M -5 25 Q 25 15, 50 28 T 105 25" stroke="url(#line-gradient-1)" stroke-width="0.18" fill="none" opacity="0.45" />
          <path class="animate-line-draw-2" d="M -5 70 Q 25 60, 50 72 T 105 70" stroke="url(#line-gradient-2)" stroke-width="0.18" fill="none" opacity="0.35" />

          <!-- Static grid lines that fade in/out -->
          <g class="animate-grid-pulse" opacity="0.12">
            <line x1="0" y1="20" x2="100" y2="20" stroke="rgb(148, 163, 184)" stroke-width="0.15" stroke-dasharray="2,2" vector-effect="non-scaling-stroke" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgb(148, 163, 184)" stroke-width="0.15" stroke-dasharray="2,2" vector-effect="non-scaling-stroke" />
            <line x1="0" y1="80" x2="100" y2="80" stroke="rgb(148, 163, 184)" stroke-width="0.15" stroke-dasharray="2,2" vector-effect="non-scaling-stroke" />
            <line x1="20" y1="0" x2="20" y2="100" stroke="rgb(148, 163, 184)" stroke-width="0.15" stroke-dasharray="2,2" vector-effect="non-scaling-stroke" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="rgb(148, 163, 184)" stroke-width="0.15" stroke-dasharray="2,2" vector-effect="non-scaling-stroke" />
            <line x1="80" y1="0" x2="80" y2="100" stroke="rgb(148, 163, 184)" stroke-width="0.15" stroke-dasharray="2,2" vector-effect="non-scaling-stroke" />
          </g>
        </svg>

        <!-- Dots layer using CSS for perfect circles -->
        <div class="animate-dot-path-1 absolute w-2 h-2 rounded-full bg-blue-500 opacity-90"></div>
        <div class="animate-dot-path-2 absolute w-2 h-2 rounded-full bg-purple-500 opacity-90"></div>
        <div class="animate-dot-path-3 absolute w-2 h-2 rounded-full bg-cyan-400 opacity-90"></div>
        <div class="animate-dot-path-4 absolute w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-70"></div>
        <div class="animate-dot-path-5 absolute w-1.5 h-1.5 rounded-full bg-pink-400 opacity-70"></div>

        <!-- Floating gradient orbs for depth -->
        <div class="absolute w-64 h-64 bg-gradient-to-br from-blue-400/10 to-indigo-400/5 rounded-full top-10 left-10 animate-float-slow blur-3xl"></div>
        <div class="absolute w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/5 rounded-full bottom-0 right-0 animate-float-medium blur-3xl"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div class="text-center max-w-3xl mx-auto">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium mb-8 border border-gray-200 shadow-sm">
            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span class="text-gray-700">Welcome to our blog</span>
          </div>

          <!-- Main Heading -->
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-gray-900">
            Modern Web Development
            <span class="block mt-2 bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Insights & Tutorials
            </span>
          </h1>

          <p class="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
            Learn Nuxt, Vue, TypeScript, and modern web technologies through practical tutorials and best practices.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <NuxtLink
              to="/blog"
              class="group inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Explore Articles
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
            <NuxtLink
              to="/about"
              class="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-xl font-semibold transition-colors border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
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
    <section class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center border border-blue-100 hover:shadow-lg transition-shadow">
            <div class="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
              {{ data?.posts?.length || 0 }}
            </div>
            <div class="text-gray-600 text-sm md:text-base font-medium">Articles Published</div>
          </div>
          <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-center border border-purple-100 hover:shadow-lg transition-shadow">
            <div class="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
              {{ categories?.length || 0 }}
            </div>
            <div class="text-gray-600 text-sm md:text-base font-medium">Categories</div>
          </div>
          <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center border border-green-100 hover:shadow-lg transition-shadow">
            <div class="text-3xl md:text-4xl font-bold text-green-600 mb-2">
              50K+
            </div>
            <div class="text-gray-600 text-sm md:text-base font-medium">Monthly Readers</div>
          </div>
          <div class="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 text-center border border-orange-100 hover:shadow-lg transition-shadow">
            <div class="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
              100%
            </div>
            <div class="text-gray-600 text-sm md:text-base font-medium">Free Content</div>
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

<style scoped>
/* Floating orbs animations */
@keyframes float-slow {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(120deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(240deg);
  }
}

@keyframes float-medium {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(-40px, 40px) rotate(180deg);
  }
}

/* Line drawing animations */
@keyframes line-draw-1 {
  0%, 100% {
    stroke-dashoffset: 0;
    opacity: 0.6;
  }
  50% {
    stroke-dashoffset: 100;
    opacity: 0.3;
  }
}

@keyframes line-draw-2 {
  0%, 100% {
    stroke-dashoffset: 0;
    opacity: 0.5;
  }
  50% {
    stroke-dashoffset: -100;
    opacity: 0.2;
  }
}

@keyframes line-draw-3 {
  0%, 100% {
    stroke-dashoffset: 0;
    opacity: 0.6;
  }
  50% {
    stroke-dashoffset: 80;
    opacity: 0.3;
  }
}

/* Grid pulse animation */
@keyframes grid-pulse {
  0%, 100% {
    opacity: 0.15;
  }
  50% {
    opacity: 0.05;
  }
}

/* Gradient shift */
@keyframes gradient-shift {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Dot path animations using offset-path */
@keyframes dot-move-1 {
  0% {
    offset-distance: 0%;
  }
  100% {
    offset-distance: 100%;
  }
}

@keyframes dot-move-2 {
  0% {
    offset-distance: 0%;
  }
  100% {
    offset-distance: 100%;
  }
}

@keyframes dot-move-3 {
  0% {
    offset-distance: 0%;
  }
  100% {
    offset-distance: 100%;
  }
}

/* Apply animations */
.animate-float-slow {
  animation: float-slow 25s ease-in-out infinite;
}

.animate-float-medium {
  animation: float-medium 20s ease-in-out infinite;
}

.animate-line-draw-1 {
  stroke-dasharray: 1000;
  animation: line-draw-1 20s ease-in-out infinite;
}

.animate-line-draw-2 {
  stroke-dasharray: 1000;
  animation: line-draw-2 25s ease-in-out infinite;
}

.animate-line-draw-3 {
  stroke-dasharray: 1000;
  animation: line-draw-3 18s ease-in-out infinite;
}

.animate-grid-pulse {
  animation: grid-pulse 10s ease-in-out infinite;
}

.animate-gradient-shift {
  animation: gradient-shift 8s ease-in-out infinite;
}

/* Dot path animations - simulate wave movement */
.animate-dot-path-1 {
  animation: dot-path-1 12s ease-in-out infinite;
}

.animate-dot-path-2 {
  animation: dot-path-2 15s ease-in-out infinite;
}

.animate-dot-path-3 {
  animation: dot-path-3 10s ease-in-out infinite;
}

.animate-dot-path-4 {
  animation: dot-path-4 18s ease-in-out infinite;
}

.animate-dot-path-5 {
  animation: dot-path-5 14s ease-in-out infinite;
}

@keyframes dot-path-1 {
  0% { left: -2%; top: 30%; }
  25% { left: 25%; top: 20%; }
  50% { left: 50%; top: 35%; }
  75% { left: 75%; top: 30%; }
  100% { left: 102%; top: 30%; }
}

@keyframes dot-path-2 {
  0% { left: -2%; top: 60%; }
  25% { left: 25%; top: 50%; }
  50% { left: 50%; top: 65%; }
  75% { left: 75%; top: 60%; }
  100% { left: 102%; top: 60%; }
}

@keyframes dot-path-3 {
  0% { left: -2%; top: 45%; }
  25% { left: 25%; top: 35%; }
  50% { left: 50%; top: 48%; }
  75% { left: 75%; top: 45%; }
  100% { left: 102%; top: 45%; }
}

@keyframes dot-path-4 {
  0% { left: -2%; top: 25%; }
  25% { left: 25%; top: 15%; }
  50% { left: 50%; top: 28%; }
  75% { left: 75%; top: 25%; }
  100% { left: 102%; top: 25%; }
}

@keyframes dot-path-5 {
  0% { left: -2%; top: 70%; }
  25% { left: 25%; top: 60%; }
  50% { left: 50%; top: 72%; }
  75% { left: 75%; top: 70%; }
  100% { left: 102%; top: 70%; }
}
</style>
