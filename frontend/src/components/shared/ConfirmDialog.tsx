'use client'

import * as Dialog from '@radix-ui/react-dialog'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  onCancel: () => void
  onConfirm: () => void
}

export default function ConfirmDialog({ open, title, description, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#e9ecef] bg-white p-5">
          <Dialog.Title className="text-[16px] font-semibold text-[#343a40]">{title}</Dialog.Title>
          <Dialog.Description className="mt-2 text-[13px] text-[#74788d]">{description}</Dialog.Description>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={onCancel} className="rounded-lg border border-[#e9ecef] px-3 py-2 text-[12px] font-semibold text-[#74788d]">Cancel</button>
            <button onClick={onConfirm} className="rounded-lg bg-[#556ee6] px-3 py-2 text-[12px] font-semibold text-white">Confirm</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

