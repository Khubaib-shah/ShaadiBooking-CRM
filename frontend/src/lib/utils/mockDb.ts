'use client'

import type { BookingStatus, EventType } from '@/types/booking.types'
import type { InquiryStatus } from '@/types/inquiry.types'

export interface MockBooking {
  _id: string
  ref: string
  client: string
  clientPhone: string
  clientWhatsapp: string
  type: EventType
  date: string
  status: BookingStatus
  contract: number
  outstanding: number
  paid: number
  venue: string
  guests: number
  perHeadPrice: number
  paymentSchedules: Array<{
    _id: string
    type: 'deposit' | 'installment' | 'balance'
    amountDue: number
    dueDate: string
    isPaid: boolean
    paidAt?: string
  }>
  notes: Array<{
    _id: string
    content: string
    noteType: 'menu' | 'decor' | 'ops' | 'billing'
    createdBy: string
    createdAt: string
  }>
}

export interface MockInquiry {
  _id: string
  clientName: string
  clientPhone: string
  eventType: EventType
  tentativeDate?: string
  budget: number
  status: InquiryStatus
  createdAt: string
}

export interface MockTeamMember {
  _id: string
  name: string
  email: string
  role: 'Owner' | 'Sales Rep' | 'Operations Manager' | 'Coordinator'
  status: 'Active' | 'Invited'
}

const DEFAULT_BOOKINGS: MockBooking[] = [
  {
    _id: '1',
    ref: 'BK-2025-0019',
    client: 'Ahmed Khan',
    clientPhone: '03121234567',
    clientWhatsapp: '03121234567',
    type: 'barat',
    date: '2025-06-15',
    status: 'confirmed',
    contract: 850000,
    paid: 500000,
    outstanding: 350000,
    venue: 'Pearl Continental Hall A',
    guests: 500,
    perHeadPrice: 1700,
    paymentSchedules: [
      { _id: 'ps1', type: 'deposit', amountDue: 500000, dueDate: '2025-05-01', isPaid: true, paidAt: '2025-04-28' },
      { _id: 'ps2', type: 'balance', amountDue: 350000, dueDate: '2025-06-10', isPaid: false },
    ],
    notes: [
      { _id: 'n1', content: 'Client requested premium mutton biryani upgrade', noteType: 'menu', createdBy: 'Ali Manager', createdAt: '2025-04-20' }
    ]
  },
  {
    _id: '2',
    ref: 'BK-2025-0020',
    client: 'Sara Ali',
    clientPhone: '03001122334',
    clientWhatsapp: '03001122334',
    type: 'mehndi',
    date: '2025-06-18',
    status: 'deposit_received',
    contract: 320000,
    paid: 200000,
    outstanding: 120000,
    venue: 'Emaar Beach Front Lawn',
    guests: 200,
    perHeadPrice: 1600,
    paymentSchedules: [
      { _id: 'ps3', type: 'deposit', amountDue: 200000, dueDate: '2025-05-10', isPaid: true, paidAt: '2025-05-09' },
      { _id: 'ps4', type: 'balance', amountDue: 120000, dueDate: '2025-06-15', isPaid: false },
    ],
    notes: [
      { _id: 'n2', content: 'Stage requires additional fairy lights setup', noteType: 'decor', createdBy: 'Sajid Designer', createdAt: '2025-05-02' }
    ]
  },
  {
    _id: '3',
    ref: 'BK-2025-0021',
    client: 'Usman Sheikh',
    clientPhone: '03219876543',
    clientWhatsapp: '03219876543',
    type: 'valima',
    date: '2025-06-20',
    status: 'balance_pending',
    contract: 1100000,
    paid: 600000,
    outstanding: 500000,
    venue: 'Marriott Marquee Hall C',
    guests: 450,
    perHeadPrice: 2400,
    paymentSchedules: [
      { _id: 'ps5', type: 'deposit', amountDue: 600000, dueDate: '2025-05-15', isPaid: true, paidAt: '2025-05-14' },
      { _id: 'ps6', type: 'balance', amountDue: 500000, dueDate: '2025-06-12', isPaid: false },
    ],
    notes: []
  },
  {
    _id: '4',
    ref: 'BK-2025-0022',
    client: 'Fatima Raza',
    clientPhone: '03335556667',
    clientWhatsapp: '03335556667',
    type: 'nikah',
    date: '2025-06-22',
    status: 'confirmed',
    contract: 600000,
    paid: 400000,
    outstanding: 200000,
    venue: 'DHA Golf Club Lawn',
    guests: 300,
    perHeadPrice: 2000,
    paymentSchedules: [
      { _id: 'ps7', type: 'deposit', amountDue: 400000, dueDate: '2025-05-20', isPaid: true, paidAt: '2025-05-19' },
      { _id: 'ps8', type: 'balance', amountDue: 200000, dueDate: '2025-06-18', isPaid: false },
    ],
    notes: []
  },
  {
    _id: '5',
    ref: 'BK-2025-0023',
    client: 'Imran Ahmed',
    clientPhone: '03004445556',
    clientWhatsapp: '03004445556',
    type: 'dholki',
    date: '2025-06-25',
    status: 'inquiry',
    contract: 150000,
    paid: 0,
    outstanding: 150000,
    venue: 'Private Farmhouse Cl-42',
    guests: 100,
    perHeadPrice: 1500,
    paymentSchedules: [
      { _id: 'ps9', type: 'deposit', amountDue: 150000, dueDate: '2025-06-20', isPaid: false }
    ],
    notes: []
  }
]

