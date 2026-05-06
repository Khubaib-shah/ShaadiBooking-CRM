export function formatRs(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 10_00_000) return `Rs. ${(amount / 10_00_000).toFixed(1)}L`
    if (amount >= 1_00_000) return `Rs. ${(amount / 1_00_000).toFixed(1)}L`
    if (amount >= 1_000) return `Rs. ${(amount / 1_000).toFixed(0)}K`
    return `Rs. ${amount.toLocaleString('en-PK')}`
  }
  return `Rs. ${amount.toLocaleString('en-PK')}`
}

export function formatRsCompact(amount: number): string {
  return formatRs(amount, true)
}

export function formatRupees(amount: number, compact = false): string {
  return formatRs(amount, compact)
}

export function parseAmount(value: string): number {
  return Number(value.replace(/[^0-9.]/g, ''))
}
