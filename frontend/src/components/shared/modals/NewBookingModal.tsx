'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Calendar as CalendarIcon, Loader2 } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { createBookingSchema } from '@/lib/utils/validation'
import { useUIStore } from '@/lib/store/uiStore'
import { useCreateBooking } from '@/lib/hooks/useBookings'
import { EVENT_TYPE_LABELS } from '@/lib/utils/booking'
import type { z } from 'zod'

type BookingFormValues = z.infer<typeof createBookingSchema>

export default function NewBookingModal() {
  const { newBookingOpen, closeNewBooking } = useUIStore()
  const createBooking = useCreateBooking()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      clientName: '',
      clientPhone: '',
      clientWhatsapp: '',
      eventType: 'barat',
      eventDate: '',
      venueName: '',
      guestCount: 0,
      packageType: 'per_head',
      perHeadPrice: 0,
      totalContractValue: 0,
      discountAmount: 0,
      discountReason: '',
      status: 'confirmed',
      paymentSchedules: [{ type: 'deposit', amountDue: 0, dueDate: '' }],
    },
  })

  const onSubmit = (data: BookingFormValues) => {
    createBooking.mutate(data, {
      onSuccess: () => {
        reset()
        closeNewBooking()
      },
    })
  }

  return (
    <Dialog.Root open={newBookingOpen} onOpenChange={(open) => !open && closeNewBooking()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl border p-0 shadow-2xl animate-in zoom-in-95 duration-200 focus:outline-none"
                        style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
          
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: 'var(--color-border)' }}>
            <div>
              <Dialog.Title className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
                New Booking
              </Dialog.Title>
              <Dialog.Description className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                Enter event details to create a new contract.
              </Dialog.Description>
            </div>
            <Dialog.Close className="rounded-full p-1.5 transition-colors hover:bg-[var(--color-border)]">
              <X className="h-4 w-4" style={{ color: 'var(--color-text-muted)' }} />
            </Dialog.Close>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="max-h-[80vh] overflow-y-auto p-6 space-y-6">
            
            {/* Section: Client */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Client Name</label>
                <input {...register('clientName')} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                       style={{ background: 'var(--color-bg-sunken)', borderColor: errors.clientName ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text-primary)' }} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Phone Number</label>
                <input {...register('clientPhone')} placeholder="03xxxxxxxxx" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                       style={{ background: 'var(--color-bg-sunken)', borderColor: errors.clientPhone ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text-primary)' }} />
              </div>
            </div>

            {/* Section: Event */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Event Type</label>
                <select {...register('eventType')} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                        style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}>
                  {Object.entries(EVENT_TYPE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Event Date</label>
                <input type="date" {...register('eventDate')} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                       style={{ background: 'var(--color-bg-sunken)', borderColor: errors.eventDate ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text-primary)' }} />
              </div>
            </div>

            {/* Section: Venue & Guests */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Venue Name</label>
                <input {...register('venueName')} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                       style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Guest Count</label>
                <input type="number" {...register('guestCount', { valueAsNumber: true })} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                       style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
              </div>
            </div>

            {/* Section: Financials */}
            <div className="rounded-lg p-4 space-y-4" style={{ background: 'var(--color-bg-sunken)', border: '1px solid var(--color-border)' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Financial Summary</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Total Contract Value (Rs.)</label>
                  <input type="number" {...register('totalContractValue', { valueAsNumber: true })} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                         style={{ background: 'var(--color-bg-elevated)', borderColor: errors.totalContractValue ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Status</label>
                  <select {...register('status')} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                          style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}>
                    <option value="inquiry">Inquiry</option>
                    <option value="confirmed">Confirmed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={closeNewBooking} className="px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-border)] rounded-lg"
                      style={{ color: 'var(--color-text-secondary)' }}>
                Cancel
              </button>
              <button type="submit" disabled={createBooking.isPending} className="flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-50"
                      style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}>
                {createBooking.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Booking
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
