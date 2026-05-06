'use client'

import StatsGrid from './StatsGrid'
import RevenueChart from './RevenueChart'
import UpcomingEvents from './UpcomingEvents'
import PaymentAlerts from './PaymentAlerts'

export default function DashboardClient() {
  return (
    <div className="space-y-6">
      <StatsGrid />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RevenueChart />
        </div>
        <div className="lg:col-span-2">
          <PaymentAlerts />
        </div>
      </div>
      <UpcomingEvents />
    </div>
  )
}
