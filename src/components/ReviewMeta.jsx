// Правая мета-колонка карточки отзыва.
// Каскад классов проверен по байтовым смещениям. SVG path'ы — реальные из DOM.
//
// СТРУКТУРА:
//   div.U2B5TKY.DkPGJGp.Bk2vHAO.vRl208d.KrI9jym
//     padding pd-xxs pd-sm (8/16), flex column, gap 8, text-left.
//     (≤1200 → grid-column 2, margin-left 0 — переезжает под текст в col 2)
//
//     div.WMOwGgb × 4                одна строка-пара label/value.
//       Реальный CSS:
//         display: grid;
//         grid-template-columns: 96px 1fr;
//         grid-gap: pd-xxs (8);
//         max-width 100%, min-width 0, width 100%.
//
//       div.CWjSPo8.BBQwOJQ.x6rcVv_ "Username:"  ← левая колонка (96px)
//         .CWjSPo8           → 12 / line-md (20) / normal / letter-md (-0.08)
//         .BBQwOJQ           → color text-tertiary (gray-6)
//         .x6rcVv_           → white-space nowrap
//
//       div.CWjSPo8.SXVQGi5.jovyy6q          ← правая колонка (1fr)
//         .CWjSPo8           → 12 / 20 / normal / -0.08
//         .SXVQGi5           → color text-secondary (gray-7)
//         .jovyy6q           → display flex + (compound) overflow hidden, word-break break-word
//
// Внутри value (Username):
//   span.CWjSPo8.SXVQGi5.XHW_KlC          XHW_KlC = items-center, flex, w-100%
//     span.BkevEAI "DH12397"              overflow ellipsis, nowrap
//     "&nbsp;"
//     svg 12×12 (copy icon, реальный path)
//
// Внутри value (Country):
//   div.I_FBPLh.OGdDadg "United States"
//     .I_FBPLh         → color text-primary, nowrap
//     .OGdDadg         → color text-secondary (override), overflow ellipsis, nowrap
//     i.NXDA7p2.y3qReP0.udGBjWg          → inline-block 16×11 sprite-flag, mr-pd-xxs (8)
//
// Внутри value (Review language):
//   span.CWjSPo8.SXVQGi5.u69x9Qw.B0GrhAc.OGdDadg "English"
//     .u69x9Qw           → text-decoration: underline DOTTED 12% thickness, offset 25%
//     .B0GrhAc           → cursor pointer
//     .OGdDadg           → color text-secondary, ellipsis, nowrap
//     i.NXDA7p2.y3qReP0  → sprite-flag (без udGBjWg → без margin)

// Форматирует количество секунд в "Ns" или "Nm Ms".
function formatTimeSpent(seconds) {
  if (seconds == null) return ''
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s === 0 ? `${m}m` : `${m}m ${s}s`
}

export default function ReviewMeta({ meta, timeSpent, overallTimeSpent, confidence }) {
  return (
    <div className="flex flex-col gap-af-xxs px-af-sm py-af-xxs text-left">
      {meta.username && (
        <Row label="Username:">
          <UsernameValue value={meta.username} />
        </Row>
      )}
      {meta.country && (
        <Row label="Country:">
          <CountryValue value={meta.country} />
        </Row>
      )}
      {meta.language && (
        <Row label="Review language:">
          <LanguageValue value={meta.language} />
        </Row>
      )}
      {meta.appVersion && (
        <Row label="App version:">
          <span className="text-af-sm font-af-normal leading-af-md tracking-af-md text-af-text-secondary">
            {meta.appVersion}
          </span>
        </Row>
      )}
      {/* Time spent — показывается только после клика Send Reply (если включён track). */}
      {timeSpent != null && (
        <Row label="Time spent:">
          <span className="text-af-sm font-af-normal leading-af-md tracking-af-md text-af-red-4">
            {formatTimeSpent(timeSpent)}
          </span>
        </Row>
      )}
      {/*
        Overall time spent — суммарное время по всей сессии (одно значение для всех
        карточек). Показывается во всех карточках одновременно когда хотя бы один Send Reply
        был выполнен.
      */}
      {overallTimeSpent != null && (
        <Row label="Overall time spent:">
          <span className="text-af-sm font-af-normal leading-af-md tracking-af-md text-af-red-4">
            {formatTimeSpent(overallTimeSpent)}
          </span>
        </Row>
      )}
      {/*
        Pattern confidence — насколько финальный текст совпал с базовым (AI/Template).
        Показывается после Send Reply, если был выбран вариант.
      */}
      {confidence != null && (
        <Row label="Pattern confidence:">
          <span className="text-af-sm font-af-normal leading-af-md tracking-af-md text-af-red-4">
            {confidence}%
          </span>
        </Row>
      )}
    </div>
  )
}

