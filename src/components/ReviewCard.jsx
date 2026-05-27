import { useState } from 'react'
import ReviewMeta from './ReviewMeta.jsx'
import AiDraft from './AiDraft.jsx'

// .CK_OBzG[role="listitem"] — корневой grid карточки отзыва.
// Каскад классов проверен по байтовым смещениям. SVG paths — из реального DOM.
//
// СТРУКТУРА:
//   div.CK_OBzG[.zbm_D3Z][role="listitem"]   grid 3 cols, align flex-start, w 100%,
//                                              padding 28/8/12/8, position relative
//                                              .zbm_D3Z → border-top 1px gray-3
//     div.tbFnn_7                            КОЛОНКА 1 (чекбокс) — w 100% h 100% relative
//       label.DRj2itn.oukbx4j[data-size=lg]   flex-col h 100%, mr 4, mt 2,
//                                              inline-flex items-center, text-primary, font 16
//         div.nxAw8_5                        flex relative
//           input.a3Jk11b                    20×20 (data-size=lg), border gray-4, radius-md,
//                                              bg primary, appearance none
//           svg.X7aTQ7D                      12×12, absolute top-4 left-4 (data-size=lg),
//                                              color blue-5, hidden default, block on :checked
//         div.jc_MAVD                        h 100% w 100% (клик-зона под чекбоксом)
//
//     div.U2B5TKY.DkPGJGp.Bk2vHAO.vRl208d.nEjReJM   КОЛОНКА 2 (контент)
//       flex-col gap 8 text-left, relative, padding-left 12, margin-right 12
//       span.igndXVR[data-rating]            sentiment polosa absolute top 0 left 0 h 100% w 2px,
//                                              radius-md, bg по rating
//       div.U2B5TKY.Bk2vHAO.vRl208d.vxNFIie    верхняя строка (звёзды+date | Report+More)
//         justify-between flex-wrap items-center gap 8
//         div.Ol9a3Ex                        слева: flex-wrap items-center gap 8 (звёзды + date)
//           svg.RtNDl7p.MsOhRcm              СВ-звёзды (один svg с 5 звёздами, gradient fill
//                                              по rating), 100×20, display block, margin 2 0
//           span.YKzOTsz.aMb6hSF.sMnXdhw     View sentiment кнопка-тэг
//             button.RmgOQmc.KuRs6n8         реальный path "Bolt Premium" (молния-звезда)
//               div.kDGIowG > svg            mr 2 mt 2
//               span.v_p2IV5 "View sentiment"  inline-block ellipsis nowrap
//           span.CWjSPo8.SXVQGi5             "May 23, 2026, 4:59 PM" — text-sm secondary
//         div.U2B5TKY.Bk2vHAO.vRl208d.cWOGNkx   справа: flex-wrap items-center gap 8
//           button "Report" .nNh22OO         color red-4
//           button.l2rYh9W                   square 36×36 — троеточие (More)
//             svg .v34RE_H (rotate 90deg) → вертикальные точки
//       div.f9U5ErS.W2MAFY5                  ТЕКСТ ОТЗЫВА — max-w 100% w 100% mb 12
//         div.BQCVweX.IUU1koI.LmcjnXt        overflow:auto, relative, w-100%
//           div.U2B5TKY.DkPGJGp.kJeCRaA.vRl208d   flex-col gap 4
//             span.GmXxLqY.jrV39Ye.ojRd2rd "Great"   ← BOLD ЗАГОЛОВОК
//             span.GmXxLqY.jrV39Ye  text       ← body, text-md (или text-lg в широких)
//                                                jrV39Ye: 14/20 NORMAL letter 0 + (override) 16/24
//       div.kJeCRaA                         ТЕГИ — flex-col gap 4
//         span.CWjSPo8.SXVQGi5 "Tags:"      text-sm secondary
//         div.bExIiH0                       flex-wrap items-center gap 8 (контейнер тегов)
//           span.YKzOTsz.aMb6hSF[.sMnXdhw|.rQluApH|.UV2WGQv]
//                                              YKzOTsz базовый: inline-flex items-center,
//                                              border-sm transparent, radius-md, h 20, w max-content
//                                              .sMnXdhw → bg gray-2 (control-bg-secondary-medium),
//                                                          color text-premium (purple-7) — AI-tag
//                                              .rQluApH → border control-stroke gray-3,
//                                                          color text-secondary — regular tag
//                                              .UV2WGQv → color text-link blue-5 — "Add tag"
//             button.RmgOQmc.KuRs6n8         tag button — bg initial, border none,
//                                              font Lato 12 (tag-font-size or text-sm)
//               div.kDGIowG > svg            иконка тега 16×16 (плюс для regular/add, sparkle для AI)
//               span.v_p2IV5 "Crash"          inline-block ellipsis nowrap
//       AI-draft (вынесено отдельно)
//
//     div.U2B5TKY.DkPGJGp.Bk2vHAO.vRl208d.KrI9jym   КОЛОНКА 3 (мета)
//       padding 8 16 — см. ReviewMeta.jsx

