export interface EventExpense {
  _id: string
  vendorId: string
  bookingId?: string
  outsourcingJobId?: string
  date: Date
  category:
    | 'food_catering' | 'worker_wages' | 'transport'
    | 'equipment_rental' | 'electricity_generator'
    | 'decoration' | 'miscellaneous'
  description: string
  amount: number
  paidTo?: string
  paymentMethod?: 'cash' | 'easypaisa' | 'jazzcash' | 'bank'
  receiptUrl?: string
  createdBy: string
  createdAt: Date
}

