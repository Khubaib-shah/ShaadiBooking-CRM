export type VendorType = 'catering' | 'marquee' | 'photography' | 'event_management'
export type SubscriptionPlan = 'trial' | 'starter' | 'growth' | 'unlimited'

export interface Vendor {
  _id: string
  name: string
  type: VendorType
  phone: string
  subscription: {
    plan: SubscriptionPlan
    expiresAt: string | null
    trialEndsAt: string | null
    isActive: boolean
    daysRemaining: number
  }
  settings: {
    reminderDays: number[]
    smsTemplates: {
      paymentReminder: string
      paymentReceipt: string
      staffAssignment: string
    }
    timezone: string
  }
}
