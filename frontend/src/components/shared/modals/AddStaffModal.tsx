'use client'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import ResponsiveModal from '../ResponsiveModal'

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
        <div className="space-y-1.5">
          <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Full Name</label>
          <input required {...register('name')} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                 style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Phone</label>
          <input required {...register('phone')} placeholder="03xxxxxxxxx" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                 style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Role</label>
          <input required {...register('role')} placeholder="e.g. Head Chef, Waiter" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                 style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
        </div>

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
