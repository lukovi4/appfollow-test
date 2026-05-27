import { useState } from 'react'
import SidebarNew from '../components/SidebarNew.jsx'
import TabbedSection from '../components/TabbedSection.jsx'

// Локальный CSS для container queries и других правил, которые нельзя
// выразить через Tailwind 3.4 без плагина.
//
// 1) `.YfSLrl6` и `.TS7JQKa` — container query на ширину .jsaulmG ≥632px:
//    переключается с column-stack на row+правая колонка max-w 240.
// 2) `.jrV39Ye` — на screen ≥1440 текст отзыва становится 16/24 (line-lg).
// 3) `.F2MdcC6` — при <1024px display: none.
// 4) `.COEEZoK` — при <1024px static, w 100%, margin-left 0.
// 5) `.NBsqiX2` — при <1024px height auto.
const PREVIEW_RESPONSIVE_CSS = `
.af-jsaulmG { container-type: inline-size; }

.af-YfSLrl6 { display: flex; flex-direction: column; }
.af-TS7JQKa { max-width: none; }
@container (min-width: 632px) {
  .af-YfSLrl6 { flex-direction: row; justify-content: space-between; }
  .af-TS7JQKa { max-width: 240px; }
}

.af-jrV39Ye { font-size: 14px; line-height: 20px; }
@media (min-width: 1440px) {
  .af-jrV39Ye { font-size: 16px; line-height: 24px; }
}

@media (max-width: 1023px) {
  .af-F2MdcC6 { display: none !important; }
  .af-COEEZoK {
    position: static !important;
    width: 100% !important;
    margin-left: 0 !important;
  }
  .af-NBsqiX2 { height: auto !important; }
}
`

// Сцена "Add automation". Каркас и layout 1-в-1 с оригиналом AppFollow.
//
// Структура (по CSS-аудиту):
//   .AYhzJ9f (bg-page, flex w-full)
//     SidebarNew
//     .i2LoI4C (flex column, min-w-0, w-full)
//       .ZyyAtz7 (padding 24)
//         .NBsqiX2 (relative, height calc(100vh - 48), width 100%)
//           .BQCVweX.axSJaoP.COEEZoK         ← левая колонка (форма)
//             absolute top:0 bottom:0 left:0,
//             margin-left: -24 (компенсация ZyyAtz7-padding слева),
//             padding 24 (только сверху и боков, не снизу),
//             width: min(50%, 680px),
//             bg primary, overflow auto
//             ─ header.AHf6iqd (mb 12)
//             ─ .RMAen00 (form, gap 24) ← пока пусто, наполним блоками
//             ─ .r74Bc23 (footer, sticky bottom 0) ← пока пусто
//           .F2MdcC6                          ← правая колонка (preview)
//             absolute inset:0 0 0 min(50%,680px),
//             bg secondary-white, items-center justify-center, padding 24
//
// Сейчас собран каркас + Header (.jT9QgoW с h1 "Add automation").
// Дальше — секции формы.

export default function AddAutomation({ onNavigate }) {
  return (
    <div className="flex min-h-screen w-full bg-af-bg-page text-af-text-primary">
      <style>{PREVIEW_RESPONSIVE_CSS}</style>
      <SidebarNew currentPage="automation" onNavigate={onNavigate} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="relative px-af-lg">
          {/*
            .NBsqiX2 — двухколоночный layout через absolute.
            Вертикальных паддингов у родителя нет — высота равна полному 100vh.
            <1024px: height auto (.af-NBsqiX2).
          */}
          <div
            className="af-NBsqiX2 relative w-full"
            style={{ height: '100vh' }}
          >
            {/*
              ЛЕВАЯ КОЛОНКА .COEEZoK
              absolute top:0 bottom:0 left:0
              margin-left: -24 (отрицательно компенсирует ZyyAtz7-padding слева,
              чтобы белый фон левой колонки доходил до самого края сайдбара).
              padding-top/right/left: 24, padding-bottom: 0
              width: min(50%, 680px)
              bg primary, overflow auto (через .BQCVweX)
            */}
            {/* Левая «колонка» теперь на всю ширину контейнера.
                Правая (.F2MdcC6) отключена — Review example рендерится
                как side-by-side блок ВНУТРИ табов (см. AutomationModeTabs). */}
            {/* flex column на всю высоту .NBsqiX2:
                header + FormTop + tabs + footer.
                Табы получают flex-1 + min-h-0, чтобы их content (chat/Review)
                растягивался на ВСЁ оставшееся пространство. */}
            <div
              className="af-COEEZoK no-scrollbar absolute bottom-0 left-0 right-0 top-0 flex flex-col bg-af-bg-primary"
              style={{
                marginLeft: -24,
                padding: '24px 24px 0 24px',
              }}
            >
              {/* .AHf6iqd — обёртка хедера, mb 12 */}
              <header className="mb-af-xs shrink-0">
                <div className="flex min-h-af-input-md items-center justify-center">
                  <div className="flex w-full flex-wrap items-center gap-af-xs">
                    <div className="flex items-center">
                      <h1 className="m-0 text-af-h-md font-af-bold leading-af-xxl text-af-text-primary">
                        Add automation
                      </h1>
                    </div>
                  </div>
                </div>
              </header>

              {/* Основная форма — flex column, занимает весь остаток высоты. */}
              <div className="flex min-h-0 flex-1 flex-col gap-af-lg">
                {/* .fC8ZPcp — верхняя секция: 3 поля. */}
                <FormTopSection />
                {/* Табы + контент таба (chat/Review) — растягиваются. */}
                <AutomationModeTabs />
              </div>

              {/* Footer — снизу, не растягивается. */}
              <div className="shrink-0">
                <FormFooter />
              </div>
            </div>

            {/* Правая колонка .F2MdcC6 как отдельный absolute блок — отключена.
                Review example теперь живёт справа от табов внутри AutomationModeTabs. */}
          </div>
        </div>
      </div>
    </div>
  )
}

// .fC8ZPcp — секция трёх полей. Внутри 3 группы .gzh2Cyq.HqisDe7:
//   .HqisDe7 + .HqisDe7 → margin-top 12 (между группами)
//   У последней (Apps) дополнительно .hZcVKwd → margin-top 8 (override?).
//
// Структура каждого поля:
//   .gzh2Cyq.HqisDe7 (w-100%)
//     div
//       .YsuLhFZ (display: flex)
//         label.U535nEB → 14/20 BOLD, color text-secondary, mb 2px (pd-xxxxs)
//       .rFTZYCC (flex-grow 1, relative, z 0)
//         <input | button> .Q6u5ycF.AArnJOZ.iLjGpcQ → w-100%
//         .aypxWZs.ZuluHb4 (error-underline 7px h, opacity 0)
//     .H5O9S6T > .qZp1emv (error-slot, скрыт когда пусто)
// =============================================================================
// Табы Conversation mode / Manual mode.
// Conversation mode = чат с AI-помощником.
// Manual mode = Conditions + Actions (ручная настройка правил).
// =============================================================================
function AutomationModeTabs() {
  const [active, setActive] = useState('conversation')
  return (
    // Обёртка занимает остаток высоты (flex-1 в родителе).
    <div className="flex min-h-0 flex-1 flex-col">
      <TabbedSection
        tabs={[
          { key: 'conversation', label: 'Conversation mode' },
          { key: 'manual', label: 'Manual mode' },
        ]}
        activeKey={active}
        onChange={setActive}
      >
        {/* Под табами grid: слева — контент таба, справа — Review example.
            Высота гибкая: flex-1 заполняет всё доступное пространство между
            табами и footer'ом. min-h-0 разрешает grid сжиматься. */}
        <div className="grid min-h-0 w-full flex-1 grid-cols-1 gap-af-xl pt-af-md lg:grid-cols-2">
          {/* Левая часть — содержимое активного таба */}
          <div className="no-scrollbar flex min-h-0 flex-col overflow-auto">
            {active === 'manual' ? (
              <div className="flex flex-col gap-af-lg">
                <ConditionsSection />
                <ActionsSection />
              </div>
            ) : (
              <ConversationChat />
            )}
          </div>

          {/* Правая часть — Review example */}
          <div className="no-scrollbar flex min-h-0 flex-col items-center justify-start overflow-auto">
            <PreviewBody />
          </div>
        </div>
      </TabbedSection>
    </div>
  )
}

