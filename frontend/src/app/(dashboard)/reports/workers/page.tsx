'use client'

import { useMemo } from 'react'
import { Download, Users, Landmark, Award, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'

const ROLE_UTILIZATION = [
  { name: 'Waiters', utilization: 86, rate: 1200 },
  { name: 'Chefs', utilization: 92, rate: 4500 },
  { name: 'Managers', utilization: 75, rate: 3500 },
  { name: 'Electricians', utilization: 68, rate: 2500 },
  { name: 'Drivers', utilization: 80, rate: 1800 },
]

const TOP_PERFORMERS = [
  { name: 'Ahmed Ali', role: 'Head Waiter', attendance: 98, events: 14, earned: 42000, rating: '4.9/5.0' },
  { name: 'Muhammad Aslam', role: 'Chef', attendance: 95, events: 10, earned: 45000, rating: '4.8/5.0' },
  { name: 'Sajid Butt', role: 'Chef', attendance: 92, events: 8, earned: 36000, rating: '4.7/5.0' },
  { name: 'Naveed Ahmed', role: 'Driver', attendance: 94, events: 12, earned: 25000, rating: '4.6/5.0' },
]

export default function WorkerReportsPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Worker Report"
        description="Detailed workforce analysis, role utilization, and monthly payouts"
        actions={
          <button
            onClick={() => toast.success('Exporting workforce analytics to Excel...')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-sunken)] transition-all"
          >
            <Download className="h-4 w-4" /> Export Analytics
          </button>
        }
      />

      {/* Analytics KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Total Deployed Crews</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-[var(--color-text-primary)] font-mono">42 workers</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#556ee6]/10 text-[#556ee6]">
              <Users className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Total Wages Paid</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-[var(--color-text-primary)] font-mono">
              <CurrencyDisplay value={234000} compact />
            </p>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#34c38f]/10 text-[#34c38f]">
              <Landmark className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Workers Per Event</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-[var(--color-text-primary)] font-mono">11 avg</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#50a5f1]/10 text-[#50a5f1]">
              <Users className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Top Rated Worker</p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-black text-[var(--color-text-primary)]">Ahmed Ali (Waiter)</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1b44c]/10 text-[#f1b44c]">
              <Award className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Role utilization horizontal Recharts chart */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <div className="md:col-span-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] border-b pb-2 mb-4">Workforce Utilization % by Category</h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ROLE_UTILIZATION} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
                <Tooltip 
                  formatter={(v: any) => `${v}%`}
                  contentStyle={{ background: '#2a3042', borderRadius: '8px', color: '#fff', fontSize: '11px', border: '0' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="utilization" name="Utilization Rate %" fill="#556ee6" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] border-b pb-2 mb-3">Utilization Context</h3>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            Utilization values are tracked dynamically based on assigned worker days relative to total weekend active rosters. 
          </p>
          <div className="bg-[var(--color-bg-sunken)] rounded-xl p-4 flex gap-3 text-xs border border-[var(--color-border)]">
            <ShieldAlert className="h-5 w-5 text-[#f1b44c] shrink-0" />
            <div>
              <p className="font-bold text-[var(--color-text-primary)]">Recommendation</p>
              <p className="text-[var(--color-text-muted)] mt-0.5">Waiters crew deployment is nearing max limits (86%). Consider onboarding 5-10 temporary wait crew.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers Ranking Table */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border)]">
          <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)]">Workforce Rankings & Ratings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-bg-sunken)]">
              <tr>
                {['Worker Name', 'Primary Role', 'Attendance Log', 'Events Worked', 'Gross Earnings', 'User Rating'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm text-[var(--color-text-secondary)]">
              {TOP_PERFORMERS.map((perf, idx) => (
                <tr key={idx} className="border-t border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)] transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-bold text-[var(--color-text-primary)]">{perf.name}</span>
                  </td>
                  <td className="px-4 py-3 capitalize">{perf.role}</td>
                  <td className="px-4 py-3 font-semibold text-[var(--color-text-primary)] font-mono">{perf.attendance}%</td>
                  <td className="px-4 py-3">{perf.events} assignments</td>
                  <td className="px-4 py-3 font-mono font-bold text-[var(--color-text-primary)]"><CurrencyDisplay value={perf.earned} /></td>
                  <td className="px-4 py-3 font-bold text-[#34c38f]">{perf.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  )
}
