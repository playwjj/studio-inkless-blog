<template>
  <section class="py-16 md:py-24 bg-gray-50">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div v-if="block.title" class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {{ block.title }}
        </h2>
        <p v-if="block.subtitle" class="text-xl text-gray-600">
          {{ block.subtitle }}
        </p>
      </div>

      <!-- Video Player -->
      <div class="aspect-video rounded-xl overflow-hidden shadow-2xl">
        <iframe
          v-if="config?.videoUrl"
          :src="config.videoUrl"
          class="w-full h-full"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>

      <!-- Video Description -->
      <div v-if="block.content" class="mt-8 prose prose-lg mx-auto" v-html="block.content"></div>
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
