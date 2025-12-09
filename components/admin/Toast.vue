<template>
  <transition-group
    name="toast"
    tag="div"
    class="fixed top-4 right-4 z-50 space-y-2 pointer-events-none"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="pointer-events-auto w-80 bg-white border shadow-lg overflow-hidden"
      :class="[
        toast.type === 'success' ? 'border-green-500' : '',
        toast.type === 'error' ? 'border-red-500' : '',
        toast.type === 'warning' ? 'border-yellow-500' : '',
        toast.type === 'info' ? 'border-blue-500' : ''
      ]"
    >
      <div class="flex items-start p-4">
        <!-- Icon -->
        <div class="flex-shrink-0">
          <!-- Success Icon -->
          <svg
            v-if="toast.type === 'success'"
            class="w-5 h-5 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <!-- Error Icon -->
          <svg
            v-else-if="toast.type === 'error'"
            class="w-5 h-5 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <!-- Warning Icon -->
          <svg
            v-else-if="toast.type === 'warning'"
            class="w-5 h-5 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>

          <!-- Info Icon -->
          <svg
            v-else
            class="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <!-- Content -->
        <div class="ml-3 flex-1">
          <p
            class="text-sm font-medium text-gray-900"
            :class="[
              toast.type === 'success' ? 'text-green-900' : '',
              toast.type === 'error' ? 'text-red-900' : '',
              toast.type === 'warning' ? 'text-yellow-900' : '',
              toast.type === 'info' ? 'text-blue-900' : ''
            ]"
          >
            {{ toast.message }}
          </p>
          <p v-if="toast.description" class="mt-1 text-xs text-gray-600">
            {{ toast.description }}
          </p>
        </div>

        <!-- Close button -->
        <button
          @click="removeToast(toast.id)"
          class="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Progress bar -->
      <div
        v-if="toast.duration"
        class="h-1 transition-all ease-linear"
        :class="[
          toast.type === 'success' ? 'bg-green-500' : '',
          toast.type === 'error' ? 'bg-red-500' : '',
          toast.type === 'warning' ? 'bg-yellow-500' : '',
          toast.type === 'info' ? 'bg-blue-500' : ''
        ]"
        :style="{ width: `${toast.progress}%` }"
      ></div>
    </div>
  </transition-group>
</template>

<script setup lang="ts">
interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  description?: string
  duration?: number
  progress?: number
}

const toasts = useState<Toast[]>('admin-toasts', () => [])

const removeToast = (id: string) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Auto-remove toasts with duration
watch(toasts, (newToasts) => {
  newToasts.forEach(toast => {
    if (toast.duration && toast.progress === undefined) {
      toast.progress = 100

      const interval = setInterval(() => {
        if (toast.progress !== undefined && toast.progress > 0) {
          toast.progress -= 2
        } else {
          clearInterval(interval)
          removeToast(toast.id)
        }
      }, toast.duration / 50)
    }
  })
}, { deep: true })
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
