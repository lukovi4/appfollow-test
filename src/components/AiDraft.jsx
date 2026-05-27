import { useState, useRef, useLayoutEffect, useMemo } from 'react'
import { generateReplies, generateTemplates } from '../utils/pickAiReplies.js'
import { patternConfidence } from '../utils/patternConfidence.js'

// AI-draft .qmXn_jc — блок с предложенными AI-ответами.
// СОСТОЯНИЯ (управляем сами — в исходном AppFollow JS-логика в минифицированном React-бандле):
//   expanded (default): toolbar + 2 варианта + textarea + trial + Send reply + close (×)
//   collapsed:          только textarea + Send reply (close × не показывается).
// Триггеры:
//   click "×" → collapsed = true
//   focus/click на textarea → collapsed = false (раскрытие обратно).
// Каскад классов проверен по байтовым смещениям. SVG path'ы — реальные из DOM.
//
// КОРНЕВАЯ СТРУКТУРА:
//   div.U2B5TKY.DkPGJGp.dJj7XNh.vRl208d.qmXn_jc.onb_r2r_send_reply
//     .qmXn_jc → bg secondary-white (#f7f9fc), radius-md (4), padding pd-xs (12),
//                position relative, w 100%
//     .DkPGJGp → flex-direction column
//     .dJj7XNh → gap pd-xs (12)        ← вертикальный gap между блоками внутри
//     .vRl208d → text-align left
//
//   1) button.B4_3TqC                  абсолют в правом верхнем (×)
//       .ucE4oQl.tAO3CWr.nHUv4yq.l2rYh9W.B4_3TqC
//        → bg initial, border none, 36×36, padding 0
//        → position absolute, right 0, top 0
//
//   2) div.cwoaCBM.wycHS0o              тулбар: Regenerate + counter + tone + flag + close
//       .cwoaCBM → flex items-center w 100% flex-wrap, gap 12 (.dJj7XNh inherited)
//       .wycHS0o → padding-right pd-xl (32) — место для .B4_3TqC
//
//        a) div._J13EnL                сегментный контрол Regenerate+refresh
//           .ucE4oQl.wEOj6nq.CsgOPCt.Z8NjCZG.p1OFmC1 "Regenerate"
//             .wEOj6nq → normal weight, min-h 28
//             .Z8NjCZG → padding-left pd-xs (12)
//             .p1OFmC1 → radius right 0
//             + svg.Fm40eTW (mr 4) — иконка regenerate
//           .ucE4oQl.wEOj6nq.CsgOPCt.l2rYh9W.X1Kb5Aj — refresh-кнопка (square 28×28)
//             .l2rYh9W.wEOj6nq → 28×28, padding 0
//             .X1Kb5Aj → radius left 0, border-left 0
//
//        b) div.G61ygXE                items-center
//           svg.I6oLbw8 (.ak8lcEc 16×16, color accent-positive = green-4) — check-icon
//           span.CWjSPo8.BBQwOJQ.D_MDNpj "123"
//             .CWjSPo8 → 12 / 20 / normal / -0.08 (letter-md)
//             .BBQwOJQ → color text-tertiary
//             .D_MDNpj → font-style italic
//
//        c) button.BsdN04N "Someting else"
//           .ucE4oQl.wEOj6nq.CsgOPCt.BsdN04N
//             .wEOj6nq → normal, min-h 28
//             .CsgOPCt → bg primary, border gray-3, color blue-5
//             .BsdN04N → max-w 20%, -webkit-line-clamp 1, color INHERIT, white-space normal
//             span.hfFP08w.GmXxLqY → 14/20 normal -0.12, color primary
//
//        d) button "Offensive material" — то же
//
//        e) button.l2rYh9W (28×28 square) — троеточие (more)
//
//   3) div.bf3YU7n                     2 варианта-ответа
//       .Bk2vHAO → gap 8
//       ._T85nyF / .bf3YU7n → w 100%
//
//      button._T85nyF
//         flex items-start, gap pd-xxxs (4), padding pd-xs (12),
//         bg primary, border gray-3 (control-stroke), radius-lg (8), text-align left
//         hover/focus → box-shadow + outline none
//         svg.ECDE1Pu.vIoEkio (20×20 sparkle, icon-tertiary, mt 2 from .vIoEkio)
//         div.hfFP08w.SXVQGi5.GgCADPm: 14/20 normal -0.12 / text-secondary /
//                                       white-space pre-wrap / word-break break-word
//
//   4) div.gzh2Cyq.HqisDe7              textarea-композиция (опционально показанная)
//      Сейчас в DOM есть, но визуально скрыта (overflow hidden, height 0px).
//      ОПУСКАЕМ — показываем только при фокусе.
//
//   5) div.hfFP08w.SXVQGi5 "14 AI generations left for free. <Start trial> to get unlimited."
//      14/20 normal -0.12 text-secondary.
//      button.uZaNVBr.Pqk3iGi.CsgOPCt.tAO3CWr.ucE4oQl "Start trial"
//        .Pqk3iGi → flat link: border none, bg initial !important, padding 0, font-weight normal,
//                    color blue-5
//        .uZaNVBr → inline-block, width fit-content
//
//   6) div.E7kwxWu                     нижняя строка
//      align-items center, flex, w 100%, justify-content space-between, margin-top pd-xxxs (4)
//      .Bk2vHAO → gap 8
//
//      button.WukwcoS.ZW2e4el "Send reply"
//        .ucE4oQl.wEOj6nq.WukwcoS.ZW2e4el
//        .WukwcoS → bg blue-5, border blue-5, color white. hover → blue-6. active → blue-7.
//        .ZW2e4el → height fit-content, margin-left auto
//        .wEOj6nq → normal weight, min-h 28, padding 0 pd-sm (0/16)

