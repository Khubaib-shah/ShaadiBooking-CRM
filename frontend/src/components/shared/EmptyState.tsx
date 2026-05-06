import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl mb-4"
        style={{ background: 'var(--color-accent-soft)' }}
      >
        <Icon className="h-6 w-6" style={{ color: 'var(--color-accent)' }} />
      </div>
      <h3 className="text-[var(--text-lg)]" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-[var(--text-sm)]" style={{ color: 'var(--color-text-secondary)' }}>
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
