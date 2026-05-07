import { mockDb } from '../utils/mockDb'
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
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const bookings = mockDb.getBookings().filter(b => b.status !== 'cancelled')
    
    let totalBooked = 0
    let collected = 0
    let outstanding = 0
    let eventsThisMonth = 0

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    bookings.forEach(b => {
      totalBooked += b.contract || 0
      collected += b.paid || 0
      outstanding += b.outstanding || 0
      
      const d = new Date(b.date)
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        eventsThisMonth++
      }
    })

    const collectedPercentage = totalBooked > 0 ? Math.round((collected / totalBooked) * 100) : 0

    return {
      success: true,
      data: {
        totalBooked,
        collected,
        outstanding,
        eventsThisMonth,
        collectedPercentage
      }
    }
  },

  getRevenue: async (months = 6): Promise<ApiResponse<RevenueMonth[]>> => {
    // Stub for now, can implement real logic if needed
    const data: RevenueMonth[] = []
    const now = new Date()
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      data.push({
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        collected: Math.floor(Math.random() * 500000) + 100000,
        outstanding: Math.floor(Math.random() * 200000)
      })
    }
    return { success: true, data }
  },

  getUpcoming: async (days = 30): Promise<ApiResponse<UpcomingEvent[]>> => {
    const bookings = mockDb.getBookings().filter(b => b.status !== 'cancelled')
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    
    const future = new Date(now)
    future.setDate(future.getDate() + days)

    const upcoming = bookings
      .filter(b => {
        const d = new Date(b.date)
        return d >= now && d <= future
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5) // Limit to next 5
      .map(b => ({
        _id: b._id,
        clientName: b.client,
        eventType: b.type,
        eventDate: b.date,
        venueName: b.venue,
        status: b.status,
        totalOutstanding: b.outstanding
      }))

    return { success: true, data: upcoming }
  },

  getPaymentAlerts: async (): Promise<ApiResponse<PaymentAlert[]>> => {
    const bookings = mockDb.getBookings().filter(b => b.status !== 'cancelled')
    const alerts: PaymentAlert[] = []
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    bookings.forEach(b => {
      b.paymentSchedules.forEach(ps => {
        if (!ps.isPaid && ps.dueDate) {
          const d = new Date(ps.dueDate)
          d.setHours(0, 0, 0, 0)
          
          const diffTime = d.getTime() - now.getTime()
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

          if (diffDays < 0) {
            alerts.push({
              _id: ps._id,
              bookingId: b._id,
              clientName: b.client,
              referenceNumber: b.ref,
              amount: ps.amountDue,
              dueDate: ps.dueDate,
              daysOverdue: Math.abs(diffDays),
              type: 'overdue'
            })
          } else if (diffDays <= 3) {
            alerts.push({
              _id: ps._id,
              bookingId: b._id,
              clientName: b.client,
              referenceNumber: b.ref,
              amount: ps.amountDue,
              dueDate: ps.dueDate,
              daysRemaining: diffDays,
              type: 'due_soon_3'
            })
          } else if (diffDays <= 7) {
            alerts.push({
              _id: ps._id,
              bookingId: b._id,
              clientName: b.client,
              referenceNumber: b.ref,
              amount: ps.amountDue,
              dueDate: ps.dueDate,
              daysRemaining: diffDays,
              type: 'due_soon_7'
            })
          }
        }
      })
    })

    // Sort by most critical first (overdue, then closest due date)
    alerts.sort((a, b) => {
      if (a.type === 'overdue' && b.type !== 'overdue') return -1
      if (a.type !== 'overdue' && b.type === 'overdue') return 1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })

    return { success: true, data: alerts.slice(0, 5) }
  }
}

export type { DashboardStats, RevenueMonth, UpcomingEvent, PaymentAlert }
