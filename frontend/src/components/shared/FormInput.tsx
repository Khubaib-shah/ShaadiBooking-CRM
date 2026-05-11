import React from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  register?: any
  wrapperClassName?: string
  rightElement?: React.ReactNode
}

export function FormInput({
  label,
  error,
  register,
  wrapperClassName = '',
  className = '',
  rightElement,
  ...props
}: FormInputProps) {
  return (
    <div className={wrapperClassName}>
      <label className="block mb-1.5 text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </label>
      <div className="relative">
        <input
          {...(register || {})}
          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)] ${rightElement ? 'pr-10' : ''} ${className}`}
          style={{
            background: 'var(--color-bg-sunken)',
            borderColor: error ? 'var(--color-danger)' : 'var(--color-border)',
            color: 'var(--color-text-primary)'
          }}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <span className="block mt-[1px] text-[10px] text-[var(--color-danger)] font-normal">
          {error}
        </span>
      )}
    </div>
  )
}
