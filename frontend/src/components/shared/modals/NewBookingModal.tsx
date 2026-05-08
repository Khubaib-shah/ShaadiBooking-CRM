'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Calendar as CalendarIcon, Loader2, DollarSign, CheckCircle2 } from 'lucide-react'
import { createBookingSchema } from '@/lib/utils/validation'
import { useUIStore } from '@/lib/store/uiStore'
import { useCreateBooking } from '@/lib/hooks/useBookings'
import { EVENT_TYPE_LABELS, getGuestCountModifier } from '@/lib/utils/booking'
import { formatRupees } from '@/lib/utils/currency'
import ResponsiveModal from '../ResponsiveModal'
import { mockDb } from '@/lib/utils/mockDb'
import type { z } from 'zod'



type BookingFormValues = z.infer<typeof createBookingSchema>

export default function NewBookingModal() {
  const { newBookingOpen, closeNewBooking, selectedCalendarDate } = useUIStore()
  const createBooking = useCreateBooking()

  // Dynamic state for master menu loaded from mockDb
  const [masterMenu, setMasterMenu] = useState<any[]>([])

  // Dynamic state for interactive menu selection (Mutton Biryani, Gajar Ka Halwa, Naan, Cold Drinks by default)
  const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>(['m1', 'm4', 'm6', 'm7'])


  // Format prefilled date if exists
  const defaultDate = selectedCalendarDate 
    ? selectedCalendarDate.toISOString().split('T')[0]
    : ''

  // Wizard step state
  const [currentStep, setCurrentStep] = useState<number>(1)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      clientName: '',
      clientPhone: '',
      clientWhatsapp: '',
      eventType: 'barat',
      eventDate: defaultDate,
      venueName: '',
      guestCount: 0,
      packageType: 'per_head',
      perHeadPrice: 0,
      totalContractValue: 0,
      discountAmount: 0,
      discountReason: '',
      expenses: 0,
      status: 'confirmed',
    },
  })

  // Watch fields for live financial equations
  const watched = watch()

  // Auto-compute recommended per head price based on selected dishes and guest count overhead tier
  useEffect(() => {
    if (watched.packageType === 'per_head') {
      const menuSum = selectedMenuIds.reduce((sum, id) => {
        const item = masterMenu.find(m => m._id === id)
        return sum + (item?.price || 0)
      }, 0)
      const modifier = getGuestCountModifier(watched.guestCount || 0)
      const recommendedPerHead = Math.max(0, menuSum + modifier.amount)
      setValue('perHeadPrice', recommendedPerHead)
    }
  }, [selectedMenuIds, watched.guestCount, watched.packageType, setValue, masterMenu])

  // Calculate net contract amount in real-time
  const calculatedTotal = watched.packageType === 'per_head'
    ? (Number(watched.guestCount || 0) * Number(watched.perHeadPrice || 0)) - Number(watched.discountAmount || 0)
    : Number(watched.totalContractValue || 0) - Number(watched.discountAmount || 0)

  // Sync date selection changes when modal opens
  useEffect(() => {
    if (newBookingOpen) {
      setCurrentStep(1) // Always start on Step 1
      const dbMenu = mockDb.getMenuItems()
      setMasterMenu(dbMenu)
      
      // Select classic defaults if they exist in DB
      const defaultIds = ['m1', 'm4', 'm6', 'm7'].filter(id => dbMenu.some(item => item._id === id))
      setSelectedMenuIds(defaultIds.length > 0 ? defaultIds : dbMenu.slice(0, 4).map(item => item._id))

      reset({
        clientName: '',
        clientPhone: '',
        clientWhatsapp: '',
        eventType: 'barat',
        eventDate: selectedCalendarDate ? selectedCalendarDate.toISOString().split('T')[0] : '',
        venueName: '',
        guestCount: 200,
        packageType: 'per_head',
        perHeadPrice: 950,
        totalContractValue: 190000,
        discountAmount: 0,
        discountReason: '',
        expenses: 0,
        status: 'confirmed',
      })
    }
  }, [newBookingOpen, selectedCalendarDate, reset])

  const handleNext = async () => {
    let isValidStep = false
    if (currentStep === 1) {
      isValidStep = await trigger(['clientName', 'clientPhone'])
    } else if (currentStep === 2) {
      isValidStep = await trigger(['eventDate', 'venueName', 'guestCount'])
    } else {
      isValidStep = true
    }

    if (isValidStep) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const onSubmit = (data: BookingFormValues) => {
    if (currentStep < 4) return // Guard against accidental submit on step transition

    // Map selected menu items to save with the booking
    const selectedMenu = masterMenu.filter(item => selectedMenuIds.includes(item._id)).map(item => ({
      _id: item._id,
      name: item.name,
      category: item.category
    }))

    // Inject calculated contract value and custom selected menu dishes
    const finalData = {
      ...data,
      totalContractValue: calculatedTotal,
      paymentSchedules: [],
      menu: selectedMenu
    }

    createBooking.mutate(finalData as any, {
      onSuccess: () => {
        reset()
        closeNewBooking()
      },
    })
  }

  return (
    <ResponsiveModal
      size="2xl"
      isOpen={newBookingOpen}
      onClose={closeNewBooking}
      title="New Booking Contract"
      description="Step-by-step wedding quotation contract workflow builder."
    >
      {/* Wizard Progress Stepper */}
      <div className="flex items-center justify-between border-b pb-4 mb-5 border-[var(--color-border)] overflow-x-auto gap-2">
        {[
          { step: 1, label: 'Client', icon: '👤' },
          { step: 2, label: 'Event', icon: '📅' },
          { step: 3, label: 'Catering', icon: '🍛' },
          { step: 4, label: 'Financials', icon: '💰' },
        ].map((item) => (
          <div key={item.step} className="flex items-center gap-1.5 shrink-0">
            <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
              currentStep === item.step
                ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white scale-105'
                : currentStep > item.step
                  ? 'bg-[var(--color-accent-soft)]/20 border-[var(--color-accent)] text-[var(--color-accent)]'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-sunken)] text-[var(--color-text-muted)]'
            }`}>
              {currentStep > item.step ? '✓' : item.icon}
            </span>
            <span className={`text-xs font-bold ${
              currentStep === item.step ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'
            }`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Step 1: Client Particulars */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fade-in py-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">Client Particulars</p>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Client Name</label>
                <input required {...register('clientName')} placeholder="e.g. Imran Khan" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                       style={{ background: 'var(--color-bg-sunken)', borderColor: errors.clientName ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text-primary)' }} />
                {errors.clientName && <span className="text-[10px] text-[var(--color-danger)] font-bold">{errors.clientName.message}</span>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Phone Number</label>
                <input required {...register('clientPhone')} placeholder="03xxxxxxxxx" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                       style={{ background: 'var(--color-bg-sunken)', borderColor: errors.clientPhone ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text-primary)' }} />
                {errors.clientPhone && <span className="text-[10px] text-[var(--color-danger)] font-bold">{errors.clientPhone.message}</span>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>WhatsApp Link Number (Optional)</label>
                <input {...register('clientWhatsapp')} placeholder="03xxxxxxxxx" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                       style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Event Parameters */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fade-in py-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">Event Settings</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Event Type</label>
                <select {...register('eventType')} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                        style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}>
                  {Object.entries(EVENT_TYPE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Event Date</label>
                <input required type="date" {...register('eventDate')} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                       style={{ background: 'var(--color-bg-sunken)', borderColor: errors.eventDate ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text-primary)' }} />
                {errors.eventDate && <span className="text-[10px] text-[var(--color-danger)] font-bold">{errors.eventDate.message}</span>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Venue / Hall Location</label>
                <input required {...register('venueName')} placeholder="e.g. Shalimar Marquee" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                       style={{ background: 'var(--color-bg-sunken)', borderColor: errors.venueName ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text-primary)' }} />
                {errors.venueName && <span className="text-[10px] text-[var(--color-danger)] font-bold">{errors.venueName.message}</span>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Guests Count</label>
                <input required type="number" {...register('guestCount', { valueAsNumber: true })} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                       style={{ background: 'var(--color-bg-sunken)', borderColor: errors.guestCount ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text-primary)' }} />
                {errors.guestCount && <span className="text-[10px] text-[var(--color-danger)] font-bold">{errors.guestCount.message}</span>}
                {watched.guestCount !== undefined && (
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold" style={{ color: 'var(--color-text-muted)' }}>
                    <span className={`inline-block h-2 w-2 rounded-full ${
                      watched.guestCount < 50 ? 'bg-[var(--color-danger)]' : watched.guestCount < 100 ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-success)]'
                    }`} />
                    Tier: {getGuestCountModifier(watched.guestCount).label}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Interactive Menu Planner */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fade-in py-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">Catering Selection</p>
                <h4 className="text-xs font-bold text-[var(--color-text-primary)] mt-0.5">Interactive Menu Planner</h4>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                {selectedMenuIds.length} Dishes Selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto max-h-[220px] p-0.5">
              {masterMenu.map((item) => {
                const isSelected = selectedMenuIds.includes(item._id)
                return (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedMenuIds(selectedMenuIds.filter(id => id !== item._id))
                      } else {
                        setSelectedMenuIds([...selectedMenuIds, item._id])
                      }
                    }}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all hover:scale-[1.01] ${
                      isSelected
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]/20 shadow-sm'
                        : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-sunken)]'
                    }`}
                  >
                    <span className="text-base shrink-0">{item.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">{item.name}</p>
                      <p className="text-[9px] font-bold text-[var(--color-accent)] font-mono">Rs. {item.price}</p>
                    </div>
                    <div className={`h-3.5 w-3.5 rounded border flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white' : 'border-[var(--color-border)]'
                    }`}>
                      {isSelected && (
                        <svg className="h-2 w-2 stroke-current stroke-[3px] fill-none" viewBox="0 0 24 24">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Live per-head breakdown detail */}
            <div className="rounded-lg p-3 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)] block">Menu Dishes Cost</span>
                <span className="font-bold font-mono text-[var(--color-text-secondary)]">
                  {formatRupees(selectedMenuIds.reduce((sum, id) => sum + (masterMenu.find(m => m._id === id)?.price || 0), 0))} / head
                </span>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)] block">Guest Tier Modifier</span>
                <span className={`font-bold font-mono ${
                  getGuestCountModifier(watched.guestCount || 0).amount > 0 
                    ? 'text-[var(--color-danger)]' 
                    : getGuestCountModifier(watched.guestCount || 0).amount < 0 
                      ? 'text-[var(--color-success)]' 
                      : 'text-[var(--color-text-secondary)]'
                }`}>
                  {getGuestCountModifier(watched.guestCount || 0).amount > 0 ? '+' : ''}
                  {formatRupees(getGuestCountModifier(watched.guestCount || 0).amount)} / head
                  <span className="text-[9px] block font-normal font-sans text-[var(--color-text-muted)] leading-tight">
                    ({getGuestCountModifier(watched.guestCount || 0).label})
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Financial Sheet */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fade-in py-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">Financial Quotation & Pricing</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Pricing Quotation Model</label>
                <select {...register('packageType')} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                        style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}>
                  <option value="per_head">Per Head Charge Pricing</option>
                  <option value="fixed">Fixed Contract Value Sum</option>
                </select>
              </div>

              {watched.packageType === 'per_head' ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Price Per Head (Rs.)</label>
                  <input required type="number" {...register('perHeadPrice', { valueAsNumber: true })} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)] font-mono"
                         style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Fixed Base Price (Rs.)</label>
                  <input required type="number" {...register('totalContractValue', { valueAsNumber: true })} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)] font-mono"
                         style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Discount Allowed (Rs.)</label>
                <input type="number" {...register('discountAmount', { valueAsNumber: true })} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)] font-mono"
                       style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Contract Booking Status</label>
                <select {...register('status')} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                        style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}>
                  <option value="confirmed">Confirmed</option>
                  <option value="inquiry">Inquiry</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Discount Reason (Optional)</label>
                <input {...register('discountReason')} placeholder="e.g. Special off-season discount" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                       style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
              </div>
            </div>

            {/* Dynamic live calculation output card */}
            <div className="pt-3 mt-2 border-t border-[var(--color-border)] flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--color-text-secondary)]">Calculated Contract Value Liability:</span>
              <span className="text-base font-black font-mono text-[var(--color-accent)]">{formatRupees(calculatedTotal)}</span>
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border)] mt-4">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                className="px-4 py-2 text-sm font-semibold transition-colors hover:bg-[var(--color-bg-sunken)] rounded-lg text-[var(--color-text-secondary)]"
              >
                Back
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={closeNewBooking}
              className="px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-bg-sunken)] rounded-lg text-[var(--color-text-secondary)]"
            >
              Cancel
            </button>
            
            {currentStep < 4 ? (
              <button
                key="btn-continue"
                type="button"
                onClick={handleNext}
                className="rounded-lg px-6 py-2 text-sm font-bold uppercase tracking-wider transition-all hover:brightness-110 active:scale-[0.97]"
                style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}
              >
                Continue
              </button>
            ) : (
              <button
                key="btn-submit"
                type="submit"
                disabled={createBooking.isPending}
                className="flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-bold uppercase tracking-wider transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-50"
                style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}
              >
                {createBooking.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Booking
              </button>
            )}
          </div>
        </div>
      </form>
    </ResponsiveModal>
  )
}
