import { useState, useRef, useEffect } from 'react'

// Универсальный компонент-секция с табами.
// Используется и для главных табов отзывов, и внутри AI summary (вложенная section.AJ1eTTY.iOfzpNa.EMfyQwu).
//
// Каскад классов (по байтовым смещениям, позже = выигрывает):
//
//   .AJ1eTTY (8959):    bg primary, flex column, overflow hidden, position relative, h auto, min-w 0
//   .iOfzpNa (9110):    border-sm background-stroke + radius-lg
//   .npfiQI3 (?):       padding pd-xs 0 0 (12px top), w-100%
//
//   .GI6wlKi:
//     (143158) display: flex
//     (143205, max-width:767px) flex-direction: column   ← на мобильном вертикально
//
//   .x6gGppp (225578): display flex, overflow hidden, position relative, w 100%
//   .x6gGppp::before:  absolute bottom 0, h --border-md (2px), w 100%, bg background-stroke
//                       → серая линия 2px СНИЗУ под всеми табами
//
//   ._qoY6Zx (225804): absolute bottom 0, h --border-md (2px), bg control-background-brand (blue-5),
//                       transition width .2s, left .3s, transform translateZ(0)
//                       → синяя индикатор-полоска, JS вычисляет left+width под активный таб
//
//   .HXHLHyv (225782): display flex
//
//   .DWE5yAB (224448): items-center, bg initial, border none, color text-secondary, display flex,
//                       font-size text-lg (16px), line-height line-lg (24px), outline none, nowrap
//   .HeW58Nf (225352): cursor default (для активного)
//
//   .WXGB9du (224831): items-center, bg initial, border none, color icon-secondary (gray-7),
//                       cursor pointer, display flex, gap pd-xxxs (4), justify-center,
//                       padding pd-xxs pd-sm (8/16)
//   .hrvMj8B (225400+225441): color text-primary, position relative — для активного
//
//   .qJ7S4yU (225552): text-align start
//   .cOkBPUX (143654): max-w 250, overflow ellipsis, nowrap
//   .U2B5TKY.kJeCRaA.vRl208d (внутри qJ7S4yU): flex, gap 4, text-align left
//
//   .W8UoLnz (184397, селектор '... .W8UoLnz' длиннее одного класса): radius-md, color text-primary,
//                       inline-block, font-weight BOLD, w fit-content
//   .B5TfIrQ (184537): font-size text-sm (12px), height 18, line-sm (18), padding 0 pd-xxxs (0/4)
//                       → счётчик 12px BOLD, h 18, padding 0/4, БЕЗ bg
//
//   .HQz7PWS (203956): items-center, radius-xl (12), flex, max-w 100%, w fit-content
//                       (NEW badge external wrapper)
//   .dUK6lpk (204213+204293+204733): h 18, w 42, padding pd-xxxxs pd-xxs (2/8), h 18
//   .ASxbql4 (без правил)
//   .tHjX4Mn (204964): overflow ellipsis, nowrap (текст внутри бейджа)
//   .oV1xnGX:
//     (204394) font-bold, uppercase
//     (204466) font-size text-xs (10), line-xs (14)
//     (204536) font-size text-sm (12), line 16   ← позже, выигрывает
//     Итог: 12px / 16 / BOLD / uppercase
//   bg/color бейджа — задаются inline-style через JS:
//     NEW (Reviews to report) → bg #36c55f (green-4) + color white
//
//   .A1QFRAc:
//     (143237) items center, box-shadow inset 0 -2px 0 background-stroke (серая линия снизу),
//               display flex, justify-between, padding-right pd-sm (16)
//     (143440, max-width:767px) items start, flex-direction column   ← на мобильном
//
//   .ucE4oQl (170522): base button — bg primary, border-sm control-background-brand-hover (blue-6),
//                       radius-lg, color control-background-brand (blue-5), flex items-center justify-center,
//                       font-size text-md (14), weight BOLD, line line-sm (18), nowrap
//   .tAO3CWr (171302): min-height 36
//   .CsgOPCt (172371): переопределяет — bg primary, border-color control-stroke (gray-3),
//                       color control-background-brand → итог: gray-3 border, blue-5 text
//   .Pqk3iGi (без правил)
//   .m4ZwGqv (143476): font-size text-lg (16)   ← переопределяет 14 на 16
//   .SYzkmtj (без правил)
//   .Fm40eTW (173939): margin-right pd-xxxs (4) — для иконки внутри кнопки
//   .ak8lcEc (164293): SVG 16×16
//   .Y53kl4i (164150): fill currentColor

