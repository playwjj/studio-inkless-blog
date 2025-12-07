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

      <!-- Testimonials Grid -->
      <div v-if="config?.testimonials" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(testimonial, index) in config.testimonials"
          :key="index"
          class="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow"
        >
          <!-- Quote -->
          <div class="mb-4">
            <svg class="w-8 h-8 text-primary-200" fill="currentColor" viewBox="0 0 32 32">
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
          </div>

          <!-- Testimonial Text -->
          <p class="text-gray-700 mb-6 italic">
            "{{ testimonial.quote }}"
          </p>

          <!-- Author -->
          <div class="flex items-center gap-3">
            <img
              v-if="testimonial.avatar"
              :src="testimonial.avatar"
              :alt="testimonial.name"
              class="w-12 h-12 rounded-full object-cover"
            />
            <div v-else class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <span class="text-primary-600 font-bold text-lg">{{ testimonial.name.charAt(0) }}</span>
            </div>
            <div>
              <div class="font-semibold text-gray-900">{{ testimonial.name }}</div>
              <div v-if="testimonial.role" class="text-sm text-gray-600">{{ testimonial.role }}</div>
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
