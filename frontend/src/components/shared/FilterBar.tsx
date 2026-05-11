import type { ReactNode } from 'react'

export default function FilterBar({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3">{children}</div>
}