export default function TabbedSection({
  tabs,
  activeKey,
  onChange,
  actions,
  bordered = false,
  padded = false,
  children,
}) {
  // section.AJ1eTTY[.iOfzpNa][.npfiQI3]
  return (
    <section
      className={`relative flex h-auto min-w-0 flex-col overflow-hidden bg-af-bg-primary ${
        bordered ? 'rounded-af-lg border border-af-bg-stroke' : ''
      } ${padded ? 'pt-af-xs' : ''} w-full`}
    >
      {/* .GI6wlKi — flex (на mobile column) */}
      <div className="flex max-md:flex-col">
        {/*
          .x6gGppp — относительный контейнер табов с серой линией под ним (::before).
          Внутри: ._qoY6Zx (синий индикатор absolute) + .HXHLHyv (сами табы).
        */}
        <TabsStrip tabs={tabs} activeKey={activeKey} onChange={onChange} />

        {/*
          .A1QFRAc — actions с inset shadow снизу (= серая линия 2px), продолжает .x6gGppp::before.
          На <767px → items-start, column.
        */}
        {actions && (
          <div className="flex items-center justify-between pr-af-sm max-md:flex-col max-md:items-start [box-shadow:inset_0_-2px_0_0_#e6effa]">
            {actions}
          </div>
        )}
      </div>
      {children}
    </section>
  )
}

function TabsStrip({ tabs, activeKey, onChange }) {
  const containerRef = useRef(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  // При смене активного таба пересчитываем left/width индикатора (._qoY6Zx).
  useEffect(() => {
    const el = containerRef.current?.querySelector(`[data-tab-key="${activeKey}"]`)
    if (!el) return
    const parent = containerRef.current.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    setIndicator({ left: rect.left - parent.left, width: rect.width })
  }, [activeKey, tabs])

  return (
    // .x6gGppp — display flex, overflow hidden, relative, w 100%.
    // ::before — серая линия снизу на всю ширину (h 2px, bg background-stroke).
    <div
      ref={containerRef}
      className="relative flex w-full overflow-hidden before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-full before:bg-af-bg-stroke before:content-['']"
    >
      {/* ._qoY6Zx — синяя полоска поверх ::before, под активным табом */}
      <div
        className="absolute bottom-0 z-[1] h-[2px] bg-af-blue-5 transition-[left,width] duration-200 ease-in-out"
        style={{ left: indicator.left, width: indicator.width }}
      />

      {/* .HXHLHyv — flex с табами */}
      <div className="flex">
        {tabs.map((t) => {
          const isActive = t.key === activeKey
          return (
            // .DWE5yAB[.HeW58Nf] — items-center, flex, font-size text-lg (16) / line-lg (24),
            // color text-secondary; HeW58Nf → cursor default
            <div
              key={t.key}
              data-tab-key={t.key}
              className={`flex items-center whitespace-nowrap text-af-lg leading-af-lg text-af-text-secondary ${
                isActive ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              {/*
                .WXGB9du — flex items-center, gap 4, justify-center, padding 8/16,
                color icon-secondary (gray-7). Активный (.hrvMj8B) → color text-primary.
              */}
              <button
                onClick={() => !isActive && onChange?.(t.key)}
                className={`flex items-center justify-center gap-af-xxxs px-af-sm py-af-xxs ${
                  isActive
                    ? 'text-af-text-primary'
                    : 'text-af-icon-secondary hover:text-af-text-primary'
                }`}
              >
                {/* .qJ7S4yU — text-align start */}
                <span className="text-left">
                  {/*
                    .U2B5TKY.kJeCRaA.vRl208d.cOkBPUX — flex gap-4 text-left,
                    max-w 250 ellipsis nowrap. Внутри: текст лейбла + (опционально) бейдж.
                  */}
                  <span className="flex max-w-[250px] items-center gap-af-xxxs overflow-hidden text-ellipsis whitespace-nowrap text-left">
                    {t.label}
                    {t.badge && <NewBadge>{t.badge}</NewBadge>}
                  </span>
                </span>
                {/*
                  .W8UoLnz.B5TfIrQ[role=textbox] — счётчик.
                  Каскад: 12px BOLD primary, h 18, padding 0/4, radius-md, fit-content.
                  bg задаётся INLINE-STYLE из исходного DOM:
                    style="background-color: var(--color-control-background-secondary-medium)"
                  = --color-gray-2 (light theme) = #f0f5fa
                */}
                {t.count != null && (
                  <span
                    role="textbox"
                    className="inline-flex h-[18px] w-fit items-center rounded-af-md px-af-xxxs text-af-sm font-af-bold leading-af-sm text-af-text-primary"
                    style={{ backgroundColor: '#f0f5fa' }}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// .HQz7PWS.dUK6lpk.ASxbql4 — pill 42×18.
// .tHjX4Mn.oV1xnGX — текст 12px / 16 / BOLD / uppercase.
// bg/color заданы inline-style: NEW → #36c55f (green-4) + white.
function NewBadge({ children }) {
  return (
    <span
      className="inline-flex h-[18px] max-w-full items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap rounded-af-xl px-af-xxs"
      style={{ backgroundColor: '#36c55f', color: '#ffffff' }}
    >
      <span className="text-af-sm font-af-bold uppercase leading-[16px]">{children}</span>
    </span>
  )
}
