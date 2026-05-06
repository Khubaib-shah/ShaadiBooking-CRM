'use client'

import { useState } from 'react'
import { Plus, Phone, Calendar, DollarSign } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import { EVENT_TYPE_LABELS } from '@/lib/utils/booking'
import { formatRupees } from '@/lib/utils/currency'
import { formatDate, relativeTime } from '@/lib/utils/dates'
import { useUIStore } from '@/lib/store/uiStore'
import type { InquiryStatus } from '@/types/inquiry.types'
import type { EventType } from '@/types/booking.types'

const COLUMNS: { status: InquiryStatus; label: string }[] = [
  { status: 'new', label: 'New' },
  { status: 'contacted', label: 'Contacted' },
  { status: 'negotiating', label: 'Negotiating' },
  { status: 'converted', label: 'Converted / Lost' },
]

const DEMO = [
  { _id:'1', clientName:'Zara Hussain', clientPhone:'03001234567', eventType:'mehndi' as EventType, tentativeDate:'2025-07-10', budget:200000, status:'new' as InquiryStatus, createdAt:'2025-05-01' },
  { _id:'2', clientName:'Kamran Ali', clientPhone:'03009876543', eventType:'barat' as EventType, tentativeDate:'2025-08-15', budget:800000, status:'contacted' as InquiryStatus, createdAt:'2025-04-28', followUpDate:'2025-05-10' },
  { _id:'3', clientName:'Nadia Shah', clientPhone:'03111234567', eventType:'valima' as EventType, tentativeDate:'2025-09-01', budget:500000, status:'negotiating' as InquiryStatus, createdAt:'2025-04-25' },
  { _id:'4', clientName:'Rizwan Malik', clientPhone:'03221234567', eventType:'nikah' as EventType, budget:350000, status:'new' as InquiryStatus, createdAt:'2025-05-03' },
]

export default function InquiriesPage() {
  const { openNewInquiry } = useUIStore()
  return (
    <div>
      <PageHeader title="Inquiries" description="Track and convert potential bookings"
        actions={<button onClick={openNewInquiry} className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all hover:brightness-110 active:scale-[0.97]" style={{ background:'var(--color-accent)', color:'var(--color-text-inverse)' }}><Plus className="h-4 w-4" /> New Inquiry</button>} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map(col => {
          const items = col.status === 'converted'
            ? DEMO.filter(i => i.status === 'converted' || i.status === 'lost')
            : DEMO.filter(i => i.status === col.status)
          return (
            <div key={col.status}>
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color:'var(--color-text-muted)' }}>{col.label}</h3>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background:'var(--color-bg-sunken)', color:'var(--color-text-secondary)' }}>{items.length}</span>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {items.map(inq => (
                  <div key={inq._id} className="rounded-lg border p-4 transition-all duration-150 hover:border-[var(--color-border-mid)] cursor-pointer"
                    style={{ background:'var(--color-bg-elevated)', borderColor:'var(--color-border)' }}>
                    <p className="text-sm font-medium" style={{ color:'var(--color-text-primary)' }}>{inq.clientName}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Phone className="h-3 w-3" style={{ color:'var(--color-text-muted)' }} />
                      <span className="text-[10px]" style={{ color:'var(--color-text-muted)' }}>{inq.clientPhone}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background:'var(--color-accent-soft)', color:'var(--color-accent)' }}>{EVENT_TYPE_LABELS[inq.eventType]}</span>
                      {inq.tentativeDate && <span className="text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1" style={{ background:'var(--color-bg-sunken)', color:'var(--color-text-muted)' }}><Calendar className="h-2.5 w-2.5" />{formatDate(inq.tentativeDate, 'dd MMM')}</span>}
                      {inq.budget && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ fontFamily:'var(--font-mono)', background:'var(--color-bg-sunken)', color:'var(--color-text-secondary)' }}>{formatRupees(inq.budget, true)}</span>}
                    </div>
                    <p className="text-[9px] mt-2" style={{ color:'var(--color-text-muted)' }}>{relativeTime(inq.createdAt)}</p>
                    {col.status === 'negotiating' && (
                      <button className="mt-2 w-full text-[10px] font-medium py-1 rounded transition-colors hover:brightness-110" style={{ background:'var(--color-success-bg)', color:'var(--color-success)' }}>Convert to Booking</button>
                    )}
                  </div>
                ))}
                {col.status === 'new' && (
                  <button className="w-full rounded-lg border-2 border-dashed p-3 text-xs font-medium transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                    style={{ borderColor:'var(--color-border)', color:'var(--color-text-muted)' }}>+ Add inquiry</button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
