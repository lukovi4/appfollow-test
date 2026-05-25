// Селектор приложений (на скриншоте — "All apps 1 ▾").
export default function AppSelector() {
  return (
    <button className="inline-flex items-center gap-2 rounded-md border border-af-border bg-white px-3 py-2 text-sm font-medium text-af-text shadow-sm hover:border-af-muted">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-af-bg text-af-muted">
        ▦
      </span>
      All apps
      <span className="rounded bg-af-bg px-1.5 text-xs text-af-muted">1</span>
      <span className="text-af-muted">▾</span>
    </button>
  )
}
