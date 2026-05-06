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
    try {
      // 1. Call server-side logout to clear cookies
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
      // We continue with client-side cleanup even if server call fails
    } finally {
      // 2. Clear Zustand auth store
      clearAuth()

      // 3. Reset TanStack Query cache to clear sensitive data
      queryClient.clear()

      // 4. Show feedback
      toast.success('Successfully logged out')

      // 5. Redirect to login
      router.push('/login')
    }
  }

  return { logout }
}
