import { mockDb, type MockBooking } from '../utils/mockDb'
import type { ApiResponse, Booking, CreateBookingInput, RecordPaymentInput } from '@/types'

// Map a mockDb booking record to the expected API client output
const mapBooking = (mb: MockBooking): Booking => ({
  _id: mb._id,
  vendorId: 'vendor_1',
  referenceNumber: mb.ref,
  clientName: mb.client,
  clientPhone: mb.clientPhone,
  clientWhatsapp: mb.clientWhatsapp,
  eventType: mb.type,
  eventDate: mb.date,
  venueName: mb.venue,
  guestCount: mb.guests,
  packageType: mb.guests ? 'per_head' : 'fixed',
  perHeadPrice: mb.perHeadPrice,
  totalContractValue: mb.contract,
  discountAmount: mb.contract - mb.outstanding - mb.paid, 
  discountReason: '',
  status: mb.status,
  netValue: mb.contract,
  totalPaid: mb.paid,
  totalOutstanding: mb.outstanding,
  paymentSchedules: mb.paymentSchedules.map(ps => ({
    _id: ps._id,
    type: ps.type as any,
    amountDue: ps.amountDue,
    dueDate: ps.dueDate,
    isPaid: ps.isPaid,
    paidAt: ps.paidAt,
    remindersSent: {},
  })),
  payments: [],
  notes: (mb.notes || []).map(n => ({
    _id: n._id,
    content: n.content,
    noteType: n.noteType as any,
    createdBy: n.createdBy,
    createdAt: n.createdAt
  })),
  staffAssignments: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

export const bookingsApi = {
  getAll: async (filters?: { status?: string; search?: string; page?: number }) => {
    let list = mockDb.getBookings()
    if (filters?.status && filters.status !== 'all') {
      list = list.filter(b => b.status === filters.status)
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(b => b.client.toLowerCase().includes(q) || b.ref.toLowerCase().includes(q))
    }
    return {
      success: true,
      data: list.map(mapBooking)
    } as ApiResponse<Booking[]>
  },

  getById: async (id: string) => {
    const b = mockDb.getBookingById(id)
    if (!b) throw new Error('Booking not found')
    return {
      success: true,
      data: mapBooking(b)
    } as ApiResponse<Booking>
  },

  create: async (data: any) => {
    // Generate full mock record
    const contract = Number(data.totalContractValue) || 0
    const b = mockDb.saveBooking({
      client: data.clientName,
      clientPhone: data.clientPhone,
      clientWhatsapp: data.clientWhatsapp || data.clientPhone,
      type: data.eventType,
      date: data.eventDate,
      venue: data.venueName,
      guests: Number(data.guestCount) || 200,
      perHeadPrice: Number(data.perHeadPrice) || 0,
      contract: contract,
      paid: 0,
      outstanding: contract,
      status: data.status || 'confirmed',
      paymentSchedules: [
        { _id: 'ps_dep_' + Date.now(), type: 'deposit', amountDue: Math.round(contract * 0.4), dueDate: data.eventDate, isPaid: false },
        { _id: 'ps_bal_' + Date.now(), type: 'balance', amountDue: Math.round(contract * 0.6), dueDate: data.eventDate, isPaid: false }
      ],
      notes: []
    })
    return {
      success: true,
      data: mapBooking(b)
    } as ApiResponse<Booking>
  },

  update: async (id: string, data: any) => {
    const list = mockDb.getBookings()
    const target = list.find(x => x._id === id)
    if (!target) throw new Error('Booking not found')
    
    // Explicitly map incoming frontend types to mockDb fields
    const updated = mockDb.saveBooking({
      ...target,
      _id: id,
      client: data.clientName ?? target.client,
      clientPhone: data.clientPhone ?? target.clientPhone,
      clientWhatsapp: data.clientWhatsapp ?? target.clientWhatsapp,
      type: data.eventType ?? target.type,
      date: data.eventDate ?? target.date,
      venue: data.venueName ?? target.venue,
      guests: data.guestCount ?? target.guests,
      perHeadPrice: data.perHeadPrice ?? target.perHeadPrice,
      contract: data.totalContractValue ?? target.contract,
      status: data.status ?? target.status,
      menu: data.menu ?? target.menu,
      outstanding: (data.totalContractValue ?? target.contract) - target.paid
    } as any)

    return {
      success: true,
      data: mapBooking(updated)
    } as ApiResponse<Booking>
  },

  cancel: async (id: string) => {
    const list = mockDb.getBookings()
    const target = list.find(x => x._id === id)
    if (!target) throw new Error('Booking not found')
    
    target.status = 'cancelled'
    mockDb.saveStore('bookings', list)

    return {
      success: true,
      data: mapBooking(target)
    } as ApiResponse<Booking>
  },

  getCalendar: async (start: string, end: string) => {
    const list = mockDb.getBookings()
    return {
      success: true,
      data: list.map(mapBooking)
    } as ApiResponse<Booking[]>
  },

  checkConflict: async (date: string, excludeId?: string) => {
    const list = mockDb.getBookings()
    const conflicts = list.filter(b => b.date === date && b._id !== excludeId)
    return {
      success: true,
      data: {
        hasConflict: conflicts.length > 0,
        conflicts: conflicts.map(mapBooking)
      }
    } as ApiResponse<{ hasConflict: boolean; conflicts: Partial<Booking>[] }>
  },

  recordPayment: async (data: RecordPaymentInput) => {
    const b = mockDb.getBookingById(data.bookingId)
    if (!b) throw new Error('Booking not found')

    // Find first unpaid installment to mark paid
    const unpaid = b.paymentSchedules.find(p => !p.isPaid)
    if (unpaid) {
      unpaid.isPaid = true
      unpaid.paidAt = new Date().toISOString()
    }

    b.paid += Number(data.amount)
    b.outstanding = Math.max(0, b.contract - b.paid)
    
    mockDb.saveBooking(b)
    return {
      success: true,
      data: mapBooking(b)
    } as ApiResponse<Booking>
  },

  addNote: async (bookingId: string, data: { content: string; noteType: string }) => {
    const b = mockDb.getBookingById(bookingId)
    if (!b) throw new Error('Booking not found')

    b.notes = b.notes || []
    b.notes.push({
      _id: 'n_' + Date.now(),
      content: data.content,
      noteType: data.noteType as any,
      createdBy: 'Ali Manager',
      createdAt: new Date().toISOString()
    })

    mockDb.saveBooking(b)
    return {
      success: true,
      data: mapBooking(b)
    } as ApiResponse<Booking>
  },

  assignStaff: async (bookingId: string, data: { staffMemberId: string; reportingTime?: string; reportingLocation?: string }) => {
    const b = mockDb.getBookingById(bookingId)
    if (!b) throw new Error('Booking not found')
    
    // Stub
    return {
      success: true,
      data: mapBooking(b)
    } as ApiResponse<Booking>
  }
}
