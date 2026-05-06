'use client'

import { use, useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, User, Calendar, CreditCard, CheckSquare, FileText, Phone, Printer, Shield, FileCheck, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import PhoneDisplay from '@/components/shared/PhoneDisplay'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'
import { formatDate } from '@/lib/utils/dates'

const TABS = [
  { id: 'overview', label: 'Biography', icon: User },
  { id: 'events', label: 'Event History', icon: Calendar },
  { id: 'salary', label: 'Salary Ledger', icon: CreditCard },
  { id: 'attendance', label: 'Attendance', icon: CheckSquare },
  { id: 'docs', label: 'Documents', icon: FileText },
]

// Extended Mock Worker details
const PROFILE_DATA: Record<string, any> = {
  w1: {
    id: 'w1', name: 'Ahmed Ali', role: 'Head Waiter', type: 'Permanent', phone: '03212345678',
    cnic: '42101-1234567-1', address: 'House 142, Sector 11-A, North Karachi', emergencyName: 'Sajid Ali (Brother)',
    emergencyPhone: '03009876543', dateJoined: '12 Jan 2024', active: true, performance: 'Outstanding (4.8/5.0)',
    eventsList: [
      { id: 'ev1', title: 'Imran Barat Banquet', date: '2025-05-02', role: 'Head Waiter', status: 'completed', wage: 3000 },
      { id: 'ev2', title: 'Sara Mehndi Hall A', date: '2025-04-28', role: 'Head Waiter', status: 'completed', wage: 3000 },
      { id: 'ev3', title: 'Hamza Valima Lawn', date: '2025-04-15', role: 'Head Waiter', status: 'completed', wage: 3000 },
      { id: 'ev4', title: 'Yasir Nikah Hall C', date: '2025-04-10', role: 'Waiter', status: 'completed', wage: 2500 },
    ],
    ledger: [
      { month: 'May 2025', base: 30000, bonus: 4000, advance: 0, deductions: 500, net: 33500, status: 'paid', paidAt: '2025-05-01' },
      { month: 'April 2025', base: 30000, bonus: 2500, advance: 5000, deductions: 0, net: 27500, status: 'paid', paidAt: '2025-04-01' },
      { month: 'March 2025', base: 30000, bonus: 3000, advance: 0, deductions: 1000, net: 32000, status: 'paid', paidAt: '2025-03-01' },
    ],
    attendanceStats: { present: 94, absent: 4, noShow: 2 },
    documents: [
      { name: 'CNIC Front & Back Scan', type: 'PDF', size: '1.2 MB', verified: true },
      { name: 'Signed Employment Agreement', type: 'PDF', size: '2.4 MB', verified: true },
    ]
  },
  w2: {
    id: 'w2', name: 'Rashid Hussain', role: 'Waiter', type: 'Temporary', phone: '03001234567',
    cnic: '42101-9876543-2', address: 'Block C, Liaquatabad, Karachi', emergencyName: 'Zahid Hussain (Father)',
    emergencyPhone: '03112233445', dateJoined: '05 Mar 2024', active: true, performance: 'Good (4.2/5.0)',
    eventsList: [
      { id: 'ev1', title: 'Imran Barat Banquet', date: '2025-05-02', role: 'Waiter', status: 'completed', wage: 1500 },
      { id: 'ev2', title: 'Sara Mehndi Hall A', date: '2025-04-28', role: 'Waiter', status: 'completed', wage: 1500 },
    ],
    ledger: [
      { month: 'May 2025', base: 0, bonus: 9000, advance: 0, deductions: 0, net: 9000, status: 'paid', paidAt: '2025-05-03' },
    ],
    attendanceStats: { present: 88, absent: 8, noShow: 4 },
    documents: [
      { name: 'CNIC Scan Copy', type: 'JPG', size: '780 KB', verified: true },
    ]
  }
}

export default function WorkerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [activeTab, setActiveTab] = useState('overview')
  const [slipModalOpen, setSlipModalOpen] = useState(false)
  const [selectedSlip, setSelectedSlip] = useState<any>(null)

  // Retrieve matching profile or default to Ahmed Ali
  const p = useMemo(() => {
    return PROFILE_DATA[id] || PROFILE_DATA['w1']
  }, [id])

  const openSlipModal = (slip: any) => {
    setSelectedSlip(slip)
    setSlipModalOpen(true)
  }

  const printSalarySlip = () => {
    window.print()
    toast.success('Slip sent to printer ledger!')
  }

  return (
    <PageWrapper>
      {/* Printable Area Wrapper */}
      <div className="print:hidden">
        <Link href="/workers" className="inline-flex items-center gap-1.5 text-xs font-semibold mb-4 text-[var(--color-text-secondary)] hover:text-[#556ee6] transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Workforce
        </Link>

        <PageHeader 
          title={p.name} 
          description={`Worker ledger: ${p.id.toUpperCase()} · ${p.role} (${p.type})`} 
        />

        {/* Tab navigation buttons */}
        <div className="flex gap-1 border-b border-[var(--color-border)] mb-6 overflow-x-auto">
          {TABS.map((tab) => {
            const IconComp = tab.icon
            const isSelected = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-3 text-xs font-semibold relative transition-all whitespace-nowrap"
                style={{ color: isSelected ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
              >
                <IconComp className="h-4 w-4" />
                {tab.label}
                {isSelected && (
                  <motion.span 
                    layoutId="activeTabUnderline" 
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-[var(--color-accent)]" 
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* TAB CONTENTS (ANIMATED) */}
        <div className="min-h-[350px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="md:col-span-2 rounded-xl border border-[var(--color-border)] bg-white p-6 space-y-5 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-muted)] border-b pb-2">Biography Details</h3>
                    
                    <div className="grid gap-y-4 gap-x-6 sm:grid-cols-2 text-sm">
                      <div>
                        <p className="text-xs font-semibold text-[var(--color-text-muted)]">Full Name</p>
                        <p className="font-semibold mt-0.5 text-[var(--color-text-primary)]">{p.name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--color-text-muted)]">CNIC Number</p>
                        <p className="font-mono mt-0.5 text-[var(--color-text-primary)]">{p.cnic}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--color-text-muted)]">Phone Line</p>
                        <p className="mt-0.5"><PhoneDisplay phone={p.phone} /></p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--color-text-muted)]">Address</p>
                        <p className="mt-0.5 text-[var(--color-text-primary)]">{p.address}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--color-text-muted)]">Emergency Contact Name</p>
                        <p className="font-semibold mt-0.5 text-[var(--color-text-primary)]">{p.emergencyName}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--color-text-muted)]">Emergency Contact Phone</p>
                        <p className="mt-0.5 font-mono text-[var(--color-text-primary)]">{p.emergencyPhone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[var(--color-border)] bg-white p-6 space-y-5 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-muted)] border-b pb-2">HR Metadata</h3>
                    
                    <div className="space-y-3.5 text-sm">
                      <div>
                        <p className="text-xs font-medium text-[var(--color-text-muted)]">Date Joined</p>
                        <p className="font-semibold mt-0.5 text-[var(--color-text-primary)]">{p.dateJoined}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[var(--color-text-muted)]">Performance Rating</p>
                        <p className="font-bold text-[#34c38f] mt-0.5">{p.performance}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[var(--color-text-muted)]">System Status</p>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#34c38f] bg-[#34c38f]/10 px-2.5 py-1 rounded-full mt-1">
                          <Shield className="h-3.5 w-3.5" />
                          Active Ledger
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: EVENTS HISTORY */}
              {activeTab === 'events' && (
                <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-white shadow-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[var(--color-bg-sunken)]">
                        {['Date', 'Event Name', 'Role Played', 'Status', 'Event Wage'].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {p.eventsList.map((ev: any) => (
                        <tr key={ev.id} className="border-t border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-sunken)] transition-colors">
                          <td className="px-4 py-3 font-mono">{formatDate(ev.date)}</td>
                          <td className="px-4 py-3 font-semibold text-[var(--color-text-primary)]">{ev.title}</td>
                          <td className="px-4 py-3 capitalize">{ev.role}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#d4edda] text-[#34c38f]">
                              {ev.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono font-semibold text-[var(--color-text-primary)]">
                            <CurrencyDisplay value={ev.wage} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 3: SALARY LEDGER */}
              {activeTab === 'salary' && (
                <div className="space-y-4">
                  <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-white shadow-sm">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[var(--color-bg-sunken)]">
                          {['Month Ledger', 'Base Salary', 'Bonus/Overtime', 'Salary Advance', 'Deductions', 'Net Disbursed', 'Status', 'Invoice'].map((h) => (
                            <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="text-sm text-[var(--color-text-secondary)]">
                        {p.ledger.map((ld: any, idx: number) => (
                          <tr key={idx} className="border-t border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)] transition-all">
                            <td className="px-4 py-3 font-semibold text-[var(--color-text-primary)]">{ld.month}</td>
                            <td className="px-4 py-3 font-mono"><CurrencyDisplay value={ld.base} /></td>
                            <td className="px-4 py-3 font-mono text-[#34c38f]"><CurrencyDisplay value={ld.bonus} /></td>
                            <td className="px-4 py-3 font-mono text-[#f46a6a]"><CurrencyDisplay value={ld.advance} /></td>
                            <td className="px-4 py-3 font-mono text-[#f46a6a]"><CurrencyDisplay value={ld.deductions} /></td>
                            <td className="px-4 py-3 font-mono font-bold text-[var(--color-text-primary)]"><CurrencyDisplay value={ld.net} /></td>
                            <td className="px-4 py-3 capitalize">
                              <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-[#34c38f]/10 text-[#34c38f]">
                                {ld.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button 
                                onClick={() => openSlipModal(ld)}
                                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold border border-[var(--color-border)] rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-sunken)] transition-all"
                              >
                                <Printer className="h-3 w-3" />
                                Slip
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: ATTENDANCE HEATMAP GRID */}
              {activeTab === 'attendance' && (
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="md:col-span-2 rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-muted)] border-b pb-2 mb-4">Last 30 Days Roster Log</h3>
                    
                    {/* Simulated visual calendar heatmap */}
                    <div className="grid grid-cols-7 gap-1.5 max-w-sm">
                      {Array.from({ length: 30 }).map((_, idx) => {
                        let bg = 'bg-[#34c38f]' // Present (green)
                        let label = 'Present'
                        if (idx === 14 || idx === 25) {
                          bg = 'bg-[#f46a6a]' // Absent (red)
                          label = 'Absent'
                        } else if (idx === 7) {
                          bg = 'bg-[#f1b44c]' // No Show (orange)
                          label = 'No Show'
                        }
                        return (
                          <div
                            key={idx}
                            title={`Day ${idx + 1}: ${label}`}
                            className={`h-7 w-7 rounded flex items-center justify-center text-[10px] font-bold font-mono text-white cursor-pointer hover:scale-105 transition-all ${bg}`}
                          >
                            {idx + 1}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[var(--color-border)] bg-white p-6 space-y-5 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-muted)] border-b pb-2">Roster Percentages</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-[#34c38f]">Present ({p.attendanceStats.present}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-[var(--color-bg-sunken)]">
                          <div className="h-2 rounded-full bg-[#34c38f]" style={{ width: `${p.attendanceStats.present}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-[#f46a6a]">Absent ({p.attendanceStats.absent}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-[var(--color-bg-sunken)]">
                          <div className="h-2 rounded-full bg-[#f46a6a]" style={{ width: `${p.attendanceStats.absent}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-[#f1b44c]">No Show ({p.attendanceStats.noShow}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-[var(--color-bg-sunken)]">
                          <div className="h-2 rounded-full bg-[#f1b44c]" style={{ width: `${p.attendanceStats.noShow}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: DOCUMENTS */}
              {activeTab === 'docs' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {p.documents.map((doc: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-[var(--color-border)] bg-white shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eef2ff] text-[#556ee6]">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[var(--color-text-primary)]">{doc.name}</p>
                          <p className="text-[11px] text-[var(--color-text-muted)] uppercase font-semibold mt-0.5">{doc.type} · {doc.size}</p>
                        </div>
                      </div>
                      {doc.verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#34c38f] bg-[#34c38f]/10 px-2.5 py-1 rounded-full">
                          <FileCheck className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* DETAILED PRINTABLE SALARY SLIP MODAL (radix style) */}
      {slipModalOpen && selectedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-xl border p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            {/* Printable Content Section */}
            <div id="salary-slip-print" className="p-4 border-2 border-slate-200 rounded-lg">
              <div className="flex justify-between items-start border-b pb-4 border-slate-200">
                <div>
                  <h4 className="text-base font-black tracking-wide text-slate-800 uppercase">SHAADIBOOK CRM</h4>
                  <p className="text-[10px] font-semibold text-slate-500">Royal Banquet & Catering Ledger</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 rounded-full text-slate-700 uppercase">PAYMENT RECEIPT</span>
                  <p className="text-[10px] font-mono text-slate-500 mt-1">{selectedSlip.paidAt ? `Paid At: ${formatDate(selectedSlip.paidAt)}` : ''}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 my-4 text-xs">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Employee Details</p>
                  <p className="font-bold text-slate-800 mt-0.5">{p.name}</p>
                  <p className="text-slate-600 font-medium capitalize mt-0.5">{p.role} ({p.type})</p>
                  <p className="text-slate-500 font-mono mt-0.5">CNIC: {p.cnic}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Payroll Period</p>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedSlip.month}</p>
                  <p className="text-slate-500 font-mono mt-0.5">Ref: SB-PAY-2025-{Math.floor(Math.random() * 900) + 100}</p>
                </div>
              </div>

              <div className="border-t border-b py-3 my-4 border-slate-200 text-xs space-y-2">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Base Salary / Event Wages Due</span>
                  <span className="font-mono text-slate-800"><CurrencyDisplay value={selectedSlip.base} /></span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Incentives & Event Bonuses</span>
                  <span className="font-mono text-[#34c38f]">+ <CurrencyDisplay value={selectedSlip.bonus} /></span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Salary Advances Taken</span>
                  <span className="font-mono text-[#f46a6a]">- <CurrencyDisplay value={selectedSlip.advance} /></span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Operational Deductions</span>
                  <span className="font-mono text-[#f46a6a]">- <CurrencyDisplay value={selectedSlip.deductions} /></span>
                </div>
                <div className="flex justify-between border-t pt-3 font-bold text-sm text-slate-800">
                  <span>Net Disbursed Amount</span>
                  <span className="font-mono text-slate-900"><CurrencyDisplay value={selectedSlip.net} /></span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-6 pt-4 border-t border-dashed">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#34c38f]" />
                  <span>Verified Ledger Receipt</span>
                </div>
                <span>Owner Signature: _________________</span>
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex justify-end gap-3 mt-6 print:hidden">
              <button 
                onClick={() => setSlipModalOpen(false)}
                className="rounded-lg border px-4 py-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-sunken)] transition-all"
              >
                Close
              </button>
              <button 
                onClick={printSalarySlip}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#556ee6] px-4 py-2 text-xs font-semibold text-white hover:brightness-110 active:scale-[0.97] transition-all"
              >
                <Printer className="h-4 w-4" />
                Print Slip
              </button>
            </div>

          </div>
        </div>
      )}
    </PageWrapper>
  )
}
