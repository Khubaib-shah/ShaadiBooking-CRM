import { apiClient } from './axios'
import type { ApiResponse, Inquiry } from '@/types'

export const inquiriesApi = {
  getAll: (filters?: { status?: string; search?: string }) =>
    apiClient.get<ApiResponse<Inquiry[]>>('/inquiries', { params: filters }).then(r => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Inquiry>>(`/inquiries/${id}`).then(r => r.data),

  create: (data: Partial<Inquiry>) =>
    apiClient.post<ApiResponse<Inquiry>>('/inquiries', data).then(r => r.data),

  update: (id: string, data: Partial<Inquiry>) =>
    apiClient.patch<ApiResponse<Inquiry>>(`/inquiries/${id}`, data).then(r => r.data),

  updateStatus: (id: string, status: string) =>
    apiClient.patch<ApiResponse<Inquiry>>(`/inquiries/${id}/status`, { status }).then(r => r.data),

  convertToBooking: (id: string) =>
    apiClient.post<ApiResponse<{ bookingId: string }>>(`/inquiries/${id}/convert`).then(r => r.data),
}
