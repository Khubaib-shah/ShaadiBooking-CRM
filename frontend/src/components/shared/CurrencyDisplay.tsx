import { formatRs } from '@/lib/utils/currency'

interface CurrencyDisplayProps {
  value: number
  compact?: boolean
  className?: string
}

export default function CurrencyDisplay({ value, compact = false, className }: CurrencyDisplayProps) {
  return (
    <span className={className} style={{ fontFamily: 'var(--font-mono)' }}>
      {formatRs(value, compact)}
    </span>
  )
}

