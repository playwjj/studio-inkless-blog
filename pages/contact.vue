<template>
  <div class="min-h-screen relative overflow-hidden bg-white">
    <!-- Animated Background -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Gradient orbs -->
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400/30 to-purple-400/30 blur-3xl animate-pulse"></div>
      <div class="absolute top-1/3 -left-32 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-blue-400/20 blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
      <div class="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-tl from-pink-400/20 to-primary-400/20 blur-3xl animate-pulse" style="animation-delay: 2s;"></div>

      <!-- Subtle grid -->
      <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px); background-size: 50px 50px;"></div>
    </div>

    <!-- Hero Section -->
    <div class="relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-32 md:pb-20">
        <div class="text-center space-y-6">
          <!-- Floating icon -->
          <div class="inline-block relative animate-float">
            <div class="w-24 h-24 bg-gradient-to-br from-primary-500 via-indigo-500 to-purple-500 opacity-20 blur-2xl absolute inset-0 animate-pulse"></div>
            <svg class="w-16 h-16 relative text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 class="text-6xl md:text-7xl lg:text-8xl font-bold">
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-primary-600 to-indigo-600">
              Let's Connect
            </span>
          </h1>

          <p class="text-xl md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have a question or want to collaborate?
            <span class="text-primary-600 font-medium">We'd love to hear from you.</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Contact Form Section -->
    <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 mb-20">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <!-- Left Column - Contact Info -->
        <div class="space-y-8">
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">Get in touch</h2>
            <p class="text-lg text-gray-600 leading-relaxed">
              We're here to help and answer any question you might have.
              We look forward to hearing from you.
            </p>
          </div>

          <!-- Contact methods -->
          <div class="space-y-6">
            <div class="flex items-start gap-4 group">
              <div class="mt-1 text-primary-600 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-1">Email us</h3>
                <a href="mailto:hello@404401.xyz" class="text-gray-600 hover:text-primary-600 transition-colors">
                  hello@404401.xyz
                </a>
              </div>
            </div>

            <div class="flex items-start gap-4 group">
              <div class="mt-1 text-primary-600 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-1">Response time</h3>
                <p class="text-gray-600">Within 24-48 hours</p>
              </div>
            </div>

            <div class="flex items-start gap-4 group">
              <div class="mt-1 text-primary-600 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-1">Support hours</h3>
                <p class="text-gray-600">Monday - Friday, 9AM - 6PM</p>
              </div>
            </div>
          </div>

          <!-- Decorative element -->
          <div class="hidden lg:block relative h-32">
            <div class="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-indigo-500/20 to-purple-500/20 blur-3xl"></div>
          </div>
        </div>

        <!-- Right Column - Form -->
        <div class="relative">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Name Field -->
            <div class="group">
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Name <span class="text-primary-500">*</span>
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                :disabled="isSubmitting"
                class="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50"
                placeholder="Your name"
              />
            </div>

            <!-- Email Field -->
            <div class="group">
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email <span class="text-primary-500">*</span>
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                :disabled="isSubmitting"
                class="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50"
                placeholder="your@email.com"
              />
            </div>

            <!-- Subject Field -->
            <div class="group">
              <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                :disabled="isSubmitting"
                class="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50"
                placeholder="What's this about?"
              />
            </div>

            <!-- Message Field -->
            <div class="group">
              <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                Message <span class="text-primary-500">*</span>
              </label>
              <textarea
                id="message"
                v-model="form.message"
                rows="6"
                :disabled="isSubmitting"
                class="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50 resize-none"
                placeholder="Tell us what's on your mind..."
              ></textarea>
              <p class="mt-2 text-xs text-gray-500">
                {{ messageLength }}/5000 characters
              </p>
            </div>

            <!-- Honeypot field - hidden from users, bots will fill it -->
            <div class="hidden" aria-hidden="true">
              <label for="website">Website</label>
              <input
                id="website"
                v-model="form.honeypot"
                type="text"
                name="website"
                tabindex="-1"
                autocomplete="off"
              />
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="p-4 bg-red-50/50 border-l-4 border-red-500">
              <p class="text-red-700 text-sm font-medium">{{ errorMessage }}</p>
            </div>

            <!-- Success Message -->
            <div v-if="submitted" class="p-4 bg-green-50/50 border-l-4 border-green-500">
              <p class="text-green-700 text-sm font-medium">
                ✓ Thank you for contacting us! We'll get back to you soon.
              </p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isSubmitting || submitted"
              class="group relative w-full px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-semibold overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span class="relative z-10">
                {{ isSubmitting ? 'Sending...' : submitted ? 'Message Sent!' : 'Send Message' }}
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </form>
        </div>
      </div>

    </div>

    <!-- Bottom Wave -->
    <div class="absolute bottom-0 left-0 right-0 w-full h-32 overflow-hidden">
      <svg class="w-full h-full" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="currentColor" class="text-gray-50"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
