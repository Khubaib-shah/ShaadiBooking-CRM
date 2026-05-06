import { apiClient } from './axios'
import type { ApiResponse, Booking, CreateBookingInput, RecordPaymentInput } from '@/types'

export const bookingsApi = {
  getAll: (filters?: { status?: string; search?: string; page?: number }) =>
    apiClient.get<ApiResponse<Booking[]>>('/bookings', { params: filters }).then(r => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`).then(r => r.data),

  create: (data: CreateBookingInput) =>
    apiClient.post<ApiResponse<Booking>>('/bookings', data).then(r => r.data),

  update: (id: string, data: Partial<CreateBookingInput>) =>
    apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}`, data).then(r => r.data),

  cancel: (id: string) =>
    apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}/cancel`).then(r => r.data),

  getCalendar: (start: string, end: string) =>
    apiClient.get<ApiResponse<Booking[]>>('/bookings/calendar', { params: { start, end } }).then(r => r.data),

  checkConflict: (date: string, excludeId?: string) =>
    apiClient.get<ApiResponse<{ hasConflict: boolean; conflicts: Partial<Booking>[] }>>('/bookings/conflict', { params: { date, excludeId } }).then(r => r.data),

  recordPayment: (data: RecordPaymentInput) =>
    apiClient.post<ApiResponse<Booking>>(`/bookings/${data.bookingId}/payments`, data).then(r => r.data),

  addNote: (bookingId: string, data: { content: string; noteType: string }) =>
    apiClient.post<ApiResponse<Booking>>(`/bookings/${bookingId}/notes`, data).then(r => r.data),

  assignStaff: (bookingId: string, data: { staffMemberId: string; reportingTime?: string; reportingLocation?: string }) =>
    apiClient.post<ApiResponse<Booking>>(`/bookings/${bookingId}/staff`, data).then(r => r.data),
}
