export type WorkerType = 'permanent' | 'temporary' | 'contractor'

export type WorkerRole =
  | 'waiter' | 'head_waiter' | 'chef' | 'electrician'
  | 'manager' | 'driver' | 'helper' | 'ac_operator'
  | 'generator_operator' | 'security' | 'cleaner'
  | 'decorator' | 'photographer' | 'other'

export interface Worker {
  _id: string
  vendorId: string
  name: string
  cnic: string
  phone: string
  whatsapp?: string
  emergencyContact?: { name: string; phone: string }
  type: WorkerType
  primaryRole: WorkerRole
  secondarySkills: string[]
  compensation: {
    monthlySalary?: number
    joiningDate?: Date
    dailyWage?: number
    eventWage?: number
    hourlyRate?: number
    dailyRate?: number
    perEventRate?: number
  }
  isActive: boolean
  notes?: string
  createdAt: Date
}

export interface EventAssignment {
  _id: string
  bookingId: string
  workerId: string
  worker: Worker
  role: string
  reportingTime: string
  reportingLocation: string
  hoursWorked?: number
  amountPaid?: number
  paymentMethod?: 'cash' | 'easypaisa' | 'jazzcash' | 'bank'
  specialInstructions?: string
  smsSent: boolean
  attended: boolean | null
  notes?: string
}

export interface MonthlySalary {
  _id: string
  workerId: string
  month: number
  year: number
  baseSalary: number
  eventsWorked: number
  eventBonus: number
  advancePaid: number
  deductions: number
  netAmount: number
  status: 'pending' | 'partial' | 'paid'
  paidAt?: Date
  paidBy?: string
  notes?: string
}

