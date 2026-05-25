// Правая панель фильтров: период, рейтинг, язык, страна, ответ, текст, теги.
const periods = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'This year', 'Custom']

export default function FilterPanel() {
  return (
    <aside className="w-64 shrink-0 space-y-5 border-l border-af-border bg-white px-5 py-6 text-sm">
      <Section title="Period">
        <div className="space-y-1.5">
          {periods.map((p, i) => (
            <label key={p} className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="period"
                defaultChecked={i === 2}
                className="h-3.5 w-3.5 accent-af-primary"
              />
              <span className={i === 2 ? 'font-medium text-af-text' : 'text-af-muted'}>{p}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Review rating">
        <div className="space-y-1.5 text-af-muted">
          {[5, 4, 3, 2, 1].map((n) => (
            <label key={n} className="flex items-center gap-2">
              <input type="checkbox" className="h-3.5 w-3.5 accent-af-primary" />
              <span className="inline-flex items-center gap-0.5">
                {Array.from({ length: n }).map((_, i) => (
                  <span key={i} className="text-af-star">★</span>
                ))}
                {Array.from({ length: 5 - n }).map((_, i) => (
                  <span key={i} className="text-af-border">★</span>
                ))}
              </span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Review language">
        <Input placeholder="e.g. English" />
      </Section>

      <Section title="Country">
        <Input placeholder="e.g. United Kingdom" />
      </Section>

      <Section title="Reply">
        <Input placeholder="e.g. With reply" />
      </Section>

      <Section title="Review text">
        <Input placeholder="Enter text" />
      </Section>

      <Section title="Tag">
        <select className="w-full rounded-md border border-af-border px-2 py-1.5 text-sm text-af-text">
          <option>Any of the tags</option>
        </select>
        <Input placeholder="e.g. Bug" className="mt-2" />
      </Section>

      <div className="flex items-center justify-between pt-2">
        <button className="text-sm font-medium text-af-primary hover:underline">+ Add filters</button>
        <button className="rounded-md bg-af-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-af-primaryDark">
          Apply
        </button>
      </div>
    </aside>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-af-muted">
        {title}
      </div>
      {children}
    </div>
  )
}

function Input({ placeholder, className = '' }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={`w-full rounded-md border border-af-border px-2 py-1.5 text-sm text-af-text placeholder:text-af-muted ${className}`}
    />
  )
}