// =============================================================================
// ConversationChat — СТАТИЧНАЯ переписка по chat-mode.md.
// Никаких интерактивов: пользователь может только проскроллить ленту.
// Снизу — неактивный input как заглушка.
// =============================================================================
const CHAT_MESSAGES = [
  {
    role: 'ai',
    text:
      'I found a repeated pattern based on your recent replies:\n' +
      'Short positive 5-star reviews praising the app.\n\n' +
      'I pre-filled the conditions for this pattern:\n\n' +
      '• Rating: 5 stars\n' +
      '• Sentiment: positive\n' +
      '• Review length: short\n' +
      '• Exclude reviews with bugs, crashes, refunds, billing issues, feature requests, or questions',
  },
  { role: 'user', text: 'Make it only for English reviews.' },
  {
    role: 'ai',
    text:
      'Done. I added Language: English to the conditions.\n' +
      'Estimated coverage changed from 42 to 34 reviews/month.',
  },
  { role: 'user', text: 'Also exclude reviews that mention price.' },
  {
    role: 'ai',
    text:
      'Done. I excluded reviews mentioning price, subscription, payment, or expensive.\n' +
      'This should keep pricing-related feedback for manual review.',
  },
  { role: 'user', text: 'What reply will be prepared?' },
  {
    role: 'ai',
    text:
      'I suggest using this template:\n\n' +
      '"Thank you for your kind words! We’re happy to hear that you enjoy using the app."\n\n' +
      'You can edit it or choose another template.',
  },
  { role: 'user', text: 'Make it warmer.' },
  {
    role: 'ai',
    text:
      'Updated the template:\n\n' +
      '"Thank you so much for your kind words! We’re really happy to hear that you enjoy using the app."\n\n' +
      'The conditions stayed the same.',
  },
  { role: 'user', text: 'Show me what will be excluded.' },
  {
    role: 'ai',
    text:
      'Example excluded review:\n' +
      '"Great app, but it crashes after the latest update."\n\n' +
      'Reason: it matches positive sentiment, but mentions a crash.\n' +
      'This review will stay in manual review.',
  },
]

