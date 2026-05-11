'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Users, Info, Plus, ArrowRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns'
import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import { EVENT_TYPE_LABELS, STATUS_CONFIG } from '@/lib/utils/booking'
import { useBookings } from '@/lib/hooks/useBookings'
import { useUIStore } from '@/lib/store/uiStore'
import { formatRupees } from '@/lib/utils/currency'
import Link from 'next/link'

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const { openNewBooking, setSelectedDate: setStoreDate } = useUIStore()

  // Load persistent real-time bookings
  const { data: resp } = useBookings()
  const bookings = resp?.data || []

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calStart = startOfWeek(monthStart)
  const calEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  const getBookingsForDay = (day: Date) => {
    return bookings.filter(b => {
      // split to avoid tz offset issues
      const bDateStr = b.eventDate.split('T')[0]
      const dayStr = day.toISOString().split('T')[0]
      return bDateStr === dayStr
    })
  }

  // Auto select today on load
  useEffect(() => {
    setSelectedDate(new Date())
  }, [])

  const selectedDayBookings = selectedDate ? getBookingsForDay(selectedDate) : []

  const handleQuickBook = () => {
    if (selectedDate) {
      setStoreDate(selectedDate)
      openNewBooking()
    }
  }

  return (
    <PageWrapper>
      <PageHeader title="Calendar" description="Track wedding bookings, coordinate staff assignments, and prevent booking overlaps on busy dates" />

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Left 2 Columns: Calendar Board */}
        <div className="lg:col-span-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-sm">
          
          {/* Calendar Header Month Controller */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)] transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4 text-[var(--color-text-secondary)]" />
            </button>
            <h3 className="text-sm font-black uppercase tracking-wider text-[var(--color-text-primary)]">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)] transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4 text-[var(--color-text-secondary)]" />
            </button>
          </div>

          {/* Weekday Names Header Row */}
          <div className="grid grid-cols-7 mb-2 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)] py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Day Grid cells */}
          <div className="grid grid-cols-7 border-t border-l border-[var(--color-border)] rounded-xl overflow-hidden">
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
                  className="min-h-[95px] border-r border-b p-2 cursor-pointer transition-all duration-150 relative select-none hover:bg-[var(--color-bg-sunken)]/50"
                  style={{
                    borderColor: 'var(--color-border)',
                    background: selected 
                      ? 'var(--color-accent-soft)' 
                      : hasConflict 
                        ? 'var(--color-danger-bg)' 
                        : 'var(--color-bg-elevated)',
                    opacity: inMonth ? 1 : 0.35,
                  }}
                >
                  <div className="flex justify-between items-start">
                    {/* Conflict indicator dot */}
                    {hasConflict && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-danger)] animate-pulse" title="Event overlap conflict!" />
                    )}
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-mono ml-auto ${
                        today ? 'font-bold bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-secondary)]'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                  </div>

                  {/* Render up to 2 bookings previews inside grid */}
                  <div className="space-y-1 mt-2">
                    {dayBookings.slice(0, 2).map(b => {
                      const sc = STATUS_CONFIG[b.status] || { bg: '#eef2ff', dot: '#556ee6', color: '#556ee6' }
                      const nameToShow = b.clientName ? b.clientName.trim().split(' ')[0] : 'Event'
                      return (
                        <div
                          key={b._id}
                          className="flex items-center gap-0.5 sm:gap-1 rounded px-0.5 sm:px-1 py-0.5 text-[7.5px] xs:text-[8.5px] md:text-[9px] font-bold truncate leading-none"
                          style={{ background: sc.bg, color: sc.color }}
                        >
                          <span className="w-1 h-1 rounded-full shrink-0 hidden xs:inline-block" style={{ background: sc.dot }} />
                          <span className="truncate">{nameToShow}</span>
                        </div>
                      )
                    })}
                    {dayBookings.length > 2 && (
                      <span className="text-[8px] md:text-[9px] font-black pl-1 text-[var(--color-text-muted)]">
                        +{dayBookings.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Status Color Legend */}
          <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-[var(--color-border)]">
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: config.dot }} />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{config.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Column: Daily Event Planner Panel */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--color-border)]">
              <CalendarIcon className="h-4.5 w-4.5 text-[var(--color-accent)]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)]">
                Selected Day Planner
              </h3>
            </div>

            {selectedDate && (
              <p className="text-sm font-bold text-[var(--color-text-primary)] mb-4">
                {format(selectedDate, 'EEEE, d MMMM yyyy')}
              </p>
            )}

            {/* List of Bookings scheduled on selectedDate */}
            <div className="space-y-3">
              {selectedDayBookings.map((b) => {
                const sc = STATUS_CONFIG[b.status] || { bg: '#eef2ff', dot: '#556ee6', color: '#556ee6' }
                return (
                  <div key={b._id} className="rounded-xl border border-[var(--color-border)] p-4 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                        {EVENT_TYPE_LABELS[b.eventType] || b.eventType}
                      </span>
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: sc.bg, color: sc.color }}
                      >
                        {b.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[var(--color-text-primary)] mb-1">{b.clientName}</h4>
                    
                    <div className="space-y-1.5 text-xs text-[var(--color-text-secondary)]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
                        <span className="truncate">{b.venueName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
                        <span>{b.guestCount} guests</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                      <p className="text-xs font-mono font-bold text-[var(--color-text-primary)]">
                        {formatRupees(b.totalContractValue, true)}
                      </p>
                      <Link
                        href={`/bookings/${b._id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-[var(--color-accent)] hover:underline"
                      >
                        Details <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                )}
              )}

              {/* Day Overlap Warning if multiple bookings on the same date */}
              {selectedDayBookings.length > 1 && (
                <div className="bg-[var(--color-danger-bg)]/30 border border-[var(--color-danger)]/20 rounded-xl p-3.5 flex gap-2.5 text-xs">
                  <Info className="h-4.5 w-4.5 text-[var(--color-danger)] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[var(--color-danger)]">Booking Conflict Alert</p>
                    <p className="text-[var(--color-text-secondary)] mt-0.5">
                      You have {selectedDayBookings.length} overlapping weddings scheduled on this date. Double check kitchen and waiter crew rosters.
                    </p>
                  </div>
                </div>
              )}

              {/* Empty state if day has no bookings */}
              {selectedDayBookings.length === 0 && (
                <div className="border-2 border-dashed border-[var(--color-border)] rounded-xl py-12 px-4 text-center">
                  <CalendarIcon className="mx-auto h-8 w-8 text-[var(--color-text-muted)] mb-3" />
                  <p className="text-xs text-[var(--color-text-muted)] font-bold mb-1">No bookings today</p>
                  <p className="text-[11px] text-[var(--color-text-muted)] mb-4 leading-relaxed">
                    This date is fully open for wedding booking inquiries.
                  </p>
                  <button
                    onClick={handleQuickBook}
                    className="inline-flex items-center gap-1 rounded-lg px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all hover:brightness-110 active:scale-95"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}
                  >
                    <Plus className="h-3.5 w-3.5" /> Book on this Day
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--color-border)] hidden lg:block text-xs text-[var(--color-text-muted)] leading-relaxed">
            <p className="font-bold mb-1">Quick Tip:</p>
            You can click on any day square in the calendar board to examine schedule, venue lists, and guest parameters instantly!
          </div>
        </div>

      </div>
    </PageWrapper>
  )
}
