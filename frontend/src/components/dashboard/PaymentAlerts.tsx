'use client'

import { AlertTriangle, Clock, CalendarClock, Loader2 } from 'lucide-react'
import { formatRupees } from '@/lib/utils/currency'
import { useDashboardAlerts } from '@/lib/hooks/useDashboard'
import { toast } from 'sonner'

const ALERT_CONFIG = {
  overdue: { icon: AlertTriangle, borderColor: 'var(--color-danger)', label: 'Overdue', labelColor: 'var(--color-danger)' },
  due_soon_3: { icon: Clock, borderColor: 'var(--color-warning)', label: 'Due in 3 days', labelColor: 'var(--color-warning)' },
  due_soon_7: { icon: CalendarClock, borderColor: 'var(--color-info)', label: 'Due in 7 days', labelColor: 'var(--color-info)' },
}

export default function PaymentAlerts() {
  const { data: response, isLoading } = useDashboardAlerts()
  const alerts = response?.data || []

  const handleSendReminder = (alert: any) => {
    // Generate prefilled WhatsApp message
    const cleanPhone = '03162126865' // mock since we don't have phone in alert
    const msg = `Assalam u Alaikum ${alert.clientName} Saheb, gentle reminder from Royal Caterers. Your installment of ${formatRupees(alert.amount)} for booking ${alert.referenceNumber} is due on ${new Date(alert.dueDate).toLocaleDateString()}. Kindly let us know when to collect. JazakAllah!`
    const waUrl = `https://wa.me/92${cleanPhone.slice(1)}?text=${encodeURIComponent(msg)}`
    window.open(waUrl, '_blank')
    toast.success(`WhatsApp reminder triggered for ${alert.clientName}!`)
  }

  return (
    <div className="rounded-xl border p-5 flex flex-col h-full" style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', height: '350px' }}>
      <h3 className="text-[var(--text-base)] font-semibold mb-4 shrink-0" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
        Payment Alerts
      </h3>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--color-accent)]" />
        </div>
      ) : alerts.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-xs font-semibold text-[var(--color-text-muted)] text-center">
          No pending payment alerts!
        </div>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-0">
          {alerts.slice(0, 4).map((alert) => {
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
                  <button
                    onClick={() => handleSendReminder(alert)}
                    className="text-[10px] font-medium px-2 py-0.5 rounded transition-colors hover:bg-[var(--color-border)]"
                    style={{ color: 'var(--color-accent)' }}>
                    Send Reminder
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
