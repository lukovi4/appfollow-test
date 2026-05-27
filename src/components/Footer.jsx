// Нижний бар: Account usage (5 индикаторов) + Start trial / View subscription.
// Маппинг .KTYCmPI = footer, .YvxayA1 = grid, .QAcVWdj = одна usage-ячейка.
const usage = [
  { label: 'Apps', value: '7/2', warn: true },
  { label: 'Manual replies | monthly', value: '0/100' },
  { label: 'Keywords', value: '5/5' },
  { label: 'AI generations', value: '14/14' },
  { label: 'Automation rules', value: '0/—' },
]

export default function Footer() {
  return (
    <footer className="flex items-center justify-between border-t border-af-bg-stroke bg-af-bg-primary px-af-xl py-af-xs">
      <div className="flex items-center gap-af-md">
        <span className="text-af-sm font-af-bold text-af-text-secondary">Account usage</span>
        <div className="flex items-center gap-af-md">
          {usage.map((u) => (
            <div key={u.label} className="flex items-baseline gap-af-xxs">
              <span className="text-af-xs text-af-text-tertiary">{u.label}</span>
              <span
                className={`text-af-sm font-af-bold ${
                  u.warn ? 'text-af-text-negative' : 'text-af-text-primary'
                }`}
              >
                {u.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-af-xxs">
        <button className="inline-flex h-af-input-sm items-center rounded-af-md bg-gradient-to-r from-af-yellow-3 to-af-yellow-4 px-af-sm text-af-sm font-af-bold text-af-text-primary">
          Start trial
        </button>
        <button className="inline-flex h-af-input-sm items-center rounded-af-md border border-af-bg-stroke bg-af-bg-primary px-af-sm text-af-sm font-af-bold text-af-text-primary hover:bg-af-bg-secondaryWhite">
          View subscription
        </button>
      </div>
    </footer>
  )
}
