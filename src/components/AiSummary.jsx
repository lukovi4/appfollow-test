// Полоска "AI summary: all workspace apps" над списком отзывов.
export default function AiSummary() {
  return (
    <div className="flex items-center justify-between rounded-md border border-af-border bg-white px-4 py-2.5">
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold text-af-accent">✦ AI summary:</span>
        <span className="font-medium text-af-text">all workspace apps</span>
        <span className="text-af-muted">▾</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-af-muted">
        <span>Please choose at least one review to apply bulk actions</span>
      </div>
      <div className="text-xs text-af-muted">
        Sort by: <span className="font-medium text-af-text">Newest first</span> ▾
      </div>
    </div>
  )
}
