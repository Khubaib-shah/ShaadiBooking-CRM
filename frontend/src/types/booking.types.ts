import type { StaffMember } from './staff.types'

export type BookingStatus =
  | 'inquiry' | 'confirmed' | 'deposit_received'
  | 'balance_pending' | 'completed' | 'cancelled'

export type EventType =
  | 'mayun' | 'dholki' | 'mehndi' | 'nikah'
  | 'barat' | 'valima' | 'other'

export type PackageType = 'per_head' | 'fixed'

export interface PaymentSchedule {
  _id: string
  type: 'deposit' | 'balance'
  amountDue: number
  dueDate: string
  isPaid: boolean
  paidAt?: string
  remindersSent: { sevenDay?: string; threeDay?: string; dueDay?: string }
}

export interface Payment {
  _id: string
  amount: number
  method: 'cash' | 'easypaisa' | 'jazzcash' | 'bank_transfer'
  referenceNumber?: string
  receivedBy: string
  receivedAt: string
  smsReceiptSent: boolean
}

export interface BookingNote {
  _id: string
  content: string
  noteType: 'menu' | 'service_change' | 'client_request' | 'agreement'
  createdBy: string
  createdAt: string
}

export interface StaffAssignment {
  _id: string
  staffMemberId: StaffMember
  reportingTime?: string
  reportingLocation?: string
  smsSent: boolean
}

export interface Booking {
  _id: string
  referenceNumber: string
  vendorId: string
  clientName: string
  clientPhone: string
  clientWhatsapp?: string
  eventType: EventType
  eventDate: string
  venueName?: string
  guestCount?: number
  packageType: PackageType
  perHeadPrice?: number
  totalContractValue: number
  discountAmount: number
  discountReason?: string
  status: BookingStatus
  paymentSchedules: PaymentSchedule[]
  payments: Payment[]
  notes: BookingNote[]
  staffAssignments: StaffAssignment[]
  netValue: number
  totalPaid: number
  totalOutstanding: number
  conflictWarning?: {
    hasConflict: boolean
    severity: 'critical' | 'warning'
    conflicts: Partial<Booking>[]
  }
  createdAt: string
  updatedAt: string
}

export interface CreateBookingInput {
  clientName: string
  clientPhone: string
  clientWhatsapp?: string
  eventType: EventType
  eventDate: string
  venueName?: string
  guestCount?: number
  packageType: PackageType
  perHeadPrice?: number
  totalContractValue: number
  discountAmount?: number
  discountReason?: string
  status: BookingStatus
  paymentSchedules: Omit<PaymentSchedule, '_id' | 'isPaid' | 'paidAt' | 'remindersSent'>[]
}
