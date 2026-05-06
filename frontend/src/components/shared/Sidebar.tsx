'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, CalendarDays, BookOpen, MessageSquare, CreditCard, Users, Settings2, ChevronLeft, X, ClipboardList, ExternalLink, Receipt, BarChart3, LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useUIStore } from '@/lib/store/uiStore'
import { useAuthStore } from '@/lib/store/authStore'
import { useLogout } from '@/lib/hooks/useLogout'

const NAV_ITEMS = [
  { label: 'MAIN', items: [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/calendar', label: 'Event Calendar', icon: CalendarDays },
  ]},
  { label: 'BOOKINGS', items: [
    { href: '/bookings', label: 'Bookings', icon: BookOpen },
    { href: '/inquiries', label: 'Inquiries', icon: MessageSquare },
    { href: '/payments', label: 'Payments', icon: CreditCard },
  ]},
  { label: 'WORKFORCE', items: [
    { href: '/workers', label: 'Workers', icon: Users },
    { href: '/staff-deployment', label: 'Staff Deployment', icon: ClipboardList },
  ]},
  { label: 'SERVICES', items: [
    { href: '/outsourcing', label: 'Outsourcing', icon: ExternalLink },
    { href: '/expenses', label: 'Expenses', icon: Receipt },
  ]},
  { label: 'ANALYTICS', items: [
    { href: '/reports', label: 'Reports', icon: BarChart3 },
  ]},
  { label: 'ACCOUNT', items: [
    { href: '/settings', label: 'Settings', icon: Settings2 },
  ]},
]

export default function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useUIStore()
  const { user, vendor } = useAuthStore()
  const { logout } = useLogout()

  // Auto-collapse sidebar on route change for mobile screens
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarCollapsed(true)
    }
  }, [pathname, setSidebarCollapsed])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full flex-col border-r transition-all duration-300',
          'lg:translate-x-0',
          sidebarCollapsed ? '-translate-x-full lg:w-[60px]' : 'translate-x-0 w-[var(--sidebar-width)]'
        )}
        style={{
          background: '#2a3042',
          borderColor: '#343a52',
        }}
      >
        {/* Logo */}
        <div className="flex h-[var(--topnav-height)] items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-1.5">
            {!sidebarCollapsed && (
              <>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.25rem', color: '#ffffff' }}>
                  Shaadi
                </span>
                <span style={{ color: '#556ee6', fontSize: '8px' }}>●</span>
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1.25rem', color: '#ffffff' }}>
                  Book
                </span>
              </>
            )}
            {sidebarCollapsed && (
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.25rem', color: '#556ee6' }}>
                S
              </span>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center h-7 w-7 rounded-md transition-colors hover:bg-[#2e3548]"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className={cn('h-4 w-4 text-[#a6b0cf] transition-transform', sidebarCollapsed && 'rotate-180')} />
          </button>
          <button
            onClick={toggleSidebar}
            className="flex lg:hidden items-center justify-center h-7 w-7 rounded-md"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4 text-[#a6b0cf]" />
          </button>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAV_ITEMS.map((section) => (
            <div key={section.label}>
              {!sidebarCollapsed && (
                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#6a7187' }}>
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150',
                        active
                          ? 'text-white border-l-[3px] border-[#556ee6]'
                          : 'text-[#a6b0cf] hover:text-white hover:bg-[#2e3548]',
                        sidebarCollapsed && 'justify-center px-2'
                      )}
                      style={active ? { background: '#374151' } : undefined}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="border-t px-3 py-4 space-y-3" style={{ borderColor: '#343a52' }}>
          {/* Subscription badge */}
          {!sidebarCollapsed && vendor?.subscription && (
            <div className="rounded-lg px-3 py-2 text-xs"
                 style={{
                   background: vendor.subscription.plan === 'trial' ? '#fff3cd' : '#374151',
                   color: vendor.subscription.plan === 'trial' ? '#f1b44c' : '#ffffff',
                 }}>
              {vendor.subscription.plan === 'trial'
                ? `Trial: ${vendor.subscription.daysRemaining} days left`
                : vendor.subscription.plan.charAt(0).toUpperCase() + vendor.subscription.plan.slice(1)
              }
            </div>
          )}
          {/* User & Logout */}
          <div className={cn('flex items-center justify-between gap-3', sidebarCollapsed && 'flex-col')}>
            <div className={cn('flex items-center gap-3', sidebarCollapsed && 'justify-center')}>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0"
                style={{ background: '#374151', color: '#ffffff' }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium" style={{ color: '#ffffff' }}>
                    {user?.name || 'User'}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: '#a6b0cf' }}>
                    {user?.role || 'owner'}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={logout}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-red-500/10 hover:text-red-500",
                !sidebarCollapsed && "ml-auto"
              )}
              title="Logout"
            >
              <LogOut className="h-4 w-4" style={{ color: '#a6b0cf' }} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
