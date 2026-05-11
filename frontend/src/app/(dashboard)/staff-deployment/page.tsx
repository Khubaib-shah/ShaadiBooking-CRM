'use client'

import { useMemo, useState, useEffect } from 'react'
import { Calendar, UserCheck, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import StatusDot from '@/components/shared/StatusDot'

import { mockDb, type MockBooking } from '@/lib/utils/mockDb'
import { formatDate } from 'date-fns'


// Staffing requirements logic based on event type and guests
const calculateRequirements = (booking: MockBooking) => {
  const guests = booking.guests || 200

  // Basic Karachi banquet staffing rule-of-thumb:
  const waiterReq = Math.ceil(guests / 25)
  const chefReq = Math.ceil(guests / 100)

  return [
    { role: 'waiter', label: 'Waiters', req: waiterReq, asg: 0, workers: [] as string[] },
    { role: 'chef', label: 'Chefs', req: chefReq, asg: 0, workers: [] as string[] },
    { role: 'manager', label: 'Managers', req: 1, asg: 0, workers: [] as string[] },
    { role: 'electrician', label: 'Electricians', req: 1, asg: 0, workers: [] as string[] },
  ]
}

export default function StaffDeploymentPage() {
  const [deployments, setDeployments] = useState(() => {
    const bookings = mockDb.getBookings()
    return bookings.map(b => ({
      id: b._id,
      eventName: `${b.client}'s ${b.type}`,
      date: b.date,
      venue: b.venue,
      guests: b.guests,
      menuItems: b.menu?.length || 0,
      rolesNeeded: calculateRequirements(b),
      required: calculateRequirements(b).reduce((sum, r) => sum + r.req, 0),
      assigned: 0
    }))
  })

  // Get unique sorted dates that have events
  const eventDates = useMemo(() => {
    const dates = Array.from(new Set(deployments.map(d => d.date)))
    return dates
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map(date => {
        const [year, month, day] = date.split('-').map(Number)
        const d = new Date(year, month - 1, day) // Local time to avoid timezone shifts
        return {
          label: formatDate(d, 'EEE'),
          num: formatDate(d, 'd'),
          month: formatDate(d, 'MMM'),
          date: date
        }
      })
  }, [deployments])

  const [selectedDate, setSelectedDate] = useState('')

  // Sync selected date on load or when eventDates change
  useEffect(() => {
    if (!selectedDate || !eventDates.some(d => d.date === selectedDate)) {
      const today = formatDate(new Date(), 'yyyy-MM-dd')
      const upcoming = eventDates.find(d => d.date >= today)
      setSelectedDate(upcoming?.date || eventDates[0]?.date || '')
    }
  }, [eventDates, selectedDate])

  const availableWorkers = useMemo(() => mockDb.getWorkers().filter(w => w.active), [])

  const [activeEventToAssign, setActiveEventToAssign] = useState<any>(null)
  const [activeRoleToAssign, setActiveRoleToAssign] = useState<string | null>(null)

  const activeDeployments = useMemo(() => {
    return deployments.filter(d => d.date === selectedDate)
  }, [deployments, selectedDate])

  const stats = useMemo(() => {
    let totalReq = 0
    let totalAsg = 0
    deployments.forEach(d => {
      totalReq += d.required
      totalAsg += d.assigned
    })
    return { totalReq, totalAsg, percent: totalReq > 0 ? Math.round((totalAsg / totalReq) * 100) : 100 }
  }, [deployments])

  const openAssignPanel = (event: any, role: string) => {
    setActiveEventToAssign(event)
    setActiveRoleToAssign(role)
  }

  const closeAssignPanel = () => {
    setActiveEventToAssign(null)
    setActiveRoleToAssign(null)
  }

  const assignWorker = (workerName: string) => {
    if (!activeEventToAssign || !activeRoleToAssign) return

    setDeployments(prev =>
      prev.map(dep => {
        if (dep.id === activeEventToAssign.id) {
          const updatedRoles = dep.rolesNeeded.map(rn => {
            if (rn.role === activeRoleToAssign) {
              if (rn.workers.includes(workerName)) {
                toast.error(`${workerName} is already assigned to this deployment.`)
                return rn
              }
              toast.success(`Assigned ${workerName} as ${rn.label}`)
              return {
                ...rn,
                asg: rn.asg + 1,
                workers: [...rn.workers, workerName]
              }
            }
            return rn
          })
          return {
            ...dep,
            assigned: dep.assigned + 1,
            rolesNeeded: updatedRoles
          }
        }
        return dep
      })
    )
    closeAssignPanel()
  }

  const removeWorker = (eventId: string, roleKey: string, workerName: string) => {
    setDeployments(prev =>
      prev.map(dep => {
        if (dep.id === eventId) {
          const updatedRoles = dep.rolesNeeded.map(rn => {
            if (rn.role === roleKey) {
              toast.info(`Removed ${workerName} from assignments.`)
              return {
                ...rn,
                asg: Math.max(0, rn.asg - 1),
                workers: rn.workers.filter(w => w !== workerName)
              }
            }
            return rn
          })
          return {
            ...dep,
            assigned: Math.max(0, dep.assigned - 1),
            rolesNeeded: updatedRoles
          }
        }
        return dep
      })
    )
  }


  return (
    <PageWrapper>
      <PageHeader
        title="Staff Schedule"
        description="Assign and monitor event-level staffing assignments"
      />

      {/* Staffing Status KPIs */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Staffing Progress</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-[var(--color-text-primary)] font-mono">{stats.percent}%</p>
            <p className="text-xs text-[var(--color-text-muted)]">average filled</p>
          </div>
          <div className="h-2 rounded-full bg-[var(--color-bg-sunken)] mt-3">
            <div className="h-2 rounded-full bg-[#34c38f]" style={{ width: `${stats.percent}%` }} />
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#34c38f]/10 text-[#34c38f]">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Staff Assigned</p>
            <p className="text-xl font-black text-[var(--color-text-primary)] font-mono mt-0.5">{stats.totalAsg}</p>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1b44c]/10 text-[#f1b44c]">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Empty Spots</p>
            <p className="text-xl font-black text-[var(--color-text-primary)] font-mono mt-0.5">{stats.totalReq - stats.totalAsg}</p>
          </div>
        </div>
      </div>

      {/* Booked Dates Navigator */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Event Dates</p>
            <p className="text-[10px] font-bold text-[var(--color-accent)] mt-1">SELECT A DATE TO ADD STAFF</p>
          </div>
          <Calendar className="h-4 w-4 text-[var(--color-text-muted)]" />
        </div>

        <div className="flex flex-wrap gap-3">
          {eventDates.map((day) => {
            const isSelected = selectedDate === day.date
            const eventCount = deployments.filter(d => d.date === day.date).length

            return (
              <button
                key={day.date}
                onClick={() => setSelectedDate(day.date)}
                className={`flex items-center gap-3 py-2 px-4 rounded-xl border transition-all text-left ${isSelected
                  ? 'border-[#556ee6] bg-[#eef2ff]/60 text-[#556ee6]'
                  : 'border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)] text-[var(--color-text-secondary)]'
                  }`}
              >
                <div className={`flex flex-col items-center justify-center h-10 w-10 rounded-lg ${isSelected ? 'bg-[#556ee6] text-white' : 'bg-[var(--color-bg-sunken)]'}`}>
                  <span className="text-[9px] font-bold uppercase leading-none mb-0.5">{day.month}</span>
                  <span className="text-sm font-black font-mono leading-none">{day.num}</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{day.label}</p>
                  <p className="text-xs font-black mt-0.5">
                    {eventCount} Event{eventCount > 1 ? 's' : ''}
                  </p>
                </div>
              </button>
            )
          })}
          {eventDates.length === 0 && (
            <p className="text-sm font-medium text-[var(--color-text-muted)] py-4 w-full text-center">No bookings found in the database.</p>
          )}
        </div>
      </div>

      {/* Deployments List render */}
      <div className="space-y-6">
        {activeDeployments.length === 0 ? (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 text-center" style={{ minHeight: '200px' }}>
            <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">No active events on this date</p>
            <p className="text-xs text-[var(--color-text-muted)]">Check another day of the week above.</p>
          </div>
        ) : (
          activeDeployments.map((event) => {
            const completeness = Math.round((event.assigned / event.required) * 100)
            const isFullyStaffed = event.assigned === event.required

            return (
              <div key={event.id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-sm space-y-5">
                <div className="flex items-start justify-between border-b pb-4 border-[var(--color-border)]">
                  <div>
                    <h3 className="text-base font-bold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                      {event.eventName}
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{event.venue}</p>
                  </div>
                  <StatusDot
                    tone={isFullyStaffed ? 'success' : 'warning'}
                    label={isFullyStaffed ? 'Ready' : `${event.required - event.assigned} spots left`}
                  />
                </div>

                {/* Staffing progress bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[var(--color-text-secondary)]">Progress</span>
                    <span className="font-mono text-[var(--color-text-primary)]">{completeness}% filled</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[var(--color-bg-sunken)]">
                    <div className="h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${completeness}%`,
                        background: isFullyStaffed ? '#34c38f' : '#f1b44c'
                      }}
                    />
                  </div>
                </div>

                {/* Role Specific assignments checkboxes/lists */}
                <div className="grid gap-6 md:grid-cols-2">
                  {event.rolesNeeded.map((rn) => (
                    <div key={rn.role} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-sunken)] p-4 space-y-3">
                      <div className="flex justify-between items-center border-b pb-2 border-[var(--color-border)]">
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                          {rn.label} ({rn.asg}/{rn.req})
                        </span>
                        {rn.asg < rn.req && (
                          <button
                            onClick={() => openAssignPanel(event, rn.role)}
                            className="inline-flex items-center gap-1 rounded bg-[#556ee6] hover:brightness-110 px-2 py-1 text-[10px] font-semibold text-white shadow-sm transition-all"
                          >
                            <Plus className="h-3 w-3" /> Assign
                          </button>
                        )}
                      </div>

                      {/* List of assigned personnel */}
                      <div className="space-y-1.5">
                        {rn.workers.map((worker) => (
                          <div key={worker} className="flex justify-between items-center text-xs px-2.5 py-1.5 rounded bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)]">
                            <span className="font-medium">{worker}</span>
                            <button
                              onClick={() => removeWorker(event.id, rn.role, worker)}
                              className="text-[10px] text-[#f46a6a] font-bold hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        ))}

                        {/* Dashed placeholder elements if gaps exist */}
                        {Array.from({ length: rn.req - rn.asg }).map((_, idx) => (
                          <div
                            key={idx}
                            onClick={() => openAssignPanel(event, rn.role)}
                            className="text-center py-2 text-[11px] font-semibold rounded-lg border-2 border-dashed border-[var(--color-border-mid)] text-[var(--color-text-muted)] cursor-pointer hover:border-[#556ee6] hover:text-[#556ee6] transition-all bg-[var(--color-bg-elevated)]"
                          >
                            + Click to assign {rn.label.slice(0, -1)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* INTERACTIVE ASG SHEET SLIDE (radix style popup) */}
      <AnimatePresence>
        {activeEventToAssign && activeRoleToAssign && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm"
            onClick={closeAssignPanel}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm h-full bg-[var(--color-bg-elevated)] border-l shadow-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b pb-4 border-[var(--color-border)] mb-5">
                  <div>
                    <h4 className="text-sm font-black text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                      Assign Workforce
                    </h4>
                    <p className="text-[11px] text-[var(--color-text-muted)] font-medium mt-0.5">Event: {activeEventToAssign.eventName}</p>
                  </div>
                  <button
                    onClick={closeAssignPanel}
                    className="p-1 rounded-full border border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)] transition-all"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Available & Free Workers</p>
                <div className="space-y-2">
                  {availableWorkers
                    .filter(w => w.role === activeRoleToAssign)
                    .map((worker) => (
                      <button
                        key={worker.id}
                        onClick={() => assignWorker(worker.name)}
                        className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-sunken)] hover:border-[var(--color-border-mid)] text-left transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-bg-sunken)] text-sm">
                            {worker.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[var(--color-text-primary)]">{worker.name}</p>
                            <p className="text-[10px] text-[var(--color-text-muted)] capitalize font-semibold mt-0.5">{worker.role} · {worker.type}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-[#34c38f] bg-[#34c38f]/10 px-2.5 py-1 rounded-full">Available</span>
                      </button>
                    ))}
                  {availableWorkers.filter(w => w.role === activeRoleToAssign).length === 0 && (
                    <div className="p-8 text-center border-2 border-dashed border-[var(--color-border)] rounded-xl">
                      <p className="text-xs font-bold text-[var(--color-text-muted)]">No available {activeRoleToAssign}s found in staff list.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-4 border-[var(--color-border)]">
                <button
                  onClick={closeAssignPanel}
                  className="w-full text-center py-2.5 rounded-lg border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-sunken)] transition-all"
                >
                  Close Panel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}
