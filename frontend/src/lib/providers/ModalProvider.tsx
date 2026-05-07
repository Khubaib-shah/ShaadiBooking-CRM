'use client'

import NewBookingModal from '@/components/shared/modals/NewBookingModal'
import EditBookingModal from '@/components/shared/modals/EditBookingModal'
import NewInquiryModal from '@/components/shared/modals/NewInquiryModal'

export default function ModalProvider() {
  return (
    <>
      <NewBookingModal />
      <EditBookingModal />
      <NewInquiryModal />
    </>
  )
}
