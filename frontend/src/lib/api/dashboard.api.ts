import { apiClient } from './axios'
import type { ApiResponse } from '@/types'

interface DashboardStats {
  totalBooked: number
  collected: number
  outstanding: number
  eventsThisMonth: number
  collectedPercentage: number
}

interface RevenueMonth {
  month: string
  collected: number
  outstanding: number
}

interface UpcomingEvent {
  _id: string
  clientName: string
  eventType: string
  eventDate: string
  venueName?: string
  status: string
  totalOutstanding: number
}

interface PaymentAlert {
  _id: string
  bookingId: string
  clientName: string
  referenceNumber: string
  amount: number
  dueDate: string
  daysOverdue?: number
  daysRemaining?: number
  type: 'overdue' | 'due_soon_3' | 'due_soon_7'
}

export const dashboardApi = {
  getStats: () =>
    apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats').then(r => r.data),

  getRevenue: (months = 6) =>
    apiClient.get<ApiResponse<RevenueMonth[]>>('/dashboard/revenue', { params: { months } }).then(r => r.data),

  getUpcoming: (days = 7) =>
    apiClient.get<ApiResponse<UpcomingEvent[]>>('/dashboard/upcoming', { params: { days } }).then(r => r.data),

  getPaymentAlerts: () =>
    apiClient.get<ApiResponse<PaymentAlert[]>>('/dashboard/payment-alerts').then(r => r.data),
}

export type { DashboardStats, RevenueMonth, UpcomingEvent, PaymentAlert }
