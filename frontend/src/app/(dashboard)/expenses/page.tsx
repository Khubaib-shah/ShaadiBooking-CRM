'use client'

import { useMemo, useState } from 'react'
import { Plus, Download, Tag, TrendingDown, Clipboard, HelpCircle, X, Check } from 'lucide-react'
import { toast } from 'sonner'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'
import { formatDate } from '@/lib/utils/dates'
import ResponsiveModal from '@/components/shared/ResponsiveModal'

const INITIAL_EXPENSES = [
  { id: 'exp-1', date: '2025-05-02', event: 'Imran Barat Banquet', category: 'Food/Catering', amount: 280000, paidTo: 'Al-Habib Caterers' },
  { id: 'exp-2', date: '2025-05-03', event: 'Imran Barat Banquet', category: 'Worker Wages', amount: 85000, paidTo: 'Staff Payroll' },
  { id: 'exp-3', date: '2025-05-03', event: 'Imran Barat Banquet', category: 'Transport', amount: 12000, paidTo: 'Karachi Logistics Team' },
  { id: 'exp-4', date: '2025-04-28', event: 'Sara Mehndi Lawn', category: 'Equipment Hire', amount: 35000, paidTo: 'Sound & Light Masters' },
  { id: 'exp-5', date: '2025-04-25', event: 'Usman Sheikh Valima', category: 'Hall Utilities', amount: 45000, paidTo: 'K-Electric/Generator Fuel' },
]

