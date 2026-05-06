'use client'

import ResponsiveModal from './ResponsiveModal'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  onCancel: () => void
  onConfirm: () => void
}

export default function ConfirmDialog({ open, title, description, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <ResponsiveModal
      isOpen={open}
      onClose={onCancel}
      title={title}
      description={description}
    >
      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={onCancel}
          className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-sunken)]"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-[var(--color-accent)] hover:brightness-110 px-4 py-2 text-xs font-semibold text-white shadow-sm"
        >
          Confirm
        </button>
      </div>
    </ResponsiveModal>
  )
}
