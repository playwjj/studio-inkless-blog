<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
    <div
      v-for="(stat, index) in stats"
      :key="index"
      class="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
    >
      <div class="text-4xl md:text-5xl font-bold text-white mb-2">
        {{ stat.value }}
      </div>
      <div class="text-primary-100 text-sm md:text-base font-medium">
        {{ stat.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  totalPosts: number
  totalCategories: number
}

const props = defineProps<Props>()

const stats = computed(() => [
  { value: props.totalPosts, label: 'Articles' },
  { value: props.totalCategories, label: 'Categories' },
  { value: '50K+', label: 'Readers' },
  { value: '99%', label: 'Satisfaction' },
])
</script>
