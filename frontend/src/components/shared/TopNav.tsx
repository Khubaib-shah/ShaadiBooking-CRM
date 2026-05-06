'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Search, Bell, Menu, Plus, Calendar, Users, Landmark, FileText, CheckCircle, X, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useUIStore } from '@/lib/store/uiStore'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from 'sonner'
import { mockDb } from '@/lib/utils/mockDb'
import { AnimatePresence, motion } from 'framer-motion'

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

interface NotificationItem {
  id: string
  text: string
  time: string
  type: 'alert' | 'info' | 'payment'
  url: string
}

export default function TopNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { toggleSidebar, sidebarCollapsed, openNewBooking } = useUIStore()
  const { vendor } = useAuthStore()

  const pageTitle = PAGE_TITLES[pathname] || (pathname.startsWith('/bookings/') ? 'Booking Detail' : 'ShaadiBook')

  // Search & Notification states
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  // Standard Mock Notification list state
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 'n1', text: 'Imran Barat Banquet starts in 2 hours. Staff rosters loaded.', time: '2 hours ago', type: 'info', url: '/calendar' },
    { id: 'n2', text: 'New inquiry received from Zara Hussain for Mehndi.', time: '5 hours ago', type: 'alert', url: '/inquiries' },
    { id: 'n3', text: 'Payment overdue notice: Ahmed Khan second installment.', time: '1 day ago', type: 'payment', url: '/bookings/1' }
  ])

  // Global Keyboard shortcuts Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close notifications popover on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Live query databases for Cmd+K search matching
  const searchResults = () => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    const results: Array<{ title: string; category: string; url: string; sub: string }> = []

    // 1. Check CRM Pages matches
    Object.entries(PAGE_TITLES).forEach(([url, title]) => {
      if (title.toLowerCase().includes(q)) {
        results.push({ title, category: 'Pages', url, sub: 'Navigate to view' })
      }
    })

    // 2. Check Bookings list
    mockDb.getBookings().forEach(b => {
      if (b.client.toLowerCase().includes(q) || b.ref.toLowerCase().includes(q)) {
        results.push({ title: b.client, category: 'Bookings', url: `/bookings/${b._id}`, sub: `Ref: ${b.ref} · ${b.venue}` })
      }
    })

    // 3. Check Inquiries list
    mockDb.getInquiries().forEach(inq => {
      if (inq.clientName.toLowerCase().includes(q)) {
        results.push({ title: inq.clientName, category: 'Inquiries', url: '/inquiries', sub: `Budget: Rs. ${inq.budget.toLocaleString()} · ${inq.eventType}` })
      }
    })

    return results.slice(0, 6)
  }

  const handleSearchResultClick = (url: string) => {
    setIsSearchOpen(false)
    setSearchQuery('')
    router.push(url)
  }

  const handleNotifClick = (notif: NotificationItem) => {
    setIsNotifOpen(false)
    router.push(notif.url)
  }

  const handleClearNotif = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications(prev => prev.filter(n => n.id !== id))
    toast.success('Notification cleared')
  }

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
      {/* Left side: Mobile burger toggler and active page header */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="flex lg:hidden items-center justify-center h-8 w-8 rounded-md transition-colors hover:bg-[#f1f3f5]"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-[#74788d]" />
        </button>
        <div>
          <h1 className="!text-[18px] font-semibold uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)', color: '#343a40' }}>
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right side controls: Search box, Notification Popover, Quick creation actions */}
      <div className="flex items-center gap-3 relative">
        
        {/* Search icon triggers search palette overlay */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-[#f1f3f5]"
          aria-label="Search (Cmd+K)"
        >
          <Search className="h-4 w-4 text-[#74788d]" />
        </button>

        {/* Notifications Popover Trigger */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(prev => !prev)}
            className="relative flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-[#f1f3f5]"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4 text-[#74788d]" />
            {notifications.length > 0 && (
              <span className="absolute -top-0.5 -right-1 min-w-4 rounded-full px-1 text-[10px] font-semibold text-white bg-[var(--color-danger)]">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Floating Notifications Popover */}
          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-xl z-40 focus:outline-none"
              >
                <div className="flex justify-between items-center pb-2 border-b border-[var(--color-border)] mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)]">Notifications</span>
                  {notifications.length > 0 && (
                    <button
                      onClick={() => { setNotifications([]); toast.success('All notifications cleared') }}
                      className="text-[10px] font-bold text-[var(--color-accent)] hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-1 max-h-[300px] overflow-y-auto">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotifClick(notif)}
                      className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[var(--color-bg-sunken)] transition-colors cursor-pointer group relative"
                    >
                      <div className={cn(
                        'w-2 h-2 rounded-full shrink-0 mt-1.5',
                        notif.type === 'alert' ? 'bg-[#f1b44c]' : notif.type === 'payment' ? 'bg-[#f46a6a]' : 'bg-[#34c38f]'
                      )} />
                      <div className="flex-1">
                        <p className="text-xs text-[var(--color-text-primary)] leading-normal pr-4">{notif.text}</p>
                        <span className="text-[9px] text-[var(--color-text-muted)] mt-1 block">{notif.time}</span>
                      </div>
                      <button
                        onClick={(e) => handleClearNotif(notif.id, e)}
                        className="absolute right-1 top-2 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-[var(--color-border)] transition-all"
                        title="Dismiss notification"
                      >
                        <X className="h-3 w-3 text-[var(--color-text-muted)]" />
                      </button>
                    </div>
                  ))}

                  {notifications.length === 0 && (
                    <div className="py-6 text-center text-xs text-[var(--color-text-muted)] font-semibold">
                      You are all caught up! No notifications.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Create Booking quick Trigger Button */}
        <button
          onClick={openNewBooking}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
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
               style={{ borderColor: '#e9ecef', background: '#ffffff' }}>
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
              {vendor.name}
            </span>
          </div>
        )}
      </div>

      {/* Global Command Palette search overlay (Cmd+K) */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[7vh] md:pt-[15vh]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-black backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.18 }}
              className="relative z-10 w-full max-w-xl rounded-xl border p-0 shadow-2xl overflow-hidden focus:outline-none bg-white"
              style={{ borderColor: 'var(--color-border)' }}
            >
              {/* Search input field */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)]">
                <Search className="h-4.5 w-4.5 text-[var(--color-text-muted)] shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bookings, inquiries, roster or navigations..."
                  className="w-full text-sm outline-none bg-transparent text-[var(--color-text-primary)]"
                />
                <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md bg-[var(--color-bg-sunken)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
                  ESC
                </span>
              </div>

              {/* Command results segment lists */}
              <div className="max-h-[300px] overflow-y-auto p-2">
                {searchQuery.trim() === '' ? (
                  <div className="p-4 text-center text-xs text-[var(--color-text-muted)]">
                    <p className="font-bold mb-1">Search suggestions:</p>
                    <p className="text-[11px]">Type client name (e.g. Zara), event reference (e.g. BK-2025), or page names (e.g. Calendar)</p>
                  </div>
                ) : searchResults().length === 0 ? (
                  <div className="p-4 text-center text-xs text-[var(--color-text-muted)]">
                    No matching results found for &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  <div className="space-y-1">
                    {searchResults().map((res, i) => (
                      <div
                        key={i}
                        onClick={() => handleSearchResultClick(res.url)}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[var(--color-accent-soft)]/20 cursor-pointer transition-all"
                      >
                        <div>
                          <p className="text-sm font-bold text-[var(--color-text-primary)]">{res.title}</p>
                          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{res.sub}</p>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--color-bg-sunken)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                          {res.category}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  )
}
