// Header (header.jT9QgoW). Каскад классов проверен по байтовым смещениям.
// SVG path'ы — реальные из исходного DOM AppFollow.
//
// СТРУКТУРА:
//   header.jT9QgoW                       flex items-center justify-center, min-h 36
//                                         (на <767px → flex-col items-start)
//     div.sM2G6Sl                        flex flex-wrap items-center gap pd-xs (12) w-100%
//       div.U2B5TKY.Bk2vHAO.vRl208d.y0VPAlL  flex (gap 8 pd-xxs) items-center text-left
//         h1.SibYdr1 "Reviews feed"         color text-primary, font header-md (26),
//                                            line line-xxl (44), m 0, font-weight 700 (от h1 base)
//         svg.Y53kl4i.ECDE1Pu.IjpW3J9       20×20 currentColor, color text-tertiary, mt 4
//                                            (help-circle с "i" внутри)
//     div._uCQMDe                        flex gap pd-xs (12)
//       section.AWE9g3q                  flex items-center gap pd-xxxs (4)
//         div.HQz7PWS.DhQxlDv.ASxbql4.mQzIfK3  AI pill (см. AiPill)
//         button.ucE4oQl.tAO3CWr.nHUv4yq.RYM8kfd "Settings"
//           → НЕТ border (nHUv4yq), padding-left 0 (RYM8kfd), padding-right 16,
//              color blue-5, BOLD 14, line-sm 18, БЕЗ иконки
//       button.ucE4oQl.tAO3CWr.CsgOPCt "Build report"
//           → border gray-3, bg primary, color blue-5, БЕЗ иконки, padding 0/16
//       button.ucE4oQl.tAO3CWr.RjET324.Z8NjCZG.C4ZRrfK "Export"
//           → border gray-3, bg primary, color text-premium (purple-7),
//              min-width 120, padding-left pd-xs (12), padding-right pd-sm (16),
//              иконка sparkle/dizzy 16×16 с mr 4 (.Fm40eTW)

export default function Header() {
  return (
    <header className="flex min-h-9 items-center justify-center max-md:flex-col max-md:items-start">
      <div className="flex w-full flex-wrap items-center gap-af-xs">
        {/* Левая группа: заголовок + help-circle */}
        <div className="flex items-center gap-af-xxs text-left">
          <h1 className="m-0 text-af-h-md font-af-bold leading-af-xxl text-af-text-primary">
            Reviews feed
          </h1>
          <HelpCircleIcon />
        </div>

        {/* Правая группа (._uCQMDe), прижата margin-left:auto */}
        <div className="ml-auto flex items-center gap-af-xs">
          {/* AI-pill + Settings (.AWE9g3q) */}
          <section className="flex items-center gap-af-xxxs">
            <AiPill />
            {/*
              Settings: .ucE4oQl.tAO3CWr.nHUv4yq.RYM8kfd
              .nHUv4yq → border none, bg initial; .RYM8kfd → padding-left 0;
              .tAO3CWr → min-h 36, padding 0 pd-sm (правый паддинг сохраняется).
              ИТОГ: link-кнопка без обводки/фона, padding-right 16, blue-5, BOLD 14.
            */}
            <button
              type="button"
              className="inline-flex h-9 cursor-pointer items-center border-none bg-transparent pl-0 pr-af-sm text-af-md font-af-bold leading-af-sm text-af-text-link transition-colors hover:bg-transparent hover:text-af-blue-4"
            >
              Settings
            </button>
          </section>

          {/*
            Build report: .ucE4oQl.tAO3CWr.CsgOPCt
            border gray-3, bg primary, color blue-5, padding 0/16, BOLD 14, line-sm 18.
            БЕЗ иконки.
          */}
          <button
            type="button"
            className="inline-flex h-9 min-w-fit cursor-pointer items-center justify-center whitespace-nowrap rounded-af-lg border border-af-bg-stroke bg-af-bg-primary px-af-sm text-af-md font-af-bold leading-af-sm text-af-text-link transition-colors hover:bg-af-bg-secondaryGray"
          >
            Build report
          </button>

          {/*
            Export: .ucE4oQl.tAO3CWr.RjET324.Z8NjCZG.C4ZRrfK
            Каскад финал:
              .ucE4oQl   → flex items-center justify-center, bg primary, border-sm,
                            radius-lg, font-size 14, font-weight BOLD, line-sm (18),
                            white-space nowrap, cursor pointer
              .tAO3CWr   → min-height 36, min-width fit-content, padding 0 pd-sm (0/16)
              .RjET324   → bg primary (=), border-color control-stroke (gray-3),
                            color text-premium (purple-7)
              .Z8NjCZG.tAO3CWr → padding-left pd-xs (12)  ← перекрывает левый паддинг 16
              .C4ZRrfK   → min-width 120
            Hover: .RjET324:hover → bg control-background-secondary-medium (gray-2)
            Иконка: .Y53kl4i.ak8lcEc.Fm40eTW → 16×16, fill currentColor, margin-right 4.
          */}
          <button
            type="button"
            className="inline-flex h-9 min-w-[120px] cursor-pointer items-center justify-center whitespace-nowrap rounded-af-lg border border-af-bg-stroke bg-af-bg-primary pl-af-xs pr-af-sm text-af-md font-af-bold leading-af-sm text-af-purple-7 transition-colors hover:bg-af-bg-secondaryGray"
          >
            <ExportIcon />
            Export
          </button>
        </div>
      </div>
    </header>
  )
}

