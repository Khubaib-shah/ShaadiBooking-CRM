import { mockDb, type MockInquiry } from '../utils/mockDb'
import type { ApiResponse, Inquiry } from '@/types'

const mapInquiry = (mi: MockInquiry): Inquiry => ({
  _id: mi._id,
  clientName: mi.clientName,
  clientPhone: mi.clientPhone,
  eventType: mi.eventType,
  tentativeDate: mi.tentativeDate || new Date().toISOString(),
  budget: mi.budget,
  status: mi.status,
  notes: [] as any,
  createdAt: mi.createdAt,
  updatedAt: mi.createdAt
})

export const inquiriesApi = {
  getAll: async (filters?: { status?: string; search?: string }) => {
    let list = mockDb.getInquiries()
    if (filters?.status && filters.status !== 'all') {
      list = list.filter(i => i.status === filters.status)
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(i => i.clientName.toLowerCase().includes(q))
    }
    return {
      success: true,
      data: list.map(mapInquiry)
    } as ApiResponse<Inquiry[]>
  },

  getById: async (id: string) => {
    const list = mockDb.getInquiries()
    const target = list.find(i => i._id === id)
    if (!target) throw new Error('Inquiry not found')
    return {
      success: true,
      data: mapInquiry(target)
    } as ApiResponse<Inquiry>
  },

  create: async (data: Partial<Inquiry>) => {
    const record = mockDb.saveInquiry({
      clientName: data.clientName,
      clientPhone: data.clientPhone,
      eventType: data.eventType || 'barat',
      budget: Number(data.budget) || 0,
      status: 'new'
    })
    return {
      success: true,
      data: mapInquiry(record)
    } as ApiResponse<Inquiry>
  },

  update: async (id: string, data: Partial<Inquiry>) => {
    const list = mockDb.getInquiries()
    const target = list.find(i => i._id === id)
    if (!target) throw new Error('Inquiry not found')

    const updated = mockDb.saveInquiry({
      ...target,
      ...data,
      _id: id
    } as any)

    return {
      success: true,
      data: mapInquiry(updated)
    } as ApiResponse<Inquiry>
  },

  updateStatus: async (id: string, status: any) => {
    const list = mockDb.getInquiries()
    const target = list.find(i => i._id === id)
    if (!target) throw new Error('Inquiry not found')

    target.status = status
    mockDb.saveInquiry(target)

    return {
      success: true,
      data: mapInquiry(target)
    } as ApiResponse<Inquiry>
  },

  convertToBooking: async (id: string) => {
    const list = mockDb.getInquiries()
    const target = list.find(i => i._id === id)
    if (!target) throw new Error('Inquiry not found')

    // Create booking record matching inquiry
    const b = mockDb.saveBooking({
      client: target.clientName,
      clientPhone: target.clientPhone,
      clientWhatsapp: target.clientPhone,
      type: target.eventType,
      date: target.tentativeDate || new Date().toISOString().split('T')[0],
      contract: target.budget,
      paid: 0,
      outstanding: target.budget,
      status: 'confirmed'
    })

    // Delete inquiry
    mockDb.deleteInquiry(id)

    return {
      success: true,
      data: { bookingId: b._id }
    } as ApiResponse<{ bookingId: string }>
  }
}
