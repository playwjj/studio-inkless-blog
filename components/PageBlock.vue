<template>
  <component
    :is="blockComponent"
    v-if="blockComponent"
    :block="block"
    :style="blockStyles"
  />
  <div v-else class="py-8 px-4 bg-yellow-50 border border-yellow-200 rounded-lg">
    <p class="text-yellow-800 text-center">
      Unknown block type: <strong>{{ block.block_type }}</strong>
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  block: any
}>()

// Map block types to components
const blockComponents: Record<string, any> = {
  hero: resolveComponent('BlockHero'),
  features: resolveComponent('BlockFeatures'),
  cta: resolveComponent('BlockCta'),
  text: resolveComponent('BlockText'),
  gallery: resolveComponent('BlockGallery'),
  testimonials: resolveComponent('BlockTestimonials'),
  faq: resolveComponent('BlockFaq'),
  stats: resolveComponent('BlockStats'),
  video: resolveComponent('BlockVideo'),
  custom: resolveComponent('BlockCustom')
}

const blockComponent = computed(() => {
  return blockComponents[props.block.block_type] || null
})

const blockStyles = computed(() => {
  const styles: Record<string, string> = {}

  if (props.block.background_color) {
    styles.backgroundColor = props.block.background_color
  }

  if (props.block.background_image) {
    styles.backgroundImage = `url(${props.block.background_image})`
    styles.backgroundSize = 'cover'
    styles.backgroundPosition = 'center'
  }

  if (props.block.text_color) {
    styles.color = props.block.text_color
  }

  return styles
})
</script>
