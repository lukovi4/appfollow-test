// Правый столбик внутри карточки отзыва: app / review id / country / language / app version.
export default function ReviewMeta({ meta }) {
  const rows = [
    ['App', meta.app, '🍬'],
    ['Review ID', meta.reviewId, '🆔'],
    ['Country', meta.country, '🇺🇸'],
    ['Language', meta.language, '🇬🇧'],
    ['App version', meta.appVersion, '📱'],
  ]
  return (
    <div className="w-44 shrink-0 space-y-2 border-l border-af-border pl-4 text-xs">
      {rows.map(([label, value, icon]) => (
        <div key={label}>
          <div className="text-af-muted">{label}</div>
          <div className="mt-0.5 flex items-center gap-1 text-af-text">
            <span>{icon}</span>
            <span className="truncate">{value}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
