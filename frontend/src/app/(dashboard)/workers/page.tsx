'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Download, Grid, List, Phone, Users, Calendar, Banknote } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import type { ColumnDef } from '@tanstack/react-table'
import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import PhoneDisplay from '@/components/shared/PhoneDisplay'
import StatusDot from '@/components/shared/StatusDot'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'
import SearchInput from '@/components/shared/SearchInput'
import DataTable from '@/components/shared/DataTable'
import StatCard from '@/components/shared/StatCard'

import { mockDb, type MockWorker } from '@/lib/utils/mockDb'

const ROLE_LABELS: Record<string, string> = {
  waiter: '🍽 Waiter',
  head_waiter: '👨‍🍳 Head Waiter',
  chef: '🧑‍🍳 Chef',
  electrician: '⚡ Electrician',
  manager: '👔 Manager',
  driver: '🚗 Driver',
  helper: '🤝 Helper',
  generator_operator: '⚙️ Generator Op',
}

const ROLE_STRIP_COLORS: Record<string, string> = {
  waiter: '#50a5f1',       // blue
  head_waiter: '#6f42c1',  // purple
  chef: '#f1b44c',         // orange/amber
  electrician: '#f46a6a',  // red/danger
  manager: '#34c38f',      // green
  driver: '#74788d',       // grey
  helper: '#6c757d',       // slate
  generator_operator: '#3b4db5', // indigo
}

