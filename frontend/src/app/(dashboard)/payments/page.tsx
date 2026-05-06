'use client'

import PageHeader from '@/components/shared/PageHeader'
import StatCard from '@/components/shared/StatCard'
import { formatRupees } from '@/lib/utils/currency'
import { formatDate } from '@/lib/utils/dates'

const DEMO_PAYMENTS = [
  { _id:'1', date:'2025-05-02', client:'Ahmed Khan', ref:'BK-2025-0019', amount:500000, method:'bank_transfer', receivedBy:'Ali Manager', smsReceipt:true },
  { _id:'2', date:'2025-04-28', client:'Sara Ali', ref:'BK-2025-0020', amount:160000, method:'easypaisa', receivedBy:'Ali Manager', smsReceipt:true },
  { _id:'3', date:'2025-04-25', client:'Usman Sheikh', ref:'BK-2025-0021', amount:600000, method:'cash', receivedBy:'Bilal', smsReceipt:false },
]

const METHOD_LABELS: Record<string, string> = {
  cash: 'Cash', easypaisa: 'EasyPaisa', jazzcash: 'JazzCash', bank_transfer: 'Bank Transfer'
}

export default function PaymentsPage() {
  return (
    <div>
      <PageHeader title="Payments" description="Track all payment transactions" />

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <StatCard label="Collected This Month" value={formatRupees(1260000, true)} accent="green" index={0} />
        <StatCard label="Transactions" value="3" accent="blue" index={1} />
        <StatCard label="Most Used Method" value="Bank Transfer" accent="gold" index={2} />
      </div>

      <div className="rounded-xl border overflow-x-auto w-full" style={{ borderColor:'var(--color-border)' }}>
        <table className="w-full min-w-[700px]">
          <thead><tr style={{ background:'var(--color-bg-sunken)' }}>
            {['Date','Client','Booking Ref','Amount','Method','Received By','SMS'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color:'var(--color-text-muted)' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{DEMO_PAYMENTS.map(p => (
            <tr key={p._id} className="border-t transition-all duration-150 hover:bg-[var(--color-bg-elevated)]" style={{ borderColor:'var(--color-border)' }}>
              <td className="px-4 py-3 text-[var(--text-sm)]" style={{ color:'var(--color-text-primary)' }}>{formatDate(p.date)}</td>
              <td className="px-4 py-3 text-[var(--text-sm)] font-medium" style={{ color:'var(--color-text-primary)' }}>{p.client}</td>
              <td className="px-4 py-3"><span style={{ fontFamily:'var(--font-mono)', color:'var(--color-accent)', fontSize:'var(--text-xs)' }}>{p.ref}</span></td>
              <td className="px-4 py-3"><span style={{ fontFamily:'var(--font-mono)', color:'var(--color-success)', fontSize:'var(--text-sm)' }}>{formatRupees(p.amount)}</span></td>
              <td className="px-4 py-3"><span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background:'var(--color-bg-sunken)', color:'var(--color-text-secondary)' }}>{METHOD_LABELS[p.method]}</span></td>
              <td className="px-4 py-3 text-[var(--text-sm)]" style={{ color:'var(--color-text-secondary)' }}>{p.receivedBy}</td>
              <td className="px-4 py-3"><span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: p.smsReceipt ? 'var(--color-success-bg)' : 'var(--color-danger-bg)', color: p.smsReceipt ? 'var(--color-success)' : 'var(--color-danger)' }}>{p.smsReceipt ? 'Sent' : 'Not Sent'}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}
