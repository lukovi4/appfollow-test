// BulkBar (div.U2B5TKY.DkPGJGp.kJeCRaA.vRl208d.JapvtJL).
// Каскад классов проверен по байтовым смещениям. SVG path'ы — реальные из DOM.
//
// СТРУКТУРА:
//   div.JapvtJL                                  flex column, gap 4, text-left,
//                                                 margin-left 8, margin-bottom -2
//     div.fENmcsf                                flex flex-wrap items-center justify-between,
//                                                 min-h 36, w 100%
//       div.xFtqkSe                              flex (обёртка label + текст)
//         label.DRj2itn[data-size="lg"]          inline-flex items-center, color text-primary,
//                                                 font-size text-lg (16), cursor pointer
//           div.nxAw8_5                          flex relative
//             input.a3Jk11b                      bg primary, border gray-4, radius-md (4),
//                                                 20×20 (data-size=lg override), mr 8,
//                                                 appearance none, flex-shrink 0
//             svg.X7aTQ7D                        12×12, color blue-5, position absolute,
//                                                 top 4 left 4 (data-size=lg override),
//                                                 display none по умолчанию,
//                                                 display block при input:checked + .X7aTQ7D
//         span.hfFP08w.SXVQGi5                   14px, NORMAL, line-md (20), letter -0.12,
//                                                 color text-secondary
//       button.ucE4oQl.tAO3CWr.CsgOPCt.Pqk3iGi.Qr1a5y6 "Sort by: Newest first"
//                                                 .Pqk3iGi → FLAT link: bg initial !important,
//                                                 border NONE, padding 0, min-height 0,
//                                                 font-weight NORMAL, color blue-5
//                                                 .Qr1a5y6 → max-w 160
//         svg.cc63tNu (.ak8lcEc)                 16×16 chevron-down, fill currentColor, ml 4
//
// Inline-style в DOM: НЕТ.
export default function BulkBar() {
  return (
    // .JapvtJL — flex column gap 4, text-left, ml 8, mb -2 (см. ReviewsFeed.jsx использование).
    // Здесь рендерим только внутренности; внешние margin задаёт родитель.
    <div className="flex flex-col gap-af-xxxs text-left">
      {/* .fENmcsf — flex-wrap items-center justify-between, min-h 36, w-100% */}
      <div className="flex min-h-9 w-full flex-wrap items-center justify-between">
        {/* .xFtqkSe — flex (label + текст) */}
        <div className="flex items-center">
          {/* .DRj2itn[data-size=lg] — inline-flex items-center, text-primary, font 16, cursor pointer */}
          <label className="relative inline-flex cursor-pointer items-center text-af-lg text-af-text-primary">
            {/* .nxAw8_5 — flex relative */}
            <span className="relative flex">
              {/*
                .a3Jk11b: appearance none, bg primary, border gray-4, radius-md, 18×18.
                + data-size=lg: 20×20.
                + margin-right pd-xxs (8).
                Группа peer для управления галочкой через :checked.
              */}
              <input
                type="checkbox"
                className="peer h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-af-md border border-af-gray-4 bg-af-bg-primary"
              />
              {/*
                .X7aTQ7D (12×12): color blue-5, absolute top:3 left:3 (default),
                + data-size=lg → top 4 left 4.
                display: none по умолчанию, display: block при peer-checked.
              */}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                className="pointer-events-none absolute left-[4px] top-[4px] hidden text-af-blue-5 peer-checked:block"
                aria-hidden
              >
                <path
                  fill="currentColor"
                  d="M8.83246 18.7327C8.98953 18.9683 9.22513 19.0469 9.53927 19.0469C9.81414 19.0469 10.0497 18.9683 10.2461 18.7327L21.8298 7.18824C21.9869 7.03117 22.1047 6.79557 22.1047 6.48143C22.1047 6.20656 21.9869 5.97096 21.8298 5.77462L20.377 4.36101C20.1806 4.16468 19.945 4.04688 19.6702 4.04688C19.3953 4.04688 19.1597 4.16468 18.9634 4.36101L9.53927 13.7851L5.14136 9.38719C4.90576 9.19085 4.67016 9.07305 4.39529 9.07305C4.12042 9.07305 3.88482 9.19085 3.72775 9.38719L2.27487 10.8008C2.07853 10.9971 2 11.2327 2 11.5076C2 11.8217 2.07853 12.0573 2.27487 12.2144L8.83246 18.7327Z"
                />
              </svg>
            </span>
            {/*
              margin-right 8 — а.3Jk11b имеет mr-pd-xxs ВНУТРИ.
              Так как input — peer (а не сама-кнопка), реальный mr идёт через input class.
              Но margin-right 8 на input уже задан Tailwind'ом косвенно? Нет — у меня не задан.
              Делаем gap через прямой margin-right на input.
            */}
            <span className="ml-af-xxs text-af-md font-af-normal leading-af-md tracking-af-sm text-af-text-secondary">
              Please choose at least one review to apply bulk actions.
            </span>
          </label>
        </div>

        {/*
          Sort by — flat link от .Pqk3iGi (СБРОС border/bg/padding/font-weight).
          .Qr1a5y6 → max-width 160. Внутри chevron .cc63tNu 16×16 ml 4.
          color text-link (blue-5). hover → blue-4 (от .Pqk3iGi:hover).
        */}
        <button
          type="button"
          className="inline-flex max-w-[160px] cursor-pointer items-center whitespace-normal border-none bg-transparent p-0 text-af-md font-af-normal leading-af-md text-af-text-link transition-colors hover:bg-transparent hover:text-af-blue-4"
        >
          Sort by: Newest first
          {/* .cc63tNu — ml 4. .ak8lcEc — 16×16. fill currentColor. */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="ml-af-xxxs block h-4 min-w-4 overflow-hidden"
            aria-hidden
          >
            <path
              fill="currentColor"
              d="M5.95285 10H18.0466C18.4528 10 18.7341 10.2031 18.8903 10.6094C19.0466 10.9844 18.9841 11.3125 18.7028 11.5938L12.656 17.6406C12.4685 17.8281 12.2497 17.9219 11.9997 17.9219C11.7497 17.9219 11.531 17.8281 11.3435 17.6406L5.2966 11.5938C5.01535 11.3125 4.95285 10.9844 5.1091 10.6094C5.26535 10.2031 5.5466 10 5.95285 10Z"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
