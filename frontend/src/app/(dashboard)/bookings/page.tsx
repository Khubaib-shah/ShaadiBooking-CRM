'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Eye, Download, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import PageHeader from '@/components/shared/PageHeader'
import StatusBadge from '@/components/shared/StatusBadge'
import EmptyState from '@/components/shared/EmptyState'
import SearchInput from '@/components/shared/SearchInput'
import { formatRupees } from '@/lib/utils/currency'
import { formatDate, relativeTime } from '@/lib/utils/dates'
import { EVENT_TYPE_LABELS } from '@/lib/utils/booking'
import { useUIStore } from '@/lib/store/uiStore'
import type { BookingStatus, EventType } from '@/types/booking.types'

const STATUSES = ['all','inquiry','confirmed','deposit_received','balance_pending','completed','cancelled'] as const

const DEMO = [
  { _id:'1', ref:'BK-2025-0019', client:'Ahmed Khan', type:'barat' as EventType, date:'2025-06-15', status:'confirmed' as BookingStatus, contract:850000, outstanding:350000 },
  { _id:'2', ref:'BK-2025-0020', client:'Sara Ali', type:'mehndi' as EventType, date:'2025-06-18', status:'deposit_received' as BookingStatus, contract:320000, outstanding:120000 },
  { _id:'3', ref:'BK-2025-0021', client:'Usman Sheikh', type:'valima' as EventType, date:'2025-06-20', status:'balance_pending' as BookingStatus, contract:1100000, outstanding:500000 },
  { _id:'4', ref:'BK-2025-0022', client:'Fatima Raza', type:'nikah' as EventType, date:'2025-06-22', status:'confirmed' as BookingStatus, contract:600000, outstanding:200000 },
  { _id:'5', ref:'BK-2025-0023', client:'Imran Ahmed', type:'dholki' as EventType, date:'2025-06-25', status:'inquiry' as BookingStatus, contract:150000, outstanding:150000 },
]

export default function BookingsPage() {
  const [activeStatus, setActiveStatus] = useState<string>('all')
  const [search, setSearch] = useState('')
  const { openNewBooking } = useUIStore()

  const filtered = DEMO.filter(b => {
    if (activeStatus !== 'all' && b.status !== activeStatus) return false
    if (search && !b.client.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <PageHeader title="Bookings" description="Manage all your wedding bookings"
        actions={<button onClick={openNewBooking} className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all hover:brightness-110 active:scale-[0.97]" style={{ background:'var(--color-accent)', color:'var(--color-text-inverse)' }}><Plus className="h-4 w-4" /> New Booking</button>} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-1 overflow-x-auto">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setActiveStatus(s)} className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
              style={{ background: activeStatus === s ? 'var(--color-accent-soft)' : 'transparent', color: activeStatus === s ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}>
              {s === 'all' ? 'All' : s.replace(/_/g,' ').replace(/\b\w/g, c => c.toUpperCase())}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="w-64"><SearchInput placeholder="Search bookings..." onSearch={setSearch} /></div>
          <button 
            onClick={() => toast.success('Exporting bookings to CSV...')}
            className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-[var(--color-border)]" style={{ borderColor:'var(--color-border)' }} aria-label="Export">
            <Download className="h-4 w-4" style={{ color:'var(--color-text-secondary)' }} />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="No bookings yet" description="Create your first booking to get started" action={{ label:'Create Booking', onClick: openNewBooking }} />
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor:'var(--color-border)' }}>
          <table className="w-full">
            <thead><tr style={{ background:'var(--color-bg-sunken)' }}>
              {['Ref','Client','Event','Date','Status','Contract','Outstanding',''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color:'var(--color-text-muted)' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{filtered.map(b => (
              <tr key={b._id} className="border-t transition-all duration-150 hover:bg-[var(--color-bg-elevated)] hover:translate-x-[2px]" style={{ borderColor:'var(--color-border)' }}>
                <td className="px-4 py-3"><span className="text-xs font-medium" style={{ fontFamily:'var(--font-mono)', color:'var(--color-accent)' }}>{b.ref}</span></td>
                <td className="px-4 py-3"><span className="text-[var(--text-sm)] font-medium" style={{ color:'var(--color-text-primary)' }}>{b.client}</span></td>
                <td className="px-4 py-3"><span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background:'var(--color-accent-soft)', color:'var(--color-accent)' }}>{EVENT_TYPE_LABELS[b.type]}</span></td>
                <td className="px-4 py-3"><p className="text-[var(--text-sm)]" style={{ color:'var(--color-text-primary)' }}>{formatDate(b.date)}</p><p className="text-[10px]" style={{ color:'var(--color-text-muted)' }}>{relativeTime(b.date)}</p></td>
                <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                <td className="px-4 py-3"><span style={{ fontFamily:'var(--font-mono)', color:'var(--color-text-primary)', fontSize:'var(--text-sm)' }}>{formatRupees(b.contract, true)}</span></td>
                <td className="px-4 py-3"><span style={{ fontFamily:'var(--font-mono)', color:'var(--color-warning)', fontSize:'var(--text-sm)' }}>{formatRupees(b.outstanding, true)}</span></td>
                <td className="px-4 py-3"><Link href={`/bookings/${b._id}`} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-colors hover:bg-[var(--color-border)]" style={{ color:'var(--color-text-secondary)' }}><Eye className="h-3 w-3" />View</Link></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}