const { siteConfig } = useSiteConfig()

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
  honeypot: '' // Anti-bot honeypot field
})

const isSubmitting = ref(false)
const submitted = ref(false)
const errorMessage = ref('')
const formLoadTime = ref(Date.now()) // Track when form was loaded

const messageLength = computed(() => form.value.message.length)

const handleSubmit = async () => {
  // Reset states
  errorMessage.value = ''

  // Anti-bot check: Honeypot field should be empty
  if (form.value.honeypot) {
    errorMessage.value = 'Invalid submission detected'
    return
  }

  // Anti-bot check: Form should take at least 3 seconds to fill
  const timeTaken = Date.now() - formLoadTime.value
  if (timeTaken < 3000) {
    errorMessage.value = 'Please take your time to fill out the form'
    return
  }

  // Client-side validation
  if (!form.value.name || form.value.name.trim().length < 2) {
    errorMessage.value = 'Please enter your name (at least 2 characters)'
    return
  }

  if (!form.value.email || !form.value.email.includes('@')) {
    errorMessage.value = 'Please enter a valid email address'
    return
  }

  if (!form.value.message || form.value.message.trim().length < 10) {
    errorMessage.value = 'Please enter a message (at least 10 characters)'
    return
  }

  if (form.value.message.length > 5000) {
    errorMessage.value = 'Message is too long (maximum 5000 characters)'
    return
  }

  isSubmitting.value = true

  try {
    const response = await $fetch('/api/contact/submit', {
      method: 'POST',
      body: {
        name: form.value.name.trim(),
        email: form.value.email.trim(),
        subject: form.value.subject.trim() || null,
        message: form.value.message.trim(),
        honeypot: form.value.honeypot,
        timestamp: formLoadTime.value
      }
    })

    if ((response as any).success) {
      submitted.value = true
      // Reset form
      form.value = {
        name: '',
        email: '',
        subject: '',
        message: '',
        honeypot: ''
      }
      // Reset form load time
      formLoadTime.value = Date.now()

      // Reset success message after 10 seconds
      setTimeout(() => {
        submitted.value = false
      }, 10000)
    }
  } catch (error: any) {
    if (error.statusCode === 400) {
      errorMessage.value = error.statusMessage || 'Please check your input and try again'
    } else {
      errorMessage.value = 'Failed to send message. Please try again later.'
    }
  } finally {
    isSubmitting.value = false
  }
}

// Try to fetch page-specific data from pages table
const { data: pageData } = await useFetch(`/api/pages/page?slug=${encodeURIComponent('/contact')}`).catch(() => ({ data: null }))

// Configure SEO Meta tags
if (pageData.value) {
  const metaTitle = pageData.value.meta_title || pageData.value.title || 'Contact Us - Studio Inkless Blog'
  const metaDescription = pageData.value.meta_description || pageData.value.description || siteConfig.value?.description || 'Get in touch with Studio Inkless Blog'
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

  if (pageData.value.meta_keywords) {
    useHead({
      meta: [
        { name: 'keywords', content: pageData.value.meta_keywords }
      ]
    })
  }

  if (pageData.value.canonical_url) {
    useHead({
      link: [
        { rel: 'canonical', href: pageData.value.canonical_url }
      ]
    })
  }
} else {
  useSeoMeta({
    title: () => siteConfig.value?.title?.replace('${title}', 'Contact Us') || 'Contact Us - Studio Inkless Blog',
    ogTitle: () => siteConfig.value?.og_title || 'Contact Studio Inkless Blog',
    description: () => siteConfig.value?.description || 'Get in touch with Studio Inkless Blog - we\'d love to hear from you.',
    ogDescription: () => siteConfig.value?.og_description || 'Contact Studio Inkless Blog for inquiries, feedback, or collaboration opportunities.',
    ogImage: () => siteConfig.value?.og_image || 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1200',
    twitterCard: 'summary_large_image',
    twitterTitle: () => siteConfig.value?.twitter_title || 'Contact Studio Inkless Blog',
    twitterDescription: () => siteConfig.value?.twitter_description || 'Contact Studio Inkless Blog for inquiries, feedback, or collaboration opportunities.',
    twitterImage: () => siteConfig.value?.twitter_image || 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1200',
  })
}
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
