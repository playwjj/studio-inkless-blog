<template>
  <NuxtLink
    :to="to"
    class="group relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
    :class="chipClass"
  >
    <!-- Gradient border effect -->
    <span class="absolute inset-0 rounded-lg bg-gradient-to-r from-ai-purple via-ai-cyan to-ai-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300" :class="borderGradient"></span>

    <!-- Inner background -->
    <span class="absolute inset-[1px] rounded-lg bg-white group-hover:bg-gradient-to-r group-hover:from-ai-purple/5 group-hover:via-ai-cyan/5 group-hover:to-ai-pink/5 transition-all duration-300"></span>

    <!-- Scanning light effect -->
    <span class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent"></span>

    <!-- Content -->
    <span class="relative z-10 flex items-center gap-1.5">
      <!-- AI chip icon/indicator -->
      <svg
        v-if="showIcon"
        class="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"/>
      </svg>

      <!-- Hash symbol -->
      <span class="opacity-50">#</span>

      <!-- Tag text -->
      <span class="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-clip-text group-hover:from-ai-purple group-hover:via-ai-cyan group-hover:to-ai-pink group-hover:text-transparent transition-all duration-300">
        {{ text }}
      </span>
    </span>

    <!-- Glow effect on hover -->
    <span class="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 blur-sm bg-gradient-to-r from-ai-purple via-ai-cyan to-ai-pink transition-opacity duration-300"></span>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
  text: string
  to: string
  showIcon?: boolean
  variant?: 'default' | 'gradient' | 'outline'
}

const props = withDefaults(defineProps<Props>(), {
  showIcon: false,
  variant: 'default'
})

const chipClass = computed(() => {
  switch (props.variant) {
    case 'gradient':
      return 'bg-gradient-to-r from-ai-purple/10 via-ai-cyan/10 to-ai-pink/10'
    case 'outline':
      return 'border border-gray-200'
    default:
      return 'bg-gray-50/80 backdrop-blur-sm'
  }
})

const borderGradient = computed(() => {
  return props.variant === 'outline' ? 'opacity-100' : ''
})
</script>

<style scoped>
/* Additional glow for chip aesthetic */
.group:hover {
  box-shadow:
    0 0 20px rgba(139, 92, 246, 0.15),
    0 0 40px rgba(6, 182, 212, 0.1);
}
</style>
