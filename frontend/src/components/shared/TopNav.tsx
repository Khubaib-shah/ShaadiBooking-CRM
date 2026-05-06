'use client'

import { usePathname } from 'next/navigation'
import { Search, Bell, Menu, Plus } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useUIStore } from '@/lib/store/uiStore'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from 'sonner'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/calendar': 'Event Calendar',
  '/bookings': 'Bookings',
  '/inquiries': 'Inquiries',
  '/payments': 'Payments',
  '/workers': 'Workforce',
  '/workers/salaries': 'Salary Management',
  '/staff-deployment': 'Staff Deployment',
  '/outsourcing': 'Outsourcing',
  '/expenses': 'Expenses',
  '/reports': 'Reports',
  '/reports/financial': 'Financial Report',
  '/reports/workers': 'Worker Report',
  '/reports/events': 'Event Performance',
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
        background: '#ffffff',
        borderColor: '#e9ecef',
      }}
    >
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="flex lg:hidden items-center justify-center h-8 w-8 rounded-md transition-colors hover:bg-[#f1f3f5]"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-[#74788d]" />
        </button>
        <div>
          <h1 className="text-[18px] font-semibold uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)', color: '#343a40' }}>
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right: search + bell + new booking + vendor */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => toast.info('Global search coming soon (Cmd+K)')}
          className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-[#f1f3f5]"
          aria-label="Search (Cmd+K)"
        >
          <Search className="h-4 w-4 text-[#74788d]" />
        </button>

        <button
          onClick={() => toast.info('You have 3 new notifications')}
          className="relative flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-[#f1f3f5]"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 text-[#74788d]" />
          <span className="absolute -top-0.5 -right-1 min-w-4 rounded-full px-1 text-[10px] font-semibold text-white" style={{ background: '#f46a6a' }}>3</span>
        </button>

        <button
          onClick={openNewBooking}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
          style={{
            background: '#556ee6',
            color: '#ffffff',
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          New Booking
        </button>

        {vendor && (
          <div className="hidden md:flex items-center gap-2 rounded-lg border px-3 py-1.5"
               style={{ borderColor: '#e9ecef', background: '#ffffff' }}>
            <span className="text-xs font-medium" style={{ color: '#74788d' }}>
              {vendor.name}
            </span>
          </div>
        )}
      </div>
    </header>
  )
}
