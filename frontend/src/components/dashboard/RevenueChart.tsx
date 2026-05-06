'use client'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

const DEMO_DATA = [
  { month: 'Dec', revenue: 700000, collected: 520000 },
  { month: 'Jan', revenue: 800000, collected: 680000 },
  { month: 'Feb', revenue: 700000, collected: 450000 },
  { month: 'Mar', revenue: 800000, collected: 710000 },
  { month: 'Apr', revenue: 800000, collected: 590000 },
  { month: 'May', revenue: 840000, collected: 610000 },
]

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload) return null
  return (
    <div className="rounded-lg border p-3"
         style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
      <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-xs" style={{ color: entry.name === 'collected' ? 'var(--color-success)' : 'var(--color-accent)' }}>
          {entry.name === 'collected' ? 'Collected' : 'Revenue'}: Rs. {(entry.value / 1000).toFixed(0)}K
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
          <AreaChart data={DEMO_DATA}>
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
            <Legend />
            <Area type="monotone" dataKey="revenue" stroke="#556ee6" fill="#eef2ff" strokeWidth={2} />
            <Area type="monotone" dataKey="collected" stroke="#34c38f" fill="#d4edda" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
