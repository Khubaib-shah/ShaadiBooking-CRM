import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '@/types/user.types'
import type { Vendor } from '@/types/vendor.types'

interface AuthState {
  accessToken: string | null
  user: User | null
  vendor: Vendor | null
  isAuthenticated: boolean
  setAuth: (token: string, user: User, vendor: Vendor) => void
  setAccessToken: (token: string) => void
  clearAuth: () => void
  updateVendor: (vendor: Partial<Vendor>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      vendor: null,
      isAuthenticated: false,
      setAuth: (token, user, vendor) =>
        set({ accessToken: token, user, vendor, isAuthenticated: true }),
      setAccessToken: (token) => set({ accessToken: token }),
      clearAuth: () =>
        set({ accessToken: null, user: null, vendor: null, isAuthenticated: false }),
      updateVendor: (updates) =>
        set((s) => ({ vendor: s.vendor ? { ...s.vendor, ...updates } as Vendor : null })),
    }),
    {
      name: 'shaadibook-auth',
      storage: createJSONStorage(() => localStorage),
      // accessToken is memory-only — never persisted
      partialize: (s) => ({ user: s.user, vendor: s.vendor, isAuthenticated: s.isAuthenticated }),
    }
  )
)
