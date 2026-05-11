'use client'

import { type ReactNode } from 'react'
import Sidebar from '@/components/shared/Sidebar'
import TopNav from '@/components/shared/TopNav'
import MobileBottomNav from '@/components/shared/MobileBottomNav'
import { useUIStore } from '@/lib/store/uiStore'
import { cn } from '@/lib/utils/cn'
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { sidebarCollapsed } = useUIStore()
  useKeyboardShortcuts()

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <Sidebar />
      <TopNav />
      <MobileBottomNav />
      <main
        className={cn(
          'px-6 py-6 pb-20 transition-all duration-300 md:pb-6',
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
