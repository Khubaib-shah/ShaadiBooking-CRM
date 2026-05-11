import React from 'react'

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  register?: any
  wrapperClassName?: string
  children: React.ReactNode
}

export function FormSelect({
  label,
  error,
  register,
  wrapperClassName = '',
  className = '',
  children,
  ...props
}: FormSelectProps) {
  return (
    <div className={wrapperClassName}>
      <label className="block mb-1.5 text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </label>
      <select
        {...(register || {})}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)] ${className}`}
        style={{
          background: 'var(--color-bg-sunken)',
          borderColor: error ? 'var(--color-danger)' : 'var(--color-border)',
          color: 'var(--color-text-primary)'
        }}
        {...props}
      >
        {children}
      </select>
      {error && (
        <span className="block mt-[1px] text-[10px] text-[var(--color-danger)] font-normal">
          {error}
        </span>
      )}
    </div>
  )
}
