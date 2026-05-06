'use client'

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'

const steps = ['Client Info', 'Event Details', 'Financial Terms', 'Additional']

export default function NewBookingPage() {
  const [step, setStep] = useState(0)

  return (
    <PageWrapper>
      <PageHeader title="New Booking" description="Create booking through 4-step guided form" />
      <div className="rounded-xl border border-[#e9ecef] bg-white p-5">
        <div className="mb-6 flex flex-wrap gap-2">
          {steps.map((label, idx) => (
            <span key={label} className={`rounded-full px-3 py-1 text-[12px] font-semibold ${idx <= step ? 'bg-[#eef2ff] text-[#556ee6]' : 'bg-[#f1f3f5] text-[#74788d]'}`}>
              Step {idx + 1}: {label}
            </span>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input className="rounded-lg border border-[#e9ecef] px-3 py-2 text-[13px]" placeholder="Client Name" />
          <input className="rounded-lg border border-[#e9ecef] px-3 py-2 text-[13px]" placeholder="Phone (03xxxxxxxxx)" />
          <select className="rounded-lg border border-[#e9ecef] px-3 py-2 text-[13px]">
            <option>Event Type</option>
            <option>Barat</option>
            <option>Mehndi</option>
            <option>Valima</option>
            <option>Nikah</option>
          </select>
          <input type="date" className="rounded-lg border border-[#e9ecef] px-3 py-2 text-[13px]" />
        </div>
        <div className="mt-6 flex justify-between">
          <button disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))} className="rounded-lg border border-[#e9ecef] px-4 py-2 text-[13px] font-semibold text-[#74788d] disabled:opacity-50">Back</button>
          {step < 3 ? (
            <button onClick={() => setStep((s) => Math.min(3, s + 1))} className="rounded-lg bg-[#556ee6] px-4 py-2 text-[13px] font-semibold text-white">Next</button>
          ) : (
            <button className="rounded-lg bg-[#34c38f] px-4 py-2 text-[13px] font-semibold text-white">Create Booking</button>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}

