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
  expenses?: number
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
  menu?: Array<{
    _id: string
    name: string
    category: 'main' | 'sweet' | 'bread' | 'drink' | 'starter'
    quantity?: string
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

export interface MockWorker {
  id: string
  name: string
  role: string
  type: 'permanent' | 'temporary' | 'contractor'
  phone: string
  salary: number
  events: number
  active: boolean
}

export interface MockMenuItem {
  _id: string
  name: string
  category: 'main' | 'sweet' | 'bread' | 'drink' | 'starter'
}

const DEFAULT_BOOKINGS: MockBooking[] = [
  {
    _id: '1',
    ref: 'BK-2026-0019',
    client: 'Ahmed Khan',
    clientPhone: '03121234567',
    clientWhatsapp: '03121234567',
    type: 'barat',
    date: '2026-05-10',
    status: 'confirmed',
    contract: 850000,
    paid: 500000,
    outstanding: 350000,
    venue: 'Pearl Continental Hall A',
    guests: 500,
    perHeadPrice: 1700,
    paymentSchedules: [
      { _id: 'ps1', type: 'deposit', amountDue: 500000, dueDate: '2026-05-01', isPaid: true, paidAt: '2026-04-28' },
      { _id: 'ps2', type: 'balance', amountDue: 350000, dueDate: '2026-05-08', isPaid: false },
    ],
    notes: [
      { _id: 'n1', content: 'Client requested premium mutton biryani upgrade', noteType: 'menu', createdBy: 'Ali Manager', createdAt: '2026-04-20' }
    ],
    menu: [
      { _id: 'm1', name: 'Mutton Biryani', category: 'main' },
      { _id: 'm2', name: 'Chicken Qorma', category: 'main' },
      { _id: 'm3', name: 'Seekh Kabab', category: 'main' },
      { _id: 'm4', name: 'Gajar Ka Halwa', category: 'sweet' },
      { _id: 'm5', name: 'Gulab Jamun', category: 'sweet' },
      { _id: 'm6', name: 'Naan / Roti', category: 'bread' }
    ]
  },
  {
    _id: '2',
    ref: 'BK-2026-0020',
    client: 'Sara Ali',
    clientPhone: '03001122334',
    clientWhatsapp: '03001122334',
    type: 'mehndi',
    date: '2026-05-12',
    status: 'deposit_received',
    contract: 320000,
    paid: 200000,
    outstanding: 120000,
    venue: 'Emaar Beach Front Lawn',
    guests: 200,
    perHeadPrice: 1600,
    paymentSchedules: [
      { _id: 'ps3', type: 'deposit', amountDue: 200000, dueDate: '2026-05-05', isPaid: true, paidAt: '2026-05-04' },
      { _id: 'ps4', type: 'balance', amountDue: 120000, dueDate: '2026-05-10', isPaid: false },
    ],
    notes: [
      { _id: 'n2', content: 'Stage requires additional fairy lights setup', noteType: 'decor', createdBy: 'Sajid Designer', createdAt: '2026-05-02' }
    ]
  },
  {
    _id: '3',
    ref: 'BK-2026-0021',
    client: 'Usman Sheikh',
    clientPhone: '03219876543',
    clientWhatsapp: '03219876543',
    type: 'valima',
    date: '2026-05-15',
    status: 'balance_pending',
    contract: 1100000,
    paid: 600000,
    outstanding: 500000,
    venue: 'Marriott Marquee Hall C',
    guests: 450,
    perHeadPrice: 2400,
    paymentSchedules: [
      { _id: 'ps5', type: 'deposit', amountDue: 600000, dueDate: '2026-05-08', isPaid: true, paidAt: '2026-05-07' },
      { _id: 'ps6', type: 'balance', amountDue: 500000, dueDate: '2026-05-14', isPaid: false },
    ],
    notes: []
  },
  {
    _id: '4',
    ref: 'BK-2026-0022',
    client: 'Fatima Raza',
    clientPhone: '03335556667',
    clientWhatsapp: '03335556667',
    type: 'nikah',
    date: '2026-06-22',
    status: 'confirmed',
    contract: 600000,
    paid: 400000,
    outstanding: 200000,
    venue: 'DHA Golf Club Lawn',
    guests: 300,
    perHeadPrice: 2000,
    paymentSchedules: [
      { _id: 'ps7', type: 'deposit', amountDue: 400000, dueDate: '2026-05-20', isPaid: true, paidAt: '2026-05-19' },
      { _id: 'ps8', type: 'balance', amountDue: 200000, dueDate: '2026-06-18', isPaid: false },
    ],
    notes: []
  },
  {
    _id: '5',
    ref: 'BK-2026-0023',
    client: 'Imran Ahmed',
    clientPhone: '03004445556',
    clientWhatsapp: '03004445556',
    type: 'dholki',
    date: '2026-06-25',
    status: 'inquiry',
    contract: 150000,
    paid: 0,
    outstanding: 150000,
    venue: 'Private Farmhouse Cl-42',
    guests: 100,
    perHeadPrice: 1500,
    paymentSchedules: [
      { _id: 'ps9', type: 'deposit', amountDue: 150000, dueDate: '2026-06-20', isPaid: false }
    ],
    notes: []
  },
  {
    _id: '6',
    ref: 'BK-2026-0024',
    client: 'Zohaib Hassan',
    clientPhone: '03115556667',
    clientWhatsapp: '03115556667',
    type: 'barat',
    date: '2026-05-18',
    status: 'confirmed',
    contract: 950000,
    paid: 400000,
    outstanding: 550000,
    venue: 'Pearl Continental Hall B',
    guests: 400,
    perHeadPrice: 2000,
    paymentSchedules: [
      { _id: 'ps10', type: 'deposit', amountDue: 400000, dueDate: '2026-05-05', isPaid: true },
      { _id: 'ps11', type: 'balance', amountDue: 550000, dueDate: '2026-05-15', isPaid: false },
    ],
    notes: []
  },
  {
    _id: '7',
    ref: 'BK-2026-0025',
    client: 'Noman Siddiqui',
    clientPhone: '03224443332',
    clientWhatsapp: '03224443332',
    type: 'mehndi',
    date: '2026-05-20',
    status: 'confirmed',
    contract: 450000,
    paid: 100000,
    outstanding: 350000,
    venue: 'Marriott Marquee Hall A',
    guests: 250,
    perHeadPrice: 1800,
    paymentSchedules: [
      { _id: 'ps12', type: 'deposit', amountDue: 100000, dueDate: '2026-05-10', isPaid: true },
    ],
    notes: []
  },
  {
    _id: '8',
    ref: 'BK-2026-0026',
    client: 'Ayesha Malik',
    clientPhone: '03337778889',
    clientWhatsapp: '03337778889',
    type: 'valima',
    date: '2026-05-22',
    status: 'confirmed',
    contract: 1200000,
    paid: 500000,
    outstanding: 700000,
    venue: 'Pearl Continental Grand Ballroom',
    guests: 600,
    perHeadPrice: 2000,
    paymentSchedules: [
      { _id: 'ps13', type: 'deposit', amountDue: 500000, dueDate: '2026-05-12', isPaid: true },
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

const DEFAULT_WORKERS: MockWorker[] = [
  { id: 'w1', name: 'Ahmed Ali', role: 'waiter', type: 'permanent', phone: '03212345678', salary: 30000, events: 8, active: true },
  { id: 'w11', name: 'Bilal Farooqi', role: 'waiter', type: 'temporary', phone: '03456677889', salary: 1200, events: 2, active: true },
  { id: 'w12', name: 'Mustafa Qureshi', role: 'waiter', type: 'permanent', phone: '03214455667', salary: 28000, events: 15, active: true },
  { id: 'w13', name: 'Asif Memon', role: 'chef', type: 'permanent', phone: '03001122334', salary: 65000, events: 45, active: true },
  { id: 'w14', name: 'Kamran Akmal', role: 'chef', type: 'contractor', phone: '03339988776', salary: 5000, events: 10, active: true },
  { id: 'w15', name: 'Sajid Khan', role: 'manager', type: 'permanent', phone: '03125566778', salary: 75000, events: 100, active: true },
  { id: 'w16', name: 'Junaid Jamshed', role: 'electrician', type: 'contractor', phone: '03218877665', salary: 3500, events: 12, active: true },
  { id: 'w17', name: 'Faisal Kapadia', role: 'waiter', type: 'temporary', phone: '03443322110', salary: 1200, events: 5, active: true },
  { id: 'w18', name: 'Hamza Ali', role: 'waiter', type: 'permanent', phone: '03225544332', salary: 30000, events: 20, active: true },
  { id: 'w19', name: 'Zainab Bibi', role: 'waiter', type: 'temporary', phone: '03119988776', salary: 1500, events: 3, active: true },
  { id: 'w20', name: 'Arsalan Baig', role: 'chef', type: 'temporary', phone: '03002233445', salary: 4000, events: 8, active: true },
  { id: 'w21', name: 'Rizwan Ahmed', role: 'waiter', type: 'permanent', phone: '03451122334', salary: 29000, events: 18, active: true },
  { id: 'w22', name: 'Farhan Saeed', role: 'waiter', type: 'temporary', phone: '03216677889', salary: 1200, events: 1, active: true },
  { id: 'w23', name: 'Shoaib Malik', role: 'manager', type: 'contractor', phone: '03331122334', salary: 8000, events: 30, active: true },
  { id: 'w24', name: 'Babar Azam', role: 'waiter', type: 'permanent', phone: '03009988776', salary: 32000, events: 25, active: true },
  { id: 'w25', name: 'Shaheen Afridi', role: 'electrician', type: 'temporary', phone: '03115566778', salary: 3000, events: 5, active: true },
  { id: 'w26', name: 'Sarfaraz Ahmed', role: 'waiter', type: 'permanent', phone: '03001122334', salary: 31000, events: 40, active: true },
  { id: 'w27', name: 'Mohammad Hafeez', role: 'waiter', type: 'temporary', phone: '03451122334', salary: 1200, events: 2, active: true },
  { id: 'w28', name: 'Saeed Ajmal', role: 'chef', type: 'contractor', phone: '03211122334', salary: 5500, events: 15, active: true },
  { id: 'w29', name: 'Younis Khan', role: 'manager', type: 'permanent', phone: '03331122334', salary: 85000, events: 150, active: true },
  { id: 'w30', name: 'Misbah-ul-Haq', role: 'waiter', type: 'permanent', phone: '03009988776', salary: 33000, events: 50, active: true },
  { id: 'w31', name: 'Imad Wasim', role: 'electrician', type: 'temporary', phone: '03115566778', salary: 3000, events: 3, active: true },
  { id: 'w32', name: 'Shadab Khan', role: 'waiter', type: 'temporary', phone: '03456677889', salary: 1200, events: 0, active: true },
  { id: 'w33', name: 'Fakhar Zaman', role: 'waiter', type: 'permanent', phone: '03214455667', salary: 29000, events: 12, active: true },
  { id: 'w34', name: 'Azhar Ali', role: 'chef', type: 'permanent', phone: '03001122334', salary: 62000, events: 35, active: true },
  { id: 'w35', name: 'Asad Shafiq', role: 'waiter', type: 'temporary', phone: '03339988776', salary: 1200, events: 5, active: true },
  { id: 'w36', name: 'Wahab Riaz', role: 'waiter', type: 'permanent', phone: '03125566778', salary: 30000, events: 18, active: true },
  { id: 'w37', name: 'Mohammad Amir', role: 'waiter', type: 'temporary', phone: '03218877665', salary: 1200, events: 4, active: true },
  { id: 'w38', name: 'Abdur Rehman', role: 'chef', type: 'temporary', phone: '03443322110', salary: 4000, events: 6, active: true },
  { id: 'w39', name: 'Umar Akmal', role: 'waiter', type: 'temporary', phone: '03225544332', salary: 1200, events: 1, active: true },
  { id: 'w40', name: 'Sohail Tanvir', role: 'electrician', type: 'permanent', phone: '03119988776', salary: 35000, events: 25, active: true },
  { id: 'w2', name: 'Rashid Hussain', role: 'waiter', type: 'temporary', phone: '03001234567', salary: 1500, events: 6, active: true },
  { id: 'w3', name: 'Muhammad Aslam', role: 'chef', type: 'permanent', phone: '03451234567', salary: 45000, events: 10, active: true },
  { id: 'w4', name: 'Tariq Mehmood', role: 'electrician', type: 'contractor', phone: '03211234567', salary: 3000, events: 4, active: false },
  { id: 'w5', name: 'Naveed Ahmed', role: 'driver', type: 'permanent', phone: '03341234567', salary: 25000, events: 12, active: true },
  { id: 'w6', name: 'Imtiaz Khan', role: 'generator_operator', type: 'temporary', phone: '03121234567', salary: 2000, events: 5, active: false },
  { id: 'w7', name: 'Saleem Butt', role: 'manager', type: 'permanent', phone: '03231234567', salary: 55000, events: 14, active: true },
  { id: 'w8', name: 'Hassan Ali', role: 'helper', type: 'temporary', phone: '03091234567', salary: 800, events: 3, active: true },
]

const DEFAULT_MENU: MockMenuItem[] = [
  { _id: 'm1', name: 'Mutton Biryani', category: 'main' },
  { _id: 'm2', name: 'Chicken Qorma', category: 'main' },
  { _id: 'm3', name: 'Seekh Kabab', category: 'main' },
  { _id: 'm4', name: 'Gajar Ka Halwa', category: 'sweet' },
  { _id: 'm5', name: 'Gulab Jamun', category: 'sweet' },
  { _id: 'm6', name: 'Naan / Roti', category: 'bread' },
  { _id: 'm7', name: 'Cold Drinks', category: 'drink' },
  { _id: 'm8', name: 'Fresh Juice', category: 'drink' },
  { _id: 'm9', name: 'Chicken Tikka', category: 'starter' },
  { _id: 'm10', name: 'Beef Pulao', category: 'main' },
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
  },

  // Workers API
  getWorkers: (): MockWorker[] => {
    return mockDb.getStore('workers', DEFAULT_WORKERS)
  },

  saveWorker: (data: Partial<MockWorker> & { id?: string }): MockWorker => {
    const list = mockDb.getWorkers()
    let record: MockWorker

    if (data.id) {
      const idx = list.findIndex(w => w.id === data.id)
      if (idx > -1) {
        list[idx] = { ...list[idx], ...data } as MockWorker
        record = list[idx]
      } else {
        record = { ...data } as MockWorker
      }
    } else {
      record = {
        id: 'w_' + Date.now(),
        name: data.name || 'Unknown Worker',
        role: data.role || 'helper',
        type: data.type || 'temporary',
        phone: data.phone || '03000000000',
        salary: data.salary || 0,
        events: 0,
        active: true
      }
      list.push(record)
    }

    mockDb.saveStore('workers', list)
    return record
  },

  // Menu API
  getMenuItems: (): MockMenuItem[] => {
    return mockDb.getStore('menu', DEFAULT_MENU)
  }
}
