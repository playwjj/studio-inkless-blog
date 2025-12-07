<template>
  <div class="min-h-screen">
    <!-- Error Background -->
    <section class="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <!-- Animated background gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-indigo-500/5 to-purple-600/5 animate-gradient-shift"></div>

      <!-- Dot pattern -->
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.1) 1px, transparent 0); background-size: 40px 40px;"></div>

      <!-- Animated lines background -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
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

          <path class="animate-line-draw-1" d="M -5 30 Q 25 20, 50 35 T 105 30" stroke="url(#line-gradient-1)" stroke-width="0.3" fill="none" opacity="0.7" />
          <path class="animate-line-draw-2" d="M -5 60 Q 25 50, 50 65 T 105 60" stroke="url(#line-gradient-2)" stroke-width="0.3" fill="none" opacity="0.65" />
          <path class="animate-line-draw-3" d="M -5 45 Q 25 35, 50 48 T 105 45" stroke="url(#line-gradient-3)" stroke-width="0.3" fill="none" opacity="0.7" />

          <path class="animate-line-draw-1" d="M -5 25 Q 25 15, 50 28 T 105 25" stroke="url(#line-gradient-1)" stroke-width="0.18" fill="none" opacity="0.45" />
          <path class="animate-line-draw-2" d="M -5 70 Q 25 60, 50 72 T 105 70" stroke="url(#line-gradient-2)" stroke-width="0.18" fill="none" opacity="0.35" />

          <g class="animate-grid-pulse" opacity="0.12">
            <line x1="0" y1="20" x2="100" y2="20" stroke="rgb(148, 163, 184)" stroke-width="0.15" stroke-dasharray="2,2" vector-effect="non-scaling-stroke" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgb(148, 163, 184)" stroke-width="0.15" stroke-dasharray="2,2" vector-effect="non-scaling-stroke" />
            <line x1="0" y1="80" x2="100" y2="80" stroke="rgb(148, 163, 184)" stroke-width="0.15" stroke-dasharray="2,2" vector-effect="non-scaling-stroke" />
            <line x1="20" y1="0" x2="20" y2="100" stroke="rgb(148, 163, 184)" stroke-width="0.15" stroke-dasharray="2,2" vector-effect="non-scaling-stroke" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="rgb(148, 163, 184)" stroke-width="0.15" stroke-dasharray="2,2" vector-effect="non-scaling-stroke" />
            <line x1="80" y1="0" x2="80" y2="100" stroke="rgb(148, 163, 184)" stroke-width="0.15" stroke-dasharray="2,2" vector-effect="non-scaling-stroke" />
          </g>
        </svg>

        <!-- Floating gradient orbs -->
        <div class="absolute w-64 h-64 bg-gradient-to-br from-red-400/10 to-orange-400/5 rounded-full top-10 left-10 animate-float-slow blur-3xl"></div>
        <div class="absolute w-96 h-96 bg-gradient-to-br from-orange-400/10 to-red-400/5 rounded-full bottom-0 right-0 animate-float-medium blur-3xl"></div>
      </div>

      <!-- Content -->
      <div class="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center max-w-2xl mx-auto">
          <!-- Error Code with Animation -->
          <div class="mb-8">
            <div class="inline-flex items-center justify-center">
              <div class="text-8xl md:text-9xl font-bold bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 bg-clip-text text-transparent animate-pulse">
                {{ statusCode }}
              </div>
            </div>
          </div>

          <!-- Error Title -->
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {{ errorMessage }}
          </h1>

          <!-- Error Description -->
          <p class="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed">
            {{ errorDescription }}
          </p>

          <!-- Suggested Actions -->
          <div class="space-y-4 mb-10">
            <p class="text-sm font-semibold text-gray-700 uppercase tracking-wide">What you can do:</p>
            <ul class="space-y-2 text-gray-600">
              <li class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Check the URL for typos
              </li>
              <li class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Go back and try again
              </li>
              <li class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Visit our homepage
              </li>
            </ul>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              @click="goBack"
              class="group inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Go Back
            </button>

            <NuxtLink
              to="/"
              class="group inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all shadow-lg hover:scale-105"
            >
              Back to Home
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4v4" />
              </svg>
            </NuxtLink>

            <NuxtLink
              to="/blog"
              class="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              Browse Articles
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Links Section -->
    <section class="bg-white py-16 md:py-20 border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Helpful Links</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Blog -->
          <NuxtLink
            to="/blog"
            class="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <div class="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Blog</h3>
            <p class="text-gray-600 text-sm">Explore our latest articles and tutorials</p>
          </NuxtLink>

          <!-- Categories -->
          <NuxtLink
            to="/blog/categories"
            class="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <div class="flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-lg mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Categories</h3>
            <p class="text-gray-600 text-sm">Browse articles by category</p>
          </NuxtLink>

          <!-- Tags -->
          <NuxtLink
            to="/blog/tags"
            class="group p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <div class="flex items-center justify-center w-12 h-12 bg-pink-600 text-white rounded-lg mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
            <p class="text-gray-600 text-sm">Find articles by tags</p>
          </NuxtLink>

          <!-- About -->
          <NuxtLink
            to="/about"
            class="group p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <div class="flex items-center justify-center w-12 h-12 bg-amber-600 text-white rounded-lg mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">About</h3>
            <p class="text-gray-600 text-sm">Learn more about us</p>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  error: Object
})

const router = useRouter()

const statusCode = computed(() => props.error?.statusCode || 404)

const errorMessage = computed(() => {
  const messages: Record<number, string> = {
    404: 'Page Not Found',
    500: 'Internal Server Error',
    403: 'Access Forbidden',
    400: 'Bad Request'
  }
  return messages[statusCode.value] || 'Oops! Something went wrong'
})

const errorDescription = computed(() => {
  const descriptions: Record<number, string> = {
    404: 'The page you\'re looking for has been moved or doesn\'t exist anymore. Let\'s get you back on track!',
    500: 'Something went wrong on our server. Please try again later.',
    403: 'Sorry, you don\'t have permission to access this page.',
    400: 'The request couldn\'t be processed. Please check the information and try again.'
  }
  return descriptions[statusCode.value] || 'We encountered an unexpected error. Please try again.'
})

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
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

@keyframes grid-pulse {
  0%, 100% {
    opacity: 0.15;
  }
  50% {
    opacity: 0.05;
  }
}

@keyframes gradient-shift {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

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
</style>
