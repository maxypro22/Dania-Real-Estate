interface LocationIconProps {
  size?: number
  className?: string
}

/** Modern map-pin glyph (filled teardrop with a clean inner dot). */
export function LocationIcon({ size = 20, className }: LocationIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M12 2.25c-3.97 0-7.2 3.13-7.2 7.01 0 4.79 5.49 10.8 6.93 12.31a.37.37 0 0 0 .54 0c1.44-1.51 6.93-7.52 6.93-12.31 0-3.88-3.23-7.01-7.2-7.01Z"
        fill="currentColor"
      />
      <circle cx="12" cy="9.2" r="2.65" fill="#fff" />
    </svg>
  )
}
