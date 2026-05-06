import { z } from 'zod'

export const createBookingSchema = z.object({
  clientName:          z.string().min(2, 'Name required').max(100),
  clientPhone:         z.string().regex(/^03[0-9]{9}$/, 'Enter valid Pakistani number (03xx...)'),
  clientWhatsapp:      z.string().optional().or(z.literal('')),
  eventType:           z.enum(['mayun','dholki','mehndi','nikah','barat','valima','other']),
  eventDate:           z.string().min(1, 'Event date required'),
  venueName:           z.string().min(1, 'Venue name required'),
  guestCount:          z.number().min(1, 'Guests count must be at least 1'),
  packageType:         z.enum(['per_head', 'fixed']),
  perHeadPrice:        z.number().min(0),
  totalContractValue:  z.number().min(1, 'Contract value required'),
  discountAmount:      z.number().min(0),
  discountReason:      z.string().optional().or(z.literal('')),
  status:              z.enum(['inquiry', 'confirmed']),
  paymentSchedules:    z.array(z.object({
    type:      z.enum(['deposit', 'balance']),
    amountDue: z.number().min(1),
    dueDate:   z.string().min(1),
  })).min(1).optional(),
})

export const recordPaymentSchema = z.object({
  bookingId:       z.string(),
  amount:          z.number().min(1, 'Amount required'),
  method:          z.enum(['cash', 'easypaisa', 'jazzcash', 'bank_transfer']),
  referenceNumber: z.string().optional(),
  paymentType:     z.enum(['deposit', 'balance']),
})

export const addNoteSchema = z.object({
  content:  z.string().min(1, 'Note content required').max(1000),
  noteType: z.enum(['menu', 'service_change', 'client_request', 'agreement']),
})

export const loginSchema = z.object({
  email:    z.string().email('Valid email required'),
  password: z.string().min(6, 'Password required'),
})

export const registerSchema = z.object({
  vendorName: z.string().min(2),
  vendorType: z.enum(['catering', 'marquee', 'photography', 'event_management']),
  phone:      z.string().regex(/^03[0-9]{9}$/),
  ownerName:  z.string().min(2),
  email:      z.string().email(),
  password:   z.string().min(8, 'Minimum 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
