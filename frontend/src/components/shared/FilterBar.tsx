import type { ReactNode } from 'react'

export default function FilterBar({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-[#e9ecef] bg-white p-3">{children}</div>
}

