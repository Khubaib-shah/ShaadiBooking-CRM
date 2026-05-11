'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '@/lib/utils/validation'
import { authApi } from '@/lib/api/auth.api'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from 'sonner'
import type { z } from 'zod'
import type { User } from '@/types/user.types'
import type { Vendor } from '@/types/vendor.types'
import { FormInput } from '@/components/shared/FormInput'
import { FormSelect } from '@/components/shared/FormSelect'

type RegisterForm = z.infer<typeof registerSchema>

const VENDOR_TYPES = [
  { value: 'catering', label: 'Catering' },
  { value: 'marquee', label: 'Marquee Hall' },
  { value: 'photography', label: 'Photography' },
  { value: 'event_management', label: 'Event Management' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const { setAuth } = useAuthStore()

  const onSubmit = async (data: RegisterForm) => {
    setIsSubmitting(true)
    
    // FRONTEND-ONLY MOCK REGISTER
    setTimeout(() => {
      const mockUser = {
        id: '2',
        email: data.email,
        name: data.ownerName,
        role: 'owner'
      }
      
      const mockVendor = {
        id: 'v2',
        name: data.vendorName,
        type: data.vendorType,
        subscription: { plan: 'trial', daysRemaining: 30, status: 'active' }
      }
      
      setAuth('mock-access-token', mockUser as unknown as User, mockVendor as unknown as Vendor)
      
      // Set a dummy cookie so the Next.js middleware allows access to the dashboard
      document.cookie = "refreshToken=mock-refresh-token; path=/; max-age=86400; SameSite=Lax"
      
      toast.success('Account created successfully!')
      
      // Robust redirect for mobile
      window.location.href = '/'
    }, 1000)
  }



  return (
    <div className="flex min-h-screen">
      {/* Left half — brand */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative"
           style={{ background: 'var(--color-bg)' }}>
        <div className="absolute inset-0 opacity-[0.03]"
             style={{
               backgroundImage: `repeating-linear-gradient(45deg, var(--color-accent) 0px, var(--color-accent) 1px, transparent 1px, transparent 20px),
                                  repeating-linear-gradient(-45deg, var(--color-accent) 0px, var(--color-accent) 1px, transparent 1px, transparent 20px)`,
             }} />
        <div className="relative z-10" />
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
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto"
           style={{ background: 'var(--color-bg-elevated)' }}>
        <div className="w-full max-w-[440px]">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-[var(--text-2xl)]"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Create your account
            </h2>
            <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
              30-day free trial
            </span>
          </div>
          <p className="mb-6 text-[var(--text-sm)]" style={{ color: 'var(--color-text-secondary)' }}>
            Set up your vendor account in 2 minutes
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Section: Business */}
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em]"
               style={{ color: 'var(--color-text-muted)' }}>Business Info</p>
            <div className="space-y-3">
              <FormInput
                id="vendorName"
                label="Vendor / Business Name"
                register={register('vendorName')}
                error={errors.vendorName?.message}
                placeholder="e.g. Royal Caterers"
              />
              <FormSelect
                id="vendorType"
                label="Vendor Type"
                register={register('vendorType')}
                error={errors.vendorType?.message}
              >
                <option value="">Select type...</option>
                {VENDOR_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </FormSelect>
              <FormInput
                id="phone"
                label="Phone"
                register={register('phone')}
                error={errors.phone?.message}
                placeholder="03xx-xxxxxxx"
              />
            </div>

            {/* Section: Account */}
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] pt-2"
               style={{ color: 'var(--color-text-muted)' }}>Account Info</p>
            <div className="space-y-3">
              <FormInput
                id="ownerName"
                label="Owner Name"
                register={register('ownerName')}
                error={errors.ownerName?.message}
                placeholder="Your full name"
              />
              <FormInput
                id="reg-email"
                type="email"
                label="Email"
                register={register('email')}
                error={errors.email?.message}
                placeholder="you@company.com"
              />
              <FormInput
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                register={register('password')}
                error={errors.password?.message}
                placeholder="Min. 8 characters"
                rightElement={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password">
                    {showPassword ? <EyeOff className="h-4 w-4" style={{ color: 'var(--color-text-muted)' }} /> : <Eye className="h-4 w-4" style={{ color: 'var(--color-text-muted)' }} />}
                  </button>
                }
              />
              <FormInput
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                register={register('confirmPassword')}
                error={errors.confirmPassword?.message}
                placeholder="Re-enter password"
              />
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full rounded-[var(--radius-md)] py-2.5 text-[var(--text-sm)] font-semibold transition-all duration-150 hover:brightness-110 active:scale-[0.97] disabled:opacity-60"
              style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}>
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium transition-colors" style={{ color: 'var(--color-accent)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
