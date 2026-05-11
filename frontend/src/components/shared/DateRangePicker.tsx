'use client'

interface DateRangePickerProps {
  from?: string
  to?: string
  onChange?: (range: { from: string; to: string }) => void
}

export default function DateRangePicker({ from = '', to = '', onChange }: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={from}
        onChange={(e) => onChange?.({ from: e.target.value, to })}
        className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[13px]"
      />
      <span className="text-[12px] text-[var(--color-text-muted)]">to</span>
      <input
        type="date"
        value={to}
        onChange={(e) => onChange?.({ from, to: e.target.value })}
        className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[13px]"
      />
    </div>
  )
}

