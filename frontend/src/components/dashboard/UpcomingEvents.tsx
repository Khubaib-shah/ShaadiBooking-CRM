'use client'

import { Loader2 } from 'lucide-react'
import { formatDate, relativeTime } from '@/lib/utils/dates'
import { formatRupees } from '@/lib/utils/currency'
import { EVENT_TYPE_LABELS } from '@/lib/utils/booking'
import StatusBadge from '@/components/shared/StatusBadge'
import { useDashboardUpcoming } from '@/lib/hooks/useDashboard'

export default function UpcomingEvents() {
  const { data: response, isLoading } = useDashboardUpcoming()
  const upcoming = response?.data || []

  return (
    <div className="rounded-xl border p-5 flex flex-col" style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', minHeight: '350px' }}>
      <h3 className="text-[var(--text-base)] font-semibold mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
        Upcoming Events
      </h3>
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--color-accent)]" />
        </div>
      ) : upcoming.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-xs font-semibold text-[var(--color-text-muted)] text-center">
          No upcoming events in the next 30 days.
        </div>
      ) : (
        <div className="space-y-3">
          {upcoming.map((event) => {
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
                    {EVENT_TYPE_LABELS[event.eventType as keyof typeof EVENT_TYPE_LABELS] || event.eventType}
                  </span>
                  <span className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{event.venueName}</span>
                </div>
              </div>
              {/* Status + outstanding */}
              <div className="flex flex-col items-end gap-1">
                <StatusBadge status={event.status as any} />
                <span className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-warning)' }}>
                  {formatRupees(event.totalOutstanding, true)}
                </span>
              </div>
            </div>
          )
          })}
        </div>
      )}
    </div>
  )
}
