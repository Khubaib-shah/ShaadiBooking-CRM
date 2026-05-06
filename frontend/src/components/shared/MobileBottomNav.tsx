'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CalendarDays, LayoutDashboard, BookOpen, Users, Ellipsis,
  MessageSquare, CreditCard, ClipboardList, ExternalLink, Receipt, BarChart3, Settings2, LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import ResponsiveModal from './ResponsiveModal'
import { useLogout } from '@/lib/hooks/useLogout'

const PRIMARY_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/bookings', label: 'Bookings', icon: BookOpen },
  { href: '/workers', label: 'Workers', icon: Users },
]

const SECONDARY_ITEMS = [
  { href: '/inquiries', label: 'Inquiries', desc: 'Leads & CRM pipeline', icon: MessageSquare },
  { href: '/payments', label: 'Payments', desc: 'Accounts & cash tracking', icon: CreditCard },
  { href: '/staff-deployment', label: 'Staffing', desc: 'Deployment rosters', icon: ClipboardList },
  { href: '/outsourcing', label: 'Outsourcing', desc: 'External suppliers', icon: ExternalLink },
  { href: '/expenses', label: 'Expenses', desc: 'Operational cost ledger', icon: Receipt },
  { href: '/reports', label: 'Reports', desc: 'Business analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', desc: 'Account configuration', icon: Settings2 },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)
  const { logout } = useLogout()

  // Automatically close sheet on navigation
  useEffect(() => {
    setMoreOpen(false)
  }, [pathname])

  const isMoreActive = SECONDARY_ITEMS.some(item => pathname.startsWith(item.href))

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-white md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.05)]"
           style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-elevated)' }}>
        
        {/* Render standard tab links */}
        {PRIMARY_ITEMS.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-bold transition-colors active:scale-95',
                active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}

        {/* More button */}
        <button
          onClick={() => setMoreOpen(true)}
          className={cn(
            'flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-bold transition-colors active:scale-95',
            isMoreActive || moreOpen ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'
          )}
        >
          <Ellipsis className="h-5 w-5" />
          <span>More</span>
        </button>
      </nav>

      {/* Responsive drawer for additional pages */}
      <ResponsiveModal
        isOpen={moreOpen}
        onClose={() => setMoreOpen(false)}
        title="More Operations"
        description="Access secondary operational tools and analytical accounts"
      >
        <div className="grid grid-cols-1 gap-3 py-2">
          {SECONDARY_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-4 rounded-xl border p-3 transition-all duration-150 hover:bg-[var(--color-bg-sunken)] active:scale-[0.98]"
                style={{
                  background: active ? 'var(--color-accent-soft)' : 'var(--color-bg-elevated)',
                  borderColor: active ? 'var(--color-accent)' : 'var(--color-border)',
                }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all"
                     style={{
                       background: active ? 'var(--color-accent)' : 'var(--color-bg-sunken)',
                       color: active ? 'var(--color-text-inverse)' : 'var(--color-accent)',
                     }}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold"
                     style={{ color: active ? 'var(--color-accent)' : 'var(--color-text-primary)' }}>
                    {item.label}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                    {item.desc}
                  </p>
                </div>
              </Link>
            )
          })}

          <button
            onClick={() => {
              setMoreOpen(false)
              logout()
            }}
            className="flex items-center gap-4 rounded-xl border p-3 transition-all duration-150 bg-red-50 hover:bg-red-100 border-red-200 active:scale-[0.98] mt-2"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500 text-white">
              <LogOut className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-sm font-bold text-red-600">Logout</p>
              <p className="text-xs truncate text-red-400">Sign out of your account</p>
            </div>
          </button>
        </div>
      </ResponsiveModal>
    </>
  )
}
