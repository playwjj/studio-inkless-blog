<template>
  <section class="py-16 md:py-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl shadow-2xl overflow-hidden">
        <div class="relative px-6 py-16 md:px-12 md:py-20 text-center">
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 40px 40px;"></div>
          </div>

          <div class="relative">
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {{ block.title }}
            </h2>
            <p v-if="block.subtitle" class="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              {{ block.subtitle }}
            </p>
            <div v-if="block.content" class="prose prose-lg prose-invert mx-auto mb-8" v-html="block.content"></div>

            <!-- CTA Buttons -->
            <div v-if="config" class="flex flex-wrap gap-4 justify-center">
              <a
                v-if="config.buttonText"
                :href="config.buttonLink || '#'"
                class="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all font-semibold shadow-lg hover:shadow-xl text-lg"
              >
                {{ config.buttonText }}
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                v-if="config.secondaryButtonText"
                :href="config.secondaryButtonLink || '#'"
                class="inline-flex items-center gap-2 bg-primary-700 text-white px-8 py-4 rounded-xl hover:bg-primary-800 transition-all font-semibold shadow-lg border border-primary-500 text-lg"
              >
                {{ config.secondaryButtonText }}
              </a>
            </div>
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
