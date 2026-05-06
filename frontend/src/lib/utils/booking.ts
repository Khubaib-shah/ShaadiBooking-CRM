import type { BookingStatus, EventType } from '@/types/booking.types'

export const STATUS_CONFIG: Record<BookingStatus, {
  label: string; color: string; bg: string; dot: string
}> = {
  inquiry:          { label: 'Inquiry',       color: '#5B8DD9', bg: '#1E2535', dot: '#5B8DD9' },
  confirmed:        { label: 'Confirmed',     color: '#5BAD80', bg: '#1A2E20', dot: '#5BAD80' },
  deposit_received: { label: 'Deposit Paid',  color: '#C9922A', bg: '#2A2010', dot: '#C9922A' },
  balance_pending:  { label: 'Balance Due',   color: '#E07B30', bg: '#2E1F10', dot: '#E07B30' },
  completed:        { label: 'Completed',     color: '#4DBF7F', bg: '#1A2E1A', dot: '#4DBF7F' },
  cancelled:        { label: 'Cancelled',     color: '#C94A3A', bg: '#2E1515', dot: '#C94A3A' },
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  mayun:  'Mayun', dholki: 'Dholki', mehndi: 'Mehndi', nikah: 'Nikah',
  barat:  'Barat', valima: 'Valima', other:  'Other'
}

export const CRITICAL_EVENTS: EventType[] = ['barat', 'valima', 'nikah']
