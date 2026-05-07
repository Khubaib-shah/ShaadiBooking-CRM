'use client'

import StatCard from '@/components/shared/StatCard'
import { formatRupees } from '@/lib/utils/currency'
import { useDashboardStats } from '@/lib/hooks/useDashboard'

export default function StatsGrid() {
  const { data: response, isLoading } = useDashboardStats()
  const stats = response?.data

  const dynamicStats = [
    { label: 'Total Booked', value: formatRupees(stats?.totalBooked || 0, true), subvalue: 'all time', accent: 'blue' as const },
    { label: 'Collected', value: formatRupees(stats?.collected || 0, true), subvalue: `${stats?.collectedPercentage || 0}%`, accent: 'green' as const },
    { label: 'Outstanding', value: formatRupees(stats?.outstanding || 0, true), subvalue: 'pending balance', accent: 'amber' as const },
    { label: 'Events This Month', value: String(stats?.eventsThisMonth || 0), subvalue: 'scheduled', accent: 'gold' as const },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-[120px] rounded-xl border bg-[var(--color-bg-elevated)]" style={{ borderColor: 'var(--color-border)' }} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {dynamicStats.map((stat, i) => (
        <StatCard key={stat.label} {...stat} index={i} />
      ))}
    </div>
  )
}
