export interface EventPnL {
  bookingId: string
  clientName: string
  eventType: string
  eventDate: Date
  revenue: number
  discount: number
  netRevenue: number
  expenses: {
    foodCatering: number
    workerWages: number
    transport: number
    equipment: number
    electricity: number
    decoration: number
    miscellaneous: number
    total: number
  }
  netProfit: number
  profitMargin: number
}

