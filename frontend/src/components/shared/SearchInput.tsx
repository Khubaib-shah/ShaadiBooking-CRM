'use client'

import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDebounce } from '@/lib/hooks/useDebounce'

interface SearchInputProps {
  placeholder?: string
  onSearch: (value: string) => void
  delay?: number
}

export default function SearchInput({ placeholder = 'Search...', onSearch, delay = 400 }: SearchInputProps) {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, delay)

  useEffect(() => {
    onSearch(debouncedValue ?? '')
  }, [debouncedValue, onSearch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-[13px] transition-colors focus:outline-none"
        style={{
          background: 'var(--color-bg-sunken)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-primary)',
        }}
      />
    </div>
  )
}