function ConversationChat() {
  return (
    // Чат занимает всю высоту родителя. Лента скроллится, input прижат снизу.
    <div className="flex h-full min-h-0 w-full flex-col gap-af-sm rounded-af-lg border border-af-bg-stroke bg-af-bg-secondaryWhite p-af-sm">
      {/* Лента сообщений — flex-1 + scroll скрыт. */}
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-af-xs overflow-auto">
        {CHAT_MESSAGES.map((m, i) => (
          <ChatBubble key={i} role={m.role} text={m.text} segments={m.segments} />
        ))}
      </div>

      {/* Input — неактивный, только визуальный. */}
      <div className="flex shrink-0 items-center gap-af-xs rounded-af-lg border border-af-bg-stroke bg-af-bg-primary px-af-sm py-af-xxs">
        <input
          type="text"
          disabled
          placeholder="Type a message…"
          className="flex-1 cursor-not-allowed border-0 bg-transparent text-af-md font-af-normal leading-af-md tracking-af-sm text-af-text-primary outline-none placeholder:text-af-text-tertiary"
        />
        {/* Send icon — задизейблен */}
        <button
          type="button"
          disabled
          aria-label="Send"
          className="inline-flex h-7 w-7 cursor-not-allowed items-center justify-center rounded-af-md border-0 bg-transparent text-af-text-tertiary"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M3.4 20.4L21.85 12.92C22.66 12.57 22.66 11.43 21.85 11.08L3.4 3.60001C2.74 3.32001 2.01 3.81001 2.01 4.51001L2 9.12001C2 9.61001 2.36 10.03 2.85 10.09L17 12L2.85 13.9C2.36 13.97 2 14.39 2 14.88L2.01 19.49C2.01 20.19 2.74 20.68 3.4 20.4Z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// Один баббл сообщения.
// AI — на всю ширину, белый фон с рамкой, primary текст.
// User — справа, max-w 80%, синий фон, белый текст.
// segments — массив { text, tone? } для разноцветных кусков внутри одного сообщения.
function ChatBubble({ role, text, segments }) {
  const isAi = role === 'ai'
  return (
    <div className={`flex w-full ${isAi ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`whitespace-pre-line rounded-af-lg px-af-sm py-af-xs text-[16px] font-af-normal leading-[1.4] tracking-af-sm ${
          isAi
            ? 'w-full border border-af-bg-stroke bg-af-bg-primary text-af-text-primary'
            : 'max-w-[80%] bg-af-blue-5 text-white'
        }`}
      >
        {segments
          ? segments.map((s, i) => (
              <span
                key={i}
                className={s.tone === 'green' ? 'text-af-green-4' : ''}
              >
                {s.text}
              </span>
            ))
          : text}
      </div>
    </div>
  )
}

// Typing-индикатор (3 точки с анимацией pulse).
function ChatTyping() {
  return (
    <div className="flex w-full justify-start">
      <div className="flex items-center gap-[3px] rounded-af-lg border border-af-bg-stroke bg-af-bg-primary px-af-sm py-af-xs">
        <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-af-text-tertiary [animation-delay:0ms]" />
        <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-af-text-tertiary [animation-delay:200ms]" />
        <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-af-text-tertiary [animation-delay:400ms]" />
      </div>
    </div>
  )
}

function FormTopSection() {
  // gap-af-xs (12) между полями. На широких экранах три поля в одну строку
  // (grid 3 cols), на узких <768px — стек.
  return (
    <div className="flex w-full flex-col gap-af-xs">
      <div className="grid w-full grid-cols-1 gap-af-xs md:grid-cols-3">
        <FormField label="Name">
          <FormTextInput
            placeholder="Reply with template: Thank you"
            defaultValue="Thank you — short 5-star praise"
          />
        </FormField>
        <FormField label="Description">
          <FormTextInput
            placeholder="Reply to 5-star reviews using template Thank you"
            defaultValue="Auto-replies to short positive 5-star reviews in English. Excludes bugs, crashes, refunds, billing, feature requests, and pricing."
          />
        </FormField>
        <FormField label="Apps">
          <AppsSelector value="Trivia Crack: Brain Quiz Games" />
        </FormField>
      </div>
      {/* Зелёный info-блок над табами — подпись о покрытии. */}
      <div
        className="rounded-af-lg bg-af-green-1 px-af-sm py-af-xs text-[16px] font-af-normal leading-[1.4] tracking-af-sm text-[#213752]"
        style={{ marginTop: 24 - 12 /* gap уже даёт 12, добираем до 24 */ }}
      >
        About <strong className="font-af-bold">100%</strong> of reviews from the last 14 days meet the selected conditions.
      </div>
    </div>
  )
}

// Общий контейнер .gzh2Cyq.HqisDe7 для поля. Между соседними .HqisDe7 — margin-top 12.
// На третьем поле дополнительно .hZcVKwd (mt 8) — но это уже учтено .HqisDe7+.HqisDe7
// правилом, нам достаточно одного mt.
function FormField({ label, children }) {
  return (
    <div className="w-full">
      <div>
        {/* .YsuLhFZ — flex (label-обёртка) */}
        <div className="flex">
          {/*
            .U535nEB — 14/20 BOLD, color text-secondary, mb 2px (pd-xxxxs).
            Второе правило .U535nEB (flex-shrink:0; margin:0 8 0 0) применяется в других
            местах (inline labels), здесь работает первое.
          */}
          <label className="mb-[2px] inline-flex text-af-md font-af-bold leading-af-md text-af-text-secondary">
            {label}
          </label>
        </div>
        {/* .rFTZYCC — relative, flex-grow 1, z 0 */}
        <div className="relative z-0 flex-grow">
          {children}
          {/* .aypxWZs.ZuluHb4 — error-underline slot (opacity 0 default) */}
          <span className="pointer-events-none absolute bottom-0 left-0 right-0 -z-10 h-[7px] bg-af-red-1 opacity-0" />
        </div>
      </div>
      {/* .H5O9S6T > .qZp1emv — error-slot (рендерим только при ошибке). */}
    </div>
  )
}

// .Q6u5ycF.AArnJOZ.iLjGpcQ обёртка + input.nCp2EqB
// Каскад (.AArnJOZ .nCp2EqB): bg primary, border control-stroke-light (gray-4),
// radius-lg, h input-md (36), padding 8 (pd-xxs), font 14/20, w 100%.
function FormTextInput({ placeholder, defaultValue }) {
  return (
    <div className="relative inline-flex w-full items-center">
      <input
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-af-input-md w-full rounded-af-lg border border-af-gray-4 bg-af-bg-primary p-af-xxs text-af-md font-af-normal leading-af-md tracking-af-sm text-af-text-primary outline-none transition-colors placeholder:text-af-text-tertiary focus:border-af-blue-5"
      />
    </div>
  )
}

// Apps — селектор с chip-внутри. Кнопка .M9hao_P.ANr9eYH.EOCXMyH.iLjGpcQ.
// Внутри chip-pill: .fGH1krX.Bbluiz4.ZzVnmIw._BASDMB
//   bg teal-2, radius-md (4), color text-primary, padding 4/8 (pd-xxxs/pd-xxs),
//   margin 4 0 0 4 (._BASDMB compensates a0tv6M6 negative margins).
// Внутри chip:
//   .eAUnDkK.Gk1XbMI — grid items-center gap 2 column flow
//     picture.d0x8Wgy.QYUB0c2.lWgLkl5 (16x16 icon)
//       img.Wd33t5S (w/h 100%, radius-app-icon 22.5%)
//     span.ZOA0DBq — text overflow ellipsis nowrap
//   i.k8m4eDs.S4PcKur — 10x10 close icon, ml 8 (pd-xxs), color text-secondary
// =============================================================================
// Conditions section (.TWscHlK)
// =============================================================================
//
// Структура:
//   div.TWscHlK (.dJj7XNh = gap 12 от родителя .DkPGJGp.dJj7XNh)
//     div (header)
//       div.hLiQXhP.GmXxLqY.jSdJfwu  "Conditions"   ← 16 BOLD primary letter-xs
//       div.hfFP08w.SXVQGi5          description    ← 14/20 normal -0.12 secondary
//     div.U2B5TKY.DkPGJGp.Bk2vHAO.vRl208d           ← flex-col gap 8 (список + кнопка)
//       div.Lt6c_WL × N (одна строка-условие)      ← flex gap 1px
//         .zjD39zJ "If"|"And"  ← min-w 60, padding 12/12, radius-l, bg secondary-white,
//                                   16/24 BOLD primary
//         .RVI3Yxj (правая часть)  ← min-h 48, padding 8/12, radius-r,
//                                       bg secondary-white, gap 8
//           .joVN9Td (контент)     ← w-100%, overflow ellipsis
//             span.N4h4BI9         ← 16 letter-xs line-32px (label условия)
//             span.EdQDZZT.Z5CjOzY (operator) ← cursor pointer, inline
//             span.EdQDZZT (value)   ← cursor pointer
//             ...
//       button.ucE4oQl.tAO3CWr.CsgOPCt.Z8NjCZG "Add conditions"

function ConditionsSection() {
  return (
    <div className="flex w-full flex-col gap-af-xs">
      {/* Header */}
      {/* Заголовок "Conditions" скрыт по запросу. */}

      {/* Список условий + кнопка Add.
          Условия согласованы в Conversation mode (см. chat-mode.md). */}
      <div className="flex flex-col gap-af-xxs">
        <ConditionRow connector="If" label="Rating" operator="is" value="5 stars" />
        <ConditionRow connector="And" label="Sentiment" operator="is" value="positive" sparkle />
        <ConditionRow connector="And" label="Review length" operator="is" value="short" sparkle />
        <ConditionRow connector="And" label="Language" operator="is" value="English" />
        <ConditionRow
          connector="And"
          label="Review text"
          operator="does not contain"
          chip="bugs, crashes, refunds, billing, feature requests, questions, price, subscription, payment, expensive"
          sparkle
        />

        {/* Add conditions кнопка — .ucE4oQl.tAO3CWr.CsgOPCt.Z8NjCZG */}
        <div className="flex flex-wrap items-center gap-af-xxs">
          {/* В оригинале кнопка без иконки — только текст. */}
          <button
            type="button"
            className="inline-flex h-9 min-w-fit cursor-pointer items-center justify-center whitespace-nowrap rounded-af-lg border border-af-bg-stroke bg-af-bg-primary px-af-sm text-af-md font-af-bold leading-af-sm text-af-text-link transition-colors hover:bg-af-bg-secondaryGray"
          >
            Add conditions
          </button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Иконки в строках Conditions/Actions (реальные SVG-path из оригинала AppFollow).
// =============================================================================
//
// .Y53kl4i.ak8lcEc → 16×16. .Y53kl4i.SgZiABU → 12×12. .Y53kl4i.ECDE1Pu → 20×20.
// .tTUZsRk — color icon-secondary, height 100%, justify-self flex-end, cursor pointer.
// .PALzOux — display inline-block, vertical-align text-bottom.
// .wAI5Vzf — vertical-align initial (override).
function RowCloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="ml-auto h-full shrink-0 cursor-pointer self-end text-af-text-secondary"
      aria-hidden
    >
      <path d="M5.15164 5.15159C5.37667 4.92663 5.68184 4.80025 6.00004 4.80025C6.31823 4.80025 6.6234 4.92663 6.84844 5.15159L12 10.3032L17.1516 5.15159C17.2623 5.03698 17.3947 4.94556 17.5412 4.88267C17.6876 4.81978 17.845 4.78668 18.0044 4.78529C18.1637 4.78391 18.3217 4.81427 18.4692 4.87461C18.6167 4.93494 18.7506 5.02405 18.8633 5.13672C18.976 5.24939 19.0651 5.38337 19.1254 5.53085C19.1858 5.67832 19.2161 5.83634 19.2147 5.99568C19.2134 6.15501 19.1802 6.31247 19.1174 6.45888C19.0545 6.60528 18.963 6.7377 18.8484 6.84839L13.6968 12L18.8484 17.1516C19.067 17.3779 19.188 17.681 19.1852 17.9957C19.1825 18.3103 19.0563 18.6113 18.8338 18.8338C18.6113 19.0563 18.3104 19.1825 17.9957 19.1852C17.6811 19.1879 17.378 19.067 17.1516 18.8484L12 13.6968L6.84844 18.8484C6.62211 19.067 6.31899 19.1879 6.00435 19.1852C5.68972 19.1825 5.38874 19.0563 5.16625 18.8338C4.94376 18.6113 4.81756 18.3103 4.81483 17.9957C4.81209 17.681 4.93305 17.3779 5.15164 17.1516L10.3032 12L5.15164 6.84839C4.92667 6.62336 4.80029 6.31819 4.80029 5.99999C4.80029 5.6818 4.92667 5.37663 5.15164 5.15159Z" />
    </svg>
  )
}

// AI sparkle 16×16 vb24, linear-gradient #643df2 → #9f88f2. .ak8lcEc.PALzOux: 16×16 + inline-block.
function RowSparkleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 self-center"
      aria-hidden
    >
      <defs>
        <linearGradient id="af-sparkle-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#643DF2" />
          <stop offset="100%" stopColor="#9F88F2" />
        </linearGradient>
      </defs>
      <path
        d="M20.0483 11.761L9.54833 23.011C9.43699 23.1303 9.28978 23.21 9.12903 23.2381C8.96829 23.2661 8.80277 23.241 8.65759 23.1665C8.51242 23.092 8.3955 22.9722 8.32457 22.8252C8.25365 22.6783 8.23258 22.5122 8.26458 22.3522L9.63952 15.4776L4.23667 13.4515C4.12121 13.4082 4.01821 13.3371 3.93679 13.2445C3.85536 13.1519 3.79802 13.0407 3.76984 12.9207C3.74167 12.8006 3.74352 12.6755 3.77524 12.5563C3.80697 12.4372 3.86758 12.3277 3.95171 12.2375L14.4517 0.98753C14.5631 0.868241 14.7103 0.788517 14.871 0.760452C15.0318 0.732387 15.1973 0.757512 15.3424 0.832015C15.4876 0.906519 15.6045 1.02634 15.6755 1.17329C15.7464 1.32025 15.7675 1.48633 15.7355 1.64634L14.3605 8.52094L19.7634 10.547C19.8788 10.5903 19.9818 10.6614 20.0633 10.754C20.1447 10.8466 20.202 10.9578 20.2302 11.0779C20.2584 11.1979 20.2565 11.323 20.2248 11.4422C20.1931 11.5614 20.1325 11.6709 20.0483 11.761Z"
        fill="url(#af-sparkle-grad)"
      />
    </svg>
  )
}

// Chevron-down 12×12 vb24 (.SgZiABU + .PALzOux + .wAI5Vzf).
// PALzOux = inline-block + vertical-align text-bottom; wAI5Vzf = vertical-align initial (override).
function RowChevronDownIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="inline-block shrink-0 text-af-text-primary"
      style={{ verticalAlign: 'initial' }}
      aria-hidden
    >
      <path d="M5.95285 10H18.0466C18.4528 10 18.7341 10.2031 18.8903 10.6094C19.0466 10.9844 18.9841 11.3125 18.7028 11.5938L12.656 17.6406C12.4685 17.8281 12.2497 17.9219 11.9997 17.9219C11.7497 17.9219 11.531 17.8281 11.3435 17.6406L5.2966 11.5938C5.01535 11.3125 4.95285 10.9844 5.1091 10.6094C5.26535 10.2031 5.5466 10 5.95285 10Z" />
    </svg>
  )
}

// .Lt6c_WL — одна строка-условие. gap 1px между If/And и правой частью.
// Левая (.zjD39zJ): bg secondary-white, 16/24 BOLD, min-w 60, padding 12/12, radius-l 8.
// Правая (.RVI3Yxj): bg secondary-white, 16/24, min-h 48, padding 8/12, radius-r 8.
//   Внутри (по DOM): [опц. sparkle .PALzOux] + .joVN9Td(label+operator+value) + .tTUZsRk(close).
function ConditionRow({ connector, label, operator, value, valueIsLink, chip, warning, sparkle = false }) {
  return (
    <div className="flex" style={{ gap: 1 }}>
      <div
        className="flex min-w-[60px] items-center justify-center bg-af-bg-secondaryWhite text-af-lg font-af-bold leading-af-lg text-af-text-primary"
        style={{ padding: '12px 12px', borderRadius: '8px 0 0 8px' }}
      >
        {connector}
      </div>
      <div
        className="flex min-h-[48px] flex-1 items-center bg-af-bg-secondaryWhite text-af-lg leading-af-lg text-af-text-primary"
        style={{ padding: '8px 12px', borderRadius: '0 8px 8px 0', gap: 8 }}
      >
        {sparkle && <RowSparkleIcon />}
        <div className="w-full overflow-hidden">
          <span className="text-af-lg tracking-af-xs" style={{ lineHeight: '32px' }}>
            {label}
            {operator && (
              <>
                {' '}
                <span className="inline cursor-pointer font-af-bold text-af-text-primary tracking-af-xs">
                  <strong>{operator}</strong>
                  <RowChevronDownIcon />
                </span>
              </>
            )}
            {value && (
              <>
                {' '}
                <span
                  className={`cursor-pointer font-af-bold tracking-af-xs ${
                    valueIsLink ? 'text-af-text-link' : 'text-af-text-primary'
                  }`}
                  role="button"
                >
                  {value}
                </span>
              </>
            )}
            {chip && (
              <>
                {' '}
                <span
                  role="button"
                  className="inline-block cursor-pointer rounded-af-md border border-af-bg-stroke bg-af-bg-primary text-af-md font-af-normal text-af-text-primary"
                  style={{ padding: '4px 12px', marginRight: 4 }}
                >
                  {chip}
                </span>
              </>
            )}
          </span>
          {warning && (
            <div
              className="mt-af-xxs flex items-center rounded-af-lg border bg-af-yellow-1 text-af-md leading-af-md text-af-text-primary"
              style={{
                borderColor: '#fceebd', // yellow-3
                columnGap: 8,
                padding: '8px 16px',
                minHeight: 'auto',
                wordBreak: 'break-word',
                width: '100%',
              }}
            >
              <div style={{ minHeight: 24 }} className="flex items-center">
                <span>
                  {warning.split('Enable reviews translation')[0]}
                  <span className="cursor-pointer text-af-text-link">Enable reviews translation</span>
                </span>
              </div>
            </div>
          )}
        </div>
        <RowCloseIcon />
      </div>
    </div>
  )
}

// =============================================================================
// Actions section (.LQLKT9p) — структурно аналогична Conditions.
// =============================================================================
//
//   div.LQLKT9p (.dJj7XNh gap 12)
//     div (header)
//       "Action"             ← 16 BOLD primary letter-xs
//       description          ← 14/20 normal -0.12 secondary
//     div.Bk2vHAO              ← flex-col gap 8 (список + кнопка)
//       div.GjqTd7O × N       ← одна строка-action, gap 1px (как .Lt6c_WL)
//         .zjD39zJ "Then"|"And"
//         .RVI3Yxj
//           .joVN9Td (контент)
//             div.j8bzusk (items-center) — для inline-content типа input
//       div.viHsiX6           ← footer Action (flex-wrap)
//         button.PKMUZio "AI knowledge base"  (w fit-content)

function ActionsSection() {
  return (
    <div className="flex w-full flex-col gap-af-xs">
      {/* Заголовок "Action" скрыт по запросу. */}

      <div className="flex flex-col gap-af-xxs">
        <RuleRow connector="Then" label="Reply with template" />

        {/* And — финальный template из чата (шаг "Make it warmer"). */}
        <div className="flex" style={{ gap: 1 }}>
          <div
            className="flex min-w-[60px] items-center justify-center text-af-lg font-af-bold leading-af-lg text-af-purple-7"
            style={{ padding: '12px 12px', borderRadius: '8px 0 0 8px', backgroundColor: '#f0f5fa' }}
          >
            And
          </div>
          <div
            className="flex min-h-[48px] flex-1 items-center bg-af-bg-secondaryWhite text-af-lg leading-af-lg text-af-text-primary"
            style={{ padding: '8px 12px', borderRadius: '0 8px 8px 0', gap: 8 }}
          >
            <div className="w-full overflow-hidden">
              <div className="flex flex-wrap items-center gap-af-xs">
                <span className="cursor-pointer font-af-bold text-af-text-primary tracking-af-xs">
                  Thank you so much for your kind words! We’re really happy to hear that you enjoy using the app.
                  <RowChevronDownIcon />
                </span>
              </div>
            </div>
            <RowCloseIcon />
          </div>
        </div>

        {/* .viHsiX6 — footer Action, flex-wrap. Кнопка .PKMUZio "AI knowledge base" (w fit). */}
        <div className="flex flex-wrap items-center gap-af-xxs">
          {/* В оригинале .PKMUZio — только текст внутри button, без иконки. */}
          <button
            type="button"
            className="inline-flex h-9 w-fit min-w-fit cursor-pointer items-center justify-center whitespace-nowrap rounded-af-lg border border-af-bg-stroke bg-af-bg-primary px-af-sm text-af-md font-af-bold leading-af-sm text-af-text-link transition-colors hover:bg-af-bg-secondaryGray"
          >
            AI knowledge base
          </button>
        </div>
      </div>
    </div>
  )
}

// Универсальная строка правила (для простых случаев — Then/And + лейбл).
// Совпадает с ConditionRow, но без operator/value/chip/warning.
// Внутри .RVI3Yxj справа всегда .tTUZsRk close.
function RuleRow({ connector, label }) {
  return (
    <div className="flex" style={{ gap: 1 }}>
      <div
        className="flex min-w-[60px] items-center justify-center text-af-lg font-af-bold leading-af-lg text-af-purple-7"
        style={{ padding: '12px 12px', borderRadius: '8px 0 0 8px', backgroundColor: '#f0f5fa' }}
      >
        {connector}
      </div>
      <div
        className="flex min-h-[48px] flex-1 items-center bg-af-bg-secondaryWhite text-af-lg leading-af-lg text-af-text-primary"
        style={{ padding: '8px 12px', borderRadius: '0 8px 8px 0', gap: 8 }}
      >
        <div className="w-full overflow-hidden text-af-lg tracking-af-xs" style={{ lineHeight: '32px' }}>
          {label}
        </div>
        <RowCloseIcon />
      </div>
    </div>
  )
}

function AppsSelector({ value }) {
  return (
    <button
      type="button"
      className="relative flex min-h-af-input-md w-full min-w-[168px] max-w-full cursor-pointer flex-wrap items-center rounded-af-lg border border-af-gray-4 bg-af-bg-primary py-[3px] pl-af-xs pr-[28px] text-left text-af-md text-af-text-primary transition-colors hover:border-af-blue-5"
    >
      {/* .a0tv6M6 — flex wrap, негативные margins для компенсации chip-margin */}
      <div className="flex min-w-0 flex-wrap" style={{ margin: '-4px 0 0 -4px' }}>
        {/* Chip .fGH1krX */}
        <div
          className="flex max-w-full cursor-pointer items-center rounded-af-md border-none text-af-text-primary"
          style={{
            backgroundColor: '#d9f0f0', // teal-2 (примерно — может быть точнее)
            padding: '4px 8px',
            margin: '4px 0 0 4px',
            minWidth: 0,
          }}
          role="button"
        >
          {/* .eAUnDkK.Gk1XbMI — иконка приложения + текст */}
          <span className="mr-af-xxxs inline-grid grid-flow-col items-center gap-[2px] align-text-bottom">
            <picture className="relative block h-4 w-4 flex-none">
              <img
                alt=""
                className="block h-full w-full overflow-hidden rounded-[22.5%] object-cover"
                src={
                  'data:image/svg+xml;base64,' +
                  btoa(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" fill="#ff6b6b"/><text x="8" y="12" font-size="10" fill="white" text-anchor="middle" font-family="sans-serif">T</text></svg>',
                  )
                }
              />
            </picture>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-af-md">
              {value}
            </span>
          </span>
          {/* Close × — в оригинале просто <i class="k8m4eDs S4PcKur"></i> без вложенного SVG.
              Сам "×" приходит из CSS (font-icon/before-content). Здесь рендерим Unicode-крестик. */}
          <i
            className="ml-af-xxs flex h-[10px] w-[10px] items-center justify-center text-[12px] not-italic leading-none text-af-text-secondary"
            aria-hidden
          >
            ×
          </i>
        </div>
      </div>
    </button>
  )
}

// =============================================================================
// Approval mode section (.fMpWJLM) — единственная строка с переключателем справа.
// =============================================================================
//
//   div.fMpWJLM (.dJj7XNh + justify-between)
//     div
//       "Approval mode"
//       description
//     label.QtSuPuK
//       input.EA8mO68 (visually-hidden)
//       div.bZP2IBu.__Vppbx[.Djlu_eq]  ← track 34x20
//         span._tDTwnr                 ← thumb 16x16

// compact=true — без заголовка "Approval mode", только описание.
// Используется внутри green-info блока, где визуальная иерархия задаётся снаружи.
function ApprovalModeSection({ compact = false }) {
  const [enabled, setEnabled] = useState(true)
  return (
    <div className="flex w-full items-center justify-between gap-af-xs">
      <div className="min-w-0 flex-1">
        {!compact && (
          <div className="text-af-lg font-af-bold tracking-af-xs text-af-text-primary">
            Approval mode
          </div>
        )}
        <div
          className={
            compact
              ? 'text-[14px] font-af-normal leading-[1.4] tracking-af-sm text-[#213752]'
              : 'text-af-md font-af-normal leading-af-md tracking-af-sm text-af-text-secondary'
          }
        >
          Replies stay in Pending approval until you approve them in the Reviews feed
        </div>
      </div>
      <ToggleSwitch checked={enabled} onChange={setEnabled} />
    </div>
  )
}

// .QtSuPuK + .bZP2IBu + ._tDTwnr — switch 34x20, thumb 16x16, on=brand color.
function ToggleSwitch({ checked, onChange, tone = 'blue' }) {
  // tone='blue' (default, как раньше) или 'green' для approval-бейджа в footer.
  const onClasses =
    tone === 'green'
      ? 'border-af-green-4 bg-af-green-4'
      : 'border-af-blue-5 bg-af-blue-5'
  return (
    <label className="relative flex shrink-0 cursor-pointer select-none items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="invisible absolute left-0 top-0 border-none outline-none"
      />
      <div
        className={`relative inline-block h-5 w-[34px] rounded-[20px] border transition-colors ${
          checked ? onClasses : 'border-af-gray-4 bg-af-gray-4'
        }`}
      >
        <span
          className="absolute top-[1px] h-4 w-4 rounded-[20px] bg-af-bg-primary transition-[left] duration-200 ease-in-out"
          style={{ left: checked ? 'calc(100% - 17px)' : '1px' }}
        />
      </div>
    </label>
  )
}

// =============================================================================
// Footer (.r74Bc23) — Cancel / Save draft / Upgrade to publish.
// =============================================================================
//
//   div.r74Bc23 (sticky bottom 0, bg primary, padding-block pd-lg, flex-wrap, z 1)
//     button.ucE4oQl.tAO3CWr.CsgOPCt          "Cancel"
//     button.ucE4oQl.tAO3CWr.CsgOPCt          "Save draft"
//     button.ucE4oQl.tAO3CWr.GkVTG2q.qDSqX0R  "Upgrade to publish"  + crown icon

function FormFooter() {
  const [approval, setApproval] = useState(true)
  return (
    <div className="sticky bottom-0 z-[1] flex flex-wrap items-center justify-between gap-af-xs bg-af-bg-primary py-af-lg">
      {/* Слева — зелёный бейдж со свитчером и текстом, высота как у кнопок (36px). */}
      <div className="inline-flex h-9 items-center gap-af-xs rounded-af-lg bg-af-green-1 px-af-sm">
        <ToggleSwitch checked={approval} onChange={setApproval} tone="green" />
        <span className="text-af-md font-af-normal leading-af-md tracking-af-sm text-[#213752]">
          Replies stay in Pending approval until you approve
        </span>
      </div>
      {/* Справа — все кнопки. */}
      <div className="flex flex-wrap items-center gap-af-xxs">
      <FooterButton kind="secondary">Cancel</FooterButton>
      <FooterButton kind="secondary">Save draft</FooterButton>
      <FooterButton kind="premium">
        Upgrade to publish
        {/* .Y53kl4i.ak8lcEc.cc63tNu — sparkle 16×16 vb24, margin-left 4 (pd-xxxs). */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="ml-af-xxxs shrink-0"
          aria-hidden
        >
          <path d="M20.0483 11.761L9.54833 23.011C9.43699 23.1303 9.28978 23.21 9.12903 23.2381C8.96829 23.2661 8.80277 23.241 8.65759 23.1665C8.51242 23.092 8.3955 22.9722 8.32457 22.8252C8.25365 22.6783 8.23258 22.5122 8.26458 22.3522L9.63952 15.4776L4.23667 13.4515C4.12121 13.4082 4.01821 13.3371 3.93679 13.2445C3.85536 13.1519 3.79802 13.0407 3.76984 12.9207C3.74167 12.8006 3.74352 12.6755 3.77524 12.5563C3.80697 12.4372 3.86758 12.3277 3.95171 12.2375L14.4517 0.98753C14.5631 0.868241 14.7103 0.788517 14.871 0.760452C15.0318 0.732387 15.1973 0.757512 15.3424 0.832015C15.4876 0.906519 15.6045 1.02634 15.6755 1.17329C15.7464 1.32025 15.7675 1.48633 15.7355 1.64634L14.3605 8.52094L19.7634 10.547C19.8788 10.5903 19.9818 10.6614 20.0633 10.754C20.1447 10.8466 20.202 10.9578 20.2302 11.0779C20.2584 11.1979 20.2565 11.323 20.2248 11.4422C20.1931 11.5614 20.1325 11.6709 20.0483 11.761Z" />
        </svg>
      </FooterButton>
      </div>
    </div>
  )
}

// .ucE4oQl base: h 36, border-sm, radius lg, font-md bold, line-sm, color brand.
// .tAO3CWr: min-h 36, min-w fit, padding 0 pd-sm + pl pd-xs.
// .CsgOPCt: secondary (bg primary, border control-stroke).
// .GkVTG2q: premium (paid-gradient bg, white text, no border).
// .qDSqX0R + .tAO3CWr: padding-right pd-xs (для крауна).
function FooterButton({ kind = 'secondary', children }) {
  const base =
    'inline-flex h-9 min-h-9 min-w-fit cursor-pointer items-center justify-center whitespace-nowrap rounded-af-lg text-af-md font-af-bold leading-af-sm transition-colors focus:outline-none disabled:cursor-default'
  // padding: 0 pd-sm + pl pd-xs (специфика tAO3CWr: pl сужено).
  const padding = kind === 'premium' ? 'pl-af-xs pr-af-xs' : 'pl-af-xs pr-af-sm'

  if (kind === 'premium') {
    return (
      <button
        type="button"
        className={`${base} ${padding} border-0 text-white`}
        style={{
          background:
            'linear-gradient(97deg, var(--af-purple-7, #5b1ad8) 0%, var(--af-purple-3, #b39df5) 100%)',
        }}
      >
        {children}
      </button>
    )
  }
  return (
    <button
      type="button"
      className={`${base} ${padding} border border-af-bg-stroke bg-af-bg-primary text-af-text-link hover:bg-af-bg-secondaryGray`}
    >
      {children}
    </button>
  )
}

function PreviewPlaceholder() {
  return (
    <div className="max-w-[420px] text-center">
      <div className="text-af-h-sm font-af-bold leading-af-lg text-af-text-primary">
        Review example
      </div>
      <p className="mt-af-xxs text-af-md font-af-normal leading-af-md tracking-af-sm text-af-text-secondary">
        Right-side preview area — TBD.
      </p>
    </div>
  )
}

// =============================================================================
// Preview top banner (.oudyFTC) — position: absolute, top: pd-lg.
// Внутри .Eebr5DO.prstMgS: flex items-center gap pd-xs, padding 0 pd-sm.
//   - img.hcQdbo4 (max-height 40)
//   - span.CWjSPo8.SXVQGi5 — text-sm, secondary
//   - button.ucE4oQl.tAO3CWr.nHUv4yq.l2rYh9W.VBWJM43 — 36×36, no border, no bg
//     внутри svg 24×24 (link-arrow или close)
// =============================================================================
function PreviewPromoBanner() {
  return (
    <div
      className="absolute"
      style={{ top: 24, left: '50%', transform: 'translateX(-50%)' }}
    >
      <div className="flex items-center" style={{ gap: 12, padding: '0 16px' }}>
        {/* .hcQdbo4 — max-height 40. Логотип Scoot. */}
        <div
          className="flex flex-none items-center justify-center overflow-hidden"
          style={{ maxHeight: 40, height: 40, width: 40 }}
        >
          <div
            className="flex h-full w-full items-center justify-center rounded-[22.5%]"
            style={{ backgroundColor: '#FFB800' }}
          >
            <span className="text-af-md font-af-bold text-af-text-primary">S</span>
          </div>
        </div>
        {/* .CWjSPo8.SXVQGi5 — text-sm, secondary */}
        <span className="text-af-sm font-af-normal text-af-text-secondary">
          Look how Scoot turned crashes into 5-star reviews with smarter automation
        </span>
        {/* .ucE4oQl.tAO3CWr.nHUv4yq.l2rYh9W.VBWJM43 — 36×36 без рамки/фона, brand-цвет иконки */}
        <button
          type="button"
          className="relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap border-0 bg-transparent p-0 text-af-text-link outline-none transition-colors hover:text-af-blue-7"
          style={{ height: 36, width: 36, borderRadius: 8 }}
          aria-label="Open"
        >
          {/* .Y53kl4i.ak8lcEc — 24×24 arrow icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M14.7515 6.35159C14.9765 6.12662 15.281 6 15.5985 6H19.2c.663 0 1.2.537 1.2 1.2v3.6c0 .318-.126.624-.351.849l-1.2 1.2a1.2 1.2 0 0 1-1.697-1.697l.847-.848V8.4h-2.005l-9.79 9.79a1.2 1.2 0 1 1-1.697-1.697l9.79-9.79z"
              fill="currentColor"
            />
            <path
              d="M5.4 9.6A2.4 2.4 0 0 1 7.8 7.2h3.6a1.2 1.2 0 1 1 0 2.4H7.8v8.4h8.4v-3.6a1.2 1.2 0 1 1 2.4 0V18a2.4 2.4 0 0 1-2.4 2.4H7.8A2.4 2.4 0 0 1 5.4 18V9.6z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

// =============================================================================
// Preview body (.rBc2qZn) — max-w 952, min-h 500, w 100%, gap pd-sm (16) column.
// =============================================================================
//
//   .rBc2qZn (DkPGJGp.Zsrb_6y → flex column gap pd-sm)
//     ┌ заголовок: span.S5RKKSq.GmXxLqY.jSdJfwu "Review example"
//     │   (S5RKKSq = header-sm 20px, font-NORMAL, line-lg 24, letter-sm)
//     │   (jSdJfwu = font-bold ← переопределяет на bold)
//     │   + <br/>
//     │   + span.hfFP08w.SXVQGi5 "About of reviews…"
//     │     (hfFP08w = text-md 14, font-normal, line-md 20, letter-sm)
//     │     (внутри <strong>100%</strong>)
//     └ div.DkPGJGp.Zsrb_6y (контейнер карточки + AI reply, flex column gap 16)
//         ├ div.jsaulmG (карточка отзыва, bg primary, radius lg, padding pd-xs/pd-sm)
//         │   div.YfSLrl6 (row, justify-between, padding-left pd-xs, position relative)
//         │     span.igndXVR (absolute polosa, 2×100, radius md, bg one-star)
//         │     div.hq6kYQv (flex column, gap pd-xs, flex 1, position relative)
//         │       div.bcrN0CS (absolute top:0 right:0 z:1, svg 20×20 sentiment-glyph)
//         │       div.NzjmDYB (flex wrap-reverse, gap pd-xs, justify-between)
//         │         div.p5TQM_x (items-center, flex-wrap)
//         │           svg.RtNDl7p.brgzCp4 (звёзды 100×20 с linearGradient)
//         │           span.CWjSPo8.SXVQGi5 (дата) — text-sm secondary
//         │       div.LmcjnXt.uzTXSMX (overflow auto, max-h 400, w 100, mb xxxs, pr xxxs)
//         │         div.DkPGJGp.kJeCRaA (column, gap pd-xxxs)
//         │           span.jrV39Ye.ojRd2rd (text-lg, line-lg, font-bold)
//         │           span.jrV39Ye (text-lg, line-lg, font-normal — emoji)
//         │     div.TS7JQKa.DkPGJGp.Bk2vHAO (max-w 240, column, gap pd-xxs)
//         │       div.ls4gtLR.sDFUSaA (grid 1fr) — иконка+название приложения
//         │       div.ls4gtLR × 3 (grid 96px/1fr) — Username/Language/Country
//         └ div.KSIt92o (mt pd-xs)
//             div.ytB27Dr (bg secondary-white, radius lg, padding pd-xs/pd-sm)
//               div.CwBd8by.Bk2vHAO (column gap pd-xxs, justify-between, w 100)
//                 div.qbONFR7.Bk2vHAO (column gap pd-xxs, items-center)  ← внутри ROW
//                   span.hfFP08w.GmXxLqY.jSdJfwu "AI reply example" (text-md BOLD)
//                   div.HQz7PWS.dUK6lpk.ASxbql4 (pill 42×18 yellow)
//                     div.tHjX4Mn.oV1xnGX "Pending approval" (text-xs ellipsis)
//                 div.DWNgRat.qCtXvSS (border-sm, radius lg, padding 3)
//                   button.B0FI6vf (padding pd-xxs, radius lg)
//                     svg.SgZiABU.ciKhQlA 16×16 (chevron/expand)
//               span.hfFP08w.GmXxLqY (text-md, primary — текст ответа)

function PreviewBody() {
  return (
    // .rBc2qZn + .U2B5TKY.DkPGJGp.Zsrb_6y.vRl208d
    //   = flex column gap 16 (pd-sm) text-align left + max-w 952 min-h 500 w 100
    <div
      className="flex w-full flex-col gap-af-sm text-left"
      style={{ maxWidth: 952, minHeight: 500 }}
    >
      {/* Заголовок Review example — 16px BOLD + короткое описание под ним. */}
      <div className="flex flex-col gap-af-xxxs">
        <span className="text-af-lg font-af-bold leading-af-lg text-af-text-primary">
          Review example
        </span>
        <span className="text-af-md font-af-normal leading-af-md tracking-af-sm text-af-text-secondary">
          A sample review that matches your conditions
        </span>
      </div>

      {/* Внутренний .U2B5TKY.DkPGJGp.Zsrb_6y.vRl208d — обёртка вокруг .jsaulmG + .KSIt92o.
          flex column gap 16 (pd-sm), text-align left. */}
      <div className="flex flex-col gap-af-sm text-left">
        {/* .jsaulmG — bg primary, radius lg, padding pd-xs/pd-sm.
            container-type: inline-size — задаётся через .af-jsaulmG (см. PREVIEW_RESPONSIVE_CSS). */}
        <div className="af-jsaulmG relative w-full rounded-af-lg bg-af-bg-primary">
          {/* .YfSLrl6 — column по умолчанию (DkPGJGp).
              @container (min-width: 632px) → row + justify-between.
              padding-left pd-xs, w 100, gap pd-xs (dJj7XNh). */}
          <div className="af-YfSLrl6 relative w-full gap-af-xs pl-af-xs">
            {/* .igndXVR — sentiment polosa абсолют слева, 2×100%, radius md.
                5 звёзд → зелёный (color-five-star = af-star-five #66b47c). */}
            <span
              aria-hidden
              className="absolute left-0 top-0"
              style={{
                width: 2,
                height: '100%',
                borderRadius: 4,
                backgroundColor: '#66b47c',
              }}
            />

            {/* .hq6kYQv — flex 1, position relative, flex column gap pd-xs */}
            <div className="relative flex min-w-0 flex-1 flex-col gap-af-xs">
              {/* .bcrN0CS — absolute top:0 right:0 z:1.
                  Внутри .Y53kl4i.ECDE1Pu.g_E_GXC 20×20 vb24 (open-in-new arrow). */}
              <div className="absolute right-0 top-0 z-[1] cursor-pointer text-af-text-secondary" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M13.2 3.60001C12.8817 3.60001 12.5765 3.72643 12.3515 3.95148C12.1264 4.17652 12 4.48175 12 4.80001C12 5.11827 12.1264 5.42349 12.3515 5.64853C12.5765 5.87358 12.8817 6.00001 13.2 6.00001H16.3032L8.7516 13.5516C8.63699 13.6623 8.54557 13.7947 8.48268 13.9411C8.41979 14.0875 8.38668 14.245 8.3853 14.4043C8.38391 14.5637 8.41428 14.7217 8.47461 14.8692C8.53495 15.0166 8.62405 15.1506 8.73673 15.2633C8.8494 15.3759 8.98338 15.4651 9.13085 15.5254C9.27833 15.5857 9.43635 15.6161 9.59568 15.6147C9.75502 15.6133 9.91248 15.5802 10.0589 15.5173C10.2053 15.4544 10.3377 15.363 10.4484 15.2484L18 7.69681V10.8C18 11.1183 18.1264 11.4235 18.3515 11.6485C18.5765 11.8736 18.8817 12 19.2 12C19.5183 12 19.8235 11.8736 20.0485 11.6485C20.2736 11.4235 20.4 11.1183 20.4 10.8V4.80001C20.4 4.48175 20.2736 4.17652 20.0485 3.95148C19.8235 3.72643 19.5183 3.60001 19.2 3.60001H13.2Z"
                    fill="currentColor"
                  />
                  <path
                    d="M6.0001 6C5.36358 6 4.75313 6.25286 4.30304 6.70294C3.85295 7.15303 3.6001 7.76348 3.6001 8.4V18C3.6001 18.6365 3.85295 19.247 4.30304 19.6971C4.75313 20.1471 5.36358 20.4 6.0001 20.4H15.6001C16.2366 20.4 16.8471 20.1471 17.2972 19.6971C17.7472 19.247 18.0001 18.6365 18.0001 18V14.4C18.0001 14.0817 17.8737 13.7765 17.6486 13.5515C17.4236 13.3264 17.1184 13.2 16.8001 13.2C16.4818 13.2 16.1766 13.3264 15.9516 13.5515C15.7265 13.7765 15.6001 14.0817 15.6001 14.4V18H6.0001V8.4H9.6001C9.91836 8.4 10.2236 8.27357 10.4486 8.04853C10.6737 7.82348 10.8001 7.51826 10.8001 7.2C10.8001 6.88174 10.6737 6.57652 10.4486 6.35147C10.2236 6.12643 9.91836 6 9.6001 6H6.0001Z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              {/* .NzjmDYB — flex-wrap wrap-reverse, gap pd-xs, justify-between */}
              <div
                className="flex justify-between gap-af-xs"
                style={{ flexWrap: 'wrap-reverse' }}
              >
                {/* .p5TQM_x — flex, items-center, flex-wrap. Звёзды + дата. */}
                <div className="flex flex-wrap items-center gap-af-xs">
                  <PreviewStars rating={5} />
                  {/* .CWjSPo8.SXVQGi5 — text-sm secondary */}
                  <span className="text-af-sm font-af-normal leading-af-sm text-af-text-secondary">
                    May 25, 2026, 09:17 AM
                  </span>
                </div>
              </div>

              {/* .LmcjnXt.uzTXSMX — max-w 100, w 100, relative + overflow auto,
                  max-h 400, margin-bottom 2 (pd-xxxxs), padding-right 2 (pd-xxxxs). */}
              <div
                className="relative w-full max-w-full overflow-auto"
                style={{ maxHeight: 400, marginBottom: 2, paddingRight: 2 }}
              >
                {/* .U2B5TKY.DkPGJGp.kJeCRaA — flex column, gap pd-xxxs (4) */}
                <div className="flex flex-col gap-af-xxxs">
                  {/* .GmXxLqY.jrV39Ye.ojRd2rd — primary BOLD.
                      По умолчанию 14/20 (text-md), на ≥1440px 16/24 (text-lg) —
                      см. .af-jrV39Ye в PREVIEW_RESPONSIVE_CSS. */}
                  <span className="af-jrV39Ye font-af-bold text-af-text-primary [word-break:break-word]">
                    <span><span>Best app ever, can't live without it!</span></span>
                  </span>
                  {/* .GmXxLqY.jrV39Ye — primary normal (тело отзыва). Те же адаптивные правила. */}
                  <span className="af-jrV39Ye font-af-normal text-af-text-primary [word-break:break-word]">
                    <span>
                      <span>
                        I've been using this app for almost two years now,
                        and it has genuinely changed how I manage my day.
                        The interface is clean, the notifications are smart
                        and not annoying, and every update brings something
                        useful.
                      </span>
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* .U2B5TKY.DkPGJGp.Bk2vHAO.vRl208d.TS7JQKa
                = flex column gap pd-xxs (8) text-align-left.
                max-w 240 — только при @container ≥632px (см. .af-TS7JQKa в CSS). */}
            <div className="af-TS7JQKa flex w-full flex-col gap-af-xxs text-left">
              {/* .ls4gtLR.sDFUSaA — grid 1fr (override), gap pd-xxs */}
              <div
                className="grid w-full min-w-0 max-w-full gap-af-xxs"
                style={{ gridTemplateColumns: '1fr' }}
              >
                <div className="flex overflow-hidden text-af-sm font-af-normal leading-af-sm text-af-text-secondary [word-break:break-word]">
                  <div style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {/* .eAUnDkK.uQyQ4wI — inline-grid с иконкой app */}
                    <span
                      style={{
                        display: 'inline-grid',
                        gridAutoFlow: 'column',
                        alignItems: 'center',
                        gap: 2,
                        marginRight: 2,
                        verticalAlign: '-2px',
                      }}
                    >
                      <PreviewAppIcon />
                      <PreviewLockIcon />
                    </span>
                    <span>Trivia Crack: Brain Quiz Games</span>
                  </div>
                </div>
              </div>

              {/* Username / Review language / Country скрыты по запросу.
                  В правой колонке остаётся только название приложения. */}
              {false && (
                <>
                  <MetaRowGrid label="Username">
                    <span className="flex w-full items-center overflow-hidden">
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                        Hshshajwine
                      </span>
                    </span>
                  </MetaRowGrid>

                  <MetaRowGrid label="Review language">
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      English
                    </span>
                  </MetaRowGrid>

                  <MetaRowGrid label="Country">
                    <span
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: 'var(--af-text-primary, #1a1a1a)',
                      }}
                    >
                      <i
                        aria-hidden
                        style={{
                          display: 'inline-block',
                          width: 16,
                          height: 11,
                          backgroundColor: '#3C3B6E',
                          verticalAlign: '-1px',
                          marginRight: 8,
                          borderRadius: 1,
                        }}
                      />
                      United States
                    </span>
                  </MetaRowGrid>
                </>
              )}
            </div>
          </div>

          {/* .KSIt92o — margin-top pd-xs (12px). НАХОДИТСЯ ВНУТРИ .jsaulmG (белой карточки)! */}
          <div className="mt-af-xs">
            {/* .ytB27Dr — bg secondary-white (серый прямоугольник внутри белой карточки),
                radius lg, padding pd-xs/pd-sm. */}
            <div className="rounded-af-lg bg-af-bg-secondaryWhite px-af-sm py-af-xs">
              {/* .U2B5TKY.Bk2vHAO.vRl208d.CwBd8by
                  = flex column gap pd-xxs (8) text-align-left + justify-between + w 100 */}
              <div className="flex w-full flex-col justify-between gap-af-xxs text-left">
                {/* Заголовок-строка: AI reply example + Pending approval + .DWNgRat */}
                <div className="flex w-full items-center justify-between gap-af-xs">
                  {/* .U2B5TKY.Bk2vHAO.vRl208d.qbONFR7
                      = flex column gap pd-xxs + items-center.
                      На практике AppFollow рендерит ROW (.dJj7XNh не применяется).
                      Здесь подписи + пилюля идут в линию. */}
                  <div className="flex min-w-0 items-center gap-af-xxs">
                    {/* .hfFP08w.GmXxLqY.jSdJfwu — text-md 14/20 letter-sm primary BOLD */}
                    <span className="whitespace-nowrap text-af-md font-af-bold leading-af-md tracking-af-sm text-af-text-primary">
                      AI reply example
                    </span>
                    {/* .HQz7PWS.dUK6lpk.ASxbql4 — radius xl, h 18, w 42 (внутри fit),
                        padding pd-xxxxs/pd-xxs (2/8). Цвет — yellow-4 background. */}
                    <span
                      className="inline-flex h-[18px] w-fit max-w-full items-center rounded-af-xl"
                      style={{ padding: '2px 8px', backgroundColor: '#fceebd' }}
                    >
                      {/* .tHjX4Mn.oV1xnGX — text-xs 10/14 ellipsis */}
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap text-af-xs leading-af-xs text-af-text-primary">
                        Pending approval
                      </span>
                    </span>
                  </div>
                  {/* .DWNgRat.qCtXvSS — border-sm + radius lg + padding 3. Хост B0FI6vf. */}
                  <div className="flex h-fit w-fit rounded-af-lg border border-af-bg-stroke bg-af-bg-primary p-[3px]">
                    {/* .B0FI6vf — bg primary, radius lg, padding pd-xxs (4 в .qCtXvSS) */}
                    <button
                      type="button"
                      aria-label="Expand"
                      className="cursor-pointer rounded-af-lg border-0 bg-af-bg-primary p-af-xxxs"
                    >
                      {/* .Y53kl4i.SgZiABU.ciKhQlA — 12×12 vb16. AI-sparkle-text icon. */}
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="text-af-text-link" aria-hidden>
                        <path d="M8.43139 10.4457C8.52188 10.2028 8.4615 9.92941 8.27713 9.74721L6.88675 8.37325L6.90675 8.35325C8.06675 7.05992 8.89341 5.57325 9.38008 3.99992H10.6667C11.0349 3.99992 11.3334 3.70144 11.3334 3.33325C11.3334 2.96506 11.0349 2.66659 10.6667 2.66659H6.66675V1.99992C6.66675 1.63173 6.36827 1.33325 6.00008 1.33325C5.63189 1.33325 5.33341 1.63173 5.33341 1.99992V2.66659H1.33341C0.965225 2.66659 0.666748 2.96506 0.666748 3.33325C0.666748 3.70144 0.965225 3.99992 1.33341 3.99992H8.11341C7.66675 5.27992 6.96008 6.49992 6.00008 7.56659C5.46756 6.97681 5.01373 6.33785 4.63859 5.6666C4.52534 5.46395 4.31407 5.33325 4.08191 5.33325C3.63335 5.33325 3.33636 5.79495 3.55339 6.18751C3.98014 6.9594 4.5019 7.69325 5.11341 8.37325L2.19804 11.2485C1.93461 11.5083 1.93343 11.9333 2.19505 12.1949C2.4554 12.4552 2.8778 12.4555 3.13815 12.1952L6.00008 9.33325L7.34835 10.6815C7.68754 11.0207 8.26393 10.8952 8.43139 10.4457ZM12.4956 7.09917C12.3981 6.83897 12.1493 6.66659 11.8714 6.66659H11.4621C11.1842 6.66659 10.9354 6.83897 10.8379 7.09917L8.31619 13.8236C8.16324 14.2315 8.46476 14.6666 8.90037 14.6666C9.16078 14.6666 9.39379 14.5049 9.48487 14.2609L10.0801 12.6666H13.2467L13.8478 14.2622C13.9394 14.5055 14.1722 14.6666 14.4322 14.6666C14.8683 14.6666 15.1701 14.2311 15.017 13.8228L12.4956 7.09917ZM10.5867 11.3333L11.6667 8.44659L12.7467 11.3333H10.5867Z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* .hfFP08w.GmXxLqY — text-md 14/20 letter-sm primary (текст ответа). */}
                <span className="text-af-md font-af-normal leading-af-md tracking-af-sm text-af-text-primary [word-break:break-word]">
                  Hi Hshshajwine, It's clear that the increase in ads has affected your experience — and that's the last thing we want. We're rebalancing ad frequency in the next update so the game stays fun without the interruptions. Thanks for sticking with us!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// .ls4gtLR — display grid, grid-template-columns 96px 1fr, gap pd-xxs (8),
//            w 100, min-w 0, max-w 100%.
function MetaRowGrid({ label, children }) {
  return (
    <div
      className="grid w-full min-w-0 max-w-full gap-af-xxs"
      style={{ gridTemplateColumns: '96px 1fr' }}
    >
      {/* .CWjSPo8.BBQwOJQ.I470BvE — text-sm 12/18 tertiary nowrap */}
      <div className="whitespace-nowrap text-af-sm font-af-normal leading-af-sm text-af-text-tertiary">
        {label}
      </div>
      {/* .CWjSPo8.SXVQGi5.Mnh_M2B — text-sm 12/18 secondary, flex, overflow, word-break */}
      <div className="flex overflow-hidden text-af-sm font-af-normal leading-af-sm text-af-text-secondary [word-break:break-word]">
        {children}
      </div>
    </div>
  )
}

// .d0x8Wgy.QYUB0c2.lWgLkl5 — иконка приложения 16×16 с rounded squircle.
function PreviewAppIcon() {
  return (
    <picture
      style={{
        display: 'block',
        flex: 'none',
        position: 'relative',
        width: 16,
        height: 16,
      }}
    >
      <img
        alt=""
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          overflow: 'hidden',
          borderRadius: '22.5%',
        }}
        src={
          'data:image/svg+xml;base64,' +
          btoa(
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" fill="#FF6B6B"/><text x="8" y="12" font-size="9" fill="#fff" text-anchor="middle" font-family="sans-serif">T</text></svg>',
          )
        }
      />
    </picture>
  )
}

// .Y53kl4i.SgZiABU.Y1OMi2q[data-type=secondary] — 12×12 vb24, Apple-logo (secondary color).
// Path — реальный из CSS оригинала AppFollow.
function PreviewLockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-af-text-secondary" aria-hidden>
      <path d="M13.0865 6.25394C13.6061 6.06323 14.1257 5.72948 14.6452 5.15733C15.1176 4.58519 15.4954 3.96537 15.7788 3.25019C16.015 2.53501 16.0622 1.86751 15.9205 1.20001C14.5508 1.53376 13.5116 2.15358 12.8503 3.05948C12.1418 3.96537 11.7639 5.10965 11.7639 6.44465C12.3308 6.44465 12.7559 6.3493 13.0865 6.25394ZM18.8491 9.6868C18.1878 10.5927 17.9044 11.5939 17.9988 12.6429C18.0461 13.5964 18.3295 14.5023 18.8963 15.2652C19.4631 16.0757 20.1244 16.6002 20.8801 16.7909C20.455 18.1259 19.841 19.3179 19.038 20.4145C17.9988 21.8448 17.0069 22.5123 16.0622 22.5123C15.5899 22.5123 14.9759 22.417 14.1729 22.1309C13.3699 21.8448 12.7559 21.7018 12.2835 21.7018C11.8112 21.7018 11.1499 21.8925 10.3942 22.1786C9.68565 22.4647 9.16608 22.56 8.7882 22.56C7.89076 22.56 6.99331 21.9879 6.04863 20.8436C5.19842 19.8423 4.53714 18.555 3.97033 17.0293C3.40352 15.5036 3.12012 14.0732 3.12012 12.7859C3.12012 11.0218 3.54522 9.49608 4.39544 8.20876C5.34012 6.87376 6.5682 6.15858 8.12693 6.15858C8.69373 6.15858 9.54395 6.3493 10.6776 6.63537C11.3861 6.82608 11.9057 6.92144 12.1891 6.92144C12.4725 6.92144 12.9448 6.82608 13.7005 6.58769C14.7397 6.25394 15.5899 6.06323 16.2512 6.06323C17.1014 6.06323 17.8571 6.25394 18.5184 6.63537C19.0852 7.0168 19.6993 7.54126 20.2661 8.20876C19.6048 8.7809 19.1325 9.25769 18.8491 9.6868Z" />
    </svg>
  )
}

// Звёзды review-rating. SVG 100×20 viewBox 0.5 0 64 13, 5 контуров, заливка градиент.
// Для rating=1 — заполнена 1/5 (gradient red), остальные — серые.
function PreviewStars({ rating = 5 }) {
  const gradId = `stars-${rating}`
  // полный путь — 5 звёзд (примерно)
  const starPath = (cx) =>
    `M${cx} 1L${cx + 1.1} 4.4 ${cx + 4.7} 4.4 ${cx + 1.8} 6.5 ${cx + 2.9} 9.9 ${cx} 7.8 ${cx - 2.9} 9.9 ${cx - 1.8} 6.5 ${cx - 4.7} 4.4 ${cx - 1.1} 4.4Z`
  const positions = [6, 18, 30, 42, 54]
  const fillPct = (rating / 5) * 100
  // цвет по рейтингу
  const color =
    rating === 1
      ? '#FF3B30'
      : rating === 2
        ? '#FF9500'
        : rating === 3
          ? '#FFCC00'
          : rating === 4
            ? '#A0D636'
            : '#34C759'
  return (
    <svg
      width="100"
      height="20"
      viewBox="0.5 0 64 13"
      style={{ display: 'block', margin: '2px 0' }}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset={`${fillPct}%`} stopColor={color} />
          <stop offset={`${fillPct}%`} stopColor="#D1D5DB" />
        </linearGradient>
      </defs>
      {positions.map((cx, i) => (
        <path key={i} d={starPath(cx)} fill={`url(#${gradId})`} />
      ))}
    </svg>
  )
}
