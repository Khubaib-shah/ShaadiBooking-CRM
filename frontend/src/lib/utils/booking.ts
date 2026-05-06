import type { BookingStatus, EventType } from '@/types/booking.types'

export const STATUS_CONFIG: Record<BookingStatus, {
  label: string; color: string; bg: string; dot: string
}> = {
  inquiry:          { label: 'Inquiry',       color: '#74788d', bg: '#f1f3f5', dot: '#74788d' },
  confirmed:        { label: 'Confirmed',     color: '#50a5f1', bg: '#d1ecf1', dot: '#50a5f1' },
  deposit_received: { label: 'Deposit Paid',  color: '#34c38f', bg: '#d4edda', dot: '#34c38f' },
  balance_pending:  { label: 'Balance Due',   color: '#f1b44c', bg: '#fff3cd', dot: '#f1b44c' },
  completed:        { label: 'Completed',     color: '#34c38f', bg: '#d4edda', dot: '#34c38f' },
  cancelled:        { label: 'Cancelled',     color: '#f46a6a', bg: '#f8d7da', dot: '#f46a6a' },
  overdue:          { label: 'Overdue',       color: '#f46a6a', bg: '#f8d7da', dot: '#f46a6a' },
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  mayun:  'Mayun', dholki: 'Dholki', mehndi: 'Mehndi', nikah: 'Nikah',
  barat:  'Barat', valima: 'Valima', other:  'Other'
}

export const CRITICAL_EVENTS: EventType[] = ['barat', 'valima', 'nikah']
