// section.FzEVA_t:
//   bg primary, border background-stroke (gray-3), radius-lg, padding 8/16, width 100%, min-width 0.
//   .BQCVweX.IUU1koI.jvRNZpW — overflow-auto, flex, w-100%.
//   .b9h8j5U × 7: border-right gray-4, flex column, flex 1 0 auto, mr 12, pr 12, white-space nowrap.
//     span.CWjSPo8.SXVQGi5 — label (text-sm = 12/18, color text-secondary)
//     div.u8m4TFe.tQAEp_t — value row:
//        font-size header-lg (30px), font-normal, line-height line-xl (36px)
//        второе правило `.tQAEp_t { font-size: text-md; line-height: line-lg }` — это
//        переопределение для контейнера, но значение внутри (span) наследует 30px от .u8m4TFe.
//        В реальном DOM первый span — значение, второй span — delta с СОБСТВЕННЫМИ классами.
//     span.SYuT7T_ | .SDbzDKJ + .xXSiP_4 + .Ln2Vjzr — delta:
//        color red-4 / green-4, font-size text-lg (16px), margin-left 4px, vertical-align top,
//        + .Ln2Vjzr перекрывает: font-size text-sm (12px), line-sm (18px).
//        В каскаде .Ln2Vjzr идёт позже → выигрывает. Итог: delta = 12px / 18px.
//        fill:currentColor намекает что внутри есть SVG-стрелка. Воспроизведём inline-SVG.
//   div.b9h8j5U.CZF8VKS — последняя ячейка View all metrics: min-width 135px (без border-right? проверим).
//
// Заметка: в реальном DOM значение "—" у "Store reply time" — это <span> пустой + delta -34%.

const metrics = [
  { label: 'Reviews', value: '114', delta: '-19%', dir: 'down' },
  { label: 'Avg. review rating', value: '2.09', delta: '+18%', dir: 'up' },
  { label: 'Sentiment score', value: '25%', delta: '+39%', dir: 'up' },
  { label: 'Replies', value: '99', delta: '+175%', dir: 'up' },
  { label: 'Reply rate', value: '87%', delta: '+240%', dir: 'up' },
  { label: 'Store reply time', value: '', delta: '-34%', dir: 'down' },
  { label: 'Automation coverage', value: '—' },
]

export default function MetricsBar() {
  return (
    <section className="w-full min-w-0 rounded-af-lg border border-af-bg-stroke bg-af-bg-primary px-af-sm py-af-xxs">
      <div className="relative flex w-full overflow-auto">
        {metrics.map((m) => (
          <Metric key={m.label} {...m} />
        ))}
        <ViewAllMetrics />
      </div>
    </section>
  )
}

// .b9h8j5U: border-right, flex column, flex 1 0 auto, margin-right 12, padding-right 12, nowrap.
// Заметка про каскад: на value-div применены .u8m4TFe и .tQAEp_t. В CSS-файле .tQAEp_t
// идёт ПОЗЖЕ .u8m4TFe → переопределяет font-size с 30px на 14px и line-height с 36 на 24.
// От .u8m4TFe остаётся только color + font-weight: normal.
// Итог: value = 14px / 24px / normal. Label = 12px / 18px / secondary.
function Metric({ label, value, delta, dir }) {
  return (
    <div className="mr-af-xs flex flex-[1_0_auto] flex-col whitespace-nowrap border-r border-af-bg-strokeDark pr-af-xs">
      {/* .CWjSPo8.SXVQGi5 — label: text-sm 12/18, text-secondary */}
      <span className="text-af-sm text-af-text-secondary">{label}</span>
      {/* .u8m4TFe.tQAEp_t — value row: 14/24 font-normal text-primary */}
      <div className="text-af-md font-af-normal text-af-text-primary">
        <span>{value}</span>
        {delta && <Delta value={delta} dir={dir} />}
      </div>
    </div>
  )
}

// span.SYuT7T_/SDbzDKJ.xXSiP_4.Ln2Vjzr:
// color red-4/green-4, font-size 12px (Ln2Vjzr перекрывает), line 18px, ml 4, vertical-align top.
// fill:currentColor для SVG-стрелки внутри.
function Delta({ value, dir }) {
  const color = dir === 'up' ? 'text-af-green-4' : 'text-af-red-4'
  return (
    <span className={`ml-af-xxxs align-top text-af-sm leading-af-sm ${color}`}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden className="inline-block">
        {dir === 'up' ? <path d="M5 2l4 6H1z" /> : <path d="M5 8L1 2h8z" />}
      </svg>
      {' '}
      {value}
    </span>
  )
}

// .b9h8j5U.CZF8VKS — min-width 135, последний без border-right.
function ViewAllMetrics() {
  return (
    <div className="flex min-w-[135px] flex-[1_0_auto] flex-col whitespace-nowrap">
      <span className="text-af-sm text-af-text-secondary">View all metrics</span>
      <a className="text-af-sm font-af-normal text-af-text-link hover:underline" href="#">
        Agent performance →
      </a>
    </div>
  )
}
