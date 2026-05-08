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

export interface RichMenuItem {
  _id: string
  name: string
  category: 'main' | 'sweet' | 'bread' | 'drink' | 'starter'
  price: number
  icon: string
}

export const RICH_MENU_ITEMS: RichMenuItem[] = [
  { _id: 'm1', name: 'Mutton Biryani', category: 'main', price: 650, icon: '🍖' },
  { _id: 'm2', name: 'Chicken Qorma', category: 'main', price: 400, icon: '🍗' },
  { _id: 'm10', name: 'Beef Pulao', category: 'main', price: 500, icon: '🍲' },
  { _id: 'm3', name: 'Seekh Kabab', category: 'main', price: 300, icon: '🍢' },
  { _id: 'm9', name: 'Chicken Tikka', category: 'starter', price: 250, icon: '🥗' },
  { _id: 'm4', name: 'Gajar Ka Halwa', category: 'sweet', price: 180, icon: '🍰' },
  { _id: 'm5', name: 'Gulab Jamun', category: 'sweet', price: 120, icon: '🧁' },
  { _id: 'm6', name: 'Naan / Roti', category: 'bread', price: 40, icon: '🫓' },
  { _id: 'm7', name: 'Cold Drinks', category: 'drink', price: 80, icon: '🥤' },
  { _id: 'm8', name: 'Fresh Juice', category: 'drink', price: 150, icon: '🍹' },
]

/**
 * Calculates guest count modifier (surcharge or discount) per head:
 * - < 50 guests: +350 Rs/head (High overhead)
 * - 50-99 guests: +150 Rs/head (Moderate overhead)
 * - 100-249 guests: 0 Rs/head (Standard)
 * - >= 250 guests: -50 Rs/head (Volume discount)
 */
export function getGuestCountModifier(guestCount: number): { amount: number; label: string; type: 'surcharge' | 'discount' | 'neutral' } {
  const count = Number(guestCount) || 0
  if (count <= 0) return { amount: 0, label: 'Standard', type: 'neutral' }
  if (count < 50) {
    return { amount: 350, label: 'Low Guest Count Overhead (+Rs. 350/head)', type: 'surcharge' }
  }
  if (count < 100) {
    return { amount: 150, label: 'Moderate Guest Count Overhead (+Rs. 150/head)', type: 'surcharge' }
  }
  if (count >= 250) {
    return { amount: -50, label: 'Volume Discount (-Rs. 50/head)', type: 'discount' }
  }
  return { amount: 0, label: 'Standard Tier Pricing (No modifier)', type: 'neutral' }
}

