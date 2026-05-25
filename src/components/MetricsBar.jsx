// Строка метрик сверху. Универсальный массив — легко добавить/убрать колонку.
const metrics = [
  { label: 'Reviews', value: '154' },
  { label: 'Avg. review rating', value: '2,00', delta: '-78%' },
  { label: 'Sentiment score', value: '79%', delta: '-3%' },
  { label: 'Replies', value: '98', delta: '-13%' },
  { label: 'Reply rate', value: '67%', delta: '+3%' },
  { label: 'Avg. reply time', value: '1d 4h', delta: '+13%' },
  { label: 'Automation coverage', value: '—' },
]

export default function MetricsBar() {
  return (
    <div className="rounded-md border border-af-border bg-af-bg px-5 py-3">
      <div className="grid grid-cols-7 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="min-w-0">
            <div className="truncate text-[11px] uppercase tracking-wide text-af-muted">
              {m.label}
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-semibold text-af-text">{m.value}</span>
              {m.delta && (
                <span
                  className={`text-[11px] font-medium ${
                    m.delta.startsWith('-') ? 'text-rose-500' : 'text-emerald-600'
                  }`}
                >
                  {m.delta}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-right">
        <a className="text-xs font-medium text-af-primary hover:underline" href="#">
          View all metrics →
        </a>
      </div>
    </div>
  )
}
