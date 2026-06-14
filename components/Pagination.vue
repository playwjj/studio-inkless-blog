<template>
  <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-8">
    <!-- Previous Button -->
    <NuxtLink
      v-if="currentPage > 1"
      :to="getPageUrl(currentPage - 1)"
      :class="[
        'px-4 py-2 rounded-lg border transition-colors',
        'border-gray-300 text-gray-700 hover:bg-gray-50'
      ]"
      @click="scrollToTop"
    >
      Previous
    </NuxtLink>
    <span
      v-else
      :class="[
        'px-4 py-2 rounded-lg border transition-colors',
        'border-gray-200 text-gray-400 cursor-not-allowed'
      ]"
    >
      Previous
    </span>

    <!-- Page Numbers -->
    <div class="flex gap-1">
      <template v-for="page in displayedPages" :key="page">
        <!-- Ellipsis -->
        <span
          v-if="page === '...'"
          class="min-w-[40px] h-10 rounded-lg border border-transparent text-gray-400 flex items-center justify-center"
        >
          {{ page }}
        </span>
        <!-- Current Page -->
        <span
          v-else-if="page === currentPage"
          :class="[
            'min-w-[40px] h-10 rounded-lg border transition-colors flex items-center justify-center',
            'bg-primary-600 text-white border-primary-600 font-semibold'
          ]"
        >
          {{ page }}
        </span>
        <!-- Other Pages -->
        <NuxtLink
          v-else
          :to="getPageUrl(page as number)"
          :class="[
            'min-w-[40px] h-10 rounded-lg border transition-colors flex items-center justify-center',
            'border-gray-300 text-gray-700 hover:bg-gray-50'
          ]"
          @click="scrollToTop"
        >
          {{ page }}
        </NuxtLink>
      </template>
    </div>

    <!-- Next Button -->
    <NuxtLink
      v-if="currentPage < totalPages"
      :to="getPageUrl(currentPage + 1)"
      :class="[
        'px-4 py-2 rounded-lg border transition-colors',
        'border-gray-300 text-gray-700 hover:bg-gray-50'
      ]"
      @click="scrollToTop"
    >
      Next
    </NuxtLink>
    <span
      v-else
      :class="[
        'px-4 py-2 rounded-lg border transition-colors',
        'border-gray-200 text-gray-400 cursor-not-allowed'
      ]"
    >
      Next
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
  maxDisplayed?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxDisplayed: 15
})

const route = useRoute()

// Generate URL for a specific page number
const getPageUrl = (page: number) => {
  const query = { ...route.query }

  if (page === 1) {
    // Remove page param for page 1 (cleaner URL)
    delete query.page
  } else {
    query.page = page.toString()
  }

  return {
    path: route.path,
    query
  }
}

// Scroll to top when clicking pagination
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const displayedPages = computed(() => {
  const { currentPage, totalPages, maxDisplayed } = props

  if (totalPages <= maxDisplayed) {
    return Array.from({ length: totalPages }, (_, i) => i + 1) as (number | string)[]
  }

  // Always anchor first 2 and last 2 pages, plus ±3 window around current
  const anchor = new Set([1, 2, totalPages - 1, totalPages])
  const winStart = Math.max(1, currentPage - 3)
  const winEnd = Math.min(totalPages, currentPage + 3)
  for (let i = winStart; i <= winEnd; i++) anchor.add(i)

  const sorted = Array.from(anchor).sort((a, b) => a - b)

  const result: (number | string)[] = []
  for (let i = 0; i < sorted.length; i++) {
    result.push(sorted[i])
    if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) {
      result.push('...')
    }
  }

  return result
})
</script>
