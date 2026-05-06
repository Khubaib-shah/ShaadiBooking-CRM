import { apiClient } from './axios'
import type { ApiResponse, Payment } from '@/types'

export const paymentsApi = {
  getAll: (filters?: { method?: string; startDate?: string; endDate?: string; search?: string; page?: number }) =>
    apiClient.get<ApiResponse<Payment[]>>('/payments', { params: filters }).then(r => r.data),
}