export default function AiDraft({ draft, onSend, onSendWithMetrics }) {
  // Если в данных задано collapsed: true → стартуем в свёрнутом виде.
  const [collapsed, setCollapsed] = useState(draft.collapsed === true)

  // Список вариантов AI (2 шт.) и шаблонов (2 шт.).
  // aiVariants — стартовое значение из draft.variants или сгенерированное.
  // aiVariantsOverride — задаётся кнопкой Regenerate (новая случайная пара).
  const initialAiVariants = useMemo(
    () => (draft.variants && draft.variants.length > 0 ? draft.variants : generateReplies(2)),
    [draft.variants],
  )
  const [aiVariantsOverride, setAiVariantsOverride] = useState(null)
  const aiVariants = aiVariantsOverride ?? initialAiVariants

  const initialTemplateVariants = useMemo(
    () => (draft.templates && draft.templates.length > 0 ? draft.templates : generateTemplates(1)),
    [draft.templates],
  )
  const [templateVariantsOverride, setTemplateVariantsOverride] = useState(null)
  const templateVariants = templateVariantsOverride ?? initialTemplateVariants

  // Интерактив выбора варианта ответа:
  // - selectedVariantIndex: индекс выбранной кнопки-карточки (null = ничего не выбрано)
  // - replyText: текущий текст в textarea (контролируемое поле)
  // Логика:
  //   click на вариант → подставить его текст в textarea + подсветить кнопку
  //   повторный click на тот же вариант → перезаписать textarea исходным текстом
  //   правка textarea вручную → если текст разошёлся с вариантом, снимаем подсветку
  // Mode switcher: null | 'ai' | 'template'. Стартовое значение берём из draft.mode
  // (если задано), иначе null (ничего не выбрано).
  const [mode, setMode] = useState(draft.mode ?? null)

  // Выбранный вариант хранится как пара (mode, index), чтобы при возврате на тот же mode
  // подсветка восстановилась. Если selection.mode !== текущий mode → подсветка не видна.
  // Стартовое значение из draft.initialSelection (например { mode: 'ai', index: 0 })
  // или null/null если не задано.
  const [selection, setSelection] = useState(
    draft.initialSelection ?? { mode: null, index: null },
  )

  // Стартовый текст textarea — если в draft задано initialReplyText, используем его.
  // Иначе пусто. Это позволяет ленте показывать карточку с уже подставленным ответом.
  const [replyText, setReplyText] = useState(draft.initialReplyText ?? '')

  // Baseline — текст последнего выбранного варианта (для расчёта pattern confidence).
  // При старте: если initialReplyText задан, считаем что он совпадает с initialSelection's variant.
  const baselineRef = useRef(draft.initialReplyText ?? null)

  // Текущий список вариантов зависит от mode.
  const visibleVariants = mode === 'ai' ? aiVariants : mode === 'template' ? templateVariants : []

  // Нормализатор: AI-варианты — строки; Template-варианты — объекты {name, text}.
  // Для текстовых операций (textarea, сравнение) используем только .text.
  const getVariantText = (v) => (typeof v === 'string' ? v : v?.text ?? '')

  // Индекс выбранного варианта В ТЕКУЩЕМ mode (или null если в другом mode или ничего).
  const selectedVariantIndex = selection.mode === mode ? selection.index : null

  const handleSelectVariant = (i) => {
    const text = getVariantText(visibleVariants[i])
    setSelection({ mode, index: i })
    setReplyText(text)
    // Запоминаем выбранный текст как baseline для расчёта confidence.
    baselineRef.current = text
  }

  const handleTextareaChange = (e) => {
    const value = e.target.value
    // Первый ввод символа в текущей сессии — фиксируем таймер.
    if (draft.trackTime && !committedRef.current && value.length > 0) {
      committedRef.current = true
    }
    setReplyText(value)
    // Снимаем подсветку, если текст отошёл от выбранного варианта.
    if (selection.index != null && selection.mode === mode) {
      const currentVariantText = getVariantText(visibleVariants[selection.index])
      if (currentVariantText !== value) {
        setSelection({ mode: null, index: null })
      }
    }
  }

  // При переключении mode подсветку НЕ сбрасываем — она привязана к mode через selection.
  // Если пользователь вернётся на тот же mode — подсветка восстановится.
  const handleModeChange = (next) => {
    setMode(next)
  }

  // Time tracker (для аналитики). Активен только если draft.trackTime === true.
  //
  // Правила:
  //  - Старт: onFocus на textarea (первая фокусировка в сессии).
  //  - "Фиксация" таймера: происходит при ПЕРВОМ вводе символа в этой сессии.
  //  - Blur (потеря фокуса):
  //      • если НЕ зафиксирован (пользователь ничего не напечатал) → таймер сбрасывается,
  //        следующий onFocus начнёт сессию заново с 0.
  //      • если зафиксирован → таймер продолжает считать. Возврат к textarea —
  //        то же сидение, считаем суммарно.
  //  - Clear / стирание текста → таймер НЕ сбрасывается (пользователь продолжает сессию).
  //  - Запись: клик Send Reply, только если в textarea есть текст.
  //  - После Send Reply: таймер и флаг фиксации сбрасываются.
  const startTimeRef = useRef(null)
  const committedRef = useRef(false)

  const handleTextareaFocus = () => {
    if (draft.trackTime && startTimeRef.current == null) {
      startTimeRef.current = Date.now()
    }
  }

  const handleTextareaBlur = () => {
    // Если пользователь так и не напечатал ничего за эту фокусировку — сбрасываем
    // таймер, чтобы следующая сессия началась с 0.
    if (draft.trackTime && !committedRef.current) {
      startTimeRef.current = null
    }
  }

  const handleSendReply = () => {
    const hasText = replyText.length > 0
    if (hasText) {
      // Time tracking — только если trackTime и таймер был запущен.
      if (
        draft.trackTime &&
        startTimeRef.current != null &&
        typeof onSend === 'function'
      ) {
        const seconds = Math.round((Date.now() - startTimeRef.current) / 1000)
        onSend(seconds)
      }
      // Pattern confidence — считаем если был выбран AI-/Template-вариант (baselineRef есть).
      if (baselineRef.current != null && typeof onSendWithMetrics === 'function') {
        const confidence = patternConfidence(baselineRef.current, replyText)
        onSendWithMetrics({ confidence })
      }
    }

    // Сброс таймеров и базы.
    startTimeRef.current = null
    committedRef.current = false
    baselineRef.current = null

    // После отправки: если активен Ask AI или Template — генерируем новые варианты и
    // сразу выбираем первый (как будто пользователь нажал Regenerate + клик на 1-й).
    // Иначе — просто очищаем textarea и снимаем выбор.
    if (mode === 'ai') {
      const newVariants = generateReplies(2)
      setAiVariantsOverride(newVariants)
      const firstText = getVariantText(newVariants[0])
      setReplyText(firstText)
      setSelection({ mode: 'ai', index: 0 })
      baselineRef.current = firstText
    } else if (mode === 'template') {
      const newVariants = generateTemplates(1)
      setTemplateVariantsOverride(newVariants)
      const firstText = getVariantText(newVariants[0])
      setReplyText(firstText)
      setSelection({ mode: 'template', index: 0 })
      baselineRef.current = firstText
    } else {
      setReplyText('')
      setSelection({ mode: null, index: null })
    }
  }

  // Auto-resize textarea по контенту.
  // TEXTAREA_MIN_H = вся высота textarea (включая padding-top, padding-bottom и контент).
  // Растёт по scrollHeight, когда контента больше.
  const TEXTAREA_MIN_H = 140
  // Лимит символов как в реальном AppFollow (App Store ограничение).
  const MAX_REPLY_CHARS = 5970
  const textareaRef = useRef(null)
  useLayoutEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    // Сначала сбрасываем height до min, чтобы scrollHeight отразил реальный контент.
    ta.style.height = `${TEXTAREA_MIN_H}px`
    // Если контент больше — растягиваем.
    if (ta.scrollHeight > TEXTAREA_MIN_H) {
      ta.style.height = `${ta.scrollHeight}px`
    }
  }, [replyText])

  // COLLAPSED state — это ДРУГОЙ компонент в реальном AppFollow:
  //   div.Q6u5ycF.AArnJOZ.HxD9hes
  //     input.nCp2EqB[placeholder="Reply to review"]
  //
  // Каскад:
  //   .Q6u5ycF → inline-flex items-center, relative, w 100%
  //   .HxD9hes → w 100%
  //   .AArnJOZ .nCp2EqB → height input-md (36), padding pd-xxs (8), 14/20
  //   .nCp2EqB → bg primary, border-sm control-stroke-light (gray-4), radius-lg (8),
  //               color text-primary, outline none, w 100%
  //   placeholder color: text-tertiary
  //
  // По click/focus на input → разворачиваем обратно в AI-draft.
  if (collapsed) {
    return (
      <div className="relative inline-flex w-full items-center">
        <input
          className="h-af-input-md w-full rounded-af-lg border border-af-gray-4 bg-af-bg-primary p-af-xxs text-af-md font-af-normal leading-af-md tracking-af-sm text-af-text-primary outline-none transition-colors placeholder:text-af-text-tertiary focus:border-af-blue-5"
          placeholder="Reply to review"
          onFocus={() => setCollapsed(false)}
          onClick={() => setCollapsed(false)}
        />
      </div>
    )
  }

  return (
    // Обёртка group + relative. Размер контейнера = ровно ширина AI-draft (w-full).
    // Layout справа не сдвигается.
    // Невидимая hover-зона и сам крестик висят АБСОЛЮТНО справа за пределами блока,
    // через left: 100% — они не влияют на layout (не занимают место в потоке).
    <div className="group relative w-full">
      <div className="relative flex w-full min-w-0 flex-col gap-af-xs rounded-af-md bg-af-bg-secondaryWhite p-af-md text-left">

      {/*
        Новый порядок:
          1) Textarea со встроенной Send reply
          2) Toolbar (Regenerate + counter + tone + flag + more)
          3) 2 варианта ответа
          4) Trial info

        4) Textarea (.gzh2Cyq.HqisDe7).
        Структура:
          .gzh2Cyq (w 100%)
            div (без класса)
              .rFTZYCC (flex-grow 1, position relative, z 0)
                .z06k5nD.iLjGpcQ (bg primary, radius-md (4), overflow hidden,
                                    padding pd-xxxs (4), w 100%, position relative, z 0)
                  :before → border 1px control-stroke-light (gray-4), radius-md,
                             absolute inset 0, z -2
                  textarea.KBBBg_R.NQODF2G:
                    .KBBBg_R: bg primary, border none, radius-lg (8) (override→2 от NQODF2G),
                              14/20, min-h 36, padding pd-xxs (8), resize none, display block
                    .NQODF2G: radius-sm (2), padding-right 54, w 100%
                  + ниже скрытые блоки (Improve/Translate/Shorter и Press TAB).
                  Сейчас открываются по фокусу — пока не реализуем.
                .aypxWZs.ZuluHb4 — error-underline (h 7px, bg red-1, opacity 0)
            .H5O9S6T — error-message slot (скрыт когда нет error)
      */}
      <div className="w-full">
        <div>
          <div className="relative z-0 flex-grow">
            <div
              className="relative z-0 w-full overflow-hidden rounded-af-lg bg-af-bg-primary p-af-xxxs before:absolute before:inset-0 before:-z-[2] before:rounded-af-lg before:border before:border-af-gray-4 before:content-['']"
            >
              <textarea
                ref={textareaRef}
                placeholder="Enter reply text"
                rows={5}
                value={replyText}
                onChange={handleTextareaChange}
                onFocus={handleTextareaFocus}
                onBlur={handleTextareaBlur}
                className="block w-full resize-none overflow-hidden rounded-af-lg border-none bg-af-bg-primary p-af-xs text-af-md font-af-normal leading-af-md tracking-normal text-af-text-primary outline-none placeholder:text-af-text-tertiary 3xl:text-af-lg 3xl:leading-af-lg"
                style={{
                  minHeight: TEXTAREA_MIN_H,
                  height: TEXTAREA_MIN_H,
                  // 28 (h кнопок) + 12 (нижний отступ от текста) + 12 (отступ кнопок от низа textarea) = 52
                  paddingBottom: 52,
                }}
              />
              {/*
                Clear icon — слева-снизу внутри textarea-обёртки.
                Появляется ТОЛЬКО если в textarea есть текст.
                По клику: очищает textarea и снимает подсветку с выбранного варианта.
              */}
              {/*
                Нижний бар: Delete-бейдж (sticky слева) + горизонтальный список
                декоративных кнопок (Improve / Translate / Shorter / Longer / Add a greeting).
                Send reply справа отдельным absolute. Между Delete и Send reply — flex с overflow-x auto.

                Видим только когда есть текст (replyText.length > 0).
              */}
              {/*
                Нижний бар всегда в DOM. Управляем opacity + pointer-events через
                replyText.length > 0 — плавная fade-in/out анимация 200ms.
              */}
              <div
                aria-hidden={replyText.length === 0}
                className={`no-scrollbar absolute bottom-af-xs left-af-xs flex items-center gap-af-xxs overflow-x-auto transition-opacity duration-200 ease-out ${
                  replyText.length > 0 ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
                style={{
                  // Резервируем место под Send reply (ширина ~120 + 12 правый offset).
                  right: 12 + 120,
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {/* Delete + counter — sticky слева, не скроллится */}
                <button
                  type="button"
                  aria-label="Clear"
                  onClick={() => {
                    setReplyText('')
                    // selection теперь объект (mode + index) — сбрасываем оба поля.
                    setSelection({ mode: null, index: null })
                  }}
                  className="group/clear sticky left-0 z-[1] inline-flex h-7 shrink-0 cursor-pointer items-center gap-af-xxs rounded-af-lg border-none text-af-sm font-af-normal leading-af-sm text-af-text-primary"
                  style={{ paddingLeft: 6, paddingRight: 6, backgroundColor: '#f0f5fa' }}
                >
                  <span className="text-af-icon-tertiary transition-colors group-hover/clear:text-af-red-4">
                    <ClearIcon />
                  </span>
                  <span>
                    {replyText.length}/{MAX_REPLY_CHARS}
                  </span>
                </button>

                {/*
                  Декоративные кнопки (.ucE4oQl.wEOj6nq.CsgOPCt):
                    base: flex items-center justify-center, bg primary, border gray-3,
                          radius-lg, color blue-5, font-size 14, weight normal (override .wEOj6nq),
                          line-sm (18), nowrap, min-h 28, padding 0 pd-sm (0/16).
                    hover: bg control-bg-secondary-medium (#f0f5fa). active: secondary-dark.
                */}
                {['Improve', 'Translate', 'Shorter', 'Longer', 'Add a greeting'].map((label) => (
                  <button
                    key={label}
                    type="button"
                    className="inline-flex h-7 min-h-7 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-af-lg border border-af-bg-stroke bg-af-bg-primary px-af-sm text-af-md font-af-normal leading-af-sm text-af-text-link transition-colors hover:bg-af-bg-secondaryGray active:bg-af-bg-stroke"
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/*
                Send reply — абсолютно справа-снизу внутри textarea-обёртки.
                Отступы 8px (right/bottom). Место под кнопку уже зарезервировано
                через paddingRight: 54 на textarea.
              */}
              {/*
                Send reply — появляется только когда в textarea есть текст.
                Плавный fade-in через opacity + pointer-events.
              */}
              <button
                type="button"
                aria-hidden={replyText.length === 0}
                onClick={handleSendReply}
                className={`absolute bottom-af-xs right-af-xs inline-flex h-7 min-h-7 cursor-pointer items-center justify-center whitespace-nowrap rounded-af-lg border border-af-blue-5 bg-af-blue-5 px-af-sm text-af-md font-af-bold leading-af-sm text-af-text-white transition-opacity duration-200 ease-out hover:border-af-blue-6 hover:bg-af-blue-6 ${
                  replyText.length > 0 ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                Send reply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*
        2) Toolbar (под textarea).
        mt-af-xxs (8) дополнительно к gap-af-xs (12) родителя = итого 20px от textarea.
      */}
      <div className="mt-af-xxs flex w-full flex-wrap items-center gap-af-xs">
        {/*
          a) Mode switcher: Ask AI / Template.
          Состояния:
            null      — обе кнопки неактивны (стартовое)
            'ai'      — активна Ask AI
            'template'— активна Template
          Клик по неактивной → активирует её. Клик по активной → выключает (null).
          Активная кнопка получает синюю обводку (border-af-blue-5).
        */}
        <ModeSwitcher mode={mode} onChange={handleModeChange} />

        {/*
          Regenerate — показывается ТОЛЬКО когда активен Ask AI (mode === 'ai').
          По клику генерим 2 новых случайных AI-варианта.
        */}
        {mode === 'ai' && (
          <>
            {/*
              Цвет текста и иконок — как у .hfFP08w.GmXxLqY в оригинале:
              text-primary (gray-8 = #213752).
            */}
            <button
              type="button"
              onClick={() => {
                setAiVariantsOverride(generateReplies(2))
                setSelection({ mode: null, index: null })
              }}
              className="inline-flex h-7 min-h-7 cursor-pointer items-center justify-center gap-af-xxxs whitespace-nowrap rounded-af-lg border border-af-gray-5 bg-af-bg-primary px-af-xs text-af-md font-af-normal leading-af-sm text-af-text-primary transition-colors hover:bg-af-blue-1"
            >
              <RegenerateIcon />
              Regenerate
            </button>
            {/* AI settings — декоративная (пока без логики). */}
            <button
              type="button"
              className="inline-flex h-7 min-h-7 cursor-pointer items-center justify-center gap-af-xxxs whitespace-nowrap rounded-af-lg border border-af-gray-5 bg-af-bg-primary px-af-xs text-af-md font-af-normal leading-af-sm text-af-text-primary transition-colors hover:bg-af-blue-1"
            >
              <SettingsIcon />
              AI settings
            </button>
          </>
        )}

        {mode === 'template' && (
          <button
            type="button"
            className="inline-flex h-7 min-h-7 cursor-pointer items-center justify-center gap-af-xxxs whitespace-nowrap rounded-af-lg border border-af-gray-5 bg-af-bg-primary px-af-xs text-af-md font-af-normal leading-af-sm text-af-text-primary transition-colors hover:bg-af-blue-1"
          >
            <TemplateIcon />
            All templates
          </button>
        )}

        {/* Counter / Tone / Flag / More — скрыты */}
        {false && (
          <>
        <div className="flex items-center gap-af-xxxs">
          <CheckIcon className="text-af-green-4" />
          <span className="italic text-af-sm font-af-normal leading-af-md tracking-af-md text-af-text-tertiary">
            {draft.regenLeft}
          </span>
        </div>
        {draft.tone && <ClampButton>{draft.tone}</ClampButton>}
        {draft.flag && <ClampButton>{draft.flag}</ClampButton>}
        <button
          type="button"
          aria-label="More"
          className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-af-lg border border-af-bg-stroke bg-af-bg-primary p-0 text-af-text-link transition-colors hover:bg-af-bg-secondaryGray"
        >
          <MoreIcon />
        </button>
          </>
        )}
      </div>

      {/*
        3) Варианты ответов (под toolbar).
        Показываются ТОЛЬКО если mode выбран (ai или template).
        Список меняется в зависимости от mode: AI-варианты или Template-варианты.
        Клик → подставляет текст варианта в textarea + подсвечивает выбранную кнопку.
      */}
      {visibleVariants.length > 0 && (
        // key={mode} → React пересоздаёт блок при смене mode, и CSS-анимация
        // af-fade-in проигрывается заново. Это даёт плавное появление новых вариантов
        // при переключении Ask AI / Template.
        <div key={mode} className="af-fade-in flex w-full flex-col gap-af-xxs">
          {visibleVariants.map((variant, i) => {
            const isSelected = i === selectedVariantIndex
            const isTemplate = mode === 'template'
            const text = getVariantText(variant)
            const name = isTemplate && typeof variant === 'object' ? variant.name : null
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectVariant(i)}
                className={`flex w-full cursor-pointer flex-col gap-af-xxxs rounded-af-lg border bg-af-bg-primary p-af-xs text-left transition-[border-color,box-shadow] duration-200 ease focus-visible:outline-none ${
                  isSelected
                    ? 'border-af-blue-5 shadow-[0_0_0_3px_rgba(35,128,249,0.15)]'
                    : 'border-af-bg-stroke hover:border-af-gray-5 hover:shadow-md'
                }`}
              >
                {isTemplate ? (
                  <>
                    {/* Первая строка: иконка + название + match badge — выровнены по центру */}
                    <div className="flex w-full items-center gap-af-xxs">
                      <TemplateVariantIcon align="center" />
                      <div className="text-af-md font-af-bold leading-af-md tracking-normal text-af-text-primary">
                        {name}
                      </div>
                      {/*
                        Badge "95% matched your answer pattern" + tooltip снизу при hover.
                        Стиль badge: bg green-1, color green-4, radius-md, h 20, padding 0/6, 12/18 normal.
                        Tooltip — .bmDylA_ style (белый, radius-lg, shadow, padding 12/16, w 306).
                        Появляется снизу под бейджем со стрелкой вверх. Управляется CSS group-hover.
                      */}
                      <span className="group/match relative inline-flex">
                        <span
                          className="inline-flex h-5 shrink-0 cursor-default items-center rounded-af-md px-[6px] text-af-sm font-af-normal leading-af-sm tracking-normal text-af-green-4"
                          style={{ backgroundColor: '#eaffea' }}
                        >
                          95% matched your answer pattern
                        </span>
                        <MatchTooltip />
                      </span>
                    </div>
                    {/*
                      Текст шаблона под названием — выровнен по правому краю иконки.
                      ml = ширина иконки (16) + gap (8) = 24px.
                    */}
                    <div
                      className="ml-6 min-w-0 break-words text-af-md font-af-normal leading-af-md tracking-normal text-af-text-primary 3xl:text-af-lg 3xl:leading-af-lg"
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      {text}
                    </div>
                  </>
                ) : (
                  <div className="flex w-full items-start gap-af-xxs">
                    <SparkleVariantIcon />
                    <div
                      className="min-w-0 w-full break-words text-af-md font-af-normal leading-af-md tracking-normal text-af-text-primary 3xl:text-af-lg 3xl:leading-af-lg"
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      {text}
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* 4) Trial info — скрыто. */}
      </div>

      {/*
        Невидимая hover-зона ЗА правым краем блока. Сидит абсолютно справа от блока,
        размер 48×100% (зазор 8 + крестик 36 + запас 4). НЕ занимает место в layout
        (абсолют). При наведении на неё group-hover продолжает работать → крестик виден.
        bg-transparent — невидимая, но pointer-events-auto перехватывает мышь.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-auto absolute top-0 left-full h-full w-[48px]"
      />

      {/*
        Close (×) — абсолют ЗА правым краем блока, на той же hover-зоне.
        Размер 36×36, top 0 (по верху). ml-af-xxs (8) — тот же зазор что при sibling.

        Видимость по умолчанию: opacity 0, pointer-events: none.
        При group-hover (мышь над AI-draft ИЛИ над невидимой зоной справа)
        или group-focus-within (фокус внутри textarea/кнопок) → видим и кликабелен.
      */}
      <button
        type="button"
        aria-label="Collapse"
        onClick={() => setCollapsed(true)}
        className="pointer-events-none absolute top-0 left-full inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-r-af-md border-none bg-af-bg-secondaryWhite p-0 text-af-icon-tertiary opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 hover:text-af-icon-primary"
      >
        <CloseIcon />
      </button>
    </div>
  )
}

// MatchTooltip — popover-тултип в стиле .bmDylA_ из AppFollow CSS.
//   bg primary white, radius-lg (8), shadow, padding 12/16, font 14/20, width 306px.
//   Появляется НАД триггером (bottom: 100% + margin-bottom 8) со стрелкой ВНИЗ.
//   Плавное появление: opacity + lёгкий translateY, 200ms ease-out.
//   Всегда в DOM (не hidden/flex-toggle), управляем только opacity + visibility.
function MatchTooltip() {
  return (
    <span
      role="tooltip"
      className="pointer-events-none invisible absolute bottom-full left-0 z-10 mb-af-xxs flex w-[306px] flex-col rounded-af-lg bg-af-bg-primary px-af-sm py-af-xs text-af-md font-af-normal leading-af-md tracking-normal text-af-text-primary opacity-0 shadow-[0_4px_16px_0_rgba(11,15,20,0.12)] transition-[opacity,transform,visibility] duration-200 ease-out translate-y-1 group-hover/match:visible group-hover/match:translate-y-0 group-hover/match:opacity-100"
    >
      {/* Стрелка вниз — повёрнутый квадрат внизу popover'а, нижняя тень */}
      <span
        aria-hidden
        className="absolute -bottom-[6px] left-af-sm h-3 w-3 rotate-45 bg-af-bg-primary shadow-[1px_1px_2px_rgba(11,15,20,0.04)]"
      />
      <span className="relative">
        This template historically matches similar reviews 95% of the time —
        users typically accept it without edits.
      </span>
    </span>
  )
}

// Mode switcher (Ask AI / Template) — единый сегментный контрол.
// Кнопки склеены вплотную (без gap), но КАЖДЫЙ сегмент имеет СВОЮ обводку:
//   - активный сегмент:  border-af-blue-5 (синяя)
//   - неактивный/hover:  border-af-gray-5 (серая)
// Чтобы не было двойной обводки между сегментами, у левой кнопки скрыт right border,
// общий вертикальный divider обеспечивается border-left правой.
function ModeSwitcher({ mode, onChange }) {
  const toggle = (next) => onChange(mode === next ? null : next)
  return (
    <div className="inline-flex h-7 flex-nowrap">
      <SwitcherSegment
        active={mode === 'ai'}
        onClick={() => toggle('ai')}
        icon={<SparkleSwitchIcon />}
        position="left"
      >
        Ask AI
      </SwitcherSegment>
      <SwitcherSegment
        active={mode === 'template'}
        onClick={() => toggle('template')}
        icon={<TemplateIcon />}
        position="right"
      >
        Template
      </SwitcherSegment>
    </div>
  )
}

function SwitcherSegment({ active, onClick, icon, children, position }) {
  const radius = position === 'left' ? 'rounded-l-af-lg' : 'rounded-r-af-lg'
  const borderColor = active ? 'border-af-blue-5' : 'border-af-gray-5'
  const bg = active ? 'bg-af-blue-1' : 'bg-af-bg-primary hover:bg-af-blue-1'
  return (
    <button
      type="button"
      onClick={onClick}
      // Плавный переход border-color + background-color (300ms ease-out).
      // Активный сегмент поднимаем z-index, чтобы синяя обводка не перекрывалась
      // серой соседнего (на месте склейки).
      className={`relative inline-flex h-full cursor-pointer items-center justify-center gap-af-xxxs whitespace-nowrap border px-af-xs text-af-md font-af-normal leading-af-sm text-af-text-link transition-[background-color,border-color] duration-300 ease-out ${radius} ${borderColor} ${bg} ${
        position === 'right' ? '-ml-px' : ''
      } ${active ? 'z-[1]' : ''}`}
    >
      {icon}
      {children}
    </button>
  )
}

// Placeholder иконка для Ask AI (sparkle-like). Позже заменим на финальную.
function SparkleSwitchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2zM18.5 14l.9 2.6L22 17.5l-2.6.9-.9 2.6-.9-2.6L15 17.5l2.6-.9.9-2.6z"
      />
    </svg>
  )
}

// Placeholder иконка для Template (document-like). Позже заменим на финальную.
function TemplateIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  )
}

