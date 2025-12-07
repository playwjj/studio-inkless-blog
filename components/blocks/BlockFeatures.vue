<template>
  <section class="py-16 md:py-24 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          {{ block.title }}
        </h2>
        <p v-if="block.subtitle" class="text-xl text-gray-600 max-w-3xl mx-auto">
          {{ block.subtitle }}
        </p>
      </div>

      <!-- Features Grid -->
      <div v-if="config?.features" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(feature, index) in config.features"
          :key="index"
          class="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow"
        >
          <!-- Icon -->
          <div v-if="feature.icon" class="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
            <span class="text-2xl">{{ feature.icon }}</span>
          </div>

          <!-- Content -->
          <h3 class="text-xl font-bold text-gray-900 mb-2">
            {{ feature.title }}
          </h3>
          <p class="text-gray-600">
            {{ feature.description }}
          </p>
        </div>
      </div>

      <!-- Fallback: Display content if no features array -->
      <div v-else-if="block.content" class="prose prose-lg max-w-none" v-html="block.content"></div>
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
