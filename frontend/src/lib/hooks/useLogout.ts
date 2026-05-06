import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { authApi } from '@/lib/api/auth.api'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useLogout = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { clearAuth } = useAuthStore()

  const logout = async () => {
    // 1. Remove the mock cookie
    document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    
    // 2. Clear Zustand auth store
    clearAuth()

    // 3. Reset TanStack Query cache to clear sensitive data
    queryClient.clear()

    // 4. Show feedback
    toast.success('Successfully logged out')

    // 5. Redirect to login using window.location to ensure fresh state
    window.location.href = '/login'
  }

  return { logout }
}
