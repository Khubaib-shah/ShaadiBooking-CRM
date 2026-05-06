'use client'

import StatCard from '@/components/shared/StatCard'
import { formatRupees } from '@/lib/utils/currency'

// Demo data — will be replaced with useQuery from dashboard API
const DEMO_STATS = [
  { label: 'Total Booked', value: formatRupees(840000, true), subvalue: 'this month', accent: 'blue' as const, trend: { value: 12, positive: true } },
  { label: 'Collected', value: formatRupees(610000, true), subvalue: '73%', accent: 'green' as const, trend: { value: 8, positive: true } },
  { label: 'Outstanding', value: formatRupees(230000, true), subvalue: '3 pending', accent: 'amber' as const },
  { label: 'Events This Month', value: '14', subvalue: '3 this week', accent: 'gold' as const, trend: { value: 5, positive: true } },
]

export default function StatsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {DEMO_STATS.map((stat, i) => (
        <StatCard key={stat.label} {...stat} index={i} />
      ))}
    </div>
  )
}
