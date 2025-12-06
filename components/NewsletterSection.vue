<template>
  <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-8 md:p-12">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -ml-32 -mt-32"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mb-48"></div>
    </div>

    <div class="relative max-w-4xl mx-auto text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>

      <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
        Stay Updated with Our Newsletter
      </h2>

      <p class="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
        Get the latest articles, tutorials, and insights delivered directly to your inbox. Join thousands of developers learning and growing together.
      </p>

      <form @submit.prevent="handleSubscribe" class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
          required
          class="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/40 transition-colors"
        />
        <button
          type="submit"
          :disabled="isSubscribing"
          class="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-lg hover:shadow-xl"
        >
          {{ isSubscribing ? 'Subscribing...' : 'Subscribe' }}
        </button>
      </form>

      <p v-if="subscribed" class="mt-4 text-green-200 font-medium">
        Thank you for subscribing!
      </p>

      <p class="mt-4 text-sm text-primary-200">
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
