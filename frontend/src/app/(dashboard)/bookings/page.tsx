'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Plus, Download, BookOpen, Loader2 } from 'lucide-react'
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
import { useBookings } from '@/lib/hooks/useBookings'
import type { Booking } from '@/types'

const STATUSES = ['all', 'inquiry', 'confirmed', 'deposit_received', 'balance_pending', 'completed', 'cancelled'] as const

export default function BookingsPage() {
  const [activeStatus, setActiveStatus] = useState<string>('all')
  const [search, setSearch] = useState('')
  const { openNewBooking } = useUIStore()

  // Dynamic real-time React Query hook for state persistence
  const { data: resp, isLoading } = useBookings({
    status: activeStatus,
    search,
  })

  const bookingsList = resp?.data || []

  const columns = useMemo<ColumnDef<Booking>[]>(
    () => [
      {
        header: 'Ref',
        accessorKey: 'referenceNumber',
        cell: ({ row }) => (
          <span className="text-xs font-semibold text-[#556ee6]" style={{ fontFamily: 'var(--font-mono)' }}>
            {row.original.referenceNumber}
          </span>
        ),
      },
      {
        header: 'Client',
        accessorKey: 'clientName',
        cell: ({ row }) => <span className="font-semibold text-[#343a40]">{row.original.clientName}</span>,
      },
      {
        header: 'Event',
        accessorKey: 'eventType',
        cell: ({ row }) => (
          <span className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ background: 'var(--color-accent-soft)', color: 'var(--color-accent)' }}>
            {EVENT_TYPE_LABELS[row.original.eventType] || row.original.eventType}
          </span>
        ),
      },
      {
        header: 'Date',
        accessorKey: 'eventDate',
        cell: ({ row }) => (
          <div>
            <p className="text-[13px] font-semibold text-[#343a40]">{formatDate(row.original.eventDate)}</p>
            <p className="text-[11px] text-[#74788d]">{relativeTime(row.original.eventDate)}</p>
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
        accessorKey: 'totalContractValue',
        cell: ({ row }) => (
          <span className="font-semibold font-mono text-xs text-[#343a40]">
            {formatRupees(row.original.totalContractValue, true)}
          </span>
        ),
      },
      {
        header: 'Outstanding',
        accessorKey: 'totalOutstanding',
        cell: ({ row }) => (
          <span className="font-semibold font-mono text-xs text-[#f1b44c]">
            {formatRupees(row.original.totalOutstanding, true)}
          </span>
        ),
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <Link href={`/bookings/${row.original._id}`} className="rounded-md px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-[#74788d] hover:bg-[#f1f3f5] border border-[var(--color-border)]">
            View
          </Link>
        ),
      },
    ],
    []
  )

  return (
    <div>
      <PageHeader
        title="Bookings"
        description="Manage, trace, and audit all localized wedding contracts"
        actions={
          <button
            onClick={openNewBooking}
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all hover:brightness-110 active:scale-[0.97]"
            style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}
          >
            <Plus className="h-4 w-4" /> New Booking
          </button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-1 overflow-x-auto">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                background: activeStatus === s ? 'var(--color-accent-soft)' : 'transparent',
                color: activeStatus === s ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              }}
            >
              {s === 'all' ? 'All' : s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="w-64">
            <SearchInput placeholder="Search bookings..." onSearch={setSearch} />
          </div>
          <button
            onClick={() => toast.success('Exporting bookings to CSV...')}
            className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-[var(--color-border)]"
            style={{ borderColor: 'var(--color-border)' }}
            aria-label="Export"
          >
            <Download className="h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-xs font-semibold text-[var(--color-text-muted)]">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)] mb-3" />
          Synchronizing contracts list...
        </div>
      ) : bookingsList.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No bookings yet"
          description="Create your first booking to get started"
          action={{ label: 'Create Booking', onClick: openNewBooking }}
        />
      ) : (
        <DataTable columns={columns} data={bookingsList} emptyMessage="No bookings found for current filters." />
      )}
    </div>
  )
}
