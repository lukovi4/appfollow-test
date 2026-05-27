// section.AJ1eTTY.iOfzpNa.EMfyQwu — закрытая AI summary полоса.
//
// ПОЛНАЯ структура DOM (с SVG, не пропуская):
//   section.AJ1eTTY.iOfzpNa.EMfyQwu
//     div.ZKgdKXU                            display:flex
//       div.xWfdl38                          flex column, items-start, justify-between, w-100%
//         div.B1UniwL[role=button]           flex wrap items-center justify-between gap-8 p-16 w-100%
//           div.WyVpgs_                      flex nowrap items-center gap-8 (LEFT group)
//             div.U2B5TKY.kJeCRaA.vRl208d.CtqKBrN   flex gap-4 text-left
//               svg.Y53kl4i.ECDE1Pu (24×24 viewBox, 2 paths sparkle)  ← AI/Sparkle 20×20 currentColor
//               span.S5RKKSq.GmXxLqY.jSdJfwu "AI summary: all workspace apps"   20/24 BOLD primary
//           svg.Y53kl4i.ak8lcEc.BEiXGkg (24×24 chevron-down)            ← Chevron 16×16 icon-link (blue-5)
//
// Каскад классов (по позициям в CSS, позже = выигрывает):
//   .Y53kl4i (164150):  fill:currentColor, display:block, h 20, overflow hidden, w 20
//   .ECDE1Pu (164348):  h 20, min-w 20, w 20   (sparkle размер итог = 20×20)
//   .ak8lcEc (164293):  h 16, min-w 16, w 16   (chevron размер итог = 16×16)
//   .BEiXGkg (134749):  color: var(--color-icon-link) = blue-5
//
// Sparkle currentColor наследует от родителя. У .CtqKBrN правил нет, вверх по дереву
// никто color не задаёт → дефолт чёрный.
export default function AiSummary() {
  return (
    <section className="relative flex h-auto min-w-0 flex-col overflow-hidden rounded-af-lg border border-af-bg-stroke bg-af-bg-primary">
      <div className="flex">
        <div className="flex w-full flex-col items-start justify-between">
          <div
            role="button"
            tabIndex={0}
            className="flex w-full cursor-pointer flex-wrap items-center justify-between gap-af-xxs p-af-sm"
          >
            {/* LEFT group: .WyVpgs_ */}
            <div className="flex flex-nowrap items-center gap-af-xxs">
              {/* .CtqKBrN — flex gap-4 text-left */}
              <div className="flex gap-af-xxxs text-left">
                <SparkleIcon />
                <span className="text-af-h-sm font-af-bold text-af-text-primary">
                  AI summary: all workspace apps
                </span>
              </div>
            </div>
            {/* RIGHT: chevron */}
            <ChevronIcon />
          </div>
        </div>
      </div>
    </section>
  )
}

// .Y53kl4i.ECDE1Pu — 20×20, fill currentColor.
// Реальные path из их DOM (две sparkle: большая + маленькая).
function SparkleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="block h-5 min-w-5 overflow-hidden"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M18.132 14.1033C12.1593 12.7545 11.2341 11.8294 9.88541 5.85672C9.82361 5.58373 9.58063 5.38934 9.29984 5.38934C9.01906 5.38934 8.77607 5.58373 8.71428 5.85672C7.36495 11.8294 6.4404 12.7545 0.46773 14.1033C0.194145 14.1657 -0.000244141 14.408 -0.000244141 14.6888C-0.000244141 14.9696 0.194145 15.212 0.46773 15.2744C6.4404 16.6237 7.36495 17.5489 8.71428 23.5209C8.77607 23.7939 9.01906 23.9883 9.29984 23.9883C9.58063 23.9883 9.82361 23.7939 9.88541 23.5209C11.2347 17.5489 12.1593 16.6237 18.132 15.2744C18.4055 15.212 18.5993 14.9696 18.5993 14.6888C18.5993 14.408 18.4049 14.1657 18.132 14.1033Z"
      />
      <path
        fill="currentColor"
        d="M23.5316 4.80432C20.3566 4.08736 19.9108 3.64159 19.1938 0.467161C19.1314 0.193576 18.889 -0.000213623 18.6083 -0.000213623C18.3275 -0.000213623 18.0851 0.193576 18.0227 0.467161C17.3057 3.64159 16.8599 4.08736 13.6855 4.80432C13.4119 4.86672 13.2181 5.10911 13.2181 5.38989C13.2181 5.67067 13.4119 5.91306 13.6855 5.97546C16.8599 6.69242 17.3057 7.13819 18.0227 10.3132C18.0851 10.5862 18.3275 10.7806 18.6083 10.7806C18.889 10.7806 19.1314 10.5862 19.1938 10.3132C19.9108 7.13819 20.3566 6.69242 23.5316 5.97546C23.8046 5.91306 23.999 5.67067 23.999 5.38989C23.999 5.10911 23.8046 4.86672 23.5316 4.80432Z"
      />
    </svg>
  )
}

// .Y53kl4i.ak8lcEc.BEiXGkg — 16×16, color icon-link (blue-5), fill currentColor.
function ChevronIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="block h-4 min-w-4 overflow-hidden text-af-icon-link"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M5.95285 10H18.0466C18.4528 10 18.7341 10.2031 18.8903 10.6094C19.0466 10.9844 18.9841 11.3125 18.7028 11.5938L12.656 17.6406C12.4685 17.8281 12.2497 17.9219 11.9997 17.9219C11.7497 17.9219 11.531 17.8281 11.3435 17.6406L5.2966 11.5938C5.01535 11.3125 4.95285 10.9844 5.1091 10.6094C5.26535 10.2031 5.5466 10 5.95285 10Z"
      />
    </svg>
  )
}
