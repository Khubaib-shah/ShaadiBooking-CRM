'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Download, Search, CheckCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'
import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'

const MONTHS = [
  'January 2025', 'February 2025', 'March 2025', 'April 2025', 'May 2025', 'June 2025',
  'July 2025', 'August 2025', 'September 2025', 'October 2025', 'November 2025', 'December 2025'
]

// Extended mock ledger data
const INITIAL_SALARIES = [
  { id: 'sal-1', name: 'Ahmed Ali', role: 'Head Waiter', type: 'Permanent', events: 8, base: 30000, bonus: 4000, advance: 0, deductions: 500, status: 'Paid' },
  { id: 'sal-2', name: 'Rashid Hussain', role: 'Waiter', type: 'Temporary', events: 6, base: 0, bonus: 9000, advance: 0, deductions: 0, status: 'Paid' },
  { id: 'sal-3', name: 'Muhammad Aslam', role: 'Chef', type: 'Permanent', events: 10, base: 45000, bonus: 5000, advance: 10000, deductions: 0, status: 'Partial' },
  { id: 'sal-4', name: 'Tariq Mehmood', role: 'Electrician', type: 'Contractor', events: 4, base: 0, bonus: 12000, advance: 2000, deductions: 0, status: 'Unpaid' },
  { id: 'sal-5', name: 'Naveed Ahmed', role: 'Driver', type: 'Permanent', events: 12, base: 25000, bonus: 3000, advance: 0, deductions: 1000, status: 'Paid' },
  { id: 'sal-6', name: 'Saleem Butt', role: 'Manager', type: 'Permanent', events: 14, base: 55000, bonus: 10000, advance: 0, deductions: 0, status: 'Unpaid' },
]

export default function WorkerSalariesPage() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(4) // May 2025
  const [search, setSearch] = useState('')
  const [salaries, setSalaries] = useState(INITIAL_SALARIES)

  const monthLabel = MONTHS[currentMonthIndex]

  const filteredSalaries = useMemo(() => {
    return salaries.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase()))
  }, [salaries, search])

  const stats = useMemo(() => {
    let totalNet = 0
    let totalPaid = 0
    let totalAdvances = 0

    salaries.forEach(s => {
      const net = s.base + s.bonus - s.advance - s.deductions
      totalNet += net
      if (s.status === 'Paid') {
        totalPaid += net
      } else if (s.status === 'Partial') {
        totalPaid += (net * 0.5) // partial payment simulation
      }
      totalAdvances += s.advance
    })

    return { totalNet, totalPaid, totalAdvances }
  }, [salaries])

  const handlePrevMonth = () => {
    setCurrentMonthIndex(prev => (prev > 0 ? prev - 1 : 11))
  }

  const handleNextMonth = () => {
    setCurrentMonthIndex(prev => (prev < 11 ? prev + 1 : 0))
  }

  const markAsPaid = (id: string, name: string) => {
    setSalaries(prev =>
      prev.map(s => (s.id === id ? { ...s, status: 'Paid' } : s))
    )
    toast.success(`Salary slip for ${name} marked as PAID.`)
  }

  const markAllPaid = () => {
    setSalaries(prev => prev.map(s => ({ ...s, status: 'Paid' })))
    toast.success(`All pending workers salaries for ${monthLabel} marked as PAID.`)
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Salary Management"
        description="Salary ledger & payout directory"
        actions={
          <button
            onClick={() => toast.success('Exporting salaries to CSV...')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-sunken)] transition-all"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        }
      />

      {/* Month Navigator Row */}
      <div className="flex items-center justify-between mb-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 shadow-sm">
        <button
          onClick={handlePrevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)] transition-all"
          aria-label="Previous Month"
        >
          <ChevronLeft className="h-4 w-4 text-[var(--color-text-secondary)]" />
        </button>
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
          Payroll Ledger: {monthLabel}
        </h3>
        <button
          onClick={handleNextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)] transition-all"
          aria-label="Next Month"
        >
          <ChevronRight className="h-4 w-4 text-[var(--color-text-secondary)]" />
        </button>
      </div>

      {/* Overall Payroll quick-stats row */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Total Payroll Liabilities</p>
          <p className="text-2xl font-black text-[var(--color-text-primary)] font-mono">
            <CurrencyDisplay value={stats.totalNet} />
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Total Disbursed</p>
          <p className="text-2xl font-black text-[#34c38f] font-mono">
            <CurrencyDisplay value={stats.totalPaid} />
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Salaries Outstanding</p>
          <p className="text-2xl font-black text-[#f1b44c] font-mono">
            <CurrencyDisplay value={stats.totalNet - stats.totalPaid} />
          </p>
        </div>
      </div>

      {/* Ledger filter bar */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search ledger by name or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] pl-9 pr-3 py-2 text-xs bg-[var(--color-bg-elevated)] focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-primary)] shadow-sm"
          />
        </div>

        <button
          onClick={markAllPaid}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#34c38f] px-4 py-2 text-xs font-semibold text-white hover:brightness-110 active:scale-[0.97] transition-all"
        >
          <CheckCircle className="h-4 w-4" />
          Bulk Mark All Paid
        </button>
      </div>

      {/* Salary table ledger */}
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-sm">
        <table className="w-full min-w-[920px]">
          <thead className="bg-[var(--color-bg-sunken)]">
            <tr>
              {['Worker', 'Type', 'Events Worked', 'Base Salary', 'Bonus/Wage', 'Advances', 'Deductions', 'Net Payout', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm text-[var(--color-text-secondary)]">
            {filteredSalaries.map((row) => {
              const netPayout = row.base + row.bonus - row.advance - row.deductions
              const isPaid = row.status === 'Paid'
              const isPartial = row.status === 'Partial'

              return (
                <tr key={row.id} className="border-t border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-bold text-[var(--color-text-primary)]">{row.name}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold">{row.role}</p>
                  </td>
                  <td className="px-4 py-3 capitalize">{row.type}</td>
                  <td className="px-4 py-3 font-semibold text-[var(--color-text-primary)]">{row.events} events</td>
                  <td className="px-4 py-3 font-mono"><CurrencyDisplay value={row.base} /></td>
                  <td className="px-4 py-3 font-mono text-[#34c38f]"><CurrencyDisplay value={row.bonus} /></td>
                  <td className="px-4 py-3 font-mono text-[#f46a6a]"><CurrencyDisplay value={row.advance} /></td>
                  <td className="px-4 py-3 font-mono text-[#f46a6a]"><CurrencyDisplay value={row.deductions} /></td>
                  <td className="px-4 py-3 font-mono font-bold text-[var(--color-text-primary)]">
                    <CurrencyDisplay value={netPayout} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      isPaid 
                        ? 'bg-[#34c38f]/10 text-[#34c38f]' 
                        : isPartial 
                        ? 'bg-[#f1b44c]/10 text-[#f1b44c]' 
                        : 'bg-[#f46a6a]/10 text-[#f46a6a]'
                    }`}>
                      {isPaid ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {!isPaid ? (
                      <button
                        onClick={() => markAsPaid(row.id, row.name)}
                        className="rounded-lg bg-[#556ee6] hover:brightness-110 active:scale-[0.97] px-3 py-1.5 text-xs font-semibold text-white transition-all shadow-sm"
                      >
                        Disburse Pay
                      </button>
                    ) : (
                      <span className="text-xs text-[var(--color-text-muted)] font-medium">No actions</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  )
}
