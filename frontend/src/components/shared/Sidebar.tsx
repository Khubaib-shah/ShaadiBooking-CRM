'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, CalendarDays, BookOpen, MessageSquare,
  CreditCard, Users, Settings2, ChevronLeft, X
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useUIStore } from '@/lib/store/uiStore'
import { useAuthStore } from '@/lib/store/authStore'

const NAV_ITEMS = [
  { label: 'MAIN', items: [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/calendar', label: 'Calendar', icon: CalendarDays },
    { href: '/bookings', label: 'Bookings', icon: BookOpen },
    { href: '/inquiries', label: 'Inquiries', icon: MessageSquare },
    { href: '/payments', label: 'Payments', icon: CreditCard },
  ]},
  { label: 'TEAM', items: [
    { href: '/staff', label: 'Staff', icon: Users },
    { href: '/settings', label: 'Settings', icon: Settings2 },
  ]},
]

export default function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { user, vendor } = useAuthStore()

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
          background: 'var(--color-bg-elevated)',
          borderColor: 'var(--color-border)',
        }}
      >
        {/* Logo */}
        <div className="flex h-[var(--topnav-height)] items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-1.5">
            {!sidebarCollapsed && (
              <>
                <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: '1.25rem', color: 'var(--color-text-primary)' }}>
                  Shaadi
                </span>
                <span style={{ color: 'var(--color-accent)', fontSize: '8px' }}>●</span>
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '1.25rem', color: 'var(--color-text-primary)' }}>
                  Book
                </span>
              </>
            )}
            {sidebarCollapsed && (
              <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: '1.25rem', color: 'var(--color-accent)' }}>
                S
              </span>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center h-7 w-7 rounded-md transition-colors hover:bg-[var(--color-border)]"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className={cn('h-4 w-4 text-[var(--color-text-muted)] transition-transform', sidebarCollapsed && 'rotate-180')} />
          </button>
          <button
            onClick={toggleSidebar}
            className="flex lg:hidden items-center justify-center h-7 w-7 rounded-md"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4 text-[var(--color-text-muted)]" />
          </button>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAV_ITEMS.map((section) => (
            <div key={section.label}>
              {!sidebarCollapsed && (
                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.12em]"
                   style={{ color: 'var(--color-text-muted)' }}>
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
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-[var(--text-sm)] font-medium transition-all duration-150',
                        active
                          ? 'text-[var(--color-accent)] border-l-2 border-[var(--color-accent)]'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border)]',
                        sidebarCollapsed && 'justify-center px-2'
                      )}
                      style={active ? { background: 'var(--color-accent-soft)' } : undefined}
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
        <div className="border-t px-3 py-4 space-y-3" style={{ borderColor: 'var(--color-border)' }}>
          {/* Subscription badge */}
          {!sidebarCollapsed && vendor?.subscription && (
            <div className="rounded-lg px-3 py-2 text-xs"
                 style={{
                   background: vendor.subscription.plan === 'trial' ? 'var(--color-warning-bg)' : 'var(--color-accent-soft)',
                   color: vendor.subscription.plan === 'trial' ? 'var(--color-warning)' : 'var(--color-accent)',
                 }}>
              {vendor.subscription.plan === 'trial'
                ? `Trial: ${vendor.subscription.daysRemaining} days left`
                : vendor.subscription.plan.charAt(0).toUpperCase() + vendor.subscription.plan.slice(1)
              }
            </div>
          )}
          {/* User */}
          <div className={cn('flex items-center gap-3', sidebarCollapsed && 'justify-center')}>
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
              style={{ background: 'var(--color-accent-soft)', color: 'var(--color-accent)' }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="truncate text-[var(--text-sm)] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  {user?.name || 'User'}
                </p>
                <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                  {user?.role || 'owner'}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
