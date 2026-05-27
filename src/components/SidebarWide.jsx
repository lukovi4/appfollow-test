import { useState } from 'react'
import { IconChevronDown, IconSearch, IconSparkle, IconHelp } from './icons.jsx'

// .U3LNHaQ.xVuhqDn — широкий сайдбар, 215px. По умолчанию opacity-0 visibility-hidden.
//   .ikCKXGw.I6O7lhh — workspace switcher header
//   .wRZeIT_ — поиск
//   .YvxayA1 — секция с My apps + группами (padding 16 24, gap 20)
//     .x79QBX6.E5qAy5r — My apps row (a + span с числом)
//     .Yj8mLAT.STSZDGy — раскрытая группа
//       button.PKGJkOV — заголовок группы
//       ul.KvPTcxn[.WdWGGIh] — список (max-height 0→1000px при раскрытии)
//         li.bZHhHAl — пункт
//           a.ef_aTrn.erCN1DH[.iptplHJ] — ссылка (активная — фон control-focused)
//             span.zidRMzB — текст
//   .f0STdEI — профиль внизу
//     .Foce6oO.XsqCN7F — имя + email
//     .rJLHWwg — flex-wrap для имени (несколько span'ов)
//     .yxIcIdf — Free plan + Start trial pill

const groups = [
  {
    title: 'Manage reviews',
    open: true,
    items: [
      { label: 'Reviews feed', active: true },
      { label: 'Automation hub', badge: 'AI' },
      { label: 'Reply kit' },
    ],
  },
  {
    title: 'Monitor dashboards',
    open: true,
    items: [
      { label: 'Rating analysis' },
      { label: 'Reviews analysis' },
      { label: 'Tags analysis' },
      { label: 'Agent performance' },
      { label: 'Automation performance' },
    ],
  },
  {
    title: 'Get insights',
    open: true,
    items: [
      { label: 'Exec report' },
      { label: 'Benchmark report' },
      { label: 'Semantic analysis' },
      { label: 'Phrase analysis' },
    ],
  },
]

export default function SidebarWide({ visible = false }) {
  // Внутреннее состояние: какие группы раскрыты
  const [openGroups, setOpenGroups] = useState(() =>
    Object.fromEntries(groups.map((g) => [g.title, g.open])),
  )

  return (
    <div
      className={`flex h-screen w-af-sidebar-wide min-w-af-sidebar-wide flex-col border-r border-af-bg-stroke bg-af-bg-primary pb-af-lg pt-af-xxxs transition-[opacity,visibility] duration-300 ${
        visible ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
    >
      {/* Workspace switcher (.ikCKXGw.I6O7lhh) */}
      <div className="mb-af-xxxs flex min-w-0 items-center px-af-sm pt-af-xs">
        <button className="flex w-full items-center gap-af-xxs text-af-md font-af-bold text-af-text-primary">
          <span className="flex h-5 w-5 items-center justify-center rounded-af-sm bg-af-blue-1 text-[10px] font-af-bold text-af-blue-5">
            M
          </span>
          <span className="truncate">My first workspace</span>
          <IconChevronDown className="ml-auto text-af-icon-tertiary" />
        </button>
      </div>

      {/* Поиск (.wRZeIT_) */}
      <div className="relative flex w-full cursor-pointer items-center justify-center px-af-xs py-af-xxs">
        <div className="flex w-full items-center gap-af-xxs rounded-af-lg border border-af-gray-5 bg-af-bg-primary px-af-xs">
          <IconSearch className="text-af-icon-tertiary" />
          <input
            placeholder="Search"
            className="h-af-input-sm w-full bg-transparent text-af-md text-af-text-primary placeholder:text-af-text-tertiary focus:outline-none"
          />
        </div>
      </div>

      {/* Секция меню (.YvxayA1: padding 16 24, gap 20) */}
      <nav className="flex flex-1 flex-col gap-af-md overflow-y-auto px-af-lg py-af-sm">
        {/* My apps (.x79QBX6.E5qAy5r) */}
        <div className="flex w-full max-w-full items-center justify-between">
          <a className="text-af-md font-af-bold text-af-text-primary hover:text-af-text-link" href="#">
            My apps
          </a>
          <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-af-md bg-af-bg-secondaryGray px-af-xxxs text-af-sm font-af-bold text-af-text-primary">
            1
          </span>
        </div>

        {/* Группы */}
        {groups.map((g) => {
          const isOpen = openGroups[g.title]
          return (
            <div key={g.title} className="mb-af-xxs flex flex-col">
              {/* Заголовок группы — .PKGJkOV */}
              <button
                onClick={() =>
                  setOpenGroups((s) => ({ ...s, [g.title]: !s[g.title] }))
                }
                className="flex items-center justify-between rounded-af-md p-af-xxxs text-left text-af-md font-af-bold text-af-text-primary transition-colors hover:bg-af-bg-secondaryWhite"
              >
                <span>{g.title}</span>
                <IconChevronDown
                  className={`text-af-icon-tertiary transition-transform ${
                    isOpen ? '' : '-rotate-90'
                  }`}
                />
              </button>

              {/* Список (.KvPTcxn) — анимируется через max-height */}
              <ul
                className={`m-0 list-none overflow-hidden p-0 transition-[max-height,opacity] duration-300 ${
                  isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                {g.items.map((item) => (
                  <li key={item.label} className="mt-af-xxs">
                    <a
                      href="#"
                      className={`flex items-center rounded-af-lg py-af-xxxs pl-af-lg pr-af-xxxs text-af-md transition-colors ${
                        item.active
                          ? 'bg-af-blue-1 font-af-bold text-af-text-primary'
                          : 'text-af-text-primary hover:bg-af-bg-secondaryWhite'
                      }`}
                    >
                      <span className="mr-af-xxs flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className="inline-flex items-center gap-af-xxxs rounded-af-sm bg-af-purple-1 px-af-xxs text-af-xs font-af-bold text-af-purple-7">
                          <IconSparkle width={10} height={10} />
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </nav>

      {/* Профиль (.f0STdEI) */}
      <div className="flex flex-col px-af-xxs pt-af-xxs">
        <div className="mb-af-xs flex max-w-full select-text flex-col items-start">
          <div className="flex w-full flex-wrap">
            <a className="max-w-full text-af-md font-af-bold text-af-text-primary" href="#">
              Evgeny
            </a>
            <span>&nbsp;</span>
            <a className="max-w-full text-af-md font-af-bold text-af-text-primary" href="#">
              Berezouski
            </a>
          </div>
          <span className="text-af-sm text-af-text-secondary">lukovich.jenya@gmail.com</span>
        </div>

        {/* Free plan + Start trial */}
        <div className="flex items-center justify-between rounded-af-lg bg-af-bg-secondaryWhite p-af-xxs">
          <span className="text-af-md font-af-bold text-af-text-primary">Free plan</span>
          <button className="rounded-af-md bg-af-paid px-af-xs py-af-xxxs text-af-sm font-af-bold text-af-text-white transition-[background-image] hover:bg-af-paid-hover">
            Start trial
          </button>
        </div>
      </div>
    </div>
  )
}
