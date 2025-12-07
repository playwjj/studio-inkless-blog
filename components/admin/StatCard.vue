<template>
  <div class="border-l-2 pl-4 py-3" :class="borderColor">
    <div class="flex items-baseline justify-between mb-1">
      <p class="text-[10px] uppercase tracking-wide font-medium text-gray-500">{{ title }}</p>
      <div v-if="trend" class="flex items-center text-[10px]">
        <svg
          v-if="trend.isPositive"
          class="w-3 h-3 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <svg
          v-else
          class="w-3 h-3 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
        <span :class="trend.isPositive ? 'text-green-600' : 'text-red-600'" class="ml-0.5">
          {{ trend.isPositive ? '+' : '-' }}{{ trend.value }}%
        </span>
      </div>
    </div>
    <p class="text-2xl font-semibold text-gray-900 tabular-nums">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  color?: 'blue' | 'green' | 'purple' | 'orange'
  trend?: {
    value: number
    isPositive: boolean
  }
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue'
})

const colorMap = {
  blue: 'border-blue-500',
  green: 'border-green-500',
  purple: 'border-purple-500',
  orange: 'border-orange-500'
}

const borderColor = computed(() => colorMap[props.color])
</script>
