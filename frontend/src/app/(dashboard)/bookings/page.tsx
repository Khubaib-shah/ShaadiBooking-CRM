'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Plus, Download, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'
import PageHeader from '@/components/shared/PageHeader'
import StatusBadge from '@/components/shared/StatusBadge'
import EmptyState from '@/components/shared/EmptyState'
import SearchInput from '@/components/shared/SearchInput'
import DataTable from '@/components/shared/DataTable'
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

  const columns = useMemo<ColumnDef<(typeof DEMO)[number]>[]>(
    () => [
      {
        header: 'Ref',
        accessorKey: 'ref',
        cell: ({ row }) => <span className="text-xs font-medium text-[#556ee6]" style={{ fontFamily: 'var(--font-mono)' }}>{row.original.ref}</span>,
      },
      {
        header: 'Client',
        accessorKey: 'client',
        cell: ({ row }) => <span className="font-medium text-[#343a40]">{row.original.client}</span>,
      },
      {
        header: 'Event',
        accessorKey: 'type',
        cell: ({ row }) => (
          <span className="rounded px-1.5 py-0.5 text-[10px] font-medium" style={{ background: 'var(--color-accent-soft)', color: 'var(--color-accent)' }}>
            {EVENT_TYPE_LABELS[row.original.type]}
          </span>
        ),
      },
      {
        header: 'Date',
        accessorKey: 'date',
        cell: ({ row }) => (
          <div>
            <p className="text-[13px] text-[#343a40]">{formatDate(row.original.date)}</p>
            <p className="text-[11px] text-[#74788d]">{relativeTime(row.original.date)}</p>
          </div>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        header: 'Contract',
        accessorKey: 'contract',
        cell: ({ row }) => <span style={{ fontFamily: 'var(--font-mono)' }}>{formatRupees(row.original.contract, true)}</span>,
      },
      {
        header: 'Outstanding',
        accessorKey: 'outstanding',
        cell: ({ row }) => <span className="text-[#f1b44c]" style={{ fontFamily: 'var(--font-mono)' }}>{formatRupees(row.original.outstanding, true)}</span>,
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <Link href={`/bookings/${row.original._id}`} className="rounded-md px-2 py-1 text-[11px] font-semibold text-[#74788d] hover:bg-[#f1f3f5]">
            View
          </Link>
        ),
      },
    ],
    []
  )

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
      ) : <DataTable columns={columns} data={filtered} emptyMessage="No bookings found for current filters." />}
    </div>
  )
}
