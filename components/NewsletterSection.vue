<template>
  <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 md:p-12 border border-blue-100">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-indigo-500/5 to-purple-600/5"></div>
    <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.1) 1px, transparent 0); background-size: 40px 40px;"></div>

    <div class="relative max-w-4xl mx-auto text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-white/80 backdrop-blur-sm rounded-full mb-6 shadow-md border border-gray-200">
        <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>

      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Stay Updated with Our Newsletter
      </h2>

      <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Get the latest articles, tutorials, and insights delivered directly to your inbox. Join thousands of developers learning and growing together.
      </p>

      <form @submit.prevent="handleSubscribe" class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
          required
          class="flex-1 px-6 py-4 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
        />
        <button
          type="submit"
          :disabled="isSubscribing"
          class="px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-lg hover:shadow-xl"
        >
          {{ isSubscribing ? 'Subscribing...' : 'Subscribe' }}
        </button>
      </form>

      <p v-if="subscribed" class="mt-4 text-green-600 font-medium">
        ✓ Thank you for subscribing!
      </p>

      <p class="mt-4 text-sm text-gray-500">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const isSubscribing = ref(false)
const subscribed = ref(false)

const handleSubscribe = async () => {
  isSubscribing.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  subscribed.value = true
  email.value = ''
  isSubscribing.value = false

  // Reset success message after 5 seconds
  setTimeout(() => {
    subscribed.value = false
  }, 5000)
}
</script>
