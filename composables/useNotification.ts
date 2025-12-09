interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  description?: string
  duration?: number
  progress?: number
}

interface ConfirmDialogState {
  isOpen: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  loadingText: string
  variant: 'danger' | 'warning'
  onConfirm?: () => Promise<void> | void
  onCancel?: () => void
}

export const useNotification = () => {
  const toasts = useState<Toast[]>('admin-toasts', () => [])
  const confirmDialog = useState<ConfirmDialogState>('admin-confirm-dialog', () => ({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    loadingText: 'Processing...',
    variant: 'warning'
  }))

  const generateId = () => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  const showToast = (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    description?: string,
    duration: number = 5000
  ) => {
    const id = generateId()
    const toast: Toast = {
      id,
      type,
      message,
      description,
      duration
    }

    toasts.value.push(toast)

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        const index = toasts.value.findIndex(t => t.id === id)
        if (index > -1) {
          toasts.value.splice(index, 1)
        }
      }, duration)
    }

    return id
  }

  const success = (message: string, description?: string, duration?: number) => {
    return showToast('success', message, description, duration)
  }

  const error = (message: string, description?: string, duration?: number) => {
    return showToast('error', message, description, duration)
  }

  const warning = (message: string, description?: string, duration?: number) => {
    return showToast('warning', message, description, duration)
  }

  const info = (message: string, description?: string, duration?: number) => {
    return showToast('info', message, description, duration)
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const confirm = (options: {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    loadingText?: string
    variant?: 'danger' | 'warning'
    onConfirm?: () => Promise<void> | void
    onCancel?: () => void
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      confirmDialog.value = {
        isOpen: true,
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        loadingText: options.loadingText || 'Processing...',
        variant: options.variant || 'warning',
        onConfirm: async () => {
          if (options.onConfirm) {
            await options.onConfirm()
          }
          resolve(true)
        },
        onCancel: () => {
          if (options.onCancel) {
            options.onCancel()
          }
          resolve(false)
        }
      }
    })
  }

  return {
    // Toast methods
    success,
    error,
    warning,
    info,
    removeToast,

    // Confirm dialog
    confirm
  }
}
