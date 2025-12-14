/**
 * useSetup - Composable for managing blog setup and initialization
 */

export type SetupStatus = 'checking' | 'missing-env' | 'needs-setup' | 'configure-site' | 'ready' | 'error'

interface SetupState {
  status: SetupStatus
  message: string
  isLoading: boolean
  error: string | null
  siteData?: Record<string, any>
}

const setupState = reactive<SetupState>({
  status: 'checking',
  message: 'Initializing...',
  isLoading: true,
  error: null
})

export const useSetup = () => {
  /**
   * Check the current setup status
   */
  const checkSetupStatus = async (): Promise<SetupStatus> => {
    setupState.isLoading = true
    setupState.error = null

    try {
      const response = await $fetch<any>('/api/admin/setup/check', {
        method: 'POST'
      })

      setupState.status = response.status
      setupState.message = response.message
      
      if (response.data) {
        setupState.siteData = response.data
      }

      return response.status
    } catch (err: any) {
      setupState.status = 'error'
      setupState.error = err?.message || 'Failed to check setup status'
      setupState.message = 'An error occurred'
      return 'error'
    } finally {
      setupState.isLoading = false
    }
  }

  /**
   * Initialize database tables
   */
  const initializeDatabase = async (): Promise<boolean> => {
    setupState.isLoading = true
    setupState.error = null

    try {
      await $fetch('/api/admin/setup/init-db', {
        method: 'POST'
      })
      setupState.message = 'Database initialized successfully'
      return true
    } catch (err: any) {
      setupState.error = err?.message || 'Failed to initialize database'
      setupState.message = 'Database initialization failed'
      return false
    } finally {
      setupState.isLoading = false
    }
  }

  /**
   * Save site configuration
   */
  const saveSiteConfiguration = async (config: Record<string, any>): Promise<boolean> => {
    setupState.isLoading = true
    setupState.error = null

    try {
      const result = await $fetch('/api/admin/setup/save-site', {
        method: 'POST',
        body: config
      })
      setupState.siteData = result
      setupState.message = 'Site configuration saved successfully'
      return true
    } catch (err: any) {
      setupState.error = err?.message || 'Failed to save site configuration'
      setupState.message = 'Configuration save failed'
      return false
    } finally {
      setupState.isLoading = false
    }
  }

  /**
   * Reset setup state
   */
  const reset = () => {
    setupState.status = 'checking'
    setupState.message = 'Initializing...'
    setupState.isLoading = true
    setupState.error = null
    setupState.siteData = undefined
  }

  /**
   * Get current setup state as reactive reference
   */
  const state = readonly(setupState)

  return {
    state,
    checkSetupStatus,
    initializeDatabase,
    saveSiteConfiguration,
    reset
  }
}
