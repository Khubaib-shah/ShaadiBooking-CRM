'use client'

import Link from 'next/link'
import { Plus, Download } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import PhoneDisplay from '@/components/shared/PhoneDisplay'
import StatusDot from '@/components/shared/StatusDot'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'

const workers = [
  { id: 'w1', name: 'Ahmed Ali', role: 'Head Waiter', type: 'Permanent', phone: '03212345678', salary: 30000, events: 8, active: true },
  { id: 'w2', name: 'Rashid Hussain', role: 'Waiter', type: 'Temporary', phone: '03001234567', salary: 1500, events: 6, active: true },
  { id: 'w3', name: 'Muhammad Aslam', role: 'Chef', type: 'Permanent', phone: '03451234567', salary: 45000, events: 10, active: true },
  { id: 'w4', name: 'Tariq Mehmood', role: 'Electrician', type: 'Contractor', phone: '03211234567', salary: 3000, events: 4, active: false },
]

export default function WorkersPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Workforce"
        description="Roster and availability of all workers"
        actions={
          <>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#e9ecef] bg-white px-3 py-2 text-xs font-semibold text-[#74788d]">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-[#556ee6] px-3 py-2 text-xs font-semibold text-white">
              <Plus className="h-4 w-4" />
              Add Worker
            </button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {workers.map((worker) => (
          <div key={worker.id} className="rounded-xl border border-[#e9ecef] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <Link href={`/workers/${worker.id}`} className="text-[15px] font-semibold text-[#343a40] hover:text-[#556ee6]">
                  {worker.name}
                </Link>
                <p className="text-[13px] text-[#74788d]">{worker.role}</p>
              </div>
              <StatusDot tone={worker.active ? 'success' : 'warning'} label={worker.active ? 'Available' : 'Busy'} />
            </div>
            <div className="space-y-1 text-[13px] text-[#495057]">
              <p>Type: {worker.type}</p>
              <p>Phone: <PhoneDisplay phone={worker.phone} /></p>
              <p>Events this month: {worker.events}</p>
              <p>{worker.type === 'Permanent' ? 'Monthly Salary' : 'Rate'}: <CurrencyDisplay value={worker.salary} compact /></p>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}

