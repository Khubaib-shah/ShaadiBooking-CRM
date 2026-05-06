'use client'

import { AlertTriangle, Clock, CalendarClock } from 'lucide-react'
import { formatRupees } from '@/lib/utils/currency'

const DEMO_ALERTS = [
  { _id: '1', clientName: 'Hassan Malik', referenceNumber: 'BK-2025-0015', amount: 150000, type: 'overdue' as const, daysOverdue: 3 },
  { _id: '2', clientName: 'Ayesha Tariq', referenceNumber: 'BK-2025-0018', amount: 250000, type: 'due_soon_3' as const, daysRemaining: 2 },
  { _id: '3', clientName: 'Bilal Ahmed', referenceNumber: 'BK-2025-0021', amount: 100000, type: 'due_soon_7' as const, daysRemaining: 6 },
]

const ALERT_CONFIG = {
  overdue: { icon: AlertTriangle, borderColor: 'var(--color-danger)', label: 'Overdue', labelColor: 'var(--color-danger)' },
  due_soon_3: { icon: Clock, borderColor: 'var(--color-warning)', label: 'Due in 3 days', labelColor: 'var(--color-warning)' },
  due_soon_7: { icon: CalendarClock, borderColor: 'var(--color-info)', label: 'Due in 7 days', labelColor: 'var(--color-info)' },
}

export default function PaymentAlerts() {
  return (
    <div className="rounded-xl border p-5" style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
      <h3 className="text-[var(--text-base)] font-semibold mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
        Payment Alerts
      </h3>
      <div className="space-y-3">
        {DEMO_ALERTS.map((alert) => {
          const config = ALERT_CONFIG[alert.type]
          const Icon = config.icon
          return (
            <div
              key={alert._id}
              className="rounded-lg border-l-[3px] p-3"
              style={{ borderLeftColor: config.borderColor, background: 'var(--color-bg-sunken)' }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[var(--text-sm)] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {alert.clientName}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                    {alert.referenceNumber}
                  </p>
                </div>
                <span className="text-xs font-medium" style={{ fontFamily: 'var(--font-mono)', color: config.labelColor }}>
                  {formatRupees(alert.amount, true)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-medium" style={{ color: config.labelColor }}>
                  <Icon className="h-3 w-3" />
                  {config.label}
                </span>
                <button className="text-[10px] font-medium px-2 py-0.5 rounded transition-colors hover:bg-[var(--color-border)]"
                        style={{ color: 'var(--color-accent)' }}>
                  Send Reminder
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
