import { STATUS_CONFIG } from '@/lib/utils/booking'
import type { BookingStatus } from '@/types/booking.types'

interface StatusBadgeProps {
  status: BookingStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  if (!config) return null

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{ color: config.color, background: config.bg }}
      role="status"
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: config.dot }} />
      {config.label}
    </span>
  )
}
