interface StatusDotProps {
  tone: 'success' | 'warning' | 'danger' | 'info'
  label?: string
}

const toneMap = {
  success: '#34c38f',
  warning: '#f1b44c',
  danger: '#f46a6a',
  info: '#50a5f1',
}

export default function StatusDot({ tone, label }: StatusDotProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-text-muted)]">
      <span className="h-2 w-2 rounded-full" style={{ background: toneMap[tone] }} />
      {label}
    </span>
  )
}

