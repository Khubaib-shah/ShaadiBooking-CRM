'use client'

import { useParams } from 'next/navigation'
import { ArrowLeft, Phone, MessageSquare, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import StatusBadge from '@/components/shared/StatusBadge'
import { formatRupees } from '@/lib/utils/currency'
import { formatDate } from '@/lib/utils/dates'
import { EVENT_TYPE_LABELS } from '@/lib/utils/booking'
import type { BookingStatus, EventType } from '@/types/booking.types'

const DEMO = {
  _id: '1', referenceNumber: 'BK-2025-0019', clientName: 'Ahmed Khan', clientPhone: '03121234567',
  clientWhatsapp: '03121234567', eventType: 'barat' as EventType, eventDate: '2025-06-15',
  venueName: 'Pearl Continental', guestCount: 500, packageType: 'per_head' as const,
  perHeadPrice: 1700, totalContractValue: 850000, discountAmount: 0, status: 'confirmed' as BookingStatus,
  netValue: 850000, totalPaid: 500000, totalOutstanding: 350000,
  paymentSchedules: [
    { _id: 'ps1', type: 'deposit' as const, amountDue: 500000, dueDate: '2025-05-01', isPaid: true, paidAt: '2025-04-28' },
    { _id: 'ps2', type: 'balance' as const, amountDue: 350000, dueDate: '2025-06-10', isPaid: false },
  ],
  payments: [{ _id: 'p1', amount: 500000, method: 'bank_transfer' as const, receivedBy: 'Ali Manager', receivedAt: '2025-04-28', smsReceiptSent: true }],
  notes: [{ _id: 'n1', content: 'Client requested mutton biryani upgrade', noteType: 'menu' as const, createdBy: 'Ali', createdAt: '2025-04-20' }],
  staffAssignments: [],
}

export default function BookingDetailPage() {
  const { id } = useParams()
  const b = DEMO

  return (
    <div>
      <Link href="/bookings" className="inline-flex items-center gap-1.5 text-xs font-medium mb-4 transition-colors hover:text-[var(--color-accent)]" style={{ color: 'var(--color-text-secondary)' }}>
        <ArrowLeft className="h-3 w-3" /> Back to Bookings
      </Link>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: 60% */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <div className="rounded-xl border p-6" style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-medium" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>{b.referenceNumber}</span>
              <StatusBadge status={b.status} />
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: 'var(--color-accent-soft)', color: 'var(--color-accent)' }}>{EVENT_TYPE_LABELS[b.eventType]}</span>
            </div>
            <h2 className="text-[var(--text-2xl)] mb-1" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{b.clientName}</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>{formatDate(b.eventDate, 'EEEE, dd MMMM yyyy')} · {b.venueName}</p>
            <div className="flex gap-3 mt-3">
              <span className="text-xs px-2 py-1 rounded-md" style={{ background: 'var(--color-bg-sunken)', color: 'var(--color-text-secondary)' }}>{b.guestCount} guests</span>
              <span className="text-xs px-2 py-1 rounded-md" style={{ background: 'var(--color-bg-sunken)', color: 'var(--color-text-secondary)' }}>Per head: {formatRupees(b.perHeadPrice || 0)}</span>
            </div>
          </div>

          {/* Payment tracker */}
          <div className="rounded-xl border p-6" style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
            <h3 className="text-[var(--text-base)] font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Payment Timeline</h3>
            <div className="space-y-4 relative">
              <div className="absolute left-[11px] top-3 bottom-3 w-px" style={{ background: 'var(--color-border)' }} />
              {b.paymentSchedules.map(ps => (
                <div key={ps._id} className="flex items-start gap-4 relative">
                  <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 shrink-0"
                    style={{ borderColor: ps.isPaid ? 'var(--color-success)' : 'var(--color-warning)', background: ps.isPaid ? 'var(--color-success-bg)' : 'var(--color-bg-elevated)' }}>
                    {ps.isPaid ? <CheckCircle className="h-3 w-3" style={{ color: 'var(--color-success)' }} /> : <Clock className="h-3 w-3" style={{ color: 'var(--color-warning)' }} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize" style={{ color: 'var(--color-text-primary)' }}>{ps.type}</span>
                      <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-mono)', color: ps.isPaid ? 'var(--color-success)' : 'var(--color-warning)' }}>{formatRupees(ps.amountDue)}</span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                      {ps.isPaid ? `Paid on ${formatDate(ps.paidAt!)}` : `Due ${formatDate(ps.dueDate)}`}
                    </p>
                    {!ps.isPaid && (
                      <div className="flex gap-2 mt-2">
                        <button className="text-[10px] font-medium px-2 py-1 rounded transition-colors hover:brightness-110" style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}>Mark as Received</button>
                        <button className="text-[10px] font-medium px-2 py-1 rounded transition-colors hover:bg-[var(--color-border)]" style={{ color: 'var(--color-text-secondary)' }}>Send Reminder</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-6 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              {[{ l: 'Contracted', v: b.netValue, c: 'var(--color-text-primary)' }, { l: 'Collected', v: b.totalPaid, c: 'var(--color-success)' }, { l: 'Outstanding', v: b.totalOutstanding, c: 'var(--color-warning)' }].map(x => (
                <div key={x.l}><p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{x.l}</p><p className="text-sm font-medium" style={{ fontFamily: 'var(--font-mono)', color: x.c }}>{formatRupees(x.v)}</p></div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-xl border p-6" style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
            <h3 className="text-[var(--text-base)] font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Notes</h3>
            {b.notes.map(n => (
              <div key={n._id} className="flex gap-3 mb-3 p-3 rounded-lg" style={{ background: 'var(--color-bg-sunken)' }}>
                <div className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold shrink-0" style={{ background: 'var(--color-accent-soft)', color: 'var(--color-accent)' }}>{n.createdBy.charAt(0)}</div>
                <div><p className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>{n.createdBy} <span className="text-[10px] font-normal px-1.5 py-0.5 rounded ml-1" style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)' }}>{n.noteType}</span></p><p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>{n.content}</p><p className="text-[10px] mt-1" style={{ color: 'var(--color-text-muted)' }}>{formatDate(n.createdAt)}</p></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 40% */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client info */}
          <div className="rounded-xl border p-5" style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>Client</h4>
            <div className="space-y-2">
              <a href={`tel:${b.clientPhone}`} className="flex items-center gap-2 text-sm transition-colors hover:text-[var(--color-accent)]" style={{ color: 'var(--color-text-secondary)' }}><Phone className="h-3.5 w-3.5" />{b.clientPhone}</a>
              {b.clientWhatsapp && <a href={`https://wa.me/92${b.clientWhatsapp.slice(1)}`} className="flex items-center gap-2 text-sm transition-colors hover:text-[var(--color-success)]" style={{ color: 'var(--color-text-secondary)' }}><MessageSquare className="h-3.5 w-3.5" />WhatsApp</a>}
            </div>
          </div>

          {/* Financial summary */}
          <div className="rounded-xl border p-5" style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>Financial Summary</h4>
            <div className="space-y-2">
              {[{ l:'Contract', v: b.totalContractValue }, { l:'Discount', v: b.discountAmount }, { l:'Net Value', v: b.netValue }, { l:'Paid', v: b.totalPaid, c:'var(--color-success)' }, { l:'Outstanding', v: b.totalOutstanding, c:'var(--color-warning)' }].map(x => (
                <div key={x.l} className="flex justify-between text-sm"><span style={{ color: 'var(--color-text-secondary)' }}>{x.l}</span><span style={{ fontFamily:'var(--font-mono)', color: ('c' in x && x.c) ? x.c : 'var(--color-text-primary)' }}>{formatRupees(x.v)}</span></div>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="rounded-xl border p-5" style={{ borderColor: 'var(--color-danger)', background: 'var(--color-danger-bg)' }}>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-danger)' }}>Danger Zone</h4>
            <button className="text-xs font-medium px-3 py-1.5 rounded transition-colors" style={{ background: 'var(--color-danger)', color: '#fff' }}>Cancel Booking</button>
          </div>
        </div>
      </div>
    </div>
  )
}