export default function ReviewCard({ review, overallTimeSpent, onSessionTimeAdd }) {
  const rating = review.rating ?? 4

  // Time tracking — для отзывов с aiDraft.trackTime === true.
  const [timeSpent, setTimeSpent] = useState(null)
  // Pattern confidence — финальное значение после Send Reply (0..100 или null).
  const [confidence, setConfidence] = useState(null)

  return (
    <div
      role="listitem"
      id={`review-${review.id}`}
      className="relative grid w-full max-w-full grid-cols-[minmax(20px,min-content)_minmax(0,1fr)] items-start gap-y-af-xs border-t border-af-bg-stroke pl-af-xxs pr-af-xxs pt-[28px] pb-[28px] xl:grid-cols-[minmax(20px,min-content)_minmax(250px,800px)_minmax(230px,1fr)] 5xl:grid-cols-[minmax(20px,min-content)_minmax(250px,1000px)_minmax(280px,1fr)] scroll-mt-af-lg"
    >
      {/* КОЛОНКА 1: .tbFnn_7 — чекбокс selection */}
      <div className="relative h-full w-full">
        <label className="m-0 mr-af-xxxs mt-[2px] flex h-full cursor-pointer flex-col items-center text-af-lg text-af-text-primary">
          <span className="relative flex">
            <input
              type="checkbox"
              className="peer h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-af-md border border-af-gray-4 bg-af-bg-primary"
            />
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
          {/* .jc_MAVD — растягивающаяся клик-зона */}
          <span className="h-full w-full" />
        </label>
      </div>

      {/*
        КОЛОНКА 2: .nEjReJM — контент отзыва.
        Реальный CSS:
          padding-left: pd-xs (12)   ← внутренний отступ от левого края до контента
          margin-right: pd-xs (12)   ← внешний справа (на 1800+ → 40, на 1921+ → 80)
          position: relative          ← база для absolute-полоски
        sentiment-полоса .igndXVR — absolute left:0 width:2px → стоит ВПЛОТНУЮ к левому
        краю контейнера. Между правым краем полосы и началом контента: 12 - 2 = 10px.
      */}
      <div className="relative col-start-2 row-start-1 flex flex-col gap-af-xxs pl-af-xs text-left mr-af-xs 5xl:mr-af-xxl 6xl:mr-[80px]">
        {/* .igndXVR — sentiment-полоска (цвет по rating). left:0 → ВНУТРИ padding-left. */}
        <span
          className="absolute left-0 top-0 h-full w-[2px] rounded-af-md"
          style={{ backgroundColor: starBgColor(rating) }}
          data-rating={rating}
        />

        {/* Верхняя строка: звёзды + date | Report + More */}
        <TopRow review={review} />

        {/* Текст отзыва (заголовок + body) */}
        <ReviewBody title={review.title} text={review.text} />

        {/* Теги */}
        <TagsRow tags={review.tags} />

        {/* AI-draft (если есть) */}
        {review.aiDraft?.enabled && (
          <AiDraft
            draft={review.aiDraft}
            onSend={(seconds) => {
              setTimeSpent(seconds)
              onSessionTimeAdd?.(seconds)
            }}
            onSendWithMetrics={({ confidence: c }) => {
              setConfidence(c)
            }}
          />
        )}
      </div>

      {/* КОЛОНКА 3: .KrI9jym — мета. На <xl уезжает под текст в col 2. */}
      <div className="col-span-2 xl:col-span-1 xl:col-start-3 xl:row-start-1">
        <ReviewMeta
          meta={review.meta}
          timeSpent={timeSpent}
          overallTimeSpent={review.aiDraft?.trackTime ? overallTimeSpent : null}
          confidence={confidence}
        />
      </div>
    </div>
  )
}

