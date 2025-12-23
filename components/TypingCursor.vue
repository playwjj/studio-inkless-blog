<template>
  <span class="relative inline-block w-full">
    <!-- Hidden placeholder to reserve space -->
    <span class="invisible" aria-hidden="true">{{ text }}</span>
    <!-- Actual typing text -->
    <span class="absolute inset-0">
      {{ displayedText }}<span
        v-if="showCursor"
        class="inline-block w-0.5 h-5 ml-0.5 bg-gradient-to-b from-ai-purple via-ai-cyan to-ai-pink animate-typing-cursor align-middle"
        :class="cursorClass"
      ></span>
    </span>
  </span>
</template>

<script setup lang="ts">
interface Props {
  text: string
  typeSpeed?: number
  startDelay?: number
  showCursor?: boolean
  cursorClass?: string
  loop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  typeSpeed: 100,
  startDelay: 0,
  showCursor: true,
  cursorClass: '',
  loop: false
})

const displayedText = ref('')
const currentIndex = ref(0)
const isTyping = ref(false)

const typeText = () => {
  if (currentIndex.value < props.text.length) {
    displayedText.value += props.text[currentIndex.value]
    currentIndex.value++
    setTimeout(typeText, props.typeSpeed)
  } else {
    isTyping.value = false

    // If loop is enabled, restart after a delay
    if (props.loop) {
      setTimeout(() => {
        displayedText.value = ''
        currentIndex.value = 0
        isTyping.value = true
        typeText()
      }, 2000)
    }
  }
}

onMounted(() => {
  setTimeout(() => {
    isTyping.value = true
    typeText()
  }, props.startDelay)
})
</script>

<style scoped>
/* AI-themed cursor glow */
.animate-typing-cursor {
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.6);
}
</style>
