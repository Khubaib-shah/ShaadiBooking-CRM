import type { Worker } from './worker.types'

export interface OutsourcingJob {
  _id: string
  vendorId: string
  referenceNumber: string
  clientName: string
  clientPhone: string
  clientOrganization?: string
  venueName: string
  venueAddress: string
  eventDate: Date
  eventDescription?: string
  workersDeployed: {
    workerId: string
    worker?: Worker
    role: string
    hoursWorked: number
    wageForEvent: number
  }[]
  equipmentDeployed: {
    itemName: string
    quantity: number
    dailyRate: number
    days: number
    totalCost: number
  }[]
  totalRevenue: number
  totalWorkerCost: number
  totalEquipmentCost: number
  transportCost: number
  netProfit: number
  status: 'draft' | 'confirmed' | 'in_progress' | 'completed' | 'invoiced' | 'paid'
  invoiceGenerated: boolean
  invoicePaidAt?: Date
  notes?: string
  createdBy: string
  createdAt: Date
}