// Иконка варианта Template — document-style.
// align="center" → без mt (для выравнивания по центру с названием).
// align="start" (default) → mt-[2px] для выравнивания с первой строкой 14/20 текста.
function TemplateVariantIcon({ align = 'start' }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`block h-4 w-4 min-w-4 shrink-0 overflow-hidden text-af-icon-tertiary ${
        align === 'center' ? '' : 'mt-[2px]'
      }`}
      aria-hidden
    >
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  )
}

// .BsdN04N — селектор тона/флага.
// max-w 20%, line-clamp 1 (через -webkit-box), color inherit, white-space normal.
// .ucE4oQl + .wEOj6nq + .CsgOPCt стандартные.
function ClampButton({ children }) {
  return (
    <button
      type="button"
      className="inline-flex h-7 min-h-7 cursor-pointer items-center justify-center overflow-hidden whitespace-normal rounded-af-lg border border-af-bg-stroke bg-af-bg-primary px-af-sm text-af-md font-af-normal leading-af-sm text-af-text-link transition-colors hover:bg-af-bg-secondaryGray"
      style={{
        maxWidth: '20%',
        minWidth: 'auto',
        WebkitLineClamp: 1,
        WebkitBoxOrient: 'vertical',
        display: '-webkit-box',
      }}
    >
      <span className="text-af-md font-af-normal leading-af-md tracking-af-sm text-af-text-primary">
        {children}
      </span>
    </button>
  )
}

