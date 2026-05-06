'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/utils/validation'
import { authApi } from '@/lib/api/auth.api'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from 'sonner'
import type { z } from 'zod'
import type { User } from '@/types/user.types'
import type { Vendor } from '@/types/vendor.types'

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@shaadibook.com',
      password: 'password123',
    },
  })

  const { setAuth } = useAuthStore()

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true)
    try {
      const response = await authApi.login(data)
      
      if (response.success && response.data) {
        const { accessToken, user, vendor } = response.data
        // Update global auth state
        setAuth(accessToken, user as unknown as User, vendor as unknown as Vendor)
        
        toast.success('Welcome back!')
        
        // Use window.location.href for a full page reload to ensure 
        // the middleware and server components correctly detect the new session cookies.
        // This is often more reliable on mobile browsers.
        window.location.href = '/'
      } else {
        toast.error((response as any).message || 'Login failed')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      const message = error.response?.data?.message || 'Invalid credentials or server error'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left half — brand */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative"
           style={{ background: 'var(--color-bg)' }}>
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
             style={{
               backgroundImage: `repeating-linear-gradient(45deg, var(--color-accent) 0px, var(--color-accent) 1px, transparent 1px, transparent 20px),
                                  repeating-linear-gradient(-45deg, var(--color-accent) 0px, var(--color-accent) 1px, transparent 1px, transparent 20px)`,
             }} />

        <div className="relative z-10">
          <div className="flex items-center gap-1.5 mb-4">
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
              Shaadi
            </span>
            <span style={{ color: 'var(--color-accent)', fontSize: '6px' }}>●</span>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
              Book
            </span>
          </div>
        </div>

        <div className="relative z-10">
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            lineHeight: 1.05,
            fontWeight: 300,
            color: 'var(--color-text-primary)',
          }}>
            Shaadi
            <br />
            <span style={{ color: 'var(--color-accent)' }}>Book</span>
          </h1>
          <p className="mt-6 max-w-md text-[var(--text-base)] leading-relaxed"
             style={{ color: 'var(--color-text-muted)' }}>
            Booking management for Pakistan&apos;s finest wedding vendors.
          </p>
        </div>

        <div className="relative z-10" />
      </div>

      {/* Right half — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12"
           style={{ background: 'var(--color-bg-elevated)' }}>
        <div className="w-full max-w-[400px]">
          <h2 className="text-[var(--text-2xl)] mb-1"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Welcome back
          </h2>
          <p className="mb-8 text-[var(--text-sm)]" style={{ color: 'var(--color-text-secondary)' }}>
            Sign in to manage your bookings
          </p>
          <p className="mb-6 text-[var(--text-xs)]" style={{ color: 'var(--color-text-muted)' }}>
            Demo credentials: admin@shaadibook.com / password123
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium mb-1.5"
                     style={{ color: 'var(--color-text-secondary)' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="w-full rounded-[var(--radius-md)] border px-3 py-2.5 text-[var(--text-sm)] transition-colors focus:outline-none focus:border-[var(--color-accent)]"
                style={{ background: 'var(--color-bg-sunken)', borderColor: errors.email ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text-primary)' }}
                placeholder="you@company.com"
              />
              {errors.email && (
                <p className="flex items-center gap-1 mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>
                  <AlertCircle className="h-3 w-3" /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium mb-1.5"
                     style={{ color: 'var(--color-text-secondary)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="w-full rounded-[var(--radius-md)] border px-3 py-2.5 pr-10 text-[var(--text-sm)] transition-colors focus:outline-none focus:border-[var(--color-accent)]"
                  style={{ background: 'var(--color-bg-sunken)', borderColor: errors.password ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text-primary)' }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" style={{ color: 'var(--color-text-muted)' }} /> : <Eye className="h-4 w-4" style={{ color: 'var(--color-text-muted)' }} />}
                </button>
              </div>
              {errors.password && (
                <p className="flex items-center gap-1 mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>
                  <AlertCircle className="h-3 w-3" /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-[var(--radius-md)] py-2.5 text-[var(--text-sm)] font-semibold transition-all duration-150 hover:brightness-110 active:scale-[0.97] disabled:opacity-60"
              style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <Link href="#" className="transition-colors hover:text-[var(--color-text-secondary)]">
              Forgot password?
            </Link>
          </p>
          <p className="mt-6 text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium transition-colors" style={{ color: 'var(--color-accent)' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
