import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-[18px] font-semibold uppercase tracking-wide" style={{ color: '#343a40' }}>
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-[13px] font-medium" style={{ color: '#74788d' }}>
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 mt-3 sm:mt-0">{actions}</div>}
    </div>
  )
}
