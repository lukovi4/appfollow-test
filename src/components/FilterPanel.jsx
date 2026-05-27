// FilterPanel — div.GJLHQAz.
// Каскад классов проверен по байтовым смещениям в CSS.
// Все SVG-path'и — реальные из исходного DOM.

const periods = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'This year', 'Custom']
const starColors = { 1: '#ff7978', 2: '#feb470', 3: '#fbd56a', 4: '#bdd280', 5: '#66b47c' }

export default function FilterPanel() {
  return (
    // .GJLHQAz — bg secondaryWhite, h-100%, padding pd-sm pd-lg (16/24), relative, w-100%
    <aside className="relative h-full w-full bg-af-bg-secondaryWhite px-af-lg py-af-sm">
      {/*
        Collapse-кнопка (.ktZns3d + .EKfMcOA.pe2PSOj) в оригинале:
        - .pe2PSOj по умолчанию { display: none } + opacity 0
        - Активируется через hover-state родителя или JS
        Скрываем полностью, как в оригинальном default state.
      */}

      {/* .GI5m94n — flex column, items-flex-start, gap pd-sm (16), h fit-content */}
      <div className="flex h-fit flex-col items-start gap-af-sm">
        <Section title="Period">
          <div className="flex flex-col gap-af-xxs text-left">
            {periods.map((p, i) => (
              <Radio key={p} name="period" label={p} defaultChecked={i === 2} />
            ))}
          </div>
        </Section>

        <Section title="Review rating">
          {/* .Bhq04k3 — mb pd-xs (12) у верхнего ряда */}
          <div className="mb-af-xs flex gap-af-md">
            <RatingCheckbox value={5} />
            <RatingCheckbox value={4} />
          </div>
          <div className="flex gap-af-md">
            <RatingCheckbox value={3} />
            <RatingCheckbox value={2} />
            <RatingCheckbox value={1} />
          </div>
        </Section>

        <Section title="Review language">
          <SelectButton placeholder="e.g. English" compact />
        </Section>

        <Section title="Country">
          <SelectButton placeholder="e.g. United Kingdom" compact />
        </Section>

        <Section title="Reply">
          <SelectButton placeholder="e.g. With reply" compact />
        </Section>

        <Section title="Review text">
          <TextInput placeholder="Enter text" />
        </Section>

        <Section title="Tag">
          {/*
            .U2B5TKY.Bk2vHAO.vRl208d.cYEOmzU:
              U2B5TKY = display flex
              Bk2vHAO = gap pd-xxs (8)
              vRl208d = text-align left
              cYEOmzU = flex-wrap, w-100%
            Каждый .gzh2Cyq имеет w-100% → стекуются вертикально (по строке на каждый).
          */}
          <div className="flex w-full flex-wrap gap-af-xxs text-left">
            {/*
              Первый таг-селектор: button.M9hao_P.ANr9eYH.iLjGpcQ (БЕЗ .EOCXMyH)
              Текст: <span.yEqU4HH> — text-primary (без .Qkzwfd_).
              Это «выбранное значение» (Any of the tags).
            */}
            <TagSelect value="Any of the tags" />
            {/*
              Второй: button.M9hao_P.ANr9eYH.EOCXMyH.iLjGpcQ (с .EOCXMyH — padding-y 3px)
              Текст: <span.Qkzwfd_> — text-tertiary placeholder.
            */}
            <TagSelect placeholder="e.g. Bug" compact />
          </div>
        </Section>

        {/*
          .L3lE3Rf — items-center, mt pd-xs (12), w-100%
          Контейнер прямо является .U2B5TKY.Bk2vHAO.vRl208d.L3lE3Rf:
            U2B5TKY → flex
            Bk2vHAO → gap pd-xxs (8)
            vRl208d → text-align left
            L3lE3Rf → items-center, mt 12, w-100%
        */}
        <div className="mt-af-xs flex w-full items-center gap-af-xxs text-left">
          {/*
            Add filters: .ucE4oQl.tAO3CWr.CsgOPCt.Pqk3iGi.gG7_VQ3
              ucE4oQl  → flex items-center justify-center, bg primary, border-sm blue-5,
                         radius-lg, color blue-5, text-md BOLD, line-sm (18), nowrap
              tAO3CWr  → min-height 36
              CsgOPCt  → border-color control-stroke (gray-3) ← переопределяет border на серый
                         + bg primary, color control-background-brand (blue-5)
              Pqk3iGi  → нет правил
              gG7_VQ3  → min-width: max-content
            Внутри: <svg.Fm40eTW> (margin-right pd-xxxs = 4) "+" + текст "Add filters"
          */}
          <button
            type="button"
            className="inline-flex h-9 min-w-max cursor-pointer items-center justify-center rounded-af-lg border border-af-bg-stroke bg-af-bg-primary px-af-sm text-af-md font-af-bold leading-af-sm text-af-text-link transition-colors hover:border-af-blue-5"
          >
            <PlusIcon className="mr-af-xxxs" />
            Add filters
          </button>
          {/*
            Apply: .ucE4oQl.tAO3CWr.CsgOPCt.t6WwKHu.onb_new_r2r_apply_filters
              t6WwKHu  → width 100%
            Та же база, но width: 100%.
          */}
          <button
            type="button"
            className="inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-af-lg border border-af-bg-stroke bg-af-bg-primary px-af-sm text-af-md font-af-bold leading-af-sm text-af-text-link transition-colors hover:border-af-blue-5"
          >
            Apply
          </button>
        </div>
      </div>
    </aside>
  )
}

