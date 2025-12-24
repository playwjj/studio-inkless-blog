export interface ApiError {
  statusCode?: number
  statusMessage?: string
  data?: {
    statusMessage?: string
    [key: string]: unknown
  }
  message?: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
