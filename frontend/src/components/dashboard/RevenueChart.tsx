'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const DEMO_DATA = [
  { month: 'Dec', collected: 520000, outstanding: 180000 },
  { month: 'Jan', collected: 680000, outstanding: 120000 },
  { month: 'Feb', collected: 450000, outstanding: 250000 },
  { month: 'Mar', collected: 710000, outstanding: 90000 },
  { month: 'Apr', collected: 590000, outstanding: 210000 },
  { month: 'May', collected: 610000, outstanding: 230000 },
]

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload) return null
  return (
    <div className="rounded-lg border p-3"
         style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
      <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-xs" style={{ color: entry.name === 'collected' ? 'var(--color-accent)' : 'var(--color-warning)' }}>
          {entry.name === 'collected' ? 'Collected' : 'Outstanding'}: Rs. {(entry.value / 1000).toFixed(0)}K
        </p>
      ))}
    </div>
  )
}

export default function RevenueChart() {
  return (
    <div className="rounded-xl border p-5" style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
      <h3 className="text-[var(--text-base)] font-semibold mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
        Revenue Overview
      </h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DEMO_DATA} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-text-muted)', fontSize: 11, fontFamily: 'var(--font-body)' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-accent-soft)' }} />
            <Bar dataKey="collected" fill="var(--color-accent)" radius={[4, 4, 0, 0]} stackId="stack" />
            <Bar dataKey="outstanding" fill="var(--color-warning)" radius={[4, 4, 0, 0]} stackId="stack" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
