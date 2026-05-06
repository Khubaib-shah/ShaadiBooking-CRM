import { create } from 'zustand'

interface UIState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void

  newBookingOpen: boolean
  newInquiryOpen: boolean
  markPaymentOpen: boolean
  assignStaffOpen: boolean
  confirmDialogOpen: boolean
  selectedBookingId: string | null
  selectedInquiryId: string | null
  confirmAction: (() => Promise<void>) | null
  confirmTitle: string
  confirmDescription: string

  currentCalendarMonth: Date
  selectedCalendarDate: Date | null

  openNewBooking: () => void
  closeNewBooking: () => void
  openMarkPayment: (bookingId: string) => void
  closeMarkPayment: () => void
  openAssignStaff: (bookingId: string) => void
  closeAssignStaff: () => void
  openNewInquiry: () => void
  closeNewInquiry: () => void
  openConfirm: (title: string, description: string, action: () => Promise<void>) => void
  closeConfirm: () => void
  setCalendarMonth: (date: Date) => void
  setSelectedDate: (date: Date | null) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  newBookingOpen: false,
  newInquiryOpen: false,
  markPaymentOpen: false,
  assignStaffOpen: false,
  confirmDialogOpen: false,
  selectedBookingId: null,
  selectedInquiryId: null,
  confirmAction: null,
  confirmTitle: '',
  confirmDescription: '',
  currentCalendarMonth: new Date(),
  selectedCalendarDate: null,

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  openNewBooking: () => set({ newBookingOpen: true }),
  closeNewBooking: () => set({ newBookingOpen: false }),
  openMarkPayment: (id) => set({ markPaymentOpen: true, selectedBookingId: id }),
  closeMarkPayment: () => set({ markPaymentOpen: false, selectedBookingId: null }),
  openAssignStaff: (id) => set({ assignStaffOpen: true, selectedBookingId: id }),
  closeAssignStaff: () => set({ assignStaffOpen: false, selectedBookingId: null }),
  openNewInquiry: () => set({ newInquiryOpen: true }),
  closeNewInquiry: () => set({ newInquiryOpen: false }),
  openConfirm: (title, description, action) =>
    set({ confirmDialogOpen: true, confirmTitle: title, confirmDescription: description, confirmAction: action }),
  closeConfirm: () =>
    set({ confirmDialogOpen: false, confirmTitle: '', confirmDescription: '', confirmAction: null }),
  setCalendarMonth: (date) => set({ currentCalendarMonth: date }),
  setSelectedDate: (date) => set({ selectedCalendarDate: date }),
}))