// .WMOwGgb — grid 96px / 1fr, gap 8, w-100%
function Row({ label, children }) {
  return (
    <div
      className="grid w-full min-w-0 max-w-full gap-af-xxs"
      style={{ gridTemplateColumns: '96px 1fr' }}
    >
      {/* .CWjSPo8.BBQwOJQ.x6rcVv_ — label: 12/20 normal -0.08 tertiary, nowrap */}
      <div className="whitespace-nowrap text-af-sm font-af-normal leading-af-md tracking-af-md text-af-text-tertiary">
        {label}
      </div>
      {/* .CWjSPo8.SXVQGi5.jovyy6q — value-wrapper: flex, overflow hidden, word-break */}
      <div className="flex min-w-0 break-words overflow-hidden text-af-sm font-af-normal leading-af-md tracking-af-md text-af-text-secondary">
        {children}
      </div>
    </div>
  )
}

// Username: span.XHW_KlC (flex items-center w-100%) > span.BkevEAI + &nbsp; + svg copy 12×12
function UsernameValue({ value }) {
  return (
    <span className="flex w-full items-center text-af-sm font-af-normal leading-af-md tracking-af-md text-af-text-secondary">
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">{value}</span>
      <span>&nbsp;</span>
      <CopyIcon />
    </span>
  )
}

// Country: div.I_FBPLh.OGdDadg → color text-secondary (OGdDadg override I_FBPLh's primary)
//          + i.NXDA7p2.y3qReP0.udGBjWg → флаг 16×11 + mr 8.
// Реальный AppFollow использует sprite. У нас флаг через unicode emoji.
function CountryValue({ value }) {
  return (
    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-af-sm font-af-normal leading-af-md tracking-af-md text-af-text-secondary">
      <i className="mr-af-xxs inline-block h-[11px] w-[16px] align-baseline text-[16px] leading-[11px]" aria-hidden>
        🇺🇸
      </i>
      {value}
    </div>
  )
}

// Language: span.u69x9Qw.B0GrhAc.OGdDadg → text-decoration dotted underline + cursor pointer +
// color text-secondary. + i.NXDA7p2.y3qReP0:
//   .NXDA7p2 → margin-right pd-xxs (8) ! display inline-block, h 11, w 16, line 11
//   (.udGBjWg тут НЕТ, но .NXDA7p2 уже сам задаёт margin-right 8.)
function LanguageValue({ value }) {
  return (
    <span
      className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-af-sm font-af-normal leading-af-md tracking-af-md text-af-text-secondary"
      style={{
        textDecorationLine: 'underline',
        textDecorationStyle: 'dotted',
        textDecorationThickness: '12%',
        textUnderlineOffset: '25%',
      }}
    >
      <i className="mr-af-xxs inline-block h-[11px] w-[16px] align-baseline text-[16px] leading-[11px]" aria-hidden>
        🇬🇧
      </i>
      {value}
    </span>
  )
}

