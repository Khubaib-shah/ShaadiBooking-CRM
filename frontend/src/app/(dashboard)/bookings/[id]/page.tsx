'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowLeft, Phone, MessageSquare, CheckCircle, Clock, Send, Check } from 'lucide-react'
import Link from 'next/link'
import StatusBadge from '@/components/shared/StatusBadge'
import PageWrapper from '@/components/shared/PageWrapper'
import { formatRupees } from '@/lib/utils/currency'
import { formatDate } from '@/lib/utils/dates'
import { EVENT_TYPE_LABELS } from '@/lib/utils/booking'
import { mockDb, type MockBooking } from '@/lib/utils/mockDb'
import { toast } from 'sonner'

export default function BookingDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [b, setB] = useState<MockBooking | null>(null)

  // Load from persistent localstorage database
  useEffect(() => {
    if (id) {
      const record = mockDb.getBookingById(id as string)
      if (record) {
        setB(record)
      } else {
        // Fallback to first if not found
        const first = mockDb.getBookings()[0]
        setB(first || null)
      }
    }
  }, [id])

  if (!b) {
    return (
      <div className="p-8 text-center text-xs font-bold text-[var(--color-text-muted)]">
        Loading wedding contract details...
      </div>
    )
  }

  // Handle marking individual payment installment schedule as Paid
  const handleMarkAsPaid = (scheduleId: string) => {
    const updatedSchedules = b.paymentSchedules.map(ps => {
      if (ps._id === scheduleId) {
        return { ...ps, isPaid: true, paidAt: new Date().toISOString() }
      }
      return ps
    })

    // Recalculate collected / outstanding finances
    let newPaid = 0
    updatedSchedules.forEach(ps => {
      if (ps.isPaid) {
        newPaid += ps.amountDue
      }
    })

    const newOutstanding = Math.max(0, b.contract - newPaid)

    const updatedBooking: MockBooking = {
      ...b,
      paymentSchedules: updatedSchedules,
      paid: newPaid,
      outstanding: newOutstanding,
      status: newOutstanding === 0 ? 'completed' : b.status
    }

    mockDb.saveBooking(updatedBooking)
    setB(updatedBooking)
    toast.success('Payment successfully received and updated!')
  }

  // Handle launching prefilled WhatsApp reminder to client
  const handleSendReminder = (amount: number, type: string) => {
    const cleanPhone = b.clientPhone.replace(/[^0-9]/g, '')
    // Pre-fill premium customized Urdu/English WhatsApp template
    const msg = `السلام عليكم ${b.client} Saheb, gentle reminder from Royal Caterers. Your installment of ${formatRupees(amount)} for the ${EVENT_TYPE_LABELS[b.type] || b.type} event on ${formatDate(b.date, 'dd MMMM yyyy')} is due. Kindly let us know when to collect, or transfer directly to Bank Al Habib Acc: 1042-0095-11042. JazakAllah!`
    
    const waUrl = `https://wa.me/92${cleanPhone.slice(1)}?text=${encodeURIComponent(msg)}`
    window.open(waUrl, '_blank')
    toast.success(`WhatsApp pre-filled reminder template triggered for ${b.client}!`)
  }

  const handleCancelBooking = () => {
    const updated: MockBooking = {
      ...b,
      status: 'cancelled',
      outstanding: b.contract - b.paid // lock financials
    }
    mockDb.saveBooking(updated)
    setB(updated)
    toast.error('Booking contract has been marked as Cancelled.')
  }

  return (
    <PageWrapper>
      <Link href="/bookings" className="inline-flex items-center gap-1.5 text-xs font-bold mb-4 transition-colors hover:text-[var(--color-accent)]" style={{ color: 'var(--color-text-secondary)' }}>
        <ArrowLeft className="h-3 w-3" /> Back to Bookings
      </Link>

      <div className="grid gap-6 lg:grid-cols-5">
        
        {/* Left Grid: 3/5 width */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Header Overview Card */}
          <div className="rounded-xl border p-6 bg-white shadow-sm" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-black font-mono text-[var(--color-accent)]">{b.ref}</span>
              <StatusBadge status={b.status} />
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                {EVENT_TYPE_LABELS[b.type] || b.type}
              </span>
            </div>
            <h2 className="text-xl font-bold mb-1 text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
              {b.client}
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {formatDate(b.date, 'EEEE, dd MMMM yyyy')} · {b.venue}
            </p>
            <div className="flex gap-3 mt-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--color-bg-sunken)] text-[var(--color-text-secondary)]">{b.guests} guests</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--color-bg-sunken)] text-[var(--color-text-secondary)]">Per head: {formatRupees(b.perHeadPrice || 0)}</span>
            </div>
          </div>

          {/* Stateful Payment Timeline Tracker */}
          <div className="rounded-xl border p-6 bg-white shadow-sm" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] border-b pb-2 mb-4">Payment Schedule Timeline</h3>
            <div className="space-y-4 relative">
              <div className="absolute left-[11px] top-3 bottom-3 w-px bg-[var(--color-border)]" />
              {b.paymentSchedules.map(ps => (
                <div key={ps._id} className="flex items-start gap-4 relative">
                  <div
                    className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 shrink-0 transition-all duration-200"
                    style={{
                      borderColor: ps.isPaid ? 'var(--color-success)' : 'var(--color-warning)',
                      background: ps.isPaid ? 'var(--color-success-bg)' : 'var(--color-bg-elevated)'
                    }}
                  >
                    {ps.isPaid ? (
                      <Check className="h-3 w-3 text-[var(--color-success)] font-black" />
                    ) : (
                      <Clock className="h-3 w-3 text-[var(--color-warning)]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold capitalize text-[var(--color-text-primary)]">{ps.type} Installment</span>
                      <span
                        className="text-sm font-bold font-mono"
                        style={{ color: ps.isPaid ? 'var(--color-success)' : 'var(--color-warning)' }}
                      >
                        {formatRupees(ps.amountDue)}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5 text-[var(--color-text-muted)] font-medium">
                      {ps.isPaid ? `Received on ${formatDate(ps.paidAt || b.date)}` : `Outstanding. Due before ${formatDate(ps.dueDate || b.date)}`}
                    </p>
                    
                    {/* Action buttons work dynamically on click! */}
                    {!ps.isPaid && (
                      <div className="flex gap-2 mt-3 animate-fade-in">
                        <button
                          onClick={() => handleMarkAsPaid(ps._id)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md transition-all hover:brightness-110 bg-[var(--color-accent)] text-[var(--color-text-inverse)] active:scale-95"
                        >
                          Mark as Received
                        </button>
                        <button
                          onClick={() => handleSendReminder(ps.amountDue, ps.type)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md transition-all border hover:bg-[var(--color-bg-sunken)] text-[var(--color-text-secondary)] border-[var(--color-border)] active:scale-95"
                        >
                          <Send className="h-3 w-3" /> Send Reminder
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Collected vs Outstanding summary boxes */}
            <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-[var(--color-border)]">
              {[{ l: 'Contracted Value', v: b.contract, c: 'var(--color-text-primary)' }, { l: 'Collected Today', v: b.paid, c: 'var(--color-success)' }, { l: 'Outstanding Liability', v: b.outstanding, c: 'var(--color-warning)' }].map(x => (
                <div key={x.l} className="flex-1 text-center py-2 bg-[var(--color-bg-sunken)] rounded-xl border border-[var(--color-border)]">
                  <p className="text-[9px] font-black uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">{x.l}</p>
                  <p className="text-sm font-bold font-mono" style={{ color: x.c }}>{formatRupees(x.v)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes Card */}
          <div className="rounded-xl border p-6 bg-white shadow-sm" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] border-b pb-2 mb-4">Contractual Operations Notes</h3>
            {b.notes && b.notes.map(n => (
              <div key={n._id} className="flex gap-3 mb-3 p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-sunken)]/50">
                <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-black uppercase shrink-0 bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                  {n.createdBy.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--color-text-primary)]">
                    {n.createdBy} 
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ml-2 bg-[#50a5f1]/10 text-[#50a5f1]">
                      {n.noteType}
                    </span>
                  </p>
                  <p className="text-sm mt-1.5 text-[var(--color-text-secondary)] leading-normal">{n.content}</p>
                  <p className="text-[10px] mt-1.5 text-[var(--color-text-muted)] font-medium">{formatDate(n.createdAt)}</p>
                </div>
              </div>
            ))}
            {(!b.notes || b.notes.length === 0) && (
              <p className="text-xs text-[var(--color-text-muted)] text-center py-4 font-semibold">No operational notes recorded.</p>
            )}
          </div>
        </div>

        {/* Right Grid: 2/5 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client profile */}
          <div className="rounded-xl border p-5 bg-white shadow-sm" style={{ borderColor: 'var(--color-border)' }}>
            <h4 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] border-b pb-2 mb-4">Client Contact</h4>
            <div className="space-y-3.5">
              <a href={`tel:${b.clientPhone}`} className="flex items-center gap-2.5 text-sm font-semibold transition-colors hover:text-[var(--color-accent)] text-[var(--color-text-secondary)]">
                <Phone className="h-4 w-4 text-[var(--color-text-muted)]" />
                <span className="font-mono">{b.clientPhone}</span>
              </a>
              {b.clientWhatsapp && (
                <a
                  href={`https://wa.me/92${b.clientWhatsapp.slice(1)}`}
                  target="_blank"
                  className="flex items-center gap-2.5 text-sm font-semibold transition-colors hover:text-[var(--color-success)] text-[var(--color-text-secondary)]"
                >
                  <MessageSquare className="h-4 w-4 text-[#34c38f]" />
                  <span>WhatsApp direct channel</span>
                </a>
              )}
            </div>
          </div>

          {/* Financial calculations breakdown */}
          <div className="rounded-xl border p-5 bg-white shadow-sm" style={{ borderColor: 'var(--color-border)' }}>
            <h4 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] border-b pb-2 mb-4">Financial Ledger Sheet</h4>
            <div className="space-y-3">
              {[
                { l: 'Base Contract Sum', v: b.contract },
                { l: 'Subcontract Expenses', v: Math.round(b.contract * 0.45) },
                { l: 'Net Revenue Margin', v: Math.round(b.contract * 0.55) },
                { l: 'Paid Total (SMS Verified)', v: b.paid, c: 'var(--color-success)' },
                { l: 'Outstanding Balance Liability', v: b.outstanding, c: 'var(--color-warning)' }
              ].map(x => (
                <div key={x.l} className="flex justify-between text-sm">
                  <span className="font-medium text-[var(--color-text-secondary)]">{x.l}</span>
                  <span className="font-bold font-mono text-xs" style={{ color: ('c' in x && x.c) ? x.c : 'var(--color-text-primary)' }}>
                    {formatRupees(x.v)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Danger zone actions */}
          <div className="rounded-xl border p-5" style={{ borderColor: 'var(--color-danger)', background: 'var(--color-danger-bg)' }}>
            <h4 className="text-xs font-black uppercase tracking-wider text-[var(--color-danger)] mb-2">Contract Termination</h4>
            <p className="text-xs text-[var(--color-text-secondary)] mb-4 leading-normal">
              Terminating this booking contract locks all worker deployment rosters and releases any venue dates. Use caution.
            </p>
            {b.status === 'cancelled' ? (
              <span className="text-xs font-black uppercase tracking-wider px-3 py-2 rounded bg-white text-[var(--color-danger)] border border-[var(--color-danger)]">
                Booking Cancelled
              </span>
            ) : (
              <button
                onClick={handleCancelBooking}
                className="text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg transition-colors hover:brightness-110 bg-[var(--color-danger)] text-white"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>

      </div>
    </PageWrapper>
  )
}
