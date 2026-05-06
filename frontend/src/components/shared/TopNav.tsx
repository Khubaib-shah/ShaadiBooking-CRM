'use client'

import { usePathname } from 'next/navigation'
import { Search, Bell, Menu, Plus } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useUIStore } from '@/lib/store/uiStore'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from 'sonner'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/calendar': 'Calendar',
  '/bookings': 'Bookings',
  '/inquiries': 'Inquiries',
  '/payments': 'Payments',
  '/staff': 'Staff',
  '/settings': 'Settings',
}

export default function TopNav() {
  const pathname = usePathname()
  const { toggleSidebar, sidebarCollapsed, openNewBooking } = useUIStore()
  const { vendor } = useAuthStore()

  const pageTitle = PAGE_TITLES[pathname] || (pathname.startsWith('/bookings/') ? 'Booking Detail' : 'ShaadiBook')

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-[var(--topnav-height)] items-center justify-between border-b px-6 transition-all duration-300',
        sidebarCollapsed ? 'lg:ml-[60px]' : 'lg:ml-[var(--sidebar-width)]'
      )}
      style={{
        background: 'var(--color-bg)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="flex lg:hidden items-center justify-center h-8 w-8 rounded-md transition-colors hover:bg-[var(--color-border)]"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-[var(--color-text-secondary)]" />
        </button>
        <div>
          <h1 className="text-[var(--text-lg)] font-semibold" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right: search + bell + new booking + vendor */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => toast.info('Global search coming soon (Cmd+K)')}
          className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-[var(--color-border)]"
          aria-label="Search (Cmd+K)"
        >
          <Search className="h-4 w-4 text-[var(--color-text-secondary)]" />
        </button>

        <button
          onClick={() => toast.info('You have 3 new notifications')}
          className="relative flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-[var(--color-border)]"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 text-[var(--color-text-secondary)]" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full" style={{ background: 'var(--color-danger)' }} />
        </button>

        <button
          onClick={openNewBooking}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
          style={{
            background: 'var(--color-accent)',
            color: 'var(--color-text-inverse)',
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          New Booking
        </button>

        {vendor && (
          <div className="hidden md:flex items-center gap-2 rounded-lg border px-3 py-1.5"
               style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-elevated)' }}>
            <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              {vendor.name}
            </span>
          </div>
        )}
      </div>
    </header>
  )
}
