<template>
  <section class="py-16 md:py-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div v-if="block.title" class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {{ block.title }}
        </h2>
        <p v-if="block.subtitle" class="text-xl text-gray-600">
          {{ block.subtitle }}
        </p>
      </div>

      <!-- Gallery Grid -->
      <div v-if="config?.images" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(image, index) in config.images"
          :key="index"
          class="aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
        >
          <NuxtImg
            :src="image.url"
            :alt="image.alt || `Gallery image ${index + 1}`"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
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
