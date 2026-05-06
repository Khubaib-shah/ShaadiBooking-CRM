'use client'

import { useMemo } from 'react'
import { Download, Landmark, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { ComposedChart, Bar, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'

// High fidelity monthly financial mock data
const MONTHLY_REPORTS = [
  { month: 'Jan', revenue: 650000, catering: 250000, wages: 90000, operational: 40000, totalCost: 380000, profit: 270000 },
  { month: 'Feb', revenue: 780000, catering: 310000, wages: 95000, operational: 45000, totalCost: 450000, profit: 330000 },
  { month: 'Mar', revenue: 1100000, catering: 450000, wages: 110000, operational: 60000, totalCost: 620000, profit: 480000 },
  { month: 'Apr', revenue: 1450000, catering: 580000, wages: 130000, operational: 80000, totalCost: 790000, profit: 660000 },
  { month: 'May', revenue: 1850000, catering: 720000, wages: 160000, operational: 110000, totalCost: 990000, profit: 860000 },
  { month: 'Jun', revenue: 2370000, catering: 950000, wages: 190000, operational: 150000, totalCost: 1290000, profit: 1080000 },
]

export default function FinancialReportsPage() {
  const totals = useMemo(() => {
    let rev = 0
    let cost = 0
    let profit = 0

    MONTHLY_REPORTS.forEach(r => {
      rev += r.revenue
      cost += r.totalCost
      profit += r.profit
    })

    const margin = rev > 0 ? Math.round((profit / rev) * 100) : 0
    return { rev, cost, profit, margin }
  }, [])

  return (
    <PageWrapper>
      <PageHeader
        title="Financial Report"
        description="Comprehensive analysis of business revenues, operational expenses, and profit margins"
        actions={
          <button
            onClick={() => toast.success('Exporting financial report to Excel...')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-sunken)] transition-all"
          >
            <Download className="h-4 w-4" /> Export Ledger
          </button>
        }
      />

      {/* KPI stats display */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Total Gross Revenues</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-[var(--color-text-primary)] font-mono">
              <CurrencyDisplay value={totals.rev} compact />
            </p>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#556ee6]/10 text-[#556ee6]">
              <Landmark className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Total Disbursed Costs</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-[var(--color-text-primary)] font-mono">
              <CurrencyDisplay value={totals.cost} compact />
            </p>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f46a6a]/10 text-[#f46a6a]">
              <TrendingDown className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Net Business Profits</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-[#34c38f] font-mono">
              <CurrencyDisplay value={totals.profit} compact />
            </p>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#34c38f]/10 text-[#34c38f]">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Gross Profit Margin</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-[var(--color-text-primary)] font-mono">{totals.margin}%</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#34c38f]/10 text-[#34c38f]">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts Layout using Recharts */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        
        {/* Composed Chart: Revenue vs Total Costs */}
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] border-b pb-2 mb-4">Revenue vs Operations Cost</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={MONTHLY_REPORTS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip 
                  formatter={(value: any) => `Rs. ${Number(value).toLocaleString()}`}
                  contentStyle={{ background: '#2a3042', borderRadius: '8px', color: '#fff', fontSize: '11px', border: '0' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="revenue" name="Gross Revenue" fill="#556ee6" barSize={18} radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="totalCost" name="Total Costs" stroke="#f46a6a" strokeWidth={3} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Chart: Net Profits Area */}
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] border-b pb-2 mb-4">Monthly Profits Curve</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_REPORTS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip 
                  formatter={(value: any) => `Rs. ${Number(value).toLocaleString()}`}
                  contentStyle={{ background: '#2a3042', borderRadius: '8px', color: '#fff', fontSize: '11px', border: '0' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34c38f" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#34c38f" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#34c38f" strokeWidth={3} fillOpacity={1} fill="url(#profitGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Financial Ledger Table */}
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-white shadow-sm">
        <table className="w-full min-w-[780px]">
          <thead className="bg-[var(--color-bg-sunken)]">
            <tr>
              {['Month', 'Total Revenue', 'Catering Costs', 'Worker Wages', 'Utilities / Transport', 'Total Cost', 'Net Profits', 'Margin %'].map((h) => (
                <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm text-[var(--color-text-secondary)]">
            {MONTHLY_REPORTS.map((row) => {
              const opCosts = row.totalCost - row.catering - row.wages
              const currentMargin = Math.round((row.profit / row.revenue) * 100)
              
              return (
                <tr key={row.month} className="border-t border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)] transition-colors">
                  <td className="px-4 py-3 font-bold text-[var(--color-text-primary)]">{row.month} 2025</td>
                  <td className="px-4 py-3 font-mono font-bold text-[var(--color-text-primary)]"><CurrencyDisplay value={row.revenue} /></td>
                  <td className="px-4 py-3 font-mono"><CurrencyDisplay value={row.catering} /></td>
                  <td className="px-4 py-3 font-mono"><CurrencyDisplay value={row.wages} /></td>
                  <td className="px-4 py-3 font-mono"><CurrencyDisplay value={row.operational} /></td>
                  <td className="px-4 py-3 font-mono font-bold text-[#f46a6a]"><CurrencyDisplay value={row.totalCost} /></td>
                  <td className="px-4 py-3 font-mono font-bold text-[#34c38f]"><CurrencyDisplay value={row.profit} /></td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-black bg-[#34c38f]/10 text-[#34c38f]">
                      {currentMargin}%
                    </span>
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
