'use client'

import { formatDate, relativeTime } from '@/lib/utils/dates'
import { formatRupees } from '@/lib/utils/currency'
import { EVENT_TYPE_LABELS } from '@/lib/utils/booking'
import StatusBadge from '@/components/shared/StatusBadge'
import type { BookingStatus, EventType } from '@/types/booking.types'

const DEMO_EVENTS = [
  { _id: '1', clientName: 'Ahmed Khan', eventType: 'barat' as EventType, eventDate: new Date(Date.now() + 86400000).toISOString(), venueName: 'Pearl Continental', status: 'confirmed' as BookingStatus, totalOutstanding: 350000 },
  { _id: '2', clientName: 'Sara Ali', eventType: 'mehndi' as EventType, eventDate: new Date(Date.now() + 86400000 * 2).toISOString(), venueName: 'Mövenpick Hotel', status: 'deposit_received' as BookingStatus, totalOutstanding: 120000 },
  { _id: '3', clientName: 'Usman Sheikh', eventType: 'valima' as EventType, eventDate: new Date(Date.now() + 86400000 * 3).toISOString(), venueName: 'Creek Club', status: 'balance_pending' as BookingStatus, totalOutstanding: 500000 },
  { _id: '4', clientName: 'Fatima Raza', eventType: 'nikah' as EventType, eventDate: new Date(Date.now() + 86400000 * 5).toISOString(), venueName: 'Mohatta Palace', status: 'confirmed' as BookingStatus, totalOutstanding: 200000 },
]

export default function UpcomingEvents() {
  return (
    <div className="rounded-xl border p-5" style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
      <h3 className="text-[var(--text-base)] font-semibold mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
        Upcoming Events
      </h3>
      <div className="space-y-3">
        {DEMO_EVENTS.map((event) => {
          const d = new Date(event.eventDate)
          return (
            <div
              key={event._id}
              className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-[var(--color-bg-sunken)]"
            >
              {/* Date pill */}
              <div className="flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-lg"
                   style={{ background: 'var(--color-bg-sunken)' }}>
                <span className="text-lg leading-none" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
                  {d.getDate()}
                </span>
                <span className="text-[9px] uppercase" style={{ color: 'var(--color-text-muted)' }}>
                  {d.toLocaleDateString('en', { month: 'short' })}
                </span>
              </div>
              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-[var(--text-sm)] font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                  {event.clientName}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: 'var(--color-accent-soft)', color: 'var(--color-accent)' }}>
                    {EVENT_TYPE_LABELS[event.eventType]}
                  </span>
                  <span className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{event.venueName}</span>
                </div>
              </div>
              {/* Status + outstanding */}
              <div className="flex flex-col items-end gap-1">
                <StatusBadge status={event.status} />
                <span className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-warning)' }}>
                  {formatRupees(event.totalOutstanding, true)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
