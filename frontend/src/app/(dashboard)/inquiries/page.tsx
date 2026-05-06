'use client'

import { useState } from 'react'
import { Plus, Phone, Calendar, Loader2, ArrowRight } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import { EVENT_TYPE_LABELS } from '@/lib/utils/booking'
import { formatRupees } from '@/lib/utils/currency'
import { formatDate, relativeTime } from '@/lib/utils/dates'
import { useUIStore } from '@/lib/store/uiStore'
import { useInquiries, useUpdateInquiryStatus, useConvertToBooking } from '@/lib/hooks/useInquiries'
import type { InquiryStatus } from '@/types/inquiry.types'
import { toast } from 'sonner'

const COLUMNS: { status: InquiryStatus; label: string }[] = [
  { status: 'new', label: 'New' },
  { status: 'contacted', label: 'Contacted' },
  { status: 'negotiating', label: 'Negotiating' },
  { status: 'converted', label: 'Converted / Lost' },
]

export default function InquiriesPage() {
  const { openNewInquiry } = useUIStore()
  
  // React query hooks
  const { data: resp, isLoading } = useInquiries()
  const updateStatus = useUpdateInquiryStatus()
  const convertToBooking = useConvertToBooking()

  const inquiries = resp?.data || []

  // Drag visual highlight states
  const [dragOverCol, setDragOverCol] = useState<string | null>(null)

  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, colStatus: string) => {
    e.preventDefault()
    if (dragOverCol !== colStatus) {
      setDragOverCol(colStatus)
    }
  }

  const handleDragLeave = () => {
    setDragOverCol(null)
  }

  const handleDrop = async (e: React.DragEvent, targetStatus: InquiryStatus) => {
    e.preventDefault()
    setDragOverCol(null)
    const id = e.dataTransfer.getData('text/plain')
    if (!id) return

    const targetInq = inquiries.find(i => i._id === id)
    if (!targetInq) return

    if (targetInq.status === targetStatus) return

    updateStatus.mutate({ id, status: targetStatus }, {
      onSuccess: () => {
        toast.success(`Inquiry moved to ${targetStatus.toUpperCase()}`)
      }
    })
  }

  const handleConvert = (id: string) => {
    convertToBooking.mutate(id)
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Inquiries"
        description="Track and convert potential wedding bookings through a visual CRM pipeline"
        actions={
          <button
            onClick={openNewInquiry}
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all hover:brightness-110 active:scale-[0.97]"
            style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}
          >
            <Plus className="h-4 w-4" /> New Inquiry
          </button>
        }
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {COLUMNS.map((col) => {
            const items = col.status === 'converted'
              ? inquiries.filter(i => i.status === 'converted' || i.status === 'lost')
              : inquiries.filter(i => i.status === col.status)

            const isOver = dragOverCol === col.status

            return (
              <div
                key={col.status}
                onDragOver={(e) => handleDragOver(e, col.status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.status)}
                className={`rounded-xl border p-3 min-h-[450px] transition-all duration-200 ${
                  isOver ? 'bg-[var(--color-accent-soft)]/20 border-dashed border-[var(--color-accent)]' : 'bg-[var(--color-bg-sunken)]/40 border-transparent'
                }`}
                style={{ borderColor: isOver ? 'var(--color-accent)' : 'var(--color-border)' }}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)]">{col.label}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                    {items.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-2.5">
                  {items.map((inq) => (
                    <div
                      key={inq._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, inq._id)}
                      className="rounded-xl border p-4 shadow-xs transition-all duration-150 hover:-translate-y-[1px] hover:shadow-md cursor-grab active:cursor-grabbing bg-white group"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <div className="flex justify-between items-center gap-2">
                        <p className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors truncate">{inq.clientName}</p>
                        
                        {/* Mobile Screen Quick Move Dropdown Selector */}
                        <div className="md:hidden shrink-0">
                          <select
                            value={inq.status}
                            onChange={(e) => {
                              const nextStatus = e.target.value as InquiryStatus
                              updateStatus.mutate({ id: inq._id, status: nextStatus }, {
                                onSuccess: () => {
                                  toast.success(`Inquiry moved to ${nextStatus.toUpperCase()}`)
                                }
                              })
                            }}
                            className="text-[10px] font-bold rounded border bg-[var(--color-bg-sunken)] px-1.5 py-0.5 text-[var(--color-text-secondary)] border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent)]"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="negotiating">Negotiate</option>
                            <option value="converted">Convert</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-xs text-[var(--color-text-secondary)]">
                        <Phone className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
                        <span className="font-mono">{inq.clientPhone}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                          {EVENT_TYPE_LABELS[inq.eventType] || inq.eventType}
                        </span>
                        {inq.tentativeDate && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-[var(--color-bg-sunken)] text-[var(--color-text-secondary)] flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-[var(--color-text-muted)]" />
                            {formatDate(inq.tentativeDate, 'dd MMM')}
                          </span>
                        )}
                        {inq.budget && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-[var(--color-bg-sunken)] text-[var(--color-text-primary)] font-mono">
                            {formatRupees(inq.budget, true)}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[var(--color-border)] flex items-center justify-between text-[10px] text-[var(--color-text-muted)]">
                        <span>{relativeTime(inq.createdAt)}</span>
                        {inq.status === 'negotiating' && (
                          <button
                            onClick={() => handleConvert(inq._id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black bg-[#34c38f]/10 text-[#34c38f] hover:bg-[#34c38f] hover:text-white transition-all active:scale-95"
                          >
                            Convert <ArrowRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {items.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-[var(--color-border)] rounded-xl text-center">
                      <p className="text-xs text-[var(--color-text-muted)] font-medium">Drag inquiry cards here</p>
                    </div>
                  )}

                  {col.status === 'new' && (
                    <button
                      onClick={openNewInquiry}
                      className="w-full rounded-xl border border-dashed p-3 text-xs font-semibold text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all bg-white/50 hover:bg-white"
                    >
                      + Add Inquiry
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </PageWrapper>
  )
}
