interface PhoneDisplayProps {
  phone: string
}

export default function PhoneDisplay({ phone }: PhoneDisplayProps) {
  const normalized = phone.startsWith('0') ? phone : `0${phone}`
  const formatted = normalized.length >= 11 ? `${normalized.slice(0, 4)}-${normalized.slice(4, 11)}` : normalized

  return (
    <a
      href={`https://wa.me/92${normalized.slice(1)}`}
      target="_blank"
      rel="noreferrer"
      className="text-[13px] text-[var(--color-text-muted)] hover:text-[#556ee6]"
    >
      {formatted}
    </a>
  )
}

