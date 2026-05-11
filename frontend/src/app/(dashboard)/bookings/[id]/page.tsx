'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import { ArrowLeft, Phone, MessageSquare, CheckCircle, Clock, Send, Check, Edit } from 'lucide-react'
import Link from 'next/link'
import StatusBadge from '@/components/shared/StatusBadge'
import PageWrapper from '@/components/shared/PageWrapper'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import ResponsiveModal from '@/components/shared/ResponsiveModal'
import { formatRupees } from '@/lib/utils/currency'
import { formatDate } from '@/lib/utils/dates'
import { EVENT_TYPE_LABELS } from '@/lib/utils/booking'
import { mockDb, type MockBooking } from '@/lib/utils/mockDb'
import { useUIStore } from '@/lib/store/uiStore'
import { toast } from 'sonner'

export default function BookingDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { openEditBooking, editBookingOpen } = useUIStore()
  const [b, setB] = useState<MockBooking | null>(null)
  const [isMenuEditing, setIsMenuEditing] = useState(false)

  // Operational note form state
  const [newNoteContent, setNewNoteContent] = useState('')
  const [newNoteType, setNewNoteType] = useState('ops')
  
  // Payment confirmation modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [activePaymentId, setActivePaymentId] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [paymentSlip, setPaymentSlip] = useState('')
  
  const masterMenu = useMemo(() => mockDb.getMenuItems(), [])

  // Load from persistent localstorage database
  useEffect(() => {
    if (id && !editBookingOpen) {
      const record = mockDb.getBookingById(id as string)
      if (record) {
        setB(record)
      } else {
        // Fallback to first if not found
        const first = mockDb.getBookings()[0]
        setB(first || null)
      }
    }
  }, [id, editBookingOpen])

  if (!b) {
    return (
      <PageWrapper>
        {/* Back Link Skeleton */}
        <LoadingSkeleton className="h-4 w-32 mb-6" />

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left Grid: 3/5 width */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Header Overview Card Skeleton */}
            <div className="rounded-xl border p-6 bg-[var(--color-bg-elevated)] shadow-sm border-[var(--color-border)]">
              <div className="flex justify-between mb-4">
                <div className="flex gap-2">
                  <LoadingSkeleton className="h-5 w-24" />
                  <LoadingSkeleton className="h-5 w-16" />
                </div>
                <LoadingSkeleton className="h-6 w-24" />
              </div>
              <LoadingSkeleton className="h-8 w-48 mb-3" />
              <LoadingSkeleton className="h-4 w-64 mb-5" />
              <div className="flex gap-3">
                <LoadingSkeleton className="h-6 w-24" />
                <LoadingSkeleton className="h-6 w-32" />
              </div>
            </div>

            {/* Payment Schedule Skeleton */}
            <div className="rounded-xl border p-6 bg-[var(--color-bg-elevated)] shadow-sm border-[var(--color-border)]">
              <LoadingSkeleton className="h-4 w-48 mb-6" />
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="flex gap-4">
                    <LoadingSkeleton className="h-6 w-6 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                        <LoadingSkeleton className="h-4 w-32" />
                        <LoadingSkeleton className="h-4 w-20" />
                      </div>
                      <LoadingSkeleton className="h-3 w-3/4" />
                      <div className="flex gap-2 mt-2">
                        <LoadingSkeleton className="h-6 w-24" />
                        <LoadingSkeleton className="h-6 w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Menu Skeleton */}
            <div className="rounded-xl border p-6 bg-[var(--color-bg-elevated)] shadow-sm border-[var(--color-border)]">
              <div className="flex justify-between mb-6">
                <LoadingSkeleton className="h-4 w-48" />
                <LoadingSkeleton className="h-4 w-16 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(i => (
                  <LoadingSkeleton key={i} className="h-16 rounded-xl" />
                ))}
              </div>
            </div>
            
            {/* Notes Skeleton */}
            <div className="rounded-xl border p-6 bg-[var(--color-bg-elevated)] shadow-sm border-[var(--color-border)] min-h-[400px]">
              <LoadingSkeleton className="h-4 w-48 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3">
                    <LoadingSkeleton className="h-7 w-7 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <LoadingSkeleton className="h-4 w-32" />
                      <LoadingSkeleton className="h-3 w-full" />
                      <LoadingSkeleton className="h-2 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Grid: 2/5 width */}
          <div className="lg:col-span-2 space-y-6 lg:sticky md:top-24 lg:self-start">
            
            {/* Client Profile Skeleton */}
            <div className="rounded-xl border p-5 bg-[var(--color-bg-elevated)] shadow-sm border-[var(--color-border)]">
              <LoadingSkeleton className="h-3 w-32 mb-6" />
              <div className="space-y-4">
                <LoadingSkeleton className="h-4 w-full" />
                <LoadingSkeleton className="h-4 w-5/6" />
              </div>
            </div>

            {/* Financial Ledger Skeleton */}
            <div className="rounded-xl border p-5 bg-[var(--color-bg-elevated)] shadow-sm border-[var(--color-border)]">
              <LoadingSkeleton className="h-3 w-40 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex justify-between">
                    <LoadingSkeleton className="h-3 w-1/2" />
                    <LoadingSkeleton className="h-3 w-1/4" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Danger Zone Skeleton */}
            <div className="rounded-xl border p-5 bg-[var(--color-bg-elevated)] shadow-sm border-[var(--color-border)]">
              <LoadingSkeleton className="h-3 w-32 mb-4" />
              <LoadingSkeleton className="h-3 w-full mb-2" />
              <LoadingSkeleton className="h-3 w-3/4 mb-6" />
              <LoadingSkeleton className="h-8 w-32" />
            </div>

          </div>
        </div>
      </PageWrapper>
    )
  }

  // Open the payment confirmation modal
  const openPaymentModal = (scheduleId: string) => {
    setActivePaymentId(scheduleId)
    setPaymentMethod('Cash')
    setPaymentSlip('')
    setPaymentModalOpen(true)
  }

  // Handle confirming the payment and saving slip/method
  const confirmPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activePaymentId || !b) return

    const updatedSchedules = b.paymentSchedules.map(ps => {
      if (ps._id === activePaymentId) {
        return { 
          ...ps, 
          isPaid: true, 
          paidAt: new Date().toISOString(),
          paymentMethod: paymentMethod as any,
          paymentSlip: paymentMethod !== 'Cash' ? paymentSlip : undefined
        }
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
    setPaymentModalOpen(false)
    toast.success('Payment successfully received and updated!')
  }

  // Handle launching prefilled WhatsApp reminder to client
  const handleSendReminder = (amount: number, type: string) => {
    const cleanPhone = b.clientPhone.replace(/[^0-9]/g, '')
    // Pre-fill premium customized Urdu/English WhatsApp template
    const msg = `السلام عليكم ${b.client} Saheb, gentle reminder from Royal Caterers. Your installment of ${formatRupees(amount)} for the ${EVENT_TYPE_LABELS[b.type] || b.type} event on ${formatDate(b.date, 'DD MMMM YYYY')} is due. Kindly let us know when to collect, or transfer directly to Bank Al Habib Acc: 1042-0095-11042. JazakAllah!`

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

  const toggleMenuItem = (item: any) => {
    if (!b) return
    const currentMenu = b.menu || []
    const exists = currentMenu.find(m => m._id === item._id)

    let updatedMenu
    if (exists) {
      updatedMenu = currentMenu.filter(m => m._id !== item._id)
    } else {
      updatedMenu = [...currentMenu, item]
    }

    // Dynamic Per Head Booking Pricing calculation
    const itemPrice = Number(item.price) || 0
    const priceDiff = exists ? -itemPrice : itemPrice
    const contractDiff = priceDiff * (b.guests || 0)
    
    const updatedPerHeadPrice = (b.perHeadPrice || 0) + priceDiff
    const updatedContract = (b.contract || 0) + contractDiff
    const updatedOutstanding = Math.max(0, updatedContract - (b.paid || 0))

    // Automatically adjust the pending balance schedule if one exists
    const updatedSchedules = b.paymentSchedules.map(ps => {
      if (ps.type === 'balance' && !ps.isPaid) {
        return { ...ps, amountDue: Math.max(0, ps.amountDue + contractDiff) }
      }
      return ps
    })

    const updatedBooking = { 
      ...b, 
      menu: updatedMenu,
      perHeadPrice: updatedPerHeadPrice,
      contract: updatedContract,
      outstanding: updatedOutstanding,
      paymentSchedules: updatedSchedules
    }
    
    mockDb.saveBooking(updatedBooking as MockBooking)
    setB(updatedBooking as MockBooking)
    toast.success(`Menu updated! Contract adjusted by ${formatRupees(Math.abs(contractDiff))}`)
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNoteContent.trim() || !b) return

    const newNote = {
      _id: 'n_' + Date.now(),
      content: newNoteContent,
      noteType: newNoteType as any,
      createdBy: 'Zeeshan Admin',
      createdAt: new Date().toISOString()
    }

    const updatedBooking = { ...b, notes: [...(b.notes || []), newNote] }
    mockDb.saveBooking(updatedBooking as MockBooking)
    setB(updatedBooking as MockBooking)
    setNewNoteContent('')
    toast.success('Operational note added successfully!')
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
          <div className="rounded-xl border p-6 bg-[var(--color-bg-elevated)] shadow-sm" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black font-mono text-[var(--color-accent)]">{b.ref}</span>
                <StatusBadge status={b.status} />
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                  {EVENT_TYPE_LABELS[b.type] || b.type}
                </span>
              </div>
              <button
                onClick={() => openEditBooking(b._id)}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md border transition-all hover:bg-[var(--color-bg-sunken)] active:scale-95"
                style={{ color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)' }}
              >
                <Edit className="h-3 w-3" /> Edit Details
              </button>
            </div>
            <h2 className="text-xl font-bold mb-1 text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
              {b.client}
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {formatDate(b.date, 'dddd, DD MMMM YYYY')} · {b.venue}
            </p>
            <div className="flex gap-3 mt-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--color-bg-sunken)] text-[var(--color-text-secondary)]">{b.guests} guests</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--color-bg-sunken)] text-[var(--color-text-secondary)]">Per head: {formatRupees(b.perHeadPrice || 0)}</span>
            </div>
          </div>

          {/* Stateful Payment Timeline Tracker */}
          <div className="rounded-xl border p-6 bg-[var(--color-bg-elevated)] shadow-sm" style={{ borderColor: 'var(--color-border)' }}>
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
                    <div className="text-xs mt-0.5 text-[var(--color-text-muted)] font-medium">
                      {ps.isPaid ? (
                        <>
                          <span className="block mb-0.5">Received on {formatDate(ps.paidAt || b.date)}</span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[var(--color-bg-sunken)] border border-[var(--color-border)]">
                            {ps.paymentMethod || 'Cash'}
                          </span>
                          {ps.paymentSlip && (
                            <span className="inline-flex items-center px-1.5 py-0.5 ml-1 rounded text-[9px] font-bold uppercase tracking-wider text-[var(--color-accent)] bg-[var(--color-accent-soft)]">
                              Ref: {ps.paymentSlip}
                            </span>
                          )}
                        </>
                      ) : (
                        `Outstanding. Due before ${formatDate(ps.dueDate || b.date)}`
                      )}
                    </div>

                    {/* Action buttons work dynamically on click! */}
                    {!ps.isPaid && (
                      <div className="flex gap-2 mt-3 animate-fade-in">
                        <button
                          onClick={() => openPaymentModal(ps._id)}
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

          {/* Wedding Menu & Dish Selection */}
          <div className="rounded-xl border p-6 bg-[var(--color-bg-elevated)] shadow-sm" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between border-b pb-2 mb-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)]">Wedding Menu & Dish Selection</h3>
              <span className="text-[10px] font-bold bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-2 py-0.5 rounded-full">
                {b.menu?.length || 0} items
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {isMenuEditing ? (
                masterMenu.map((item) => {
                  const isSelected = b.menu?.some(m => m._id === item._id)
                  return (
                    <button
                      key={item._id}
                      onClick={() => toggleMenuItem(item)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isSelected
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]'
                          : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-sunken)]'
                        }`}
                    >
                      <div className="text-lg">
                        {item.category === 'main' && '🍖'}
                        {item.category === 'sweet' && '🍰'}
                        {item.category === 'bread' && '🫓'}
                        {item.category === 'drink' && '🥤'}
                        {item.category === 'starter' && '🥗'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[var(--color-text-primary)]">{item.name}</p>
                        <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">{item.category}</p>
                      </div>
                      {isSelected && <CheckCircle className="h-4 w-4 text-[var(--color-accent)]" />}
                    </button>
                  )
                })
              ) : (
                b.menu?.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-sunken)]/30 group hover:border-[var(--color-accent)] transition-all">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] shadow-sm group-hover:bg-[var(--color-accent-soft)] group-hover:text-[var(--color-accent)] transition-colors">
                      {item.category === 'main' && '🍖'}
                      {item.category === 'sweet' && '🍰'}
                      {item.category === 'bread' && '🫓'}
                      {item.category === 'drink' && '🥤'}
                      {item.category === 'starter' && '🥗'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--color-text-primary)]">{item.name}</p>
                      <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">{item.category}</p>
                    </div>
                  </div>
                ))
              )}

              {(!isMenuEditing && (!b.menu || b.menu.length === 0)) && (
                <div className="sm:col-span-2 text-center py-8 border-2 border-dashed border-[var(--color-border)] rounded-xl">
                  <p className="text-xs font-bold text-[var(--color-text-muted)] mb-2">No dishes selected for this event yet.</p>
                  <button
                    onClick={() => setIsMenuEditing(true)}
                    className="text-[10px] font-black uppercase tracking-wider px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg hover:brightness-110"
                  >
                    + Open Menu Selection
                  </button>
                </div>
              )}
            </div>

            {!isMenuEditing && b.menu && b.menu.length > 0 && (
              <button
                onClick={() => setIsMenuEditing(true)}
                className="w-full mt-4 text-center py-2 text-[10px] font-black uppercase tracking-wider border border-dashed border-[var(--color-border-mid)] text-[var(--color-text-muted)] rounded-lg hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
              >
                + Edit Menu Selection
              </button>
            )}

            {isMenuEditing && (
              <button
                onClick={() => setIsMenuEditing(false)}
                className="w-full mt-4 text-center py-2 text-[10px] font-black uppercase tracking-wider bg-[var(--color-text-primary)] text-white rounded-lg hover:brightness-110 transition-all"
              >
                Save Menu Selection
              </button>
            )}
          </div>

          {/* Notes Card */}
          
        </div>

        {/* Right Grid: 2/5 width */}
        <div className="lg:col-span-2 space-y-6 lg:self-start">
          {/* Client profile */}
          <div className="rounded-xl border p-5 bg-[var(--color-bg-elevated)] shadow-sm" style={{ borderColor: 'var(--color-border)' }}>
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
          <div className="rounded-xl border p-5 bg-[var(--color-bg-elevated)] shadow-sm" style={{ borderColor: 'var(--color-border)' }}>
            <h4 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] border-b pb-2 mb-4">Financial Ledger Sheet</h4>
            <div className="space-y-3">
              {[
                { l: 'Base Contract Sum', v: b.contract },
                { l: 'Total Expenses', v: (b as any).expenses || 0 },
                { l: 'Net Profit Margin', v: b.contract - ((b as any).expenses || 0) },
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

          {/* Important Actions */}
          <div className="rounded-xl border p-5" style={{ borderColor: 'var(--color-danger)', background: 'var(--color-danger-bg)' }}>
            <h4 className="text-xs font-black uppercase tracking-wider text-[var(--color-danger)] mb-2">Cancel Booking</h4>
            <p className="text-xs text-[var(--color-text-secondary)] mb-4 leading-normal">
              Canceling this booking will release the hall and remove all assigned staff. Use caution.
            </p>
            {b.status === 'cancelled' ? (
              <span className="text-xs font-black uppercase tracking-wider px-3 py-2 rounded bg-[var(--color-bg-elevated)] text-[var(--color-danger)] border border-[var(--color-danger)]">
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
          <div className="rounded-xl border p-6 bg-[var(--color-bg-elevated)] shadow-sm flex flex-col " style={{ borderColor: 'var(--color-border)', minHeight: '320px' }}>
            <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] border-b pb-2 mb-4">Event Setup Notes</h3>
            
            <div className="flex-1 overflow-y-auto pr-1 mb-4 custom-scrollbar !max-h-[250px]">
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

            {/* Add Note Input Area */}
            <form onSubmit={handleAddNote} className="mt-auto pt-4 border-t border-[var(--color-border)]">
               
              <div className="flex gap-2">
                 <select
                  value={newNoteType}
                  onChange={e => setNewNoteType(e.target.value)}
                  className="text-xs font-bold rounded-lg border px-2 py-1.5 focus:outline-none focus:border-[var(--color-accent)] cursor-pointer"
                  style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                >
                  <option value="ops">Ops</option>
                  <option value="menu">Menu</option>
                  <option value="decor">Decor</option>
                  <option value="billing">Billing</option>
                </select>
                <input
                  type="text"
                  value={newNoteContent}
                  onChange={e => setNewNoteContent(e.target.value)}
                  placeholder="Type a new operational note..."
                  className="flex-1 text-xs font-medium rounded-lg border px-3 py-2 focus:outline-none focus:border-[var(--color-accent)]"
                  style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                />
                <button
                  type="submit"
                  disabled={!newNoteContent.trim()}
                  className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors hover:brightness-110 disabled:opacity-50"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}
                >
                  Add Note
                </button>
              </div>
            </form>
          </div>
        </div>
        

      </div>

      {/* Payment Confirmation Modal */}
      <ResponsiveModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Record Received Payment"
        description="Verify the payment method and attach any transaction slips."
        size="lg"
      >
        <form onSubmit={confirmPayment} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--color-text-secondary)]">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
              style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
            >
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="EasyPaisa">EasyPaisa</option>
              <option value="JazzCash">JazzCash</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {paymentMethod !== 'Cash' && (
            <div className="space-y-1.5 animate-fade-in">
              <label className="text-xs font-semibold text-[var(--color-text-secondary)]">Attach Payment Slip (Image / PDF)</label>
              <div className="relative">
                <input
                  required
                  type="file"
                  accept="image/png, image/jpeg, application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setPaymentSlip(file.name)
                    } else {
                      setPaymentSlip('')
                    }
                  }}
                  className="w-full text-xs text-[var(--color-text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-wider file:bg-[var(--color-accent-soft)] file:text-[var(--color-accent)] hover:file:brightness-110 cursor-pointer rounded-lg border py-1.5 pl-1.5 focus:outline-none focus:border-[var(--color-accent)]"
                  style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)' }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-end pt-4 mt-2 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => setPaymentModalOpen(false)}
              className="px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-bg-sunken)] rounded-lg text-[var(--color-text-secondary)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg px-6 py-2 text-sm font-bold uppercase tracking-wider transition-all hover:brightness-110 active:scale-[0.97]"
              style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}
            >
              Confirm Receipt
            </button>
          </div>
        </form>
      </ResponsiveModal>
    </PageWrapper>
  )
}
