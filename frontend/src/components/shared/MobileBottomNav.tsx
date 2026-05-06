'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, LayoutDashboard, BookOpen, Users, Ellipsis } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const items = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/bookings', label: 'Bookings', icon: BookOpen },
  { href: '/workers', label: 'Workers', icon: Users },
  { href: '/reports', label: 'More', icon: Ellipsis },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-[#e9ecef] bg-white md:hidden">
      {items.map((item) => {
        const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn('flex flex-col items-center gap-1 py-2 text-[11px] font-medium', active ? 'text-[#556ee6]' : 'text-[#74788d]')}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

