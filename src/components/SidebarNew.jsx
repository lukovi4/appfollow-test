import { useState, useEffect, useRef } from 'react'

// Новый sidebar с draggable-ползунком справа.
// При drag на разделитель меняется CSS-переменная `--sidebar-width` на root
// (через document.documentElement.style), которой пользуется layout сцены.
//
// Параметры:
//   default width: 275px (как combined narrow+wide оригинала)
//   min/max:       180 ... 600px
//
// Сохранение: localStorage ключ "af-sidebar-w".
const DEFAULT_W = 500
const MIN_W = 400
const MAX_W = 800

export default function SidebarNew({ currentPage = 'reviews', onNavigate }) {
  // Стартовая ширина всегда 500. Сохранение в localStorage отключено
  // (раньше восстанавливалось из ключа af-sidebar-w).
  const [width, setWidth] = useState(DEFAULT_W)

  // При изменении width — обновляем CSS-переменную.
  useEffect(() => {
    document.documentElement.style.setProperty('--af-sidebar-w', `${width}px`)
  }, [width])

  const draggingRef = useRef(false)

  // Начало drag — навешиваем глобальные mousemove/mouseup.
  const onPointerDown = (e) => {
    e.preventDefault()
    draggingRef.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    const onMove = (ev) => {
      if (!draggingRef.current) return
      const x = ev.clientX
      const next = Math.min(MAX_W, Math.max(MIN_W, x))
      setWidth(next)
    }
    const onUp = () => {
      draggingRef.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  // Двойной клик по разделителю — сброс на default.
  const onDoubleClick = () => setWidth(DEFAULT_W)

  return (
    <div
      className="sticky top-0 flex h-screen shrink-0"
      style={{ width: `${width}px` }}
    >
      <div className="flex h-full w-full flex-col gap-af-xs overflow-y-auto border-r border-af-bg-stroke bg-af-bg-primary p-af-lg text-left">
        {/* Навигация между сценами прототипа */}
        <nav className="flex flex-col gap-af-xxs">
          <NavLink
            label="Reviews feed"
            active={currentPage === 'reviews'}
            onClick={() => onNavigate?.('reviews')}
          />
          <NavLink
            label="Add automation"
            active={currentPage === 'automation'}
            onClick={() => onNavigate?.('automation')}
          />
        </nav>

        {/* Контекст для текущей сцены:
            - Reviews feed → DescriptionNotes (заметки из description.md).
            - Add automation → AutomationNotes (заглушка под отдельный текст). */}
        {currentPage === 'reviews' ? (
          <DescriptionNotes currentPage={currentPage} onNavigate={onNavigate} />
        ) : (
          <AutomationNotes />
        )}

        <div className="mt-auto pt-af-xs text-af-sm text-af-text-tertiary">{width}px</div>
      </div>

      {/*
        Разделитель — узкая полоска 4px на правой границе sidebar.
        cursor: col-resize, hover/active меняет цвет.
        Висит абсолютно поверх границы, чтобы попадать в неё мышью было комфортно.
      */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
        tabIndex={0}
        onMouseDown={onPointerDown}
        onDoubleClick={onDoubleClick}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setWidth((w) => Math.max(MIN_W, w - 16))
          if (e.key === 'ArrowRight') setWidth((w) => Math.min(MAX_W, w + 16))
        }}
        className="absolute right-[-2px] top-0 z-10 h-full w-1 cursor-col-resize bg-transparent transition-colors hover:bg-af-blue-3 active:bg-af-blue-5"
        title="Drag to resize. Double-click to reset."
      />
    </div>
  )
}

// Заметки по странице Add automation (из add_automation.md).
// Стиль 1-в-1 с DescriptionNotes: 15px primary (#213752), межстрочный 140%,
// аккордеоны с жирными заголовками.
function AutomationNotes() {
  return (
    <div className="flex flex-col gap-af-xxs pt-af-md">
      <AccordionSection title="Problems with the current Add automation flow" defaultOpen>
        <P>
          If we talk specifically about the Add automation page, I see several
          problems in the current flow.
        </P>
        <P>
          First, as a user, I do not clearly understand why I should automate
          this specific rule. There is a message like "About 100% of reviews
          from the last 14 days meet the selected conditions," but it feels
          hidden and not strong enough. This should be one of the main things
          on the page, because it explains the potential value and can catch
          the user's attention.
        </P>
        <P>
          Second, the setup is still quite technical. Users need to work with
          "if / then" logic, conditions, and actions. For experienced users
          this may be okay, but for non-technical users it can feel
          complicated. They need to combine many rules in their head and
          understand what exactly will happen after activation.
        </P>
        <P>
          Third, Approval mode is a very strong trust-building feature, but
          right now it is switched off and feels secondary. In my opinion, it
          should work as a safety signal: "You can try automation without
          risk, because nothing will be sent without your approval."
        </P>
      </AccordionSection>

      <AccordionSection title="AI assistant chat as a translation layer">
        <P>
          So I would try to transform the complex Conditions / Actions setup
          into a more human-readable experience through an AI assistant chat.
        </P>
        <P>
          The structured settings should still stay on the page. Conditions
          and Actions are important because they keep the logic transparent
          and give advanced users full control. But they should move to the
          second layer.
        </P>
        <P>
          The AI assistant would work as a translation layer between human
          language and structured conditions. The system already detects a
          pattern, pre-fills the conditions, and then explains this pattern in
          a human way through the chat. If the user writes something like
          "exclude refund requests" or "make it only for English reviews," the
          assistant updates the Conditions / Actions automatically.
        </P>
        <P>
          At the same time, every change should be visible in the structured
          settings. So the AI does not hide the logic. It helps users
          configure the rule faster, but the user can still check and edit
          everything manually.
        </P>
        <P>
          This can make the page easier to understand for non-technical users,
          while still keeping the full rule builder for advanced users.
        </P>
      </AccordionSection>

      <AccordionSection title="Focus on why to activate automation">
        <P>
          The second important change is to focus much more on why the user
          should activate this automation.
        </P>
        <P>The page should clearly show:</P>
        <Ul>
          <Li>how many reviews this pattern can cover;</Li>
          <Li>how much time it can save;</Li>
          <Li>why this pattern is safe enough to try;</Li>
          <Li>and that Approval mode keeps the user in control.</Li>
        </Ul>
        <P>
          So the page should not feel like "configure this rule and publish
          it." It should feel more like:
        </P>
        <Blockquote>
          "We found a repeated pattern. It can save you time and cover more
          reviews. You can safely test it in Approval mode first."
        </Blockquote>
      </AccordionSection>

      <AccordionSection title="Templates first, AI replies later">
        <P>
          Also, I would rely more on automation through templates first, not
          full AI-generated replies right away.
        </P>
        <P>
          As I mentioned before, I think many users may still have low trust
          in AI systems. A fully AI-generated reply can feel more risky,
          because the user does not know exactly what the system will write.
          A template is simpler and more predictable. The user can read it,
          approve it, and understand what kind of reply will be used.
        </P>
        <P>
          So for the first automation experience, I would make AI more of a
          helper, not the main actor. AI can help detect the pattern, explain
          it in human language, suggest conditions, and help create or improve
          the template. But the actual automation candidate can start from a
          clear approved template.
        </P>
        <P>This makes the experience feel safer:</P>
        <Blockquote>
          "AI helps me set this up, but I still control the final reply."
        </Blockquote>
        <P>
          Only later, when the user sees that the system matches the right
          reviews and templates work well, it becomes easier to introduce
          AI-generated drafts for more complex cases.
        </P>
      </AccordionSection>
    </div>
  )
}

// Заметки по тестовому заданию (из description.md).
// Базовый текст 15px primary (#213752), межстрочный 140%,
// порядок и формулировки сохранены 1-в-1 с документом.
// currentPage / onNavigate — для якорной ссылки "test it" на первый отзыв.
function DescriptionNotes({ currentPage, onNavigate }) {
  // Скроллим к карточке #review-{id}, мигаем её фоном 1.5 сек.
  // Если активна Add automation — сначала переключаемся на Reviews feed.
  const scrollToReview = (reviewId) => (e) => {
    e.preventDefault()
    const run = () => {
      const el = document.getElementById(`review-${reviewId}`)
      if (!el) return
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      el.classList.remove('af-review-pulse')
      // Reflow, чтобы анимация запустилась повторно при повторных кликах.
      void el.offsetWidth
      el.classList.add('af-review-pulse')
      setTimeout(() => el.classList.remove('af-review-pulse'), 1600)
    }
    if (currentPage !== 'reviews') {
      onNavigate?.('reviews')
      setTimeout(run, 60)
    } else {
      run()
    }
  }
  return (
    <div className="flex flex-col gap-af-xxs pt-af-md">
      <AccordionSection
        title="I made a short audit of the current system and defined several assumptions/observations about the product context:"
        defaultOpen
      >
        <Ul>
          <Li>
            Full AI automation is available for premium users, so this flow is
            not mainly about direct subscription conversion. It is more about
            premium value realization: helping users experience the scalable
            workflow they already pay for.
          </Li>
          <Li>
            AppFollow already has many AI and automation capabilities, but
            users still need to manually configure, understand, and launch
            them.
          </Li>
          <Li>
            The product explains the general value of AI automation through
            articles and external success stories, but I did not see clear
            product-level evidence of how automation would help me
            specifically.
          </Li>
          <Li>
            Since AppFollow wants to push automation and AI adoption, I assume
            the company already has a strong enough AI/automation system under
            the hood to promote wider usage.
          </Li>
          <Li>
            The core value of automation is to significantly speed up clients'
            workflow and increase reply coverage, if the system works
            correctly and safely.
          </Li>
        </Ul>
      </AccordionSection>

      <AccordionSection title="Based on these assumptions, I formed several hypotheses about why users may not activate automation:">
        <Ul>
          <Li>
            Users may not trust automation enough to delegate replies on
            behalf of the company. The main concern is brand reputation: what
            if AI writes something inappropriate, incorrect, or not aligned
            with the brand, and the user misses it?
          </Li>
          <Li>
            AI automation has a higher trust barrier than template automation.
            Templates are predictable in output but risky in targeting. AI
            replies are risky in both targeting and generation.
          </Li>
          <Li>
            Users may not clearly understand the value of activating
            automation for their own workflow. The product does not clearly
            show expected time savings or increased review coverage for a
            specific automation candidate.
          </Li>
          <Li>
            The automation setup may feel too rule-first and complex for
            non-technical users. I do not know exactly who replies to reviews,
            but I assume they are non-technical users. Users are asked to
            understand "if this, then that" logic, while they may naturally
            think in repeated review situations, such as "positive reviews
            about ease of use" or "users asking about cancellation."
          </Li>
        </Ul>
      </AccordionSection>

      <AccordionSection title="My core idea: automation should not be pushed. It should be earned through approval-based learning.">
        <P>
          Automation should show value through expected time savings and
          increased review coverage. It also should show pattern confidence
          based on real user behavior, so users can understand why the system
          can be trusted for a specific type of review.
        </P>
        <P>
          I do not know exactly how the current prefill logic works, but based
          on the current visible setup, it seems to rely mostly on basic
          conditions. This may be too generic for safe automation. For
          example, a 5-star review can still contain a refund request, a bug
          report, or a question.
        </P>
        <P>
          I think the system should first help users reply faster in Approval
          mode, learn from their actions, detect repeated review-response
          patterns, group them into pattern candidates, and only then suggest
          automation candidates that are already proven by real user
          behavior. These candidates should not be generic rules. They should
          be specific, human-readable patterns with clear boundaries.
        </P>
        <P>
          Based on this idea, I would suggest trying a different approach.
          AppFollow already has Approval mode, and in my solution it becomes
          the main trust-building mechanism.
        </P>
        <P>
          Right now, Approval mode is switched off by default. Users use AI
          and templates manually, and only when the product pushes them to
          the automation page can they switch it on for one exact rule.
        </P>
        <P>
          I suggest making Approval mode the default safe layer for suggested
          replies and pattern learning. The system should prepare replies
          only when it is helpful, keep risky cases manual, and learn from
          every approval, edit, rejection, and wrong match. Of course, users
          should allow this first.
        </P>
      </AccordionSection>

      <AccordionSection title="How it could work:">
        <Ol>
          <Li>
            Users see a short explanation of what will happen and why it is
            safe enough to try: nothing will be sent automatically until they
            approve it.
          </Li>
          <Li>
            If users allow it, the system starts preparing reply suggestions
            where it has enough confidence. At the same time, it collects and
            groups repeated review-response patterns and can create template
            candidates.
          </Li>
          <Li>
            I see three main behaviors:
            <NestedList>
              <Li>
                <Strong>AI draft suggested.</Strong> The system does not have
                enough information about a repeated pattern yet, so it
                prepares an AI draft for approval.{' '}
                <a
                  href="#review-r2"
                  onClick={scrollToReview('r2')}
                  className="cursor-pointer font-af-bold text-af-text-link underline-offset-2 hover:underline"
                >
                  Test it
                </a>
                .
              </Li>
              <Li>
                <Strong>Template suggested.</Strong> The system already has
                enough information about a repeated pattern and can suggest
                a template candidate. When a new review matches this pattern,
                the system shows the template suggestion.{' '}
                <a
                  href="#review-r3"
                  onClick={scrollToReview('r3')}
                  className="cursor-pointer font-af-bold text-af-text-link underline-offset-2 hover:underline"
                >
                  Test it
                </a>
                .
              </Li>
              <Li>
                <Strong>Manual review recommended.</Strong> For high-risk,
                sensitive, or unclear reviews, the system should not show any
                prefilled reply by default.
              </Li>
            </NestedList>
          </Li>
          <Li>
            This also makes it possible to collect statistics about how well
            specific patterns work. These actions update pattern confidence,
            not generic AI confidence.
          </Li>
        </Ol>
      </AccordionSection>

      <AccordionSection title="I would separate four user behavior signals:">
        <Ul>
          <Li>
            User applies AI/template suggestion without any modification —
            strong positive signal.
          </Li>
          <Li>
            User makes slight modifications, but the meaning stays the same —
            positive signal.
          </Li>
          <Li>
            User makes serious modifications or rewrites a large part of the
            reply — weak or negative signal for automation readiness.
          </Li>
          <Li>
            User fully deletes the suggestion and writes a new reply —
            negative signal.
          </Li>
        </Ul>
        <P>
          If suggestions become more accurate over time, users should need
          fewer edits. This can increase confidence in specific patterns and
          make AI/automation feel safer.
        </P>
      </AccordionSection>

      <AccordionSection title="Now let's talk about the main value of automation: time savings and increased review coverage.">
        <P>
          To make automation adoption stronger, the product should not only
          ask users to trust automation, but also prove its value in their
          own workflow.
        </P>
        <P>
          One of the main values of automation is time savings. To make this
          value visible, the system should measure how much time users spend
          replying manually (
          <a
            href="#review-r1"
            onClick={scrollToReview('r1')}
            className="cursor-pointer font-af-bold text-af-text-link underline-offset-2 hover:underline"
          >
            test it
          </a>
          ), and then compare it with the time spent approving prepared
          replies.
        </P>
        <P>
          For example, the system can track how long it usually takes a user
          to write and send a reply manually. Then, when the user starts
          approving suggested AI/template replies, AppFollow can compare
          both numbers and show the real impact:
        </P>
        <Blockquote>
          "You usually spend 1 min 20 sec replying manually. With prepared
          replies, approval takes around 15 sec."
        </Blockquote>
        <P>
          This can help users understand not just that automation is useful
          in general, but how much time it saves in their own workflow.
        </P>
      </AccordionSection>

      <AccordionSection title="Summary.">
        <P>
          I do not think the main problem is only the interface. Most likely,
          it is a trust problem.
        </P>
        <P>
          From my point of view, the best direction is to gradually build
          this trust with users and show them the real value of using
          automation in their own workflow.
        </P>
        <P>
          In the end, the goal is to make users want to automate some
          repeated patterns themselves. The product should not force this
          decision, but gently guide users with contextual reminders when the
          system has enough evidence that a pattern is safe and valuable.
        </P>
        <P>
          There are still many ideas around this direction, but
          unfortunately, I do not have enough time to fully think through and
          design all of them now. I would be happy to discuss them in more
          detail during the interview call.
        </P>
      </AccordionSection>
    </div>
  )
}

// Аккордеон-секция: заголовок + сворачиваемое содержимое.
// Состояние локально, по умолчанию закрыта (если не передано defaultOpen).
// Иконка chevron-вниз — реальный path из AppFollow .Y53kl4i.SgZiABU.
function AccordionSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="flex flex-col border-b border-af-bg-stroke pb-af-xs last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="m-0 flex w-full cursor-pointer items-start justify-between gap-af-xs border-0 bg-transparent py-af-xs text-left outline-none"
      >
        <span className="text-[15px] font-af-bold leading-[1.4] tracking-af-sm text-[#213752]">
          {title}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
          className={`mt-[2px] shrink-0 text-af-text-secondary transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        >
          <path d="M5.95285 10H18.0466C18.4528 10 18.7341 10.2031 18.8903 10.6094C19.0466 10.9844 18.9841 11.3125 18.7028 11.5938L12.656 17.6406C12.4685 17.8281 12.2497 17.9219 11.9997 17.9219C11.7497 17.9219 11.531 17.8281 11.3435 17.6406L5.2966 11.5938C5.01535 11.3125 4.95285 10.9844 5.1091 10.6094C5.26535 10.2031 5.5466 10 5.95285 10Z" />
        </svg>
      </button>
      {/* Плавное раскрытие через grid-template-rows trick:
          0fr → 1fr с overflow hidden даёт анимируемую высоту "auto". */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-af-xs pt-af-xxs">{children}</div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Хелперы оформления — всё на токенах AppFollow, размер базового текста 14.
// =============================================================================
function P({ children, className = '', bold = false }) {
  return (
    <p
      className={`m-0 text-[15px] leading-[1.4] tracking-af-sm text-[#213752] ${
        bold ? 'font-af-bold' : 'font-af-normal'
      } ${className}`}
    >
      {children}
    </p>
  )
}

function Strong({ children }) {
  return (
    <strong className="font-af-bold text-af-text-primary">{children}</strong>
  )
}

function Ul({ children }) {
  return (
    <ul className="m-0 flex list-disc flex-col gap-af-xxs pl-af-md text-[15px] font-af-normal leading-[1.4] tracking-af-sm text-[#213752] marker:text-af-text-tertiary">
      {children}
    </ul>
  )
}

function Ol({ children }) {
  return (
    <ol className="m-0 flex list-decimal flex-col gap-af-xs pl-af-md text-[15px] font-af-normal leading-[1.4] tracking-af-sm text-[#213752] marker:font-af-bold marker:text-af-text-primary">
      {children}
    </ol>
  )
}

// Вложенный буллет внутри Ol-пункта (как нумерованный пункт 3 с дочерними a/b/c).
function NestedList({ children }) {
  return (
    <ul className="mt-af-xxs flex list-[lower-alpha] flex-col gap-af-xxs pl-af-md text-[15px] font-af-normal leading-[1.4] tracking-af-sm text-[#213752] marker:text-af-text-tertiary">
      {children}
    </ul>
  )
}

function Li({ children }) {
  return <li className="leading-[1.4] [&>p]:m-0">{children}</li>
}

// Курсивная цитата (как пример "You usually spend 1 min 20 sec…").
function Blockquote({ children }) {
  return (
    <blockquote className="m-0 border-l-2 border-af-bg-strokeDark pl-af-xs text-[15px] font-af-normal italic leading-[1.4] tracking-af-sm text-[#213752]">
      {children}
    </blockquote>
  )
}

function NavLink({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 cursor-pointer items-center rounded-af-lg border-none px-af-xs text-left text-af-md font-af-normal leading-[1.4] tracking-af-sm transition-colors ${
        active
          ? 'bg-af-blue-1 text-af-text-link'
          : 'bg-transparent text-af-text-primary hover:bg-af-bg-secondaryWhite'
      }`}
    >
      {label}
    </button>
  )
}