export default function WorkersPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])
  
  const workersData = useMemo(() => mockDb.getWorkers(), [])

  const filtered = useMemo(() => {
    return workersData.filter(w => {
      const matchSearch = w.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || w.phone.includes(debouncedSearch)
      const matchType = typeFilter === 'all' || w.type === typeFilter
      const matchRole = roleFilter === 'all' || w.role === roleFilter
      return matchSearch && matchType && matchRole
    })
  }, [workersData, debouncedSearch, typeFilter, roleFilter])

  const stats = useMemo(() => {
    const total = workersData.length
    const active = workersData.filter(w => w.active).length
    const permanent = workersData.filter(w => w.type === 'permanent').length
    const temporary = workersData.filter(w => w.type === 'temporary').length
    return { total, active, permanent, temporary }
  }, [workersData])

  const columns = useMemo<ColumnDef<MockWorker>[]>(
    () => [
      {
        header: 'Worker Name',
        accessorKey: 'name',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                 style={{
                   background: (ROLE_STRIP_COLORS[row.original.role] || '#556ee6') + '22',
                   color: ROLE_STRIP_COLORS[row.original.role] || '#556ee6'
                 }}>
              {row.original.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <Link href={`/workers/${row.original.id}`} className="font-semibold text-[var(--color-text-primary)] hover:text-[#556ee6]">
                {row.original.name}
              </Link>
              <p className="text-[11px] text-[var(--color-text-muted)] capitalize">{row.original.type}</p>
            </div>
          </div>
        ),
      },
      {
        header: 'Primary Role',
        accessorKey: 'role',
        cell: ({ row }) => (
          <span className="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold bg-[var(--color-bg-sunken)]" style={{ color: 'var(--color-text-secondary)' }}>
            {ROLE_LABELS[row.original.role] || row.original.role}
          </span>
        ),
      },
      {
        header: 'Phone Number',
        accessorKey: 'phone',
        cell: ({ row }) => <PhoneDisplay phone={row.original.phone} />,
      },
      {
        header: 'Events Worked',
        accessorKey: 'events',
        cell: ({ row }) => <span className="font-medium">{row.original.events} events</span>,
      },
      {
        header: 'Salary / Rate',
        accessorKey: 'salary',
        cell: ({ row }) => (
          <div className="font-medium">
            <CurrencyDisplay value={row.original.salary} compact />
            <span className="text-[10px] text-[var(--color-text-muted)] block">
              {row.original.type === 'permanent' ? 'per month' : 'per event'}
            </span>
          </div>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'active',
        cell: ({ row }) => (
          <StatusDot tone={row.original.active ? 'success' : 'warning'} label={row.original.active ? 'Available' : 'Busy'} />
        ),
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <Link href={`/workers/${row.original.id}`} className="rounded-md border border-[var(--color-border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-sunken)] transition-all">
            Profile
          </Link>
        ),
      },
    ],
    []
  )

  return (
    <PageWrapper>
      <PageHeader
        title="Workforce"
        description="Staff list and availability of banquet hall workers"
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => toast.success('Exporting staff list to Excel...')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-sunken)] transition-all"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <Link
              href="/workers/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#556ee6] px-3 py-2 text-xs font-semibold text-white hover:brightness-110 active:scale-[0.97] transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Worker
            </Link>
          </div>
        }
      />

      {/* Roster summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Total Staff Registered" value={stats.total} accent="gold" index={0} />
        <StatCard label="Available Today" value={stats.active} accent="green" index={1} />
        <StatCard label="Permanent Staff" value={stats.permanent} accent="blue" index={2} />
        <StatCard label="Temporary (Wages)" value={stats.temporary} accent="amber" index={3} />
      </div>

      {/* Advanced Filter Bar */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Worker Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent)] bg-[var(--color-bg-elevated)]"
          >
            <option value="all">All Types</option>
            <option value="permanent">Permanent</option>
            <option value="temporary">Temporary</option>
            <option value="contractor">Contractor</option>
          </select>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent)] bg-[var(--color-bg-elevated)]"
          >
            <option value="all">All Roles</option>
            {Object.entries(ROLE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-56 md:w-64">
            <SearchInput placeholder="Search staff list by name..." onSearch={setSearch} />
          </div>

          {/* Grid/Table view toggles */}
          <div className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] p-1 bg-[var(--color-bg-sunken)]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-[var(--color-bg-elevated)] shadow-sm text-[#556ee6]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-[var(--color-bg-elevated)] shadow-sm text-[#556ee6]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}
              aria-label="Table view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or Table render */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 text-center" style={{ minHeight: '200px' }}>
          <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">No staff members found</p>
          <p className="text-xs text-[var(--color-text-muted)]">Try adjusting your filters or search criteria.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((worker, i) => {
            const roleColor = ROLE_STRIP_COLORS[worker.role] || '#556ee6'
            return (
              <motion.div
                key={worker.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.2, delay: i * 0.04 } }}
                whileHover={{ y: -2, transition: { duration: 0.15, ease: 'easeInOut' } }}
                className="relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)] hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-shadow duration-200"
              >
                {/* Colored role strip */}
                <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ background: roleColor }} />

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Circle avatar */}
                    <div className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold shadow-sm"
                         style={{ background: roleColor + '15', color: roleColor }}>
                      {worker.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <Link href={`/workers/${worker.id}`} className="text-sm font-semibold text-[var(--color-text-primary)] hover:text-[#556ee6] transition-colors block">
                        {worker.name}
                      </Link>
                      <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: roleColor }}>
                        {ROLE_LABELS[worker.role]?.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]\s*/g, '') || worker.role}
                      </span>
                    </div>
                  </div>
                  <StatusDot tone={worker.active ? 'success' : 'warning'} label={worker.active ? 'Available' : 'Busy'} />
                </div>

                <div className="space-y-1.5 text-[12px] text-[var(--color-text-secondary)] border-b pb-4 mb-4 border-[var(--color-border)]">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)] font-medium">Type</span>
                    <span className="font-semibold capitalize text-[var(--color-text-primary)]">{worker.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)] font-medium">Phone</span>
                    <span><PhoneDisplay phone={worker.phone} /></span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)] font-medium">Events Month</span>
                    <span className="font-semibold text-[var(--color-text-primary)]">{worker.events} events</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)] font-medium">
                      {worker.type === 'permanent' ? 'Monthly Salary' : 'Event Wage'}
                    </span>
                    <span className="font-mono font-bold text-[var(--color-text-primary)]">
                      <CurrencyDisplay value={worker.salary} />
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/workers/${worker.id}`} className="flex-1 text-center py-2 text-xs font-semibold rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-sunken)] transition-all">
                    View Profile
                  </Link>
                  <a
                    href={`https://wa.me/92${worker.phone.slice(1)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] text-[#25d366] hover:bg-[#25d366]/10 transition-all"
                    aria-label="WhatsApp"
                  >
                    <Phone className="h-4 w-4 fill-current" />
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} emptyMessage="No staff members found matching criteria." />
      )}
    </PageWrapper>
  )
}
