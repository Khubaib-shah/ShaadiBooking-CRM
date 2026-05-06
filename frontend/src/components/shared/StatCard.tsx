'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  subvalue?: string
  trend?: { value: number; positive: boolean }
  accent?: 'gold' | 'green' | 'amber' | 'blue'
  index?: number
}

const ACCENT_COLORS = {
  gold:  'var(--color-accent)',
  green: 'var(--color-success)',
  amber: 'var(--color-warning)',
  blue:  'var(--color-info)',
}

export default function StatCard({ label, value, subvalue, trend, accent = 'gold', index = 0 }: StatCardProps) {
  const accentColor = ACCENT_COLORS[accent]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-xl border p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_3px_8px_rgba(15,23,42,0.06)] transition-all duration-200 ease-in-out hover:-translate-y-[2px] hover:shadow-[0_4px_14px_rgba(15,23,42,0.12)]"
      style={{
        background: 'var(--color-bg-elevated)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Label */}
      <p
        className="text-[13px] font-medium"
        style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
      >
        {label}
      </p>

      {/* Big number */}
      <p
        className="mt-2 text-[24px] font-semibold leading-none"
        style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}
      >
        {value}
      </p>

      {/* Subvalue / trend */}
      <div className="mt-2 flex items-center gap-2">
        {trend && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: trend.positive ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {trend.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.value}%
          </span>
        )}
        {subvalue && (
          <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{subvalue}</span>
        )}
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px]"
        style={{ background: accentColor, opacity: 0.6 }}
      />
    </motion.div>
  )
}
