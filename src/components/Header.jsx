// Верхняя панель: заголовок Reviews feed + действия справа (Settings / Build report / Export).
export default function Header() {
  return (
    <div className="flex items-center justify-between px-8 pt-6 pb-4">
      <div className="flex items-center gap-2">
        <h1 className="text-[28px] font-bold text-af-text">Reviews feed</h1>
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-af-border text-[10px] text-af-muted">
          ?
        </span>
      </div>
      <div className="flex items-center gap-5">
        <button className="text-sm text-af-primary hover:underline">⚙ Settings</button>
        <button className="text-sm text-af-primary hover:underline">📊 Build report</button>
        <button className="inline-flex items-center gap-1 rounded-md bg-af-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-af-primaryDark">
          ↗ Export
        </button>
      </div>
    </div>
  )
}