// .heoZZGb + .G9x1MrJ — одна секция
function Section({ title, children }) {
  return (
    <div className="relative flex w-full min-w-0 max-w-full items-center">
      <div className="flex w-full min-w-0 flex-col items-start">
        {/* .sbYMv8u — flex items-center justify-between w-100% mb 8 */}
        <div className="mb-af-xxs flex w-full items-center justify-between">
          {/* .OBwTmEB — 16/24 BOLD letter-0 (правило .{font-size:text-lg;line:line-lg} позже) */}
          <span className="text-af-lg font-af-bold leading-af-lg tracking-normal text-af-text-primary">
            {title}
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}

// .ZIwZoEC + .H_iv2Z8 — radio с круглым 20×20
function Radio({ name, label, defaultChecked }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center text-af-md text-af-text-primary">
      <span className="relative mr-af-xxs inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-af-gray-5 bg-af-bg-primary">
        <input
          type="radio"
          name={name}
          defaultChecked={defaultChecked}
          className="peer absolute inset-0 cursor-pointer appearance-none rounded-full opacity-0"
        />
        <span className="hidden h-2.5 w-2.5 rounded-full bg-af-blue-5 peer-checked:block" />
      </span>
      {label}
    </label>
  )
}

// .DRj2itn + .nxAw8_5 + .a3Jk11b (20×20 квадрат radius-md) + .X7aTQ7D (checkmark)
// .Os9Ivg6 — flex items-center gap-4 (число + звезда SVG 16×16 по data-count)
function RatingCheckbox({ value }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center text-af-md text-af-text-primary">
      <span className="relative mr-af-xxs flex">
        <input
          type="checkbox"
          className="peer h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-af-md border border-af-gray-5 bg-af-bg-primary"
        />
        <CheckIcon className="pointer-events-none absolute left-[3px] top-[3px] hidden text-af-blue-5 peer-checked:block" />
      </span>
      <span className="inline-flex items-center gap-af-xxxs">
        <span>{value}</span>
        <StarIcon color={starColors[value]} />
      </span>
    </label>
  )
}

// .M9hao_P.ANr9eYH[.EOCXMyH] — select-button для Language/Country/Reply
// Если compact (.EOCXMyH) — padding-y 3px (для языка/страны/реплая).
// Без compact — стандартный padding (для первого тэг-селектора с уже выбранным значением).
function SelectButton({ placeholder, compact = false }) {
  const padY = compact ? 'py-[3px]' : 'py-af-xxs'
  return (
    <button
      type="button"
      className={`relative flex min-h-9 w-full min-w-[168px] max-w-full cursor-pointer flex-wrap items-center rounded-af-lg border border-af-gray-5 bg-af-bg-primary pl-af-xs pr-[28px] text-left text-af-md text-af-text-primary transition-colors hover:border-af-blue-5 ${padY}`}
    >
      {/* .Qkzwfd_ — placeholder text-tertiary, ml 4, ellipsis */}
      <span className="ml-af-xxxs overflow-hidden text-ellipsis whitespace-nowrap text-af-text-tertiary">
        {placeholder}
      </span>
      {/* .La6YM2J — absolute right 10 top 50% (chevron SVG 12×12) */}
      <span className="absolute right-[10px] top-1/2 -translate-y-1/2 text-af-icon-link">
        <ChevronDownIcon />
      </span>
    </button>
  )
}

