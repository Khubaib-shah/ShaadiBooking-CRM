export type UserRole = 'owner' | 'manager' | 'viewer'

export interface User {
  _id: string
  vendorId: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  lastLoginAt: string
}
