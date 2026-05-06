'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUIStore } from '@/lib/store/uiStore'

export function useKeyboardShortcuts() {
  const router = useRouter()
  const openNewBooking = useUIStore((s) => s.openNewBooking)
  const closeNewBooking = useUIStore((s) => s.closeNewBooking)
  const closeNewInquiry = useUIStore((s) => s.closeNewInquiry)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const modifier = event.metaKey || event.ctrlKey
      if (modifier && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        router.push('/reports')
      }
      if (modifier && event.key.toLowerCase() === 'n') {
        event.preventDefault()
        openNewBooking()
      }
      if (event.key === 'Escape') {
        closeNewBooking()
        closeNewInquiry()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [closeNewBooking, closeNewInquiry, openNewBooking, router])
}

