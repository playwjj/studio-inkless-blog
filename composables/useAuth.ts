import { ref } from 'vue'
import type { DbUser } from '~/server/types/dbTypes'

export function useAuth() {
  const currentUser = ref<DbUser | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchUser() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch('/api/auth/user', {
        credentials: 'include'
      })

      if (!res.ok) {
        // Not authenticated or other error - clear user
        currentUser.value = null
        return
      }

      const data = await res.json()
      currentUser.value = data?.user ?? null
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      currentUser.value = null
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      currentUser.value = null
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    currentUser,
    loading,
    error,
    fetchUser,
    logout
  }
}