const CATEGORY_COLORS: Record<string, string> = {
  'Food/Catering': '#34c38f',    // green
  'Worker Wages': '#556ee6',     // blue
  'Transport': '#50a5f1',         // info
  'Equipment Hire': '#f1b44c',    // warning/orange
  'Hall Utilities': '#f46a6a',    // danger/red
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [recordModalOpen, setRecordModalOpen] = useState(false)

  // Form Fields State
  const [formEvent, setFormEvent] = useState('')
  const [formCategory, setFormCategory] = useState('Food/Catering')
  const [formAmount, setFormAmount] = useState('')
  const [formPaidTo, setFormPaidTo] = useState('')

  const categories = Object.keys(CATEGORY_COLORS)

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const matchSearch = exp.event.toLowerCase().includes(search.toLowerCase()) || exp.paidTo.toLowerCase().includes(search.toLowerCase())
      const matchCategory = activeCategory === 'all' || exp.category === activeCategory
      return matchSearch && matchCategory
    })
  }, [expenses, search, activeCategory])

  const totals = useMemo(() => {
    let total = 0
    const catSums: Record<string, number> = {}

    expenses.forEach(exp => {
      total += exp.amount
      catSums[exp.category] = (catSums[exp.category] || 0) + exp.amount
    })

    const chartData = Object.entries(CATEGORY_COLORS).map(([cat, color]) => ({
      name: cat,
      value: catSums[cat] || 0,
      color: color
    })).filter(x => x.value > 0)

    return { total, chartData }
  }, [expenses])

  const handleRecordExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formEvent || !formAmount || !formPaidTo) {
      toast.error('Please fill in Event name, Amount, and Payee.')
      return
    }

    const newExp = {
      id: `exp-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      event: formEvent,
      category: formCategory,
      amount: Number(formAmount),
      paidTo: formPaidTo
    }

    setExpenses(prev => [newExp, ...prev])
    toast.success('Operational expense recorded in general ledger!')
    setRecordModalOpen(false)
    
    // Reset fields
    setFormEvent('')
    setFormAmount('')
    setFormPaidTo('')
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Expenses"
        description="Monitor general operational costs, catering supply invoices, and utility logs"
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => toast.success('Exporting expense ledger to CSV...')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-sunken)] transition-all"
            >
              <Download className="h-4 w-4" /> Export
            </button>
            <button
              onClick={() => setRecordModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#556ee6] px-3 py-2 text-xs font-semibold text-white hover:brightness-110 active:scale-[0.97] transition-all"
            >
              <Plus className="h-4 w-4" /> Record Cost
            </button>
          </div>
        }
      />

      {/* Main Expense Dashboard layout */}
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        
        {/* Left column: total stats and category cards list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">General Payout Liabilities</p>
              <p className="text-3xl font-black text-[var(--color-text-primary)] font-mono">
                <CurrencyDisplay value={totals.total} />
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Operational costs disbursed this month</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f46a6a]/10 text-[#f46a6a]">
              <TrendingDown className="h-6 w-6" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(CATEGORY_COLORS).map(([cat, color]) => {
              const amount = expenses.filter(e => e.category === cat).reduce((sum, current) => sum + current.amount, 0)
              return (
                <div key={cat} className="rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                    <span className="text-xs font-bold text-[var(--color-text-primary)]">{cat}</span>
                  </div>
                  <span className="font-mono font-bold text-xs text-[var(--color-text-primary)]"><CurrencyDisplay value={amount} compact /></span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right column: Beautiful Recharts donut chart visualization */}
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] border-b pb-2 mb-4">Cost Structure Breakdown</h3>
          
          <div className="h-56">
            {totals.chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[var(--color-text-muted)]">No entries logged.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={totals.chartData}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {totals.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => `Rs. ${Number(value).toLocaleString()}`} 
                    contentStyle={{ background: '#2a3042', borderRadius: '8px', color: '#fff', fontSize: '11px', border: '0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] text-[var(--color-text-muted)] font-medium justify-center border-t pt-3 border-[var(--color-border)]">
            {totals.chartData.map(entry => (
              <div key={entry.name} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories select row and search input */}
      <div className="rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeCategory === 'all' ? 'bg-[#556ee6]/10 text-[#556ee6]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-sunken)]'}`}
          >
            All Costs
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeCategory === cat ? 'bg-[#556ee6]/10 text-[#556ee6]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-sunken)]'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search costs by event or payee..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-primary)] shadow-sm max-w-xs"
        />
      </div>

      {/* Expenses Table ledger */}
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-white shadow-sm">
        <table className="w-full min-w-[700px]">
          <thead className="bg-[var(--color-bg-sunken)]">
            <tr>
              {['Disbursement Date', 'Assigned Event', 'Cost Category', 'Amount Paid', 'Paid To (Payee)'].map((h) => (
                <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm text-[var(--color-text-secondary)]">
            {filteredExpenses.map((exp) => (
              <tr key={exp.id} className="border-t border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)] transition-colors">
                <td className="px-4 py-3 font-mono">{formatDate(exp.date)}</td>
                <td className="px-4 py-3 font-bold text-[var(--color-text-primary)]">{exp.event}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--color-bg-sunken)]">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: CATEGORY_COLORS[exp.category] || '#74788d' }} />
                    {exp.category}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono font-bold text-[var(--color-text-primary)]"><CurrencyDisplay value={exp.amount} /></td>
                <td className="px-4 py-3">{exp.paidTo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RECORD OPERATIONAL COST DIALOG */}
      <ResponsiveModal
        isOpen={recordModalOpen}
        onClose={() => setRecordModalOpen(false)}
        title="Record Operational Expense"
        description="Disburse operational, payroll, or utility assets to real-time event ledgers."
      >
        <form onSubmit={handleRecordExpense} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--color-text-secondary)]">Assigned Event *</label>
            <input
              required
              type="text"
              placeholder="e.g. Imran Barat Wedding"
              value={formEvent}
              onChange={e => setFormEvent(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs bg-[var(--color-bg-sunken)] focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-primary)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--color-text-secondary)]">Cost Category *</label>
            <select
              value={formCategory}
              onChange={e => setFormCategory(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs bg-[var(--color-bg-sunken)] focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-primary)]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--color-text-secondary)]">Amount Disbursed (Rs.) *</label>
            <input
              required
              type="number"
              placeholder="e.g. 15000"
              value={formAmount}
              onChange={e => setFormAmount(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs bg-[var(--color-bg-sunken)] focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-primary)] font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--color-text-secondary)]">Paid To (Payee) *</label>
            <input
              required
              type="text"
              placeholder="e.g. Al-Habib Caterers"
              value={formPaidTo}
              onChange={e => setFormPaidTo(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs bg-[var(--color-bg-sunken)] focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-primary)]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => setRecordModalOpen(false)}
              className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-sunken)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[var(--color-accent)] hover:brightness-110 px-4 py-2 text-xs font-semibold text-white shadow-sm"
            >
              Disburse Ledger
            </button>
          </div>
        </form>
      </ResponsiveModal>
    </PageWrapper>
  )
}
