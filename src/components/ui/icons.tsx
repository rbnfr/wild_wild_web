type IconProps = { className?: string }

const common = {
  'aria-hidden': true,
  focusable: false,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
} as const

export function IrisMark({ className }: IconProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="var(--color-ambar)" />
      <circle cx="12" cy="12" r="5.5" fill="var(--color-abeto)" />
      <circle cx="14.2" cy="9.8" r="1.6" fill="var(--color-ambar)" />
    </svg>
  )
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg {...common} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...common} className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function ExternalIcon({ className }: IconProps) {
  return (
    <svg {...common} className={className}>
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  )
}

export function CheckCircleIcon({ className }: IconProps) {
  return (
    <svg {...common} className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12.5l2.7 2.7L16 9.5" />
    </svg>
  )
}

export function AlertIcon({ className }: IconProps) {
  return (
    <svg {...common} className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 7.5v5.5M12 16.5h.01" />
    </svg>
  )
}
