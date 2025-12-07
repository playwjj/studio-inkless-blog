<template>
  <section class="py-16 md:py-24 bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div v-if="block.title" class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {{ block.title }}
        </h2>
        <p v-if="block.subtitle" class="text-xl text-gray-600">
          {{ block.subtitle }}
        </p>
      </div>

      <!-- FAQ Items -->
      <div v-if="config?.faqs" class="space-y-4">
        <details
          v-for="(faq, index) in config.faqs"
          :key="index"
          class="bg-white rounded-xl shadow-md overflow-hidden group"
        >
          <summary class="px-6 py-4 cursor-pointer flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
            <span>{{ faq.question }}</span>
            <svg class="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div class="px-6 py-4 text-gray-600 border-t border-gray-100">
            {{ faq.answer }}
          </div>
        </details>
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
