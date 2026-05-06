import { format, formatDistance, isToday, isTomorrow, isPast, addDays, parseISO } from 'date-fns'

export const PKT_TZ = 'Asia/Karachi'

export function formatDate(date: string | Date, fmt = 'dd MMM yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, fmt)
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'dd MMM yyyy, h:mm a')
}

export function relativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (isToday(d)) return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  return formatDistance(d, new Date(), { addSuffix: true })
}

export function isOverdue(date: string | Date): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date
  return isPast(d) && !isToday(d)
}

export function isDueSoon(date: string | Date, withinDays = 7): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date
  return d >= new Date() && d <= addDays(new Date(), withinDays)
}