const DEFAULT_INQUIRIES: MockInquiry[] = [
  { _id: '1', clientName: 'Zara Hussain', clientPhone: '03001234567', eventType: 'mehndi', tentativeDate: '2025-07-10', budget: 200000, status: 'new', createdAt: '2025-05-01' },
  { _id: '2', clientName: 'Kamran Ali', clientPhone: '03009876543', eventType: 'barat', tentativeDate: '2025-08-15', budget: 800000, status: 'contacted', createdAt: '2025-04-28' },
  { _id: '3', clientName: 'Nadia Shah', clientPhone: '03111234567', eventType: 'valima', tentativeDate: '2025-09-01', budget: 500000, status: 'negotiating', createdAt: '2025-04-25' },
  { _id: '4', clientName: 'Rizwan Malik', clientPhone: '03221234567', eventType: 'nikah', budget: 350000, status: 'new', createdAt: '2025-05-03' },
]

const DEFAULT_TEAM: MockTeamMember[] = [
  { _id: 't1', name: 'Zeeshan Jamil', email: 'zeeshan@shaadibook.com', role: 'Owner', status: 'Active' },
  { _id: 't2', name: 'Noman Butt', email: 'noman@shaadibook.com', role: 'Sales Rep', status: 'Active' },
  { _id: 't3', name: 'Asma Khan', email: 'asma@shaadibook.com', role: 'Operations Manager', status: 'Invited' },
]

// Pure client-side lazy seeders
export const mockDb = {
  getStore: <T>(key: string, defaults: T[]): T[] => {
    if (typeof window === 'undefined') return defaults
    const saved = localStorage.getItem(`shaadi_${key}`)
    if (!saved) {
      localStorage.setItem(`shaadi_${key}`, JSON.stringify(defaults))
      return defaults
    }
    return JSON.parse(saved)
  },

  saveStore: <T>(key: string, data: T[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`shaadi_${key}`, JSON.stringify(data))
    }
  },

  // Bookings API
  getBookings: (): MockBooking[] => {
    return mockDb.getStore('bookings', DEFAULT_BOOKINGS)
  },

  getBookingById: (id: string): MockBooking | undefined => {
    const list = mockDb.getBookings()
    return list.find(b => b._id === id)
  },

  saveBooking: (data: Partial<MockBooking> & { _id?: string }): MockBooking => {
    const list = mockDb.getBookings()
    let record: MockBooking

    if (data._id) {
      // update
      const idx = list.findIndex(b => b._id === data._id)
      if (idx > -1) {
        list[idx] = { ...list[idx], ...data } as MockBooking
        record = list[idx]
      } else {
        record = { ...data } as MockBooking
      }
    } else {
      // create new
      const nextRef = `BK-2025-0${24 + list.length}`
      record = {
        _id: String(Date.now()),
        ref: nextRef,
        client: data.client || 'Unnamed Client',
        clientPhone: data.clientPhone || '03000000000',
        clientWhatsapp: data.clientWhatsapp || '03000000000',
        type: data.type || 'barat',
        date: data.date || new Date().toISOString().split('T')[0],
        status: data.status || 'confirmed',
        contract: data.contract || 0,
        paid: data.paid || 0,
        outstanding: data.outstanding || (data.contract || 0) - (data.paid || 0),
        venue: data.venue || 'TBD Hall',
        guests: data.guests || 200,
        perHeadPrice: data.perHeadPrice || 0,
        paymentSchedules: data.paymentSchedules || [
          { _id: 'ps_' + Date.now(), type: 'deposit', amountDue: data.contract || 0, dueDate: data.date || '', isPaid: false }
        ],
        notes: data.notes || []
      }
      list.push(record)
    }

    mockDb.saveStore('bookings', list)
    return record
  },

  // Inquiries API
  getInquiries: (): MockInquiry[] => {
    return mockDb.getStore('inquiries', DEFAULT_INQUIRIES)
  },

  saveInquiry: (data: Partial<MockInquiry> & { _id?: string }): MockInquiry => {
    const list = mockDb.getInquiries()
    let record: MockInquiry

    if (data._id) {
      const idx = list.findIndex(i => i._id === data._id)
      if (idx > -1) {
        list[idx] = { ...list[idx], ...data } as MockInquiry
        record = list[idx]
      } else {
        record = { ...data } as MockInquiry
      }
    } else {
      record = {
        _id: String(Date.now()),
        clientName: data.clientName || 'Anonymous',
        clientPhone: data.clientPhone || '03000000000',
        eventType: data.eventType || 'barat',
        tentativeDate: data.tentativeDate,
        budget: data.budget || 0,
        status: data.status || 'new',
        createdAt: new Date().toISOString()
      }
      list.push(record)
    }

    mockDb.saveStore('inquiries', list)
    return record
  },

  deleteInquiry: (id: string) => {
    const list = mockDb.getInquiries()
    const filtered = list.filter(i => i._id !== id)
    mockDb.saveStore('inquiries', filtered)
  },

  // Team API
  getTeam: (): MockTeamMember[] => {
    return mockDb.getStore('team', DEFAULT_TEAM)
  },

  saveTeamMember: (data: Omit<MockTeamMember, '_id' | 'status'>): MockTeamMember => {
    const list = mockDb.getTeam()
    const next: MockTeamMember = {
      _id: 't_' + Date.now(),
      name: data.name,
      email: data.email,
      role: data.role,
      status: 'Invited'
    }
    list.push(next)
    mockDb.saveStore('team', list)
    return next
  }
}
