'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Plus, Download, Search, Sparkles, AlertCircle, TrendingUp, X } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDate } from 'date-fns'
import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'

// Expanded high-fidelity mock data for rentals and outside services
const INITIAL_JOBS = [
  { id: 'os-1', client: 'Pearl Continental Hotel', event: 'Corporate Dinner', date: '15 Dec 2025', revenue: 185000, cost: 72000, profit: 113000, margin: 61, status: 'Completed', equipment: 'Utensils (500 sets), Buffet Warmers x10', type: 'hired' },
  { id: 'os-2', client: 'Emaar Beach Front', event: 'Beach Wedding', date: '18 Dec 2025', revenue: 245000, cost: 98000, profit: 147000, margin: 60, status: 'In Progress', equipment: 'Waiters (20), Buffet Staff (5)', type: 'hired' },
  { id: 'os-5', client: 'Green Catering Co.', event: 'Vendor Rental', date: '20 Dec 2025', revenue: 45000, cost: 5000, profit: 40000, margin: 89, status: 'Completed', equipment: 'AC Units x2 (Our Own)', type: 'own' },
  { id: 'os-3', client: 'Marriott Marquee', event: 'Nikah Backdrop', date: '22 Dec 2025', revenue: 95000, cost: 40000, profit: 55000, margin: 58, status: 'Pending', equipment: 'Floral Stage Decor, LED Screen', type: 'hired' },
  { id: 'os-4', client: 'DHA Golf Club', event: 'Mehndi Night', date: '28 Dec 2025', revenue: 320000, cost: 130000, profit: 190000, margin: 59, status: 'In Progress', equipment: 'Heaters x8, Fairy lights setup', type: 'hired' },
]

