'use client'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import ResponsiveModal from '../ResponsiveModal'
import { FormInput } from '../FormInput'

interface AddStaffFormValues {
  name: string
  phone: string
  role: string
}

export default function AddStaffModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { register, handleSubmit, reset } = useForm<AddStaffFormValues>({
    defaultValues: {
      name: '',
      phone: '',
      role: '',
    }
  })

  const onSubmit = (data: AddStaffFormValues) => {
    toast.success(`${data.name} added to staff list`)
    reset()
    onOpenChange(false)
  }

  return (
    <ResponsiveModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Add Staff Member"
      description="Register a new crew member, logistics assistant, or operational vendor."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Full Name"
          register={register('name')}
          required
        />

        <FormInput
          label="Phone"
          register={register('phone')}
          placeholder="03xxxxxxxxx"
          required
        />

        <FormInput
          label="Role"
          register={register('role')}
          placeholder="e.g. Head Chef, Waiter"
          required
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <button type="button" onClick={() => onOpenChange(false)} className="px-4 py-2 text-sm font-semibold transition-colors hover:bg-[var(--color-border)] rounded-lg"
                  style={{ color: 'var(--color-text-secondary)' }}>
            Cancel
          </button>
          <button type="submit" className="rounded-lg px-6 py-2 text-sm font-bold transition-all hover:brightness-110 active:scale-[0.97]"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}>
            Add Member
          </button>
        </div>
      </form>
    </ResponsiveModal>
  )
}
