'use client'

import { useMemo, useState } from 'react'
import { Calendar, UserCheck, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import StatusDot from '@/components/shared/StatusDot'

// Calendar week-days representation
const DAYS = [
  { label: 'Mon', num: '19', date: '2025-05-19' },
  { label: 'Tue', num: '20', date: '2025-05-20' },
  { label: 'Wed', num: '21', date: '2025-05-21' },
  { label: 'Thu', num: '22', date: '2025-05-22' },
  { label: 'Fri', num: '23', date: '2025-05-23' },
  { label: 'Sat', num: '24', date: '2025-05-24' },
  { label: 'Sun', num: '25', date: '2025-05-25' },
]

// Mock Deployment active data
const INITIAL_DEPLOYMENTS = [
  {
    id: 'dep-1',
    eventName: 'Imran Barat Banquet',
    date: '2025-05-20',
    venue: 'Pearl Continental Hall A',
    required: 12,
    assigned: 9,
    rolesNeeded: [
      { role: 'waiter', label: 'Waiters', req: 8, asg: 6, workers: ['Ahmed Ali', 'Rashid Hussain', 'Hassan Ali', 'Bilal Shah', 'Farooq Khan', 'Yasir Malik'] },
      { role: 'chef', label: 'Chefs', req: 2, asg: 2, workers: ['Muhammad Aslam', 'Sajid Butt'] },
      { role: 'manager', label: 'Managers', req: 1, asg: 1, workers: ['Saleem Butt'] },
      { role: 'electrician', label: 'Electricians', req: 1, asg: 0, workers: [] },
    ]
  },
  {
    id: 'dep-2',
    eventName: 'Sara Mehndi Lawn',
    date: '2025-05-22',
    venue: 'Emaar Beach Front Lawn',
    required: 9,
    assigned: 9,
    rolesNeeded: [
      { role: 'waiter', label: 'Waiters', req: 6, asg: 6, workers: ['Ahmed Ali', 'Rashid Hussain', 'Hassan Ali', 'Farooq Khan', 'Yasir Malik', 'Sajid Ali'] },
      { role: 'chef', label: 'Chefs', req: 1, asg: 1, workers: ['Muhammad Aslam'] },
      { role: 'manager', label: 'Managers', req: 1, asg: 1, workers: ['Saleem Butt'] },
      { role: 'electrician', label: 'Electricians', req: 1, asg: 1, workers: ['Tariq Mehmood'] },
    ]
  }
]

// Available workers list for instant assignments
const AVAILABLE_WORKERS = [
  { id: 'w10', name: 'Naveed Ahmed', role: 'driver', emoji: '🚗' },
  { id: 'w4', name: 'Tariq Mehmood', role: 'electrician', emoji: '⚡' },
  { id: 'w11', name: 'Imtiaz Khan', role: 'generator_operator', emoji: '⚙️' },
  { id: 'w12', name: 'Zia-ur-Rehman', role: 'waiter', emoji: '🍽' },
]

export default function StaffDeploymentPage() {
  const [selectedDate, setSelectedDate] = useState('2025-05-20')
  const [deployments, setDeployments] = useState(INITIAL_DEPLOYMENTS)
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
        title="Staff Deployment"
        description="Assign, deploy, and monitor event-level staffing completeness"
      />

      {/* Deployments Quick Status KPIs */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Staffing Completeness Rate</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-[var(--color-text-primary)] font-mono">{stats.percent}%</p>
            <p className="text-xs text-[var(--color-text-muted)]">average across events</p>
          </div>
          <div className="h-2 rounded-full bg-[var(--color-bg-sunken)] mt-3">
            <div className="h-2 rounded-full bg-[#34c38f]" style={{ width: `${stats.percent}%` }} />
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#34c38f]/10 text-[#34c38f]">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Assigned Positions</p>
            <p className="text-xl font-black text-[var(--color-text-primary)] font-mono mt-0.5">{stats.totalAsg}</p>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1b44c]/10 text-[#f1b44c]">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Unstaffed Gaps</p>
            <p className="text-xl font-black text-[var(--color-text-primary)] font-mono mt-0.5">{stats.totalReq - stats.totalAsg} positions</p>
          </div>
        </div>
      </div>

      {/* Calendar Week Slider Navigator */}
      <div className="rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Select Operational Date</p>
          <div className="flex gap-1">
            <button className="p-1 rounded hover:bg-[var(--color-bg-sunken)] border border-[var(--color-border)]" aria-label="Previous Week"><ChevronLeft className="h-4 w-4" /></button>
            <button className="p-1 rounded hover:bg-[var(--color-bg-sunken)] border border-[var(--color-border)]" aria-label="Next Week"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((day) => {
            const isSelected = selectedDate === day.date
            return (
              <button
                key={day.date}
                onClick={() => setSelectedDate(day.date)}
                className={`flex flex-col items-center py-2.5 rounded-lg border transition-all ${
                  isSelected 
                    ? 'border-[#556ee6] bg-[#eef2ff]/60 text-[#556ee6] shadow-sm' 
                    : 'border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)] text-[var(--color-text-secondary)]'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider mb-1">{day.label}</span>
                <span className="text-sm font-black font-mono">{day.num}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Deployments List render */}
      <div className="space-y-6">
        {activeDeployments.length === 0 ? (
          <div className="rounded-xl border border-[var(--color-border)] bg-white p-8 text-center" style={{ minHeight: '200px' }}>
            <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">No active events on this date</p>
            <p className="text-xs text-[var(--color-text-muted)]">Check another day of the week above.</p>
          </div>
        ) : (
          activeDeployments.map((event) => {
            const completeness = Math.round((event.assigned / event.required) * 100)
            const isFullyStaffed = event.assigned === event.required

            return (
              <div key={event.id} className="rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm space-y-5">
                <div className="flex items-start justify-between border-b pb-4 border-[var(--color-border)]">
                  <div>
                    <h3 className="text-base font-bold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                      {event.eventName}
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{event.venue}</p>
                  </div>
                  <StatusDot 
                    tone={isFullyStaffed ? 'success' : 'warning'} 
                    label={isFullyStaffed ? 'Fully Staffed' : `${event.required - event.assigned} spots empty`} 
                  />
                </div>

                {/* Staffing completion progress */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[var(--color-text-secondary)]">Staffing Completeness</span>
                    <span className="font-mono text-[var(--color-text-primary)]">{completeness}% ({event.assigned}/{event.required})</span>
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
                          <div key={worker} className="flex justify-between items-center text-xs px-2.5 py-1.5 rounded bg-white border border-[var(--color-border)] text-[var(--color-text-primary)]">
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
                            className="text-center py-2 text-[11px] font-semibold rounded-lg border-2 border-dashed border-[var(--color-border-mid)] text-[var(--color-text-muted)] cursor-pointer hover:border-[#556ee6] hover:text-[#556ee6] transition-all bg-white"
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
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-sm h-full bg-white border-l shadow-2xl p-6 flex flex-col justify-between"
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
                  {AVAILABLE_WORKERS.map((worker) => (
                    <button
                      key={worker.id}
                      onClick={() => assignWorker(worker.name)}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--color-border)] bg-white hover:bg-[var(--color-bg-sunken)] hover:border-[var(--color-border-mid)] text-left transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{worker.emoji}</span>
                        <div>
                          <p className="text-xs font-bold text-[var(--color-text-primary)]">{worker.name}</p>
                          <p className="text-[10px] text-[var(--color-text-muted)] capitalize font-semibold mt-0.5">{worker.role}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#34c38f] bg-[#34c38f]/10 px-2.5 py-1 rounded-full">Available</span>
                    </button>
                  ))}
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
