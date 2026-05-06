'use client'

import { useState } from 'react'
import { Plus, Phone, MoreHorizontal } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import AddStaffModal from '@/components/shared/modals/AddStaffModal'

const DEMO_STAFF = [
  { _id:'1', name:'Ali Hassan', phone:'03121234567', role:'Head Chef', isActive:true, upcomingCount:3 },
  { _id:'2', name:'Bilal Ahmed', phone:'03009876543', role:'Waiter Captain', isActive:true, upcomingCount:2 },
  { _id:'3', name:'Kamran Iqbal', phone:'03111234567', role:'Decorator', isActive:true, upcomingCount:1 },
  { _id:'4', name:'Farhan Shah', phone:'03221234567', role:'Driver', isActive:false, upcomingCount:0 },
]

const AVATAR_COLORS = ['var(--color-accent)', 'var(--color-success)', 'var(--color-info)', 'var(--color-warning)']

function maskPhone(phone: string) {
  return phone.slice(0,4) + '-***-' + phone.slice(-4)
}

export default function StaffPage() {
  const [addStaffOpen, setAddStaffOpen] = useState(false)
  return (
    <div>
      <PageHeader title="Staff" description="Manage your team members"
        actions={<button onClick={() => setAddStaffOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all hover:brightness-110 active:scale-[0.97]" style={{ background:'var(--color-accent)', color:'var(--color-text-inverse)' }}><Plus className="h-4 w-4" /> Add Staff</button>} />

      <AddStaffModal open={addStaffOpen} onOpenChange={setAddStaffOpen} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_STAFF.map((s, i) => (
          <div key={s._id} className="rounded-xl border p-5 transition-all duration-150 hover:border-[var(--color-border-mid)]"
            style={{ background:'var(--color-bg-elevated)', borderColor:'var(--color-border)' }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] + '22', color: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                  {s.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color:'var(--color-text-primary)' }}>{s.name}</p>
                  <p className="text-xs" style={{ color:'var(--color-text-muted)' }}>{s.role}</p>
                </div>
              </div>
              <button className="h-7 w-7 flex items-center justify-center rounded-md transition-colors hover:bg-[var(--color-border)]" aria-label="More options">
                <MoreHorizontal className="h-4 w-4" style={{ color:'var(--color-text-muted)' }} />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Phone className="h-3 w-3" style={{ color:'var(--color-text-muted)' }} />
              <span className="text-xs" style={{ fontFamily:'var(--font-mono)', color:'var(--color-text-secondary)' }}>{maskPhone(s.phone)}</span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: s.isActive ? 'var(--color-success-bg)' : 'var(--color-danger-bg)', color: s.isActive ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {s.isActive ? 'Active' : 'Inactive'}
              </span>
              {s.upcomingCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background:'var(--color-info-bg)', color:'var(--color-info)' }}>
                  {s.upcomingCount} upcoming
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