export default function OutsourcingPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [jobs, setJobs] = useState(INITIAL_JOBS)
  const [isAddingJob, setIsAddingJob] = useState(false)

  // New Job Form State
  const [newJob, setNewJob] = useState({
    client: '',
    event: '',
    date: '',
    type: 'hired' as 'own' | 'hired',
    items: [{ name: '', qty: 1, price: 0, cost: 0 }]
  })

  // Calculate totals from items
  const calculatedTotals = useMemo(() => {
    return newJob.items.reduce((acc, item) => {
      acc.revenue += (item.qty || 0) * (item.price || 0)
      acc.cost += (item.qty || 0) * (item.cost || 0)
      return acc
    }, { revenue: 0, cost: 0 })
  }, [newJob.items])

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchSearch = job.client.toLowerCase().includes(search.toLowerCase()) || job.event.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || job.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [jobs, search, statusFilter])

  const stats = useMemo(() => {
    let totalRevenue = 0
    let totalProfit = 0
    let totalJobs = jobs.length

    jobs.forEach(job => {
      totalRevenue += job.revenue
      totalProfit += job.profit
    })

    const avgMargin = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0
    return { totalRevenue, totalProfit, totalJobs, avgMargin }
  }, [jobs])

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault()
    const { revenue, cost } = calculatedTotals
    const profit = revenue - cost
    const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0
    const equipmentSummary = newJob.items.map(i => `${i.name} (x${i.qty})`).join(', ')
    
    const jobToAdd = {
      id: `os-${Date.now()}`,
      client: newJob.client,
      event: newJob.event,
      revenue,
      cost,
      profit,
      margin,
      equipment: equipmentSummary,
      type: newJob.type,
      status: 'Pending',
      date: formatDate(new Date(newJob.date), 'dd MMM yyyy')
    }

    setJobs([jobToAdd, ...jobs])
    setIsAddingJob(false)
    setNewJob({ client: '', event: '', date: '', type: 'hired', items: [{ name: '', qty: 1, price: 0, cost: 0 }] })
    toast.success('New job recorded successfully')
  }

  const addItemRow = () => {
    setNewJob({ ...newJob, items: [...newJob.items, { name: '', qty: 1, price: 0, cost: 0 }] })
  }

  const removeItemRow = (index: number) => {
    if (newJob.items.length === 1) return
    const updated = newJob.items.filter((_, i) => i !== index)
    setNewJob({ ...newJob, items: updated })
  }

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...newJob.items]
    updated[index] = { ...updated[index], [field]: value }
    setNewJob({ ...newJob, items: updated })
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Rentals & Hire"
        description="Track rental items, outside services, and your profits"
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => toast.success('Exporting report...')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-sunken)] transition-all"
            >
              <Download className="h-4 w-4" /> Export
            </button>
            <button
              onClick={() => setIsAddingJob(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#556ee6] px-3 py-2 text-xs font-semibold text-white hover:brightness-110 active:scale-[0.97] transition-all"
            >
              <Plus className="h-4 w-4" /> Add New Job
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Total Jobs</p>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#556ee6]/10 text-[#556ee6]">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-[var(--color-text-primary)] font-mono">{stats.totalJobs}</p>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Total Revenue</p>
          <p className="text-2xl font-black text-[var(--color-text-primary)] font-mono">
            <CurrencyDisplay value={stats.totalRevenue} />
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Total Profit</p>
          <p className="text-2xl font-black text-[#34c38f] font-mono">
            <CurrencyDisplay value={stats.totalProfit} />
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Average Profit %</p>
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
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>{job.client}</h4>
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${job.type === 'own' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                      {job.type === 'own' ? 'Our Item' : 'Hired'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{job.event} · {job.date}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${statusColors[job.status] || ''}`}>
                  {job.status}
                </span>
              </div>

              {/* Items/Services summary */}
              <div className="flex items-center gap-2 rounded-lg bg-[var(--color-bg-sunken)] p-3 text-xs text-[var(--color-text-secondary)] mb-4">
                <AlertCircle className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
                <p className="truncate"><span className="font-bold text-[var(--color-text-primary)]">Services Provided: </span>{job.equipment}</p>
              </div>

              {/* Quick financial totals */}
              <div className="grid grid-cols-3 gap-2 border-t pt-3 border-[var(--color-border)] text-[11px] text-[var(--color-text-secondary)]">
                <div>
                  <p className="text-[var(--color-text-muted)] font-medium">Revenue</p>
                  <p className="font-bold text-[var(--color-text-primary)] font-mono mt-0.5"><CurrencyDisplay value={job.revenue} compact /></p>
                </div>
                <div>
                  <p className="text-[var(--color-text-muted)] font-medium">Costs</p>
                  <p className="font-bold text-[var(--color-text-primary)] font-mono mt-0.5"><CurrencyDisplay value={job.cost} compact /></p>
                </div>
                <div>
                  <p className="text-[#34c38f] font-bold">Profit</p>
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

      {/* Add New Job Modal */}
      <AnimatePresence>
        {isAddingJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-7 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Add New Rental Job</h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">Track external rentals, staff hiring, and your profit margins.</p>
                </div>
                <button onClick={() => setIsAddingJob(false)} className="text-[var(--color-text-muted)] hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-all">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddJob} className="space-y-6">
                {/* Source Toggle */}
                <div className="flex p-1 bg-[var(--color-bg-sunken)] rounded-xl border border-[var(--color-border)] max-w-sm">
                  <button 
                    type="button" 
                    onClick={() => setNewJob({...newJob, type: 'hired'})}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${newJob.type === 'hired' ? 'bg-white shadow-sm text-[#556ee6]' : 'text-[var(--color-text-muted)]'}`}
                  >
                    Hiring from Outside
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      const resetCosts = newJob.items.map(i => ({ ...i, cost: 0 }))
                      setNewJob({...newJob, type: 'own', items: resetCosts})
                    }}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${newJob.type === 'own' ? 'bg-white shadow-sm text-[#556ee6]' : 'text-[var(--color-text-muted)]'}`}
                  >
                    Renting our Own
                  </button>
                </div>

                {/* Section: Job Basics */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">Job Information</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--color-text-secondary)]">Client Name</label>
                      <input required type="text" value={newJob.client} onChange={e => setNewJob({...newJob, client: e.target.value})} placeholder="e.g. PC Hotel" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[#556ee6] bg-[var(--color-bg-sunken)] border-[var(--color-border)] text-[var(--color-text-primary)]" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--color-text-secondary)]">Event Date</label>
                      <input required type="date" value={newJob.date} onChange={e => setNewJob({...newJob, date: e.target.value})} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[#556ee6] bg-[var(--color-bg-sunken)] border-[var(--color-border)] text-[var(--color-text-primary)]" />
                    </div>
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-xs font-semibold text-[var(--color-text-secondary)]">Event Name / Purpose</label>
                      <input required type="text" value={newJob.event} onChange={e => setNewJob({...newJob, event: e.target.value})} placeholder="e.g. Wedding Reception" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[#556ee6] bg-[var(--color-bg-sunken)] border-[var(--color-border)] text-[var(--color-text-primary)]" />
                    </div>
                  </div>
                </div>

                {/* Section: Items List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">List of Items & Staff</p>
                    <button type="button" onClick={addItemRow} className="text-xs font-bold text-[#556ee6] hover:underline flex items-center gap-1">
                      <Plus className="h-3 w-3" /> Add Row
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                    {newJob.items.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-[var(--color-bg-sunken)] p-2 rounded-lg border border-[var(--color-border)]">
                        <div className="col-span-4">
                          <input placeholder="Item (e.g. AC)" value={item.name} onChange={e => updateItem(idx, 'name', e.target.value)} className="w-full bg-transparent px-2 py-1 text-xs focus:outline-none text-[var(--color-text-primary)]" />
                        </div>
                        <div className="col-span-2">
                          <input type="number" placeholder="Qty" value={item.qty} onChange={e => updateItem(idx, 'qty', Number(e.target.value))} className="w-full bg-transparent px-2 py-1 text-xs focus:outline-none text-[var(--color-text-primary)] text-center" />
                        </div>
                        <div className="col-span-2 border-l border-[var(--color-border)]">
                          <input type="number" placeholder="Price" value={item.price} onChange={e => updateItem(idx, 'price', Number(e.target.value))} className="w-full bg-transparent px-2 py-1 text-xs focus:outline-none text-[var(--color-text-primary)] font-mono text-right" title="Price to Client" />
                        </div>
                        <div className="col-span-3 border-l border-[var(--color-border)]">
                          <input type="number" placeholder="Cost" value={item.cost} onChange={e => updateItem(idx, 'cost', Number(e.target.value))} disabled={newJob.type === 'own'} className="w-full bg-transparent px-2 py-1 text-xs focus:outline-none text-[var(--color-text-primary)] font-mono text-right disabled:opacity-30" title="Cost to Us" />
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <button type="button" onClick={() => removeItemRow(idx)} className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors"><X className="h-4 w-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section: Financial Box */}
                <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--color-bg-sunken)', border: '1px solid var(--color-border)' }}>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">Money Summary</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-[var(--color-border)]">
                      <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Total Bill:</span>
                      <span className="text-sm font-black font-mono text-[#556ee6]"><CurrencyDisplay value={calculatedTotals.revenue} /></span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-[var(--color-border)]">
                      <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Net Profit:</span>
                      <span className="text-sm font-black font-mono text-[#34c38f]"><CurrencyDisplay value={calculatedTotals.revenue - calculatedTotals.cost} /></span>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsAddingJob(false)} className="px-6 py-2.5 text-sm font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-sunken)] rounded-xl transition-all">
                    Cancel
                  </button>
                  <button type="submit" className="px-8 py-2.5 text-sm font-bold text-white bg-[#556ee6] hover:brightness-110 active:scale-[0.98] rounded-xl shadow-lg shadow-[#556ee6]/20 transition-all">
                    Save Job Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}
