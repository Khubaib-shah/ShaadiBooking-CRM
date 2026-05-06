import type { EventType } from '@/types/booking.types'

export const EVENT_COLORS: Record<EventType, { bg: string; text: string; border: string }> = {
  barat: { bg: '#e7f5ff', text: '#1971c2', border: '#74c0fc' },
  mehndi: { bg: '#fff9db', text: '#e67700', border: '#ffe066' },
  valima: { bg: '#f3fbe8', text: '#2f9e44', border: '#8ce99a' },
  dholki: { bg: '#fff0f6', text: '#c2255c', border: '#faa2c1' },
  nikah: { bg: '#f8f0ff', text: '#7048e8', border: '#d0bfff' },
  mayun: { bg: '#f1f3f5', text: '#495057', border: '#dee2e6' },
  other: { bg: '#f8f9fa', text: '#495057', border: '#dee2e6' },
}

