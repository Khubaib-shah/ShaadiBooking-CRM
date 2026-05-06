import dayjs from 'dayjs'
import relativeTimePlugin from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTimePlugin)

export const PKT_TZ = 'Asia/Karachi'

export function formatDate(date: string | Date, fmt = 'DD MMM YYYY'): string {
  return dayjs(date).format(fmt)
}

export function formatDateTime(date: string | Date): string {
  return dayjs(date).format('DD MMM YYYY, h:mm A')
}

export function relativeTime(date: string | Date): string {
  const d = dayjs(date)
  if (d.isSame(dayjs(), 'day')) return 'Today'
  if (d.isSame(dayjs().add(1, 'day'), 'day')) return 'Tomorrow'
  return d.fromNow()
}

export function isOverdue(date: string | Date): boolean {
  return dayjs(date).isBefore(dayjs(), 'day')
}

export function isDueSoon(date: string | Date, withinDays = 7): boolean {
  const d = dayjs(date)
  return d.isAfter(dayjs().startOf('day')) && d.isBefore(dayjs().add(withinDays, 'day').endOf('day'))
}
