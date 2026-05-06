'use client'

import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { toast } from 'sonner'
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
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border p-0 shadow-2xl"
                        style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
          
          <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: 'var(--color-border)' }}>
            <Dialog.Title className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
              Add Staff Member
            </Dialog.Title>
            <Dialog.Close className="rounded-full p-1.5 transition-colors hover:bg-[var(--color-border)]">
              <X className="h-4 w-4" style={{ color: 'var(--color-text-muted)' }} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Full Name</label>
              <input {...register('name')} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                     style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Phone</label>
              <input {...register('phone')} placeholder="03xxxxxxxxx" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                     style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Role</label>
              <input {...register('role')} placeholder="e.g. Head Chef, Waiter" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                     style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => onOpenChange(false)} className="px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-border)] rounded-lg"
                      style={{ color: 'var(--color-text-secondary)' }}>
                Cancel
              </button>
              <button type="submit" className="rounded-lg px-6 py-2 text-sm font-semibold transition-all hover:brightness-110 active:scale-[0.97]"
                      style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}>
                Add Member
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
