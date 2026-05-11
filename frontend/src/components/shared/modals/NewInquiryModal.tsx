'use client'

import { useForm } from 'react-hook-form'
import { X, Loader2 } from 'lucide-react'
import { useUIStore } from '@/lib/store/uiStore'
import { useCreateInquiry } from '@/lib/hooks/useInquiries'
import { EVENT_TYPE_LABELS } from '@/lib/utils/booking'
import ResponsiveModal from '../ResponsiveModal'
import { FormInput } from '../FormInput'
import { FormSelect } from '../FormSelect'

export default function NewInquiryModal() {
  const { newInquiryOpen, closeNewInquiry } = useUIStore()
  const createInquiry = useCreateInquiry()

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      clientName: '',
      clientPhone: '',
      eventType: 'barat',
      budget: '',
    }
  })

  const onSubmit = (data: any) => {
    createInquiry.mutate({
      clientName: data.clientName,
      clientPhone: data.clientPhone,
      eventType: data.eventType,
      budget: Number(data.budget) || 0
    }, {
      onSuccess: () => {
        reset()
        closeNewInquiry()
      }
    })
  }

  return (
    <ResponsiveModal
      isOpen={newInquiryOpen}
      onClose={closeNewInquiry}
      title="New Inquiry"
      description="Record a new wedding lead parameters and contact particulars to initiate tracking."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Client Name"
          register={register('clientName')}
          required
        />

        <FormInput
          label="Phone Number"
          register={register('clientPhone')}
          placeholder="03xxxxxxxxx"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Event Type"
            register={register('eventType')}
          >
            {Object.entries(EVENT_TYPE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </FormSelect>
          <FormInput
            label="Budget (Rs.)"
            type="number"
            register={register('budget')}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <button type="button" onClick={closeNewInquiry} className="px-4 py-2 text-sm font-semibold transition-colors hover:bg-[var(--color-border)] rounded-lg"
                  style={{ color: 'var(--color-text-secondary)' }}>
            Cancel
          </button>
          <button type="submit" disabled={createInquiry.isPending} className="flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-bold transition-all hover:brightness-110 active:scale-[0.97]"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}>
            {createInquiry.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Inquiry
          </button>
        </div>
      </form>
    </ResponsiveModal>
  )
}
