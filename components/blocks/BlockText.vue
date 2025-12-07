<template>
  <section class="py-12 md:py-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 v-if="block.title" class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {{ block.title }}
      </h2>
      <p v-if="block.subtitle" class="text-xl text-gray-600 mb-8">
        {{ block.subtitle }}
      </p>
      <div v-if="block.content" class="prose prose-lg max-w-none" v-html="block.content"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  block: any
}>()
</script>
