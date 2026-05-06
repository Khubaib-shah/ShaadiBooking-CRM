export interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: { total: number; page: number; limit: number; totalPages: number }
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
}
