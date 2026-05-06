'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Plus, Download, Search, Sparkles, AlertCircle, TrendingUp, Cpu, Landmark } from 'lucide-react'
import { toast } from 'sonner'
import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'

// Expanded high-fidelity mock outsourcing data
const INITIAL_JOBS = [
  { id: 'os-1', client: 'Pearl Continental Hotel', event: 'Corporate Dinner Banquet', date: '15 Dec 2025', revenue: 185000, cost: 72000, profit: 113000, margin: 61, status: 'Completed', equipment: 'Standing AC x5, 100KVA Generator x1' },
  { id: 'os-2', client: 'Emaar Beach Front', event: 'Beach Wedding Lawn Setup', date: '18 Dec 2025', revenue: 245000, cost: 98000, profit: 147000, margin: 60, status: 'In Progress', equipment: 'Canopy Marquees, Soft Uplighters x40' },
  { id: 'os-3', client: 'Marriott Marquee Hall C', event: 'Nikah Backdrop Setup', date: '22 Dec 2025', revenue: 95000, cost: 40000, profit: 55000, margin: 58, status: 'Pending', equipment: 'Floral Stage Frame, LED Screen x1' },
  { id: 'os-4', client: 'DHA Golf Club Lawn', event: 'Mehndi Festoon Setup', date: '28 Dec 2025', revenue: 320000, cost: 130000, profit: 190000, margin: 59, status: 'In Progress', equipment: 'Fairy lights x200 strands, Carpeted Pathway' },
]

export default function OutsourcingPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredJobs = useMemo(() => {
    return INITIAL_JOBS.filter(job => {
      const matchSearch = job.client.toLowerCase().includes(search.toLowerCase()) || job.event.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || job.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [search, statusFilter])

  const stats = useMemo(() => {
    let totalRevenue = 0
    let totalProfit = 0
    let totalJobs = INITIAL_JOBS.length

    INITIAL_JOBS.forEach(job => {
      totalRevenue += job.revenue
      totalProfit += job.profit
    })

    const avgMargin = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0
    return { totalRevenue, totalProfit, totalJobs, avgMargin }
  }, [])

  return (
    <PageWrapper>
      <PageHeader
        title="Outsourcing"
        description="Monitor external sub-contracts, equipment hire, and rental margins"
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => toast.success('Exporting outsourcing ledger...')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-sunken)] transition-all"
            >
              <Download className="h-4 w-4" /> Export
            </button>
            <button
              onClick={() => toast.info('New outsourcing request form coming soon.')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#556ee6] px-3 py-2 text-xs font-semibold text-white hover:brightness-110 active:scale-[0.97] transition-all"
            >
              <Plus className="h-4 w-4" /> Record Job
            </button>
          </div>
        }
      />

      {/* Outsourcing Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Total Subcontracts</p>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#556ee6]/10 text-[#556ee6]">
              <Cpu className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-[var(--color-text-primary)] font-mono">{stats.totalJobs} jobs</p>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Outsourcing Volume</p>
          <p className="text-2xl font-black text-[var(--color-text-primary)] font-mono">
            <CurrencyDisplay value={stats.totalRevenue} />
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Total Operational Profit</p>
          <p className="text-2xl font-black text-[#34c38f] font-mono">
            <CurrencyDisplay value={stats.totalProfit} />
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Average Margin %</p>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#34c38f]/10 text-[#34c38f]">
              <TrendingUp className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-[var(--color-text-primary)] font-mono">{stats.avgMargin}%</p>
          </div>
        </div>
      </div>

      {/* Roster list filter bar */}
      <div className="rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search outsourcing jobs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] pl-9 pr-3 py-2 text-xs bg-white focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-primary)] shadow-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent)] bg-[var(--color-bg-elevated)]"
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Grid view of outsourcing cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredJobs.map((job) => {
          const statusColors: Record<string, string> = {
            Completed: 'bg-[#d4edda] text-[#34c38f]',
            'In Progress': 'bg-[#fff3cd] text-[#f1b44c]',
            Pending: 'bg-[#f8f9fa] text-[var(--color-text-secondary)] border border-[var(--color-border)]',
          }

          return (
            <Link key={job.id} href={`/outsourcing/${job.id}`} className="block rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-150">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-sm font-bold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>{job.client}</h4>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{job.event} · {job.date}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${statusColors[job.status] || ''}`}>
                  {job.status}
                </span>
              </div>

              {/* Equipment summary list block */}
              <div className="flex items-center gap-2 rounded-lg bg-[var(--color-bg-sunken)] p-3 text-xs text-[var(--color-text-secondary)] mb-4">
                <AlertCircle className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
                <p className="truncate"><span className="font-bold text-[var(--color-text-primary)]">Hire Deployed: </span>{job.equipment}</p>
              </div>

              {/* Quick financial totals table */}
              <div className="grid grid-cols-3 gap-2 border-t pt-3 border-[var(--color-border)] text-[11px] text-[var(--color-text-secondary)]">
                <div>
                  <p className="text-[var(--color-text-muted)] font-medium">Job Revenue</p>
                  <p className="font-bold text-[var(--color-text-primary)] font-mono mt-0.5"><CurrencyDisplay value={job.revenue} compact /></p>
                </div>
                <div>
                  <p className="text-[var(--color-text-muted)] font-medium">Rental Costs</p>
                  <p className="font-bold text-[var(--color-text-primary)] font-mono mt-0.5"><CurrencyDisplay value={job.cost} compact /></p>
                </div>
                <div>
                  <p className="text-[#34c38f] font-bold">Net P&L Profit</p>
                  <p className="font-bold text-[#34c38f] font-mono mt-0.5">
                    <CurrencyDisplay value={job.profit} compact />
                    <span className="text-[9px] font-normal text-[var(--color-text-muted)] ml-1">({job.margin}%)</span>
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </PageWrapper>
  )
}
