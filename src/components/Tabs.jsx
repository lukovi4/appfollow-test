// Табы: All reviews / Featured / Reviews to report / No replies / Pending replies.
const tabs = [
  { key: 'all', label: 'All reviews', count: 154, active: true },
  { key: 'featured', label: 'Featured' },
  { key: 'to-report', label: 'Reviews to report', badge: 'NEW' },
  { key: 'no-replies', label: 'No replies', count: 11 },
  { key: 'pending', label: 'Pending replies' },
]

export default function Tabs() {
  return (
    <div className="flex items-center justify-between border-b border-af-border">
      <div className="flex items-center gap-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`relative flex items-center gap-1.5 pb-2 text-sm font-medium ${
              t.active ? 'text-af-text' : 'text-af-muted hover:text-af-text'
            }`}
          >
            {t.label}
            {t.count != null && (
              <span className="rounded bg-af-bg px-1.5 text-xs text-af-muted">{t.count}</span>
            )}
            {t.badge && (
              <span className="rounded bg-emerald-100 px-1.5 text-[10px] font-semibold text-emerald-700">
                {t.badge}
              </span>
            )}
            {t.active && (
              <span className="absolute -bottom-px left-0 right-0 h-0.5 rounded bg-af-primary" />
            )}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 pb-2">
        <button className="inline-flex items-center gap-1 text-sm font-medium text-af-primary">
          + New
        </button>
        <button className="inline-flex items-center gap-1 text-sm font-medium text-af-primary">
          ⚙ Manage
        </button>
      </div>
    </div>
  )
}
