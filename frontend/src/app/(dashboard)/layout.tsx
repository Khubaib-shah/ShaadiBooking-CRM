'use client'

import { type ReactNode } from 'react'
import Sidebar from '@/components/shared/Sidebar'
import TopNav from '@/components/shared/TopNav'
import { useUIStore } from '@/lib/store/uiStore'
import { cn } from '@/lib/utils/cn'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { sidebarCollapsed } = useUIStore()

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <Sidebar />
      <TopNav />
      <main
        className={cn(
          'transition-all duration-300 px-6 py-6',
          sidebarCollapsed ? 'lg:ml-[60px]' : 'lg:ml-[var(--sidebar-width)]'
        )}
      >
        <div className="mx-auto" style={{ maxWidth: 'var(--content-max-w)' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