// .vxNFIie — родитель: items-center flex flex-wrap, justify-content space-between, БЕЗ gap.
// .Ol9a3Ex / .cWOGNkx — items-center flex flex-wrap, БЕЗ gap.
// Промежутки между элементами образуются естественно (margin внутри детей).
function TopRow({ review }) {
  return (
    // .vxNFIie + .Bk2vHAO + .U2B5TKY + .vRl208d → flex flex-wrap items-center justify-between, gap 8 (Bk2vHAO)
    <div className="flex flex-wrap items-center justify-between gap-af-xxs">
      {/* .Ol9a3Ex + .Bk2vHAO → flex flex-wrap items-center, gap 8 (Bk2vHAO) */}
      <div className="flex flex-wrap items-center gap-af-xxs">
        <StarsSvg rating={review.rating ?? 4} />
        <ViewSentimentTag />
        {/*
          Date — span.CWjSPo8.SXVQGi5
          .CWjSPo8,.WdtRoGo → font-weight normal, letter-spacing letter-md (-0.08)
          .CWjSPo8           → font-size text-sm (12)
          .CWjSPo8,.hfFP08w  → line-height line-md (20)  ← переопределяет дефолт 18
          .SXVQGi5           → color text-secondary
          Итог: 12 / 20 / normal / -0.08 / secondary.
        */}
        <span className="text-af-sm font-af-normal leading-af-md tracking-af-md text-af-text-secondary">
          {review.date}
        </span>
      </div>
      {/* .cWOGNkx + .Bk2vHAO → flex flex-wrap items-center, gap 8 (Bk2vHAO) */}
      <div className="flex flex-wrap items-center gap-af-xxs">
        {/*
          Report: .ucE4oQl.wEOj6nq.nHUv4yq.nNh22OO
          .ucE4oQl → font-weight BOLD, font-size 14, line-sm (18), nowrap
          .wEOj6nq → font-weight NORMAL (override), min-height 28, padding 0 16
          .nHUv4yq → border NONE, bg initial
          .nNh22OO → color red-4 (включая hover/focus)
        */}
        <button
          type="button"
          className="inline-flex h-7 min-h-7 cursor-pointer items-center justify-center whitespace-nowrap border-none bg-transparent px-af-sm text-af-md font-af-normal leading-af-sm text-af-red-4 transition-colors hover:bg-transparent"
        >
          Report
        </button>
        {/*
          More: .ucE4oQl.wEOj6nq.CsgOPCt.l2rYh9W
          .wEOj6nq → 28 min-h
          .CsgOPCt → border gray-3, bg primary, color blue-5
          .l2rYh9W.wEOj6nq → 28×28 square
          + svg.v34RE_H (rotate 90deg) → вертикальные точки
        */}
        <button
          type="button"
          className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-af-lg border border-af-bg-stroke bg-af-bg-primary p-0 text-af-text-link transition-colors hover:bg-af-bg-secondaryGray"
          aria-label="More"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="rotate-90" aria-hidden>
            <path
              fill="currentColor"
              d="M7.1999 12C7.1999 12.6365 6.94705 13.247 6.49696 13.697C6.04687 14.1471 5.43642 14.4 4.7999 14.4C4.16338 14.4 3.55293 14.1471 3.10285 13.697C2.65276 13.247 2.3999 12.6365 2.3999 12C2.3999 11.3635 2.65276 10.753 3.10285 10.3029C3.55293 9.85285 4.16338 9.59999 4.7999 9.59999C5.43642 9.59999 6.04687 9.85285 6.49696 10.3029C6.94705 10.753 7.1999 11.3635 7.1999 12ZM14.3999 12C14.3999 12.6365 14.147 13.247 13.697 13.697C13.2469 14.1471 12.6364 14.4 11.9999 14.4C11.3634 14.4 10.7529 14.1471 10.3028 13.697C9.85276 13.247 9.5999 12.6365 9.5999 12C9.5999 11.3635 9.85276 10.753 10.3028 10.3029C10.7529 9.85285 11.3634 9.59999 11.9999 9.59999C12.6364 9.59999 13.2469 9.85285 13.697 10.3029C14.147 10.753 14.3999 11.3635 14.3999 12ZM19.1999 14.4C19.8364 14.4 20.4469 14.1471 20.897 13.697C21.347 13.247 21.5999 12.6365 21.5999 12C21.5999 11.3635 21.347 10.753 20.897 10.3029C20.4469 9.85285 19.8364 9.59999 19.1999 9.59999C18.5634 9.59999 17.9529 9.85285 17.5028 10.3029C17.0528 10.753 16.7999 11.3635 16.7999 12C16.7999 12.6365 17.0528 13.247 17.5028 13.697C17.9529 14.1471 18.5634 14.4 19.1999 14.4Z"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

// .RtNDl7p.MsOhRcm — звёзды одним SVG с linear-gradient.
// 100×20 viewBox 0.5 0 64 13, display block, margin 2px 0 (RtNDl7p), margin 0 (MsOhRcm override)
// fill через url(#<id>): gradient от starColor с offset=ratingFraction к gray-4 от offset=0.
// 5 звёзд path-line; rating заполняет первые N звёзд цветом по rating.
const STAR_COLORS = {
  1: '#ff7978',
  2: '#feb470',
  3: '#fbd56a',
  4: '#bdd280',
  5: '#66b47c',
}
function starBgColor(rating) {
  return STAR_COLORS[rating] ?? '#dae7f7'
}

function StarsSvg({ rating }) {
  const id = `stars-${rating}-${Math.random().toString(36).slice(2, 8)}`
  const offset = rating / 5
  const color = starBgColor(rating)
  return (
    // .RtNDl7p.MsOhRcm: display block, margin 0 (MsOhRcm перекрывает RtNDl7p's "2px 0")
    <svg
      width="100"
      height="20"
      viewBox="0.5 0 64 13"
      xmlns="http://www.w3.org/2000/svg"
      fill={`url(#${id})`}
      className="m-0 block"
      aria-label={`${rating} stars`}
    >
      <linearGradient id={id} x2="100%" gradientUnits="userSpaceOnUse">
        <stop offset={offset} stopColor={color} />
        <stop offset={0} stopColor="#dae7f7" />
      </linearGradient>
      <path
        strokeWidth="0.5"
        stroke={`url(#${id})`}
        d="M6.23 1.904L6 1.349l-.23.555-1.265 3.039-3.28.263-.6.048.457.39 2.5 2.142-.764 3.201-.14.585.513-.314L6 9.543l2.809 1.715.513.314-.14-.585-.764-3.201 2.5-2.141.456-.391-.599-.048-3.28-.263L6.23 1.904zM19.23 1.904L19 1.349l-.23.555-1.265 3.039-3.28.263-.6.048.457.39 2.5 2.142-.764 3.201-.14.585.513-.314L19 9.543l2.809 1.715.513.314-.14-.585-.763-3.201 2.499-2.141.456-.391-.599-.048-3.28-.263-1.264-3.039zM32.23 1.904L32 1.349l-.23.555-1.265 3.039-3.28.263-.6.048.457.39 2.5 2.142-.764 3.201-.14.585.513-.314L32 9.543l2.809 1.715.513.314-.14-.585-.764-3.201 2.5-2.141.456-.391-.599-.048-3.28-.263-1.264-3.039zM45.23 1.904L45 1.349l-.23.555-1.265 3.039-3.28.263-.6.048.457.39 2.5 2.142-.764 3.201-.14.585.513-.314L45 9.543l2.809 1.715.513.314-.14-.585-.764-3.201 2.5-2.141.456-.391-.599-.048-3.28-.263-1.264-3.039zM58.23 1.904L58 1.349l-.23.555-1.265 3.039-3.28.263-.6.048.457.39 2.5 2.142-.764 3.201-.14.585.513-.314L58 9.543l2.809 1.715.513.314-.14-.585-.764-3.201 2.5-2.141.456-.391-.599-.048-3.28-.263-1.264-3.039z"
      />
    </svg>
  )
}

// View sentiment tag: .YKzOTsz.aMb6hSF.sMnXdhw + button.RmgOQmc.KuRs6n8
// .YKzOTsz: inline-flex items-center, border 1px transparent, radius-md, h 20, w max-content
// .sMnXdhw: bg gray-2 (control-bg-secondary-medium), color text-premium (purple-7)
// .RmgOQmc: bg initial, border none, color inherit, inline-flex items-center,
//           font Lato 12 (tag-font-size or text-sm), weight NORMAL, line 18 (tag-line-height or line-sm),
//           max-w 100%, min-w 0, outline none, overflow hidden,
//           padding: 0 calc(pd-xxxs - border-sm) pd-xxxxs   = 0 3px 2px
// .kDGIowG: margin-right 2 (pd-xxxxs), margin-top 2
function ViewSentimentTag() {
  return (
    <span
      className="inline-flex h-5 max-w-full cursor-pointer items-center rounded-af-md border border-transparent text-af-purple-7"
      style={{ backgroundColor: '#f0f5fa' }}
    >
      {/*
        .RmgOQmc финал:
          font-family Lato, font-size 12 (tag-font-size→text-sm), font-weight normal,
          line-height 18 (tag-line-height→line-sm), color inherit (purple-7 от .sMnXdhw),
          letter-spacing НЕ задан → browser default (normal). Перекрываем tracking-normal,
          чтобы убрать -0.12 из text-af-sm токена.
      */}
      <button
        type="button"
        className="inline-flex max-w-full cursor-pointer items-center overflow-hidden border-none bg-transparent font-sans text-af-sm font-af-normal leading-af-sm tracking-normal text-current outline-none"
        style={{ fontFamily: 'Lato, Arial, Helvetica, sans-serif', padding: '0 3px 2px', minWidth: 0, width: 'max-content' }}
      >
        <span className="mr-[2px] mt-[2px] inline-block">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
            <defs>
              <linearGradient id="bolt-prem" x1="3.75" y1="0.749275" x2="22.0225" y2="2.29486" gradientUnits="userSpaceOnUse">
                <stop stopColor="#643DF2" />
                <stop offset="1" stopColor="#9F88F2" />
              </linearGradient>
            </defs>
            <path
              fill="url(#bolt-prem)"
              d="M20.0483 11.761L9.54833 23.011C9.43699 23.1303 9.28978 23.21 9.12903 23.2381C8.96829 23.2661 8.80277 23.241 8.65759 23.1665C8.51242 23.092 8.3955 22.9722 8.32457 22.8252C8.25365 22.6783 8.23258 22.5122 8.26458 22.3522L9.63952 15.4776L4.23667 13.4515C4.12121 13.4082 4.01821 13.3371 3.93679 13.2445C3.85536 13.1519 3.79802 13.0407 3.76984 12.9207C3.74167 12.8006 3.74352 12.6755 3.77524 12.5563C3.80697 12.4372 3.86758 12.3277 3.95171 12.2375L14.4517 0.98753C14.5631 0.868241 14.7103 0.788517 14.871 0.760452C15.0318 0.732387 15.1973 0.757512 15.3424 0.832015C15.4876 0.906519 15.6045 1.02634 15.6755 1.17329C15.7464 1.32025 15.7675 1.48633 15.7355 1.64634L14.3605 8.52094L19.7634 10.547C19.8788 10.5903 19.9818 10.6614 20.0633 10.754C20.1447 10.8466 20.202 10.9578 20.2302 11.0779C20.2584 11.1979 20.2565 11.323 20.2248 11.4422C20.1931 11.5614 20.1325 11.6709 20.0483 11.761Z"
            />
          </svg>
        </span>
        <span className="inline-block overflow-hidden text-ellipsis whitespace-nowrap">
          View sentiment
        </span>
      </button>
    </span>
  )
}

// .f9U5ErS.W2MAFY5 — обёртка текста (max-w 100%, w 100%, mb 12)
// .BQCVweX.IUU1koI.LmcjnXt — внутренний overflow-auto contaner
// .U2B5TKY.DkPGJGp.kJeCRaA — flex-col gap 4
// span.GmXxLqY.jrV39Ye.ojRd2rd "Great" — заголовок BOLD primary 14/20
// span.GmXxLqY.jrV39Ye text — body NORMAL primary 14/20 letter 0 word-break break-word
function ReviewBody({ title, text }) {
  // .jrV39Ye каскад:
  //   (default)        font-size text-md (14), line-height line-md (20),
  //                     font-weight normal, letter-spacing 0, color text-primary, word-break break-word
  //   (@min-width:1440) font-size text-lg (16), line-height line-lg (24)
  // .ojRd2rd → font-weight BOLD (для заголовка)
  return (
    // mb-af-xs (12) от .W2MAFY5 — даёт визуальный отступ ~20 (12 + 8 от gap-родителя)
    // между ReviewBody и TagsRow. Симметрично TagsRow тоже имеет mb-af-xs.
    <div className="mb-af-xs w-full max-w-full">
      <div className="relative w-full max-w-full overflow-auto">
        <div className="flex flex-col gap-af-xxxs">
          {title && (
            <span
              dir="auto"
              className="break-words text-af-md font-af-bold leading-af-md tracking-normal text-af-text-primary 3xl:text-af-lg 3xl:leading-af-lg"
            >
              {title}
            </span>
          )}
          <span
            dir="auto"
            className="break-words text-af-md font-af-normal leading-af-md tracking-normal text-af-text-primary 3xl:text-af-lg 3xl:leading-af-lg"
          >
            {text}
          </span>
        </div>
      </div>
    </div>
  )
}

// Теги:
// Родитель .U2B5TKY.DkPGJGp.kJeCRaA.vRl208d: flex-col, gap 4 (pd-xxxs), text-left.
// "Tags:" — span.CWjSPo8.SXVQGi5: font 12/20 normal letter-md, color text-secondary.
// .bExIiH0: items-center, flex, flex-wrap. БЕЗ gap.
// Между тегами расстояние обеспечивает их собственный border 1px (transparent) + .RmgOQmc padding 0/3/2 +
// .kDGIowG mr/mt 2. То есть тэги стоят встык — visual spacing небольшой и формируется их структурой.
function TagsRow({ tags = [] }) {
  // "Tags:" и сами теги — в одной горизонтальной строке (wrap).
  // gap pd-xxxs (4) между тэгами и между Tags:/первым тэгом.
  // mb-af-xs (12) — симметрично ReviewBody, чтобы отступ до AI-draft был тем же ~20px
  // (12 mb + 8 gap родителя), как от текста до тегов.
  return (
    <div className="mb-af-xs flex flex-wrap items-center gap-af-xxxs text-left">
      <span className="shrink-0 text-af-sm font-af-normal leading-af-md tracking-af-md text-af-text-secondary">
        Tags:
      </span>
      <div className="flex flex-wrap items-center gap-af-xxxs">
        {tags.map((t, i) => (
          <Tag key={i} {...t} />
        ))}
        <Tag label="Add tag" variant="add" />
      </div>
    </div>
  )
}

// Тег: .YKzOTsz.aMb6hSF[.sMnXdhw|.rQluApH|.UV2WGQv] + button.RmgOQmc.KuRs6n8
//
// .YKzOTsz: inline-flex items-center, border 1px transparent, radius-md, h 20, w max-content
// .aMb6hSF: cursor pointer
//
// Варианты по 2-му классу:
//   .sMnXdhw → bg gray-2 (secondary-medium), color text-premium (purple-7)  ← AI-tag
//   .rQluApH → border gray-3 (control-stroke), color text-secondary           ← regular tag
//   .UV2WGQv → color text-link (blue-5)                                       ← "Add tag"
//
// Внутри button.RmgOQmc:
//   .kDGIowG → mr 2 mt 2  (обёртка иконки)
//   svg 16×16 SgZiABU
//   .v_p2IV5 → inline-block ellipsis nowrap (текст)
function Tag({ label, variant = 'regular', semantic = false }) {
  const isAI = variant === 'ai'
  const isAdd = variant === 'add'

  const variantStyle = (() => {
    if (isAI)
      return {
        wrapper: 'text-af-purple-7 border-transparent',
        bg: '#f0f5fa',
      }
    if (isAdd)
      return {
        wrapper: 'text-af-text-link border-transparent',
        bg: 'transparent',
      }
    return {
      wrapper: 'text-af-text-secondary border-af-bg-stroke',
      bg: 'transparent',
    }
  })()

  return (
    <span
      className={`inline-flex h-5 max-w-full cursor-pointer items-center rounded-af-md border ${variantStyle.wrapper}`}
      style={{ backgroundColor: variantStyle.bg, width: 'max-content' }}
    >
      {/*
        Tag .RmgOQmc: Lato 12 / 18 / normal / letter-spacing default (не задан CSS-ом).
        tracking-normal перекрывает -0.12 из text-af-sm токена.
      */}
      <button
        type="button"
        className="inline-flex max-w-full cursor-pointer items-center overflow-hidden border-none bg-transparent font-sans text-af-sm font-af-normal leading-af-sm tracking-normal text-current outline-none"
        style={{
          fontFamily: 'Lato, Arial, Helvetica, sans-serif',
          padding: '0 3px 2px',
          minWidth: 0,
          width: 'max-content',
        }}
      >
        <span className="mr-[2px] mt-[2px] inline-block">
          {isAI ? <SparkleSmallIcon /> : <PlusSmallIcon />}
        </span>
        <span className="inline-block overflow-hidden text-ellipsis whitespace-nowrap">
          {label}
        </span>
      </button>
    </span>
  )
}

// 12×12 sparkle (две звезды) — реальный path из DOM.
// Каскад `.Y53kl4i.SgZiABU` (2 класса > 1 класс) переопределяет .Y53kl4i (20×20) на 12×12.
// В DOM атрибуты width/height="24" но CSS перекрывает → конечный размер 12×12.
function SparkleSmallIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
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

// 12×12 плюс — реальный path из DOM. Та же логика SgZiABU → 12×12.
function PlusSmallIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.66895 7.89071C1.66898 7.67858 1.75326 7.47515 1.90326 7.32515C2.05326 7.17515 2.25669 7.09086 2.46882 7.09083H7.3258L7.33561 2.48089C7.33377 2.37468 7.35309 2.26917 7.39246 2.1705C7.43183 2.07184 7.49045 1.98201 7.56491 1.90624C7.63937 1.83048 7.72817 1.7703 7.82614 1.72923C7.9241 1.68815 8.02926 1.66699 8.13549 1.66699C8.24172 1.66699 8.34688 1.68815 8.44485 1.72923C8.54281 1.7703 8.63161 1.83048 8.70607 1.90624C8.78053 1.98201 8.83915 2.07184 8.87852 2.1705C8.91789 2.26917 8.93722 2.37468 8.93537 2.48089L8.92556 7.09083H13.545C13.7548 7.09448 13.9547 7.18035 14.1017 7.32996C14.2487 7.47957 14.3311 7.68094 14.3311 7.89071C14.3311 8.10048 14.2487 8.30185 14.1017 8.45146C13.9547 8.60107 13.7548 8.68694 13.545 8.69059H8.92556V13.5476C8.92191 13.7573 8.83604 13.9572 8.68643 14.1042C8.53682 14.2513 8.33544 14.3337 8.12568 14.3337C7.91591 14.3337 7.71454 14.2513 7.56493 14.1042C7.41532 13.9572 7.32944 13.7573 7.3258 13.5476V8.69059H2.46882C2.25669 8.69056 2.05326 8.60628 1.90326 8.45628C1.75326 8.30628 1.66898 8.10284 1.66895 7.89071Z"
        fill="currentColor"
      />
    </svg>
  )
}
