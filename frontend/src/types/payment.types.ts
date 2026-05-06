import type { Payment } from './booking.types'

export interface RecordPaymentInput {
  bookingId: string
  amount: number
  method: Payment['method']
  referenceNumber?: string
  paymentType: 'deposit' | 'balance'
}
