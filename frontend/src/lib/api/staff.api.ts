import { apiClient } from './axios'
import type { ApiResponse, StaffMember } from '@/types'

export const staffApi = {
  getAll: () =>
    apiClient.get<ApiResponse<StaffMember[]>>('/staff').then(r => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<StaffMember>>(`/staff/${id}`).then(r => r.data),

  create: (data: Omit<StaffMember, '_id' | 'vendorId'>) =>
    apiClient.post<ApiResponse<StaffMember>>('/staff', data).then(r => r.data),

  update: (id: string, data: Partial<StaffMember>) =>
    apiClient.patch<ApiResponse<StaffMember>>(`/staff/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/staff/${id}`).then(r => r.data),
}
