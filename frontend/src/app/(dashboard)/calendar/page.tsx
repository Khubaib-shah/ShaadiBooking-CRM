'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns'
import PageHeader from '@/components/shared/PageHeader'
import { EVENT_TYPE_LABELS, STATUS_CONFIG } from '@/lib/utils/booking'
import type { BookingStatus, EventType } from '@/types/booking.types'

const DEMO_BOOKINGS = [
  { _id: '1', clientName: 'Ahmed Khan', eventType: 'barat' as EventType, eventDate: new Date(2025, new Date().getMonth(), 15).toISOString(), status: 'confirmed' as BookingStatus },
  { _id: '2', clientName: 'Sara Ali', eventType: 'mehndi' as EventType, eventDate: new Date(2025, new Date().getMonth(), 15).toISOString(), status: 'deposit_received' as BookingStatus },
  { _id: '3', clientName: 'Usman Sheikh', eventType: 'valima' as EventType, eventDate: new Date(2025, new Date().getMonth(), 20).toISOString(), status: 'balance_pending' as BookingStatus },
  { _id: '4', clientName: 'Fatima Raza', eventType: 'nikah' as EventType, eventDate: new Date(2025, new Date().getMonth(), 22).toISOString(), status: 'confirmed' as BookingStatus },
]

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calStart = startOfWeek(monthStart)
  const calEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  const getBookingsForDay = (day: Date) =>
    DEMO_BOOKINGS.filter(b => isSameDay(new Date(b.eventDate), day))

  return (
    <div>
      <PageHeader title="Calendar" description="View bookings on the calendar" />

      {/* Month nav */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[var(--color-border)]"
          aria-label="Previous month">
          <ChevronLeft className="h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
        </button>
        <h3 className="text-[var(--text-lg)]" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[var(--color-border)]"
          aria-label="Next month">
          <ChevronRight className="h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
        </button>
      </div>

      {/* Grid header */}
      <div className="grid grid-cols-7 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-[10px] font-semibold uppercase tracking-wider py-2"
               style={{ color: 'var(--color-text-muted)' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 border-t border-l rounded-lg overflow-hidden"
           style={{ borderColor: 'var(--color-border)' }}>
        {days.map((day) => {
          const dayBookings = getBookingsForDay(day)
          const inMonth = isSameMonth(day, currentMonth)
          const today = isToday(day)
          const selected = selectedDate && isSameDay(day, selectedDate)
          const hasConflict = dayBookings.length > 1

          return (
            <div
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className="min-h-[90px] border-r border-b p-1.5 cursor-pointer transition-colors"
              style={{
                borderColor: 'var(--color-border)',
                background: selected ? 'var(--color-accent-soft)' : hasConflict ? 'var(--color-danger-bg)' : 'var(--color-bg-elevated)',
                opacity: inMonth ? 1 : 0.3,
              }}
            >
              <div className="flex justify-end">
                <span
                  className={`text-xs px-1 rounded ${today ? 'font-bold' : ''}`}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: today ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    background: today ? 'var(--color-accent-soft)' : 'transparent',
                  }}
                >
                  {format(day, 'd')}
                </span>
              </div>
              <div className="space-y-0.5 mt-1">
                {dayBookings.slice(0, 2).map(b => {
                  const sc = STATUS_CONFIG[b.status]
                  return (
                    <div key={b._id} className="flex items-center gap-1 rounded px-1 py-0.5 text-[9px] truncate"
                         style={{ background: sc.bg }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: sc.dot }} />
                      <span className="truncate" style={{ color: sc.color }}>{b.clientName}</span>
                    </div>
                  )
                })}
                {dayBookings.length > 2 && (
                  <span className="text-[9px] px-1" style={{ color: 'var(--color-text-muted)' }}>+{dayBookings.length - 2} more</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4">
        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: config.dot }} />
            <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{config.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
