'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUIStore } from '@/lib/store/uiStore'

export default function NewBookingRedirectPage() {
  const router = useRouter()
  const { openNewBooking } = useUIStore()

  useEffect(() => {
    // Gracefully redirect to bookings list and pop open the creation modal
    router.replace('/bookings')
    openNewBooking()
  }, [router, openNewBooking])

  return (
    <div className="flex h-[60vh] items-center justify-center text-xs font-semibold text-[var(--color-text-muted)] animate-pulse">
      Redirecting to booking system...
    </div>
  )
}