// === SVG icons (real path data from DOM) ===

// svg 0 — Close (X) 16×16, currentColor
function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M4.28607 4.28571C4.99615 3.57563 6.14741 3.57563 6.85749 4.28571L19.7146 17.1428C20.4247 17.8529 20.4247 19.0041 19.7146 19.7142C19.0045 20.4243 17.8532 20.4243 17.1432 19.7142L4.28607 6.85713C3.57599 6.14705 3.57599 4.99579 4.28607 4.28571Z"
      />
      <path
        fill="currentColor"
        d="M19.7145 4.28579C20.4246 4.99587 20.4246 6.14713 19.7145 6.85721L6.85744 19.7143C6.14736 20.4244 4.9961 20.4244 4.28602 19.7143C3.57594 19.0042 3.57594 17.853 4.28602 17.1429L17.1431 4.28579C17.8532 3.57572 19.0045 3.57572 19.7145 4.28579Z"
      />
    </svg>
  )
}

// svg 1 — Regenerate (refresh-arrow), 16×16 mr 4 (.Fm40eTW)
function RegenerateIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-af-xxxs" aria-hidden>
      <path
        fill="currentColor"
        d="M4.8001 2.39999C5.11836 2.39999 5.42358 2.52642 5.64863 2.75147C5.87367 2.97651 6.0001 3.28173 6.0001 3.59999V6.12119C6.99855 5.10272 8.23981 4.35516 9.60699 3.94893C10.9742 3.5427 12.4222 3.49118 13.8148 3.7992C15.2074 4.10722 16.4987 4.76466 17.567 5.70959C18.6353 6.65452 19.4455 7.85584 19.9213 9.20039C19.979 9.3501 20.0061 9.50987 20.001 9.67024C19.9959 9.83061 19.9587 9.98833 19.8916 10.1341C19.8245 10.2798 19.7288 10.4106 19.6103 10.5187C19.4917 10.6268 19.3527 10.7101 19.2014 10.7635C19.0501 10.817 18.8896 10.8396 18.7295 10.8299C18.5693 10.8203 18.4127 10.7786 18.2689 10.7074C18.1252 10.6361 17.9971 10.5368 17.8924 10.4152C17.7877 10.2937 17.7084 10.1523 17.6593 9.99959C17.2971 8.97577 16.6638 8.06941 15.8271 7.37709C14.9904 6.68476 13.9815 6.23242 12.908 6.06825C11.8344 5.90409 10.7365 6.03425 9.73109 6.44488C8.7257 6.85551 7.85055 7.53122 7.1989 8.39999H10.8001C11.1184 8.39999 11.4236 8.52642 11.6486 8.75147C11.8737 8.97651 12.0001 9.28173 12.0001 9.59999C12.0001 9.91825 11.8737 10.2235 11.6486 10.4485C11.4236 10.6736 11.1184 10.8 10.8001 10.8H4.8001C4.48184 10.8 4.17661 10.6736 3.95157 10.4485C3.72653 10.2235 3.6001 9.91825 3.6001 9.59999V3.59999C3.6001 3.28173 3.72653 2.97651 3.95157 2.75147C4.17661 2.52642 4.48184 2.39999 4.8001 2.39999ZM4.8097 13.2684C4.9583 13.2159 5.11579 13.1932 5.27316 13.2016C5.43054 13.21 5.58473 13.2493 5.72691 13.3172C5.8691 13.3852 5.99651 13.4805 6.10186 13.5977C6.2072 13.715 6.28843 13.8518 6.3409 14.0004C6.70313 15.0242 7.33635 15.9306 8.17308 16.6229C9.00981 17.3152 10.0187 17.7676 11.0922 17.9317C12.1658 18.0959 13.2637 17.9657 14.2691 17.5551C15.2745 17.1445 16.1496 16.4688 16.8013 15.6H13.2001C12.8818 15.6 12.5766 15.4736 12.3516 15.2485C12.1265 15.0235 12.0001 14.7183 12.0001 14.4C12.0001 14.0817 12.1265 13.7765 12.3516 13.5515C12.5766 13.3264 12.8818 13.2 13.2001 13.2H19.2001C19.5184 13.2 19.8236 13.3264 20.0486 13.5515C20.2737 13.7765 20.4001 14.0817 20.4001 14.4V20.4C20.4001 20.7183 20.2737 21.0235 20.0486 21.2485C19.8236 21.4736 19.5184 21.6 19.2001 21.6C18.8818 21.6 18.5766 21.4736 18.3516 21.2485C18.1265 21.0235 18.0001 20.7183 18.0001 20.4V17.8788C17.0016 18.8973 15.7604 19.6448 14.3932 20.0511C13.026 20.4573 11.578 20.5088 10.1854 20.2008C8.79277 19.8928 7.5015 19.2353 6.43319 18.2904C5.36487 17.3455 4.55467 16.1441 4.0789 14.7996C4.02641 14.651 4.00371 14.4935 4.01209 14.3361C4.02047 14.1787 4.05977 14.0246 4.12774 13.8824C4.19572 13.7402 4.29104 13.6128 4.40825 13.5074C4.52547 13.4021 4.66229 13.3209 4.8109 13.2684H4.8097Z"
      />
    </svg>
  )
}

