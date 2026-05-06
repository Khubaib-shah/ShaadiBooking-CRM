import { apiClient } from './axios'
import type { ApiResponse } from '@/types'

interface LoginPayload { email: string; password: string }
interface RegisterPayload {
  vendorName: string; vendorType: string; phone: string
  ownerName: string; email: string; password: string
}
interface AuthResponse { accessToken: string; user: Record<string, unknown>; vendor: Record<string, unknown> }

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/login', payload).then(r => r.data),

  register: (payload: RegisterPayload) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/register', payload).then(r => r.data),

  refresh: () =>
    apiClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh').then(r => r.data),

  logout: () =>
    apiClient.post('/auth/logout').then(r => r.data),

  me: () =>
    apiClient.get<ApiResponse<{ user: Record<string, unknown>; vendor: Record<string, unknown> }>>('/auth/me').then(r => r.data),
}
