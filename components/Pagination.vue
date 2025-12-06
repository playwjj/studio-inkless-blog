<template>
  <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-8">
    <button
      @click="$emit('update:page', currentPage - 1)"
      :disabled="currentPage === 1"
      :class="[
        'px-4 py-2 rounded-lg border transition-colors',
        currentPage === 1
          ? 'border-gray-200 text-gray-400 cursor-not-allowed'
          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
      ]"
    >
      Previous
    </button>

    <div class="flex gap-1">
      <button
        v-for="page in displayedPages"
        :key="page"
        @click="page !== '...' && $emit('update:page', page)"
        :class="[
          'min-w-[40px] h-10 rounded-lg border transition-colors',
          page === currentPage
            ? 'bg-primary-600 text-white border-primary-600'
            : page === '...'
            ? 'border-transparent text-gray-400 cursor-default'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        ]"
      >
        {{ page }}
      </button>
    </div>

    <button
      @click="$emit('update:page', currentPage + 1)"
      :disabled="currentPage === totalPages"
      :class="[
        'px-4 py-2 rounded-lg border transition-colors',
        currentPage === totalPages
          ? 'border-gray-200 text-gray-400 cursor-not-allowed'
          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
      ]"
    >
      Next
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
  maxDisplayed?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxDisplayed: 7
})

defineEmits<{
  'update:page': [page: number]
}>()

const displayedPages = computed(() => {
  const pages: (number | string)[] = []
  const { currentPage, totalPages, maxDisplayed } = props

  if (totalPages <= maxDisplayed) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    const leftSide = Math.max(2, currentPage - 1)
    const rightSide = Math.min(totalPages - 1, currentPage + 1)

    pages.push(1)

    if (leftSide > 2) {
      pages.push('...')
    }

    for (let i = leftSide; i <= rightSide; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i)
      }
    }

    if (rightSide < totalPages - 1) {
      pages.push('...')
    }

    pages.push(totalPages)
  }

  return pages
})
</script>
