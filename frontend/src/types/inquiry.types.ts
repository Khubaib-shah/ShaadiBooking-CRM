import type { EventType } from './booking.types'

export type InquiryStatus = 'new' | 'contacted' | 'negotiating' | 'converted' | 'lost'

export interface Inquiry {
  _id: string
  clientName: string
  clientPhone: string
  eventType: EventType
  tentativeDate?: string
  guestCount?: number
  budget?: number
  notes?: string
  status: InquiryStatus
  followUpDate?: string
  convertedBookingId?: string
  createdAt: string
  updatedAt: string
}
