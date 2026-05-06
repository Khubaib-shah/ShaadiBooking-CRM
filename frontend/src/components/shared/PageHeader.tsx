import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h2 className="text-[var(--text-2xl)]" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-[var(--text-sm)]" style={{ color: 'var(--color-text-secondary)' }}>
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 mt-3 sm:mt-0">{actions}</div>}
    </div>
  )
}