// .Q6u5ycF.AArnJOZ обёртка + input.nCp2EqB
// Каскад для .AArnJOZ .nCp2EqB (специфичность 2 класса > 1 класс):
//   .nCp2EqB (192254): bg primary, border control-stroke-light, radius-lg, w-100%
//   .AArnJOZ .nCp2EqB,.zbGnxxg .nCp2EqB (192955): font-size text-md (14), line line-md (20)
//   .AArnJOZ .nCp2EqB (193025): height input-md (36), padding pd-xxs (8/8)
// Итог: h 36, padding 8, radius-lg, 14/20 — РАВЕН по высоте SelectButton.
function TextInput({ placeholder }) {
  return (
    <div className="relative inline-flex w-full items-center">
      <input
        type="text"
        placeholder={placeholder}
        className="h-af-input-md w-full rounded-af-lg border border-af-gray-5 bg-af-bg-primary p-af-xxs text-af-md text-af-text-primary placeholder:text-af-text-tertiary focus:border-af-blue-5 focus:outline-none"
      />
    </div>
  )
}

// Tag-селектор — точная структура из DOM:
//   .gzh2Cyq (w-100%)
//     <div>                       без класса
//       .rFTZYCC                  flex-grow 1, relative, z 0
//         button.M9hao_P.ANr9eYH.iLjGpcQ[.EOCXMyH]
//           span.yEqU4HH (text-primary) ИЛИ span.Qkzwfd_ (text-tertiary placeholder)
//           svg.La6YM2J chevron-down
//         .aypxWZs.ZuluHb4         error-underline (h 7px, bg red-1, opacity 0 default)
//     .H5O9S6T                    error-bg-container (bg red-1, radius bottom-lg)
//       .qZp1emv                  error-text slot (text-negative, text-sm)
//
// value (если задан) — рендерим .yEqU4HH с text-primary, button БЕЗ .EOCXMyH.
// placeholder (если задан) — рендерим .Qkzwfd_ с text-tertiary, button С .EOCXMyH (compact).
function TagSelect({ value, placeholder, compact = false, error }) {
  const isValue = value != null
  const padY = compact ? 'py-[3px]' : 'py-af-xxs'
  return (
    // .gzh2Cyq — w-100%
    <div className="w-full">
      <div>
        {/* .rFTZYCC — flex-grow 1, relative, z 0 */}
        <div className="relative z-0 flex-grow">
          <button
            type="button"
            className={`relative flex min-h-9 w-full min-w-[168px] max-w-full cursor-pointer flex-wrap items-center rounded-af-lg border border-af-gray-5 bg-af-bg-primary pl-af-xs pr-[28px] text-left text-af-md transition-colors hover:border-af-blue-5 ${padY}`}
          >
            {isValue ? (
              <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-af-text-primary">
                {value}
              </span>
            ) : (
              <span className="ml-af-xxxs overflow-hidden text-ellipsis whitespace-nowrap text-af-text-tertiary">
                {placeholder}
              </span>
            )}
            <span className="absolute right-[10px] top-1/2 -translate-y-1/2 text-af-icon-link">
              <ChevronDownIcon />
            </span>
          </button>
          {/*
            .aypxWZs.ZuluHb4 — error-underline. В default opacity 0 + z -1 → невидим.
            Рендерим только если error (чтобы не плодить пустых элементов).
          */}
          {error && (
            <span className="pointer-events-none absolute bottom-0 left-0 right-0 -z-10 h-[7px] bg-af-red-1" />
          )}
        </div>
        {/*
          .H5O9S6T + .qZp1emv — error-message slot.
          В оригинале блок ВСЕГДА в DOM, но .qZp1emv внутри пустой → нулевая высота → не видно.
          В моём коде раньше блок был с padding, и красная полоса торчала из-под селекторов.
          Рендерим контейнер ТОЛЬКО при наличии error.
        */}
        {error && (
          <div className="rounded-b-af-lg bg-af-red-1">
            <div className="w-full px-af-xxs py-af-xxxs text-af-sm leading-af-sm text-af-text-negative">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// === Icons (точные path'ы из реального DOM) ===

// .X7aTQ7D — check-mark 12×12
function CheckIcon({ className = '' }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M8.83246 18.7327C8.98953 18.9683 9.22513 19.0469 9.53927 19.0469C9.81414 19.0469 10.0497 18.9683 10.2461 18.7327L21.8298 7.18824C21.9869 7.03117 22.1047 6.79557 22.1047 6.48143C22.1047 6.20656 21.9869 5.97096 21.8298 5.77462L20.377 4.36101C20.1806 4.16468 19.945 4.04688 19.6702 4.04688C19.3953 4.04688 19.1597 4.16468 18.9634 4.36101L9.53927 13.7851L5.14136 9.38719C4.90576 9.19085 4.67016 9.07305 4.39529 9.07305C4.12042 9.07305 3.88482 9.19085 3.72775 9.38719L2.27487 10.8008C2.07853 10.9971 2 11.2327 2 11.5076C2 11.8217 2.07853 12.0573 2.27487 12.2144L8.83246 18.7327Z"
      />
    </svg>
  )
}

// .La6YM2J — chevron-down 12×12
function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M5.95285 10H18.0466C18.4528 10 18.7341 10.2031 18.8903 10.6094C19.0466 10.9844 18.9841 11.3125 18.7028 11.5938L12.656 17.6406C12.4685 17.8281 12.2497 17.9219 11.9997 17.9219C11.7497 17.9219 11.531 17.8281 11.3435 17.6406L5.2966 11.5938C5.01535 11.3125 4.95285 10.9844 5.1091 10.6094C5.26535 10.2031 5.5466 10 5.95285 10Z"
      />
    </svg>
  )
}

// .ak8lcEc — star 16×16
function StarIcon({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden style={{ color }}>
      <path
        fill="currentColor"
        d="M22.7888 7.6486C23.1477 7.73832 23.4617 7.91776 23.686 8.18692C23.9103 8.50093 24 8.81495 24 9.17383C24 9.53271 23.8654 9.84673 23.5963 10.1159L18.8411 14.7364L19.9626 21.286C20.0075 21.6449 19.9178 22.0037 19.7383 22.3178C19.5589 22.6318 19.2897 22.8112 18.9308 22.9009C18.572 22.9907 18.2131 22.9458 17.8991 22.7664L12.0224 19.7159L6.14579 22.7664C5.78692 22.9458 5.4729 22.9907 5.11402 22.9009C4.75514 22.8112 4.44112 22.6318 4.26168 22.3178C4.08224 22.0037 3.99252 21.6449 4.08224 21.286L5.20374 14.7364L0.448598 10.1159C0.179439 9.84673 0 9.53271 0 9.17383C0 8.81495 0.0897196 8.50093 0.314019 8.18692C0.538318 7.91776 0.852336 7.73832 1.25607 7.6486L7.80561 6.70654L10.7215 0.785047C10.9009 0.426168 11.1252 0.201869 11.4841 0.0672897C11.843 -0.0224299 12.157 -0.0224299 12.5159 0.0672897C12.8748 0.201869 13.1439 0.426168 13.3234 0.785047L16.2393 6.70654L22.7888 7.6486Z"
      />
    </svg>
  )
}

// Plus — Add filters icon. .Fm40eTW = mr pd-xxxs (4)
function PlusIcon({ className = '' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 3C12.4774 3 12.9352 3.18964 13.2728 3.52721C13.6104 3.86477 13.8 4.32261 13.8 4.8V10.2H19.2C19.6774 10.2 20.1352 10.3896 20.4728 10.7272C20.8104 11.0648 21 11.5226 21 12C21 12.4774 20.8104 12.9352 20.4728 13.2728C20.1352 13.6104 19.6774 13.8 19.2 13.8H13.8V19.2C13.8 19.6774 13.6104 20.1352 13.2728 20.4728C12.9352 20.8104 12.4774 21 12 21C11.5226 21 11.0648 20.8104 10.7272 20.4728C10.3896 20.1352 10.2 19.6774 10.2 19.2V13.8H4.8C4.32261 13.8 3.86477 13.6104 3.52721 13.2728C3.18964 12.9352 3 12.4774 3 12C3 11.5226 3.18964 11.0648 3.52721 10.7272C3.86477 10.3896 4.32261 10.2 4.8 10.2H10.2V4.8C10.2 4.32261 10.3896 3.86477 10.7272 3.52721C11.0648 3.18964 11.5226 3 12 3Z"
      />
    </svg>
  )
}
