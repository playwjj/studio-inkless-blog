<template>
  <section class="relative overflow-hidden py-20 md:py-32">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-50"></div>
    <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.1) 1px, transparent 0); background-size: 40px 40px;"></div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Content -->
        <div>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            {{ block.title }}
          </h1>
          <p v-if="block.subtitle" class="text-xl md:text-2xl text-gray-600 mb-8">
            {{ block.subtitle }}
          </p>
          <div v-if="block.content" class="prose prose-lg mb-8" v-html="block.content"></div>

          <!-- CTA Buttons -->
          <div v-if="config" class="flex flex-wrap gap-4">
            <a
              v-if="config.buttonText"
              :href="config.buttonLink || '#'"
              class="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl hover:bg-primary-700 transition-all font-semibold shadow-lg hover:shadow-xl text-lg"
            >
              {{ config.buttonText }}
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              v-if="config.secondaryButtonText"
              :href="config.secondaryButtonLink || '#'"
              class="inline-flex items-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all font-semibold shadow-md border border-gray-200 text-lg"
            >
              {{ config.secondaryButtonText }}
            </a>
          </div>
        </div>

        <!-- Image -->
        <div v-if="config?.imageUrl" class="relative">
          <div class="aspect-square lg:aspect-auto lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
            <NuxtImg
              :src="config.imageUrl"
              :alt="block.title"
              class="w-full h-full object-cover"
            />
          </div>
          <!-- Decorative elements -->
          <div class="absolute -z-10 -top-4 -right-4 w-72 h-72 bg-primary-200 rounded-full opacity-20 blur-3xl"></div>
          <div class="absolute -z-10 -bottom-8 -left-8 w-96 h-96 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  block: any
}>()

const config = computed(() => {
  return props.block.config || {}
})
</script>