// SVG copy icon 12×12 — реальный path из DOM AppFollow.
function CopyIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className="block h-3 min-w-3 overflow-hidden"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M10 2.6001C10 2.31182 9.99937 2.12556 9.98779 1.98389C9.9767 1.8481 9.95791 1.79767 9.94531 1.77295C9.89739 1.67897 9.82104 1.60261 9.72705 1.55469C9.70233 1.54209 9.65191 1.52331 9.51612 1.51221C9.44532 1.50643 9.36339 1.50301 9.26319 1.50147L8.8999 1.5H6.1001C5.81182 1.5 5.62556 1.50063 5.48389 1.51221C5.3481 1.52331 5.29767 1.54209 5.27295 1.55469C5.17897 1.60261 5.10261 1.67897 5.05469 1.77295C5.0421 1.79767 5.02331 1.8481 5.01221 1.98389C5.00063 2.12556 5 2.31182 5 2.6001V6.3999C5 6.68818 5.00063 6.87445 5.01221 7.01612C5.02331 7.15191 5.0421 7.20233 5.05469 7.22705C5.10261 7.32104 5.17897 7.39739 5.27295 7.44531C5.29767 7.45791 5.3481 7.4767 5.48389 7.4878C5.62556 7.49937 5.81182 7.5 6.1001 7.5H8.8999C9.18818 7.5 9.37445 7.49937 9.51612 7.4878C9.65191 7.4767 9.70233 7.45791 9.72705 7.44531C9.82104 7.3974 9.89739 7.32104 9.94531 7.22705C9.95791 7.20233 9.9767 7.15191 9.98779 7.01612C9.99937 6.87445 10 6.68818 10 6.3999V2.6001ZM2 9.3999C2 9.68818 2.00063 9.87445 2.01221 10.0161C2.02331 10.1519 2.0421 10.2023 2.05469 10.2271C2.10261 10.321 2.17897 10.3974 2.27295 10.4453C2.29767 10.4579 2.3481 10.4767 2.48389 10.4878C2.62556 10.4994 2.81182 10.5 3.1001 10.5H5.8999C6.18818 10.5 6.37445 10.4994 6.51612 10.4878C6.65191 10.4767 6.70233 10.4579 6.72705 10.4453C6.82104 10.3974 6.8974 10.321 6.94531 10.2271C6.95791 10.2023 6.9767 10.1519 6.9878 10.0161C6.99937 9.87445 7 9.68818 7 9.3999V8.5H6.1001C5.82832 8.5 5.59418 8.50054 5.40235 8.48487C5.20472 8.46871 5.008 8.4328 4.81885 8.33643C4.53674 8.19264 4.30736 7.96327 4.16358 7.68115C4.0672 7.49201 4.03129 7.29529 4.01514 7.09766C3.99947 6.90582 4 6.67168 4 6.3999V4.5H3.1001C2.81182 4.5 2.62556 4.50063 2.48389 4.51221C2.3481 4.52331 2.29767 4.5421 2.27295 4.55469C2.17897 4.60261 2.10261 4.67897 2.05469 4.77295C2.04209 4.79767 2.02331 4.8481 2.01221 4.98389C2.00063 5.12556 2 5.31182 2 5.6001V9.3999ZM11 6.3999C11 6.67168 11.0005 6.90582 10.9849 7.09766C10.9687 7.29529 10.9328 7.49201 10.8364 7.68115C10.6926 7.96327 10.4633 8.19264 10.1812 8.33643C9.99201 8.4328 9.79529 8.46871 9.59766 8.48487C9.40582 8.50054 9.17168 8.5 8.8999 8.5H8V9.3999C8 9.67168 8.00054 9.90582 7.98487 10.0977C7.96871 10.2953 7.9328 10.492 7.83643 10.6812C7.69264 10.9633 7.46327 11.1926 7.18115 11.3364C6.99201 11.4328 6.79529 11.4687 6.59766 11.4849C6.40582 11.5005 6.17168 11.5 5.8999 11.5H3.1001C2.82832 11.5 2.59418 11.5005 2.40235 11.4849C2.20472 11.4687 2.008 11.4328 1.81885 11.3364C1.53674 11.1926 1.30736 10.9633 1.16358 10.6812C1.0672 10.492 1.03129 10.2953 1.01514 10.0977C0.999465 9.90582 1 9.67168 1 9.3999V5.6001C1 5.32832 0.999465 5.09418 1.01514 4.90235C1.03129 4.70472 1.0672 4.508 1.16358 4.31885C1.30736 4.03674 1.53674 3.80736 1.81885 3.66358C2.008 3.5672 2.20472 3.53129 2.40235 3.51514C2.59418 3.49947 2.82832 3.5 3.1001 3.5H4V2.6001C4 2.32832 3.99947 2.09418 4.01514 1.90235C4.03129 1.70472 4.0672 1.508 4.16358 1.31885C4.30736 1.03674 4.53674 0.807364 4.81885 0.663576C5.008 0.5672 5.20472 0.531294 5.40235 0.515139C5.59418 0.499465 5.82832 0.500002 6.1001 0.500002H8.8999L9.27881 0.501955C9.39521 0.503818 9.50176 0.507304 9.59766 0.515139C9.79529 0.531294 9.99201 0.5672 10.1812 0.663576C10.4633 0.807364 10.6926 1.03674 10.8364 1.31885C10.9328 1.508 10.9687 1.70472 10.9849 1.90235C11.0005 2.09418 11 2.32832 11 2.6001V6.3999Z"
      />
    </svg>
  )
}
