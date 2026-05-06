'use client'

import { useMemo } from 'react'
import { Download, Calendar, Sparkles, Star, Milestone } from 'lucide-react'
import { toast } from 'sonner'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'

const SEASONAL_EVENTS = [
  { name: 'Jan', bookings: 12, revenue: 1200000 },
  { name: 'Feb', bookings: 15, revenue: 1500000 },
  { name: 'Mar', bookings: 8, revenue: 850000 },
  { name: 'Apr', bookings: 5, revenue: 450000 },
  { name: 'May', bookings: 3, revenue: 250000 },
  { name: 'Jun', bookings: 2, revenue: 150000 },
  { name: 'Jul', bookings: 4, revenue: 350000 },
  { name: 'Aug', bookings: 3, revenue: 300000 },
  { name: 'Sep', bookings: 6, revenue: 600000 },
  { name: 'Oct', bookings: 14, revenue: 1400000 },
  { name: 'Nov', bookings: 18, revenue: 1900000 },
  { name: 'Dec', bookings: 22, revenue: 2400000 },
]

const VENUE_PERFORMANCE = [
  { name: 'Pearl Continental Hall A', count: 18, rating: '4.9/5.0', totalSales: 3240000, equipment: 'Standing AC, VIP Stage' },
  { name: 'Emaar Beach Front Lawn', count: 12, rating: '4.8/5.0', totalSales: 2450000, equipment: 'Marquees, Fairy Lights' },
  { name: 'Marriott Marquee Hall C', count: 9, rating: '4.7/5.0', totalSales: 1650000, equipment: 'LED Screen, Stage Setup' },
  { name: 'DHA Golf Club Lawn', count: 6, rating: '4.6/5.0', totalSales: 1100000, equipment: 'Carpeting, Uplighting' },
]

export default function EventReportsPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Event Performance"
        description="Seasonal wedding event counts, venue performance, and guest volume metrics"
        actions={
          <button
            onClick={() => toast.success('Exporting seasonal trends to Excel...')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-sunken)] transition-all"
          >
            <Download className="h-4 w-4" /> Export Trends
          </button>
        }
      />

      {/* Seasonal KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Total Bookings Managed</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-[var(--color-text-primary)] font-mono">112 events</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#556ee6]/10 text-[#556ee6]">
              <Calendar className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Busiest Wedding Type</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-black text-[var(--color-text-primary)]">Barat (54%)</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#34c38f]/10 text-[#34c38f]">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Average Guest Count</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-[var(--color-text-primary)] font-mono">420 guests</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#50a5f1]/10 text-[#50a5f1]">
              <Star className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Active Venues Ledger</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-[var(--color-text-primary)] font-mono">14 locations</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1b44c]/10 text-[#f1b44c]">
              <Milestone className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal Line chart representation using Recharts */}
      <div className="rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm mb-6">
        <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] border-b pb-2 mb-4">Seasonal Wedding Booking Density (Monthly Counts)</h3>
        
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SEASONAL_EVENTS}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
              <Tooltip 
                formatter={(v: any) => `${v} events`}
                contentStyle={{ background: '#2a3042', borderRadius: '8px', color: '#fff', fontSize: '11px', border: '0' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="bookings" name="Monthly Booking Vol" stroke="#556ee6" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Venue Performance Table */}
      <div className="rounded-xl border border-[var(--color-border)] bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border)]">
          <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)]">Venue Deployment & Performance Table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-bg-sunken)]">
              <tr>
                {['Venue Name', 'Bookings Completed', 'Average Satisfaction', 'Deployed Subcontract Equipment', 'Gross Operational Sales'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm text-[var(--color-text-secondary)]">
              {VENUE_PERFORMANCE.map((venue, idx) => (
                <tr key={idx} className="border-t border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)] transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-bold text-[var(--color-text-primary)]">{venue.name}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-[var(--color-text-primary)] font-mono">{venue.count} events</td>
                  <td className="px-4 py-3 font-bold text-[#34c38f]">{venue.rating}</td>
                  <td className="px-4 py-3 text-xs text-[var(--color-text-muted)]">{venue.equipment}</td>
                  <td className="px-4 py-3 font-mono font-bold text-[var(--color-text-primary)]">
                    <CurrencyDisplay value={venue.totalSales} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  )
}
