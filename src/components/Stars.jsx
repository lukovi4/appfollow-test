// Звёзды рейтинга. Принимает value (0..5) и size.
export default function Stars({ value = 0, size = 16 }) {
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`${value} stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill={i < value ? '#f5a623' : '#e6e8ee'}
          aria-hidden
        >
          <path d="M10 1.5l2.6 5.5 5.9.8-4.3 4.2 1 6.1-5.2-2.9-5.2 2.9 1-6.1L1.5 7.8l5.9-.8z" />
        </svg>
      ))}
    </div>
  )
}
