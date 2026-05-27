// Звёзды AppFollow: цвет n-й звезды соответствует "оценке n" — пятёрка зелёная, четвёрка
// светло-зелёная, тройка — жёлтая, двойка — оранжевая, единица — красная.
// Источник: --color-five-stars / four / three / two / one в их CSS.
const colors = {
  5: '#66b47c',
  4: '#bdd280',
  3: '#edbc2f',
  2: '#f89a3e',
  1: '#fd334b',
}

export default function Stars({ value = 0, size = 14 }) {
  const color = colors[value] ?? '#dae7f7'
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`${value} stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill={i < value ? color : '#dae7f7'}
          aria-hidden
        >
          <path d="M10 1.5l2.6 5.5 5.9.8-4.3 4.2 1 6.1-5.2-2.9-5.2 2.9 1-6.1L1.5 7.8l5.9-.8z" />
        </svg>
      ))}
    </div>
  )
}
