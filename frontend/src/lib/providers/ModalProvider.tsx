'use client'

import NewBookingModal from '@/components/shared/modals/NewBookingModal'
import NewInquiryModal from '@/components/shared/modals/NewInquiryModal'

export default function ModalProvider() {
  return (
    <>
      <NewBookingModal />
      <NewInquiryModal />
    </>
  )
}
