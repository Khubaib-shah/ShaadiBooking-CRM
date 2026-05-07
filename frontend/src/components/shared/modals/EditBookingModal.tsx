'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { createBookingSchema } from '@/lib/utils/validation'
import { useUIStore } from '@/lib/store/uiStore'
import { useUpdateBooking, useBookingDetail } from '@/lib/hooks/useBookings'
import { EVENT_TYPE_LABELS } from '@/lib/utils/booking'
import { formatRupees } from '@/lib/utils/currency'
import ResponsiveModal from '../ResponsiveModal'
import type { z } from 'zod'

type BookingFormValues = z.infer<typeof createBookingSchema>

export default function EditBookingModal() {
  const { editBookingOpen, closeEditBooking, selectedEditBookingId } = useUIStore()
  const { data: bookingResponse, isLoading: isLoadingBooking } = useBookingDetail(selectedEditBookingId || '')
  const updateBooking = useUpdateBooking(selectedEditBookingId || '')

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(createBookingSchema),
  })

  // Pre-fill form when booking data loads
  useEffect(() => {
    if (bookingResponse?.data && editBookingOpen) {
      const b = bookingResponse.data
      reset({
        clientName: b.clientName,
        clientPhone: b.clientPhone,
        clientWhatsapp: b.clientWhatsapp || '',
        eventType: b.eventType as any,
        eventDate: b.eventDate.split('T')[0],
        venueName: b.venueName || '',
        guestCount: b.guestCount || 200,
        packageType: b.packageType as any,
        perHeadPrice: b.perHeadPrice || 0,
        totalContractValue: b.totalContractValue || 0,
        discountAmount: b.discountAmount || 0,
        discountReason: b.discountReason || '',
        status: b.status as any,
      })
    }
  }, [bookingResponse?.data, editBookingOpen, reset])

  // Watch fields for live financial equations
  const watched = watch()

  // Calculate net contract amount in real-time
  const calculatedTotal = watched.packageType === 'per_head'
    ? (Number(watched.guestCount || 0) * Number(watched.perHeadPrice || 0)) - Number(watched.discountAmount || 0)
    : Number(watched.totalContractValue || 0) - Number(watched.discountAmount || 0)

  const onSubmit = (data: BookingFormValues) => {
    // Inject the calculated total contract value
    const finalData = {
      ...data,
      totalContractValue: calculatedTotal,
    }

    updateBooking.mutate(finalData, {
      onSuccess: () => {
        reset()
        closeEditBooking()
      },
    })
  }

  return (
    <ResponsiveModal
      size="2xl"
      isOpen={editBookingOpen}
      onClose={closeEditBooking}
      title="Edit Booking Details"
      description="Update client information, event specifications, and financial quotation."
    >
      {isLoadingBooking ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)]" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Section: Client */}
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">Client Particulars</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Client Name</label>
                <input required {...register('clientName')} placeholder="e.g. Imran Khan" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                       style={{ background: 'var(--color-bg-sunken)', borderColor: errors.clientName ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text-primary)' }} />
                {errors.clientName && <span className="text-[10px] text-[var(--color-danger)] font-bold">{errors.clientName.message}</span>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Phone Number</label>
                <input required {...register('clientPhone')} placeholder="03xxxxxxxxx" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                       style={{ background: 'var(--color-bg-sunken)', borderColor: errors.clientPhone ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text-primary)' }} />
                {errors.clientPhone && <span className="text-[10px] text-[var(--color-danger)] font-bold">{errors.clientPhone.message}</span>}
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>WhatsApp Link Number (Optional)</label>
                <input {...register('clientWhatsapp')} placeholder="03xxxxxxxxx" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                       style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
              </div>
            </div>
          </div>

          {/* Section: Event Parameters */}
          <div className="space-y-3 pt-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">Event Settings</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Event Type</label>
                <select {...register('eventType')} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                        style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}>
                  {Object.entries(EVENT_TYPE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Event Date</label>
                <input required type="date" {...register('eventDate')} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                       style={{ background: 'var(--color-bg-sunken)', borderColor: errors.eventDate ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text-primary)' }} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Venue / Hall Location</label>
                <input required {...register('venueName')} placeholder="e.g. Shalimar Marquee" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                       style={{ background: 'var(--color-bg-sunken)', borderColor: errors.venueName ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text-primary)' }} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Guests Count</label>
                <input required type="number" {...register('guestCount', { valueAsNumber: true })} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                       style={{ background: 'var(--color-bg-sunken)', borderColor: errors.guestCount ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text-primary)' }} />
              </div>
            </div>
          </div>

          {/* Section: Financial Sheet */}
          <div className="rounded-xl p-4.5 space-y-4" style={{ background: 'var(--color-bg-sunken)', border: '1px solid var(--color-border)' }}>
            <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Financial Quotation & Pricing</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Pricing Quotation Model</label>
                <select {...register('packageType')} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                        style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}>
                  <option value="per_head">Per Head Charge Pricing</option>
                  <option value="fixed">Fixed Contract Value Sum</option>
                </select>
              </div>

              {watched.packageType === 'per_head' ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Price Per Head (Rs.)</label>
                  <input required type="number" {...register('perHeadPrice', { valueAsNumber: true })} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                         style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }} />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Fixed Base Price (Rs.)</label>
                  <input required type="number" {...register('totalContractValue', { valueAsNumber: true })} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                         style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }} />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Discount Allowed (Rs.)</label>
                <input type="number" {...register('discountAmount', { valueAsNumber: true })} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                       style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Contract Booking Status</label>
                <select {...register('status')} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                        style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}>
                  <option value="confirmed">Confirmed</option>
                  <option value="inquiry">Inquiry</option>
                  <option value="deposit_received">Deposit Received</option>
                  <option value="balance_pending">Balance Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Discount Reason (Optional)</label>
                <input {...register('discountReason')} placeholder="e.g. Special off-season discount" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                       style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
              </div>
            </div>

            {/* Dynamic live calculation output card */}
            <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--color-text-secondary)]">Calculated Contract Value Liability:</span>
              <span className="text-base font-black font-mono text-[var(--color-accent)]">{formatRupees(calculatedTotal)}</span>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={closeEditBooking} className="px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-border)] rounded-lg"
                    style={{ color: 'var(--color-text-secondary)' }}>
              Cancel
            </button>
            <button type="submit" disabled={updateBooking.isPending} className="flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-50"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}>
              {updateBooking.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      )}
    </ResponsiveModal>
  )
}