// .HQz7PWS.DhQxlDv.ASxbql4.mQzIfK3 — AI pill.
// Каскад:
//   .HQz7PWS:    radius-xl, items-center, max-w 100%, w fit-content, flex
//   .DhQxlDv:    h 24, padding 2/8 (pd-xxxxs pd-xxs), font-size text-md, line-md (20)
//   .ASxbql4.DhQxlDv: padding 4/8 (pd-xxxs pd-xxs)  ← позже, выигрывает (более специфичный селектор)
//   .mQzIfK3:    inline-flex, vertical-align text-bottom
// Inline-style: background-color blue-1 (#e6f3ff), color white.
// Внутри:
//   img.RiiXpJu[data-size="sm"]:  16×16 base64 PNG "dizzy_symbol" (💫). mr pd-xxxs (4).
//   div.tHjX4Mn.oV1xnGX:           flex container, font-bold uppercase, text-overflow ellipsis
//     .DhQxlDv .oV1xnGX:           font-size 12, line 16  ← позже, выигрывает
//   span.Nr39qBn "AI":             color text-link (blue-5) ← перекрывает родительский color
function AiPill() {
  return (
    <div
      className="inline-flex h-6 w-fit max-w-full items-center rounded-af-xl px-af-xxs py-af-xxxs align-text-bottom"
      style={{ backgroundColor: '#e6f3ff', color: '#ffffff' }}
    >
      <span className="mr-af-xxxs flex h-4 w-4 min-w-4 items-center justify-center text-[14px] leading-none">
        💫
      </span>
      <span className="overflow-hidden text-ellipsis whitespace-nowrap text-af-sm font-af-bold uppercase leading-[16px]">
        <span className="text-af-text-link">AI</span>
      </span>
    </div>
  )
}

// .Y53kl4i.ECDE1Pu.IjpW3J9 — help-circle 20×20 (от .ECDE1Pu), color text-tertiary, mt 4.
// Реальный path из DOM AppFollow.
function HelpCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="mt-af-xxxs block h-5 min-w-5 overflow-hidden text-af-text-tertiary"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM14 8C14 9.10457 13.1046 10 12 10C10.8954 10 10 9.10457 10 8C10 6.89543 10.8954 6 12 6C13.1046 6 14 6.89543 14 8ZM10 11.5C10 11.2239 10.2239 11 10.5 11H13.5V16H14.5C14.7761 16 15 16.2239 15 16.5V17.5C15 17.7761 14.7761 18 14.5 18H10C9.72386 18 9.5 17.7761 9.5 17.5V16.5C9.5 16.2239 9.72386 16 10 16H11V13H10.5C10.2239 13 10 12.7761 10 12.5V11.5Z"
      />
    </svg>
  )
}

// .Y53kl4i.ak8lcEc.Fm40eTW — sparkle/dizzy 16×16, fill currentColor, mr pd-xxxs (4).
// Реальный path из DOM.
function ExportIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="mr-af-xxxs block h-4 min-w-4 overflow-hidden"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M20.0483 11.761L9.54833 23.011C9.43699 23.1303 9.28978 23.21 9.12903 23.2381C8.96829 23.2661 8.80277 23.241 8.65759 23.1665C8.51242 23.092 8.3955 22.9722 8.32457 22.8252C8.25365 22.6783 8.23258 22.5122 8.26458 22.3522L9.63952 15.4776L4.23667 13.4515C4.12121 13.4082 4.01821 13.3371 3.93679 13.2445C3.85536 13.1519 3.79802 13.0407 3.76984 12.9207C3.74167 12.8006 3.74352 12.6755 3.77524 12.5563C3.80697 12.4372 3.86758 12.3277 3.95171 12.2375L14.4517 0.98753C14.5631 0.868241 14.7103 0.788517 14.871 0.760452C15.0318 0.732387 15.1973 0.757512 15.3424 0.832015C15.4876 0.906519 15.6045 1.02634 15.6755 1.17329C15.7464 1.32025 15.7675 1.48633 15.7355 1.64634L14.3605 8.52094L19.7634 10.547C19.8788 10.5903 19.9818 10.6614 20.0633 10.754C20.1447 10.8466 20.202 10.9578 20.2302 11.0779C20.2584 11.1979 20.2565 11.323 20.2248 11.4422C20.1931 11.5614 20.1325 11.6709 20.0483 11.761Z"
      />
    </svg>
  )
}
