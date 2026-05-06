import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center px-6 py-16 text-center">
      <div
        className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl"
        style={{ background: 'var(--color-accent-soft)' }}
      >
        <Icon className="h-10 w-10" style={{ color: 'var(--color-accent)' }} />
      </div>
      <h3 className="text-[16px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-[13px]" style={{ color: 'var(--color-text-muted)' }}>
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
          style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
