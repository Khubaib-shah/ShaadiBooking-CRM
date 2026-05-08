'use client'

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useMemo, useState } from 'react'

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  emptyMessage?: string
}

export default function DataTable<TData>({ columns, data, emptyMessage = 'No records found.' }: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  const pageCountLabel = useMemo(() => {
    const total = table.getFilteredRowModel().rows.length
    const start = total === 0 ? 0 : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1
    const end = Math.min(total, (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize)
    return `Showing ${start}-${end} of ${total}`
  }, [table])

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-[#e9ecef] bg-white">
        <table className="w-full min-w-[800px]">
          <thead className="sticky top-0 bg-[#f8f9fa]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-[#74788d]"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        onClick={header.column.getToggleSortingHandler()}
                        className="inline-flex items-center gap-1"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === 'asc' && <ChevronUp className="h-3 w-3" />}
                        {header.column.getIsSorted() === 'desc' && <ChevronDown className="h-3 w-3" />}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-[13px] text-[#74788d]">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t border-[#e9ecef] text-[13px] text-[#495057] hover:bg-[#f8f9fa]">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-top">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-[#e9ecef] bg-white px-4 py-3">
        <p className="text-[12px] text-[#74788d]">{pageCountLabel}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-lg border border-[#e9ecef] px-3 py-1.5 text-[12px] font-semibold text-[#74788d] disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-lg border border-[#e9ecef] px-3 py-1.5 text-[12px] font-semibold text-[#74788d] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

