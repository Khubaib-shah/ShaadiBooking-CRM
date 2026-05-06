'use client'

import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { useUIStore } from '@/lib/store/uiStore'
import { toast } from 'sonner'
import { EVENT_TYPE_LABELS } from '@/lib/utils/booking'

export default function NewInquiryModal() {
  const { newInquiryOpen, closeNewInquiry } = useUIStore()

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      clientName: '',
      clientPhone: '',
      eventType: 'barat',
      budget: '',
    }
  })

  const onSubmit = () => {
    // Mocking the creation logic since we're in development
    toast.success('Inquiry saved successfully')
    reset()
    closeNewInquiry()
  }

  return (
    <Dialog.Root open={newInquiryOpen} onOpenChange={(open) => !open && closeNewInquiry()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border p-0 shadow-2xl animate-in zoom-in-95 duration-200 focus:outline-none"
                        style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
          
          <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: 'var(--color-border)' }}>
            <Dialog.Title className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
              New Inquiry
            </Dialog.Title>
            <Dialog.Close className="rounded-full p-1.5 transition-colors hover:bg-[var(--color-border)]">
              <X className="h-4 w-4" style={{ color: 'var(--color-text-muted)' }} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Client Name</label>
              <input {...register('clientName')} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                     style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Phone Number</label>
              <input {...register('clientPhone')} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                     style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>

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
                <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Budget (Rs.)</label>
                <input type="number" {...register('budget')} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                       style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={closeNewInquiry} className="px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-border)] rounded-lg"
                      style={{ color: 'var(--color-text-secondary)' }}>
                Cancel
              </button>
              <button type="submit" className="rounded-lg px-6 py-2 text-sm font-semibold transition-all hover:brightness-110 active:scale-[0.97]"
                      style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}>
                Save Inquiry
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
