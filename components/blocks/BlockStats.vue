<template>
  <section class="py-16 md:py-24 bg-gradient-to-br from-primary-600 to-primary-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div v-if="block.title" class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          {{ block.title }}
        </h2>
        <p v-if="block.subtitle" class="text-xl text-primary-100">
          {{ block.subtitle }}
        </p>
      </div>

      <!-- Stats Grid -->
      <div v-if="config?.stats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="(stat, index) in config.stats"
          :key="index"
          class="text-center"
        >
          <div class="text-4xl md:text-5xl font-bold text-white mb-2">
            {{ stat.value }}
          </div>
          <div class="text-lg text-primary-100">
            {{ stat.label }}
          </div>
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