// svg 2 — ChevronDown 16×16 (refresh-кнопка use)
function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M5.95285 10H18.0466C18.4528 10 18.7341 10.2031 18.8903 10.6094C19.0466 10.9844 18.9841 11.3125 18.7028 11.5938L12.656 17.6406C12.4685 17.8281 12.2497 17.9219 11.9997 17.9219C11.7497 17.9219 11.531 17.8281 11.3435 17.6406L5.2966 11.5938C5.01535 11.3125 4.95285 10.9844 5.1091 10.6094C5.26535 10.2031 5.5466 10 5.95285 10Z"
      />
    </svg>
  )
}

// svg 3 — Check 16×16 .I6oLbw8 (color accent-positive = green-4)
function CheckIcon({ className = '' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M20.0484 6.35159C20.2734 6.57662 20.3997 6.88179 20.3997 7.19999C20.3997 7.51819 20.2734 7.82335 20.0484 8.04839L10.4484 17.6484C10.2234 17.8734 9.9182 17.9997 9.6 17.9997C9.2818 17.9997 8.97663 17.8734 8.7516 17.6484L3.9516 12.8484C3.73301 12.6221 3.61206 12.3189 3.61479 12.0043C3.61753 11.6897 3.74373 11.3887 3.96622 11.1662C4.18871 10.9437 4.48968 10.8175 4.80432 10.8148C5.11896 10.812 5.42208 10.933 5.6484 11.1516L9.6 15.1032L18.3516 6.35159C18.5766 6.12662 18.8818 6.00024 19.2 6.00024C19.5182 6.00024 19.8234 6.12662 20.0484 6.35159Z"
      />
    </svg>
  )
}

