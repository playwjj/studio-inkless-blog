<template>
  <section class="py-12">
    <div v-if="block.content" v-html="block.content"></div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  block: any
}>()
</script>