// svg 4 — More (horizontal dots) 16×16
function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M7.1999 12C7.1999 12.6365 6.94705 13.247 6.49696 13.697C6.04687 14.1471 5.43642 14.4 4.7999 14.4C4.16338 14.4 3.55293 14.1471 3.10285 13.697C2.65276 13.247 2.3999 12.6365 2.3999 12C2.3999 11.3635 2.65276 10.753 3.10285 10.3029C3.55293 9.85285 4.16338 9.59999 4.7999 9.59999C5.43642 9.59999 6.04687 9.85285 6.49696 10.3029C6.94705 10.753 7.1999 11.3635 7.1999 12ZM14.3999 12C14.3999 12.6365 14.147 13.247 13.697 13.697C13.2469 14.1471 12.6364 14.4 11.9999 14.4C11.3634 14.4 10.7529 14.1471 10.3028 13.697C9.85276 13.247 9.5999 12.6365 9.5999 12C9.5999 11.3635 9.85276 10.753 10.3028 10.3029C10.7529 9.85285 11.3634 9.59999 11.9999 9.59999C12.6364 9.59999 13.2469 9.85285 13.697 10.3029C14.147 10.753 14.3999 11.3635 14.3999 12ZM19.1999 14.4C19.8364 14.4 20.4469 14.1471 20.897 13.697C21.347 13.247 21.5999 12.6365 21.5999 12C21.5999 11.3635 21.347 10.753 20.897 10.3029C20.4469 9.85285 19.8364 9.59999 19.1999 9.59999C18.5634 9.59999 17.9529 9.85285 17.5028 10.3029C17.0528 10.753 16.7999 11.3635 16.7999 12C16.7999 12.6365 17.0528 13.247 17.5028 13.697C17.9529 14.1471 18.5634 14.4 19.1999 14.4Z"
      />
    </svg>
  )
}

// Settings (gear) — 16×16 currentColor. Placeholder для AI settings кнопки.
function SettingsIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 4.27 16.6l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

// Clear (trash-can) — 16×16 currentColor
function ClearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  )
}

// svg 5/6 — Sparkle 16×16 (color icon-tertiary, flex-shrink 0, mt 2)
function SparkleVariantIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="mt-[2px] block h-4 w-4 min-w-4 shrink-0 overflow-hidden text-af-icon-tertiary"
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
