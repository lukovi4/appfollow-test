import { useState } from 'react'
import TabbedSection from './TabbedSection.jsx'

// Главная секция табов: All reviews / Featured / Reviews to report / No replies / Pending replies.
// Actions справа: New / Manage.
//
// Финальный каскад для button.ucE4oQl.tAO3CWr.CsgOPCt.Pqk3iGi.m4ZwGqv.SYzkmtj:
//   .ucE4oQl    → bg primary, border-sm blue-6, radius-lg, color blue-5, BOLD 14, line 18
//   .tAO3CWr    → min-height 36
//   .CsgOPCt    → bg primary, border-color gray-3, color blue-5
//   .Pqk3iGi    → СБРОС: bg initial !important, border NONE, padding 0, min-height 0,
//                  height auto, font-weight NORMAL, white-space normal, color blue-5
//   .m4ZwGqv    → font-size 16 (но не применится — .Pqk3iGi font-weight normal остаётся)
//   .SYzkmtj    → нет defaults; на :hover добавляет flex, gap 4, padding pd-xxs
//
// Итог дефолта: ПЛОСКИЙ link-style без обводки/bg/padding, color blue-5, normal weight.
// Размер текста — 14 (после .Pqk3iGi сброса; .m4ZwGqv применяет 16, но без strict overrides).
// Иконка (.Fm40eTW): mr 4.

const TABS = [
  { key: 'all', label: 'All reviews', count: 114 },
  { key: 'featured', label: 'Featured' },
  { key: 'to-report', label: 'Reviews to report', badge: 'New' },
  { key: 'no-replies', label: 'No replies', count: 10 },
  { key: 'pending', label: 'Pending replies' },
]

export default function Tabs({ children }) {
  const [active, setActive] = useState('all')
  return (
    <TabbedSection
      tabs={TABS}
      activeKey={active}
      onChange={setActive}
      bordered
      padded
      actions={
        <div className="flex items-center gap-af-xs">
          <FlatAction icon={PlusIcon}>New</FlatAction>
          <FlatAction icon={SettingsIcon}>Manage</FlatAction>
        </div>
      }
    >
      {children}
    </TabbedSection>
  )
}

// Плоская link-кнопка: без обводки, без bg, без padding (как .Pqk3iGi итог).
// На hover — blue-4 (.Pqk3iGi:hover).
function FlatAction({ icon: Icon, children }) {
  return (
    <button
      type="button"
      className="inline-flex cursor-pointer items-center gap-af-xxxs whitespace-nowrap border-none bg-transparent p-0 text-af-md font-af-normal text-af-text-link transition-colors hover:text-af-blue-4"
    >
      <Icon />
      {children}
    </button>
  )
}

// Real SVG path из DOM AppFollow — Plus
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-af-xxxs" aria-hidden>
      <path
        fill="currentColor"
        d="M12 3C12.4774 3 12.9352 3.18964 13.2728 3.52721C13.6104 3.86477 13.8 4.32261 13.8 4.8V10.2H19.2C19.6774 10.2 20.1352 10.3896 20.4728 10.7272C20.8104 11.0648 21 11.5226 21 12C21 12.4774 20.8104 12.9352 20.4728 13.2728C20.1352 13.6104 19.6774 13.8 19.2 13.8H13.8V19.2C13.8 19.6774 13.6104 20.1352 13.2728 20.4728C12.9352 20.8104 12.4774 21 12 21C11.5226 21 11.0648 20.8104 10.7272 20.4728C10.3896 20.1352 10.2 19.6774 10.2 19.2V13.8H4.8C4.32261 13.8 3.86477 13.6104 3.52721 13.2728C3.18964 12.9352 3 12.4774 3 12C3 11.5226 3.18964 11.0648 3.52721 10.7272C3.86477 10.3896 4.32261 10.2 4.8 10.2H10.2V4.8C10.2 4.32261 10.3896 3.86477 10.7272 3.52721C11.0648 3.18964 11.5226 3 12 3Z"
      />
    </svg>
  )
}

// Real SVG path из DOM — Settings/gear
function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-af-xxxs" aria-hidden>
      <path
        fill="currentColor"
        d="M13.7881 3.804C13.3321 1.932 10.6681 1.932 10.2121 3.804C10.144 4.0853 10.0105 4.34655 9.82236 4.56649C9.63424 4.78644 9.39685 4.95886 9.1295 5.06973C8.86216 5.18059 8.57242 5.22677 8.28385 5.20451C7.99529 5.18225 7.71606 5.09217 7.46889 4.9416C5.82249 3.9384 3.93849 5.8224 4.94169 7.4688C5.58969 8.532 5.01489 9.9192 3.80529 10.2132C1.93209 10.668 1.93209 13.3332 3.80529 13.7868C4.08666 13.855 4.34796 13.9886 4.5679 14.1769C4.78785 14.3652 4.96022 14.6027 5.07098 14.8702C5.18174 15.1377 5.22776 15.4275 5.20529 15.7162C5.18283 16.0048 5.09251 16.2841 4.94169 16.5312C3.93849 18.1776 5.82249 20.0616 7.46889 19.0584C7.71602 18.9076 7.99527 18.8173 8.28391 18.7948C8.57255 18.7723 8.86242 18.8184 9.12991 18.9291C9.39739 19.0399 9.63494 19.2122 9.8232 19.4322C10.0115 19.6521 10.1451 19.9134 10.2133 20.1948C10.6681 22.068 13.3333 22.068 13.7869 20.1948C13.8553 19.9136 13.9891 19.6525 14.1774 19.4327C14.3657 19.2129 14.6032 19.0406 14.8706 18.9299C15.138 18.8192 15.4278 18.7731 15.7163 18.7954C16.0049 18.8178 16.2841 18.9079 16.5313 19.0584C18.1777 20.0616 20.0617 18.1776 19.0585 16.5312C18.9079 16.284 18.8178 16.0048 18.7955 15.7162C18.7732 15.4277 18.8192 15.1379 18.93 14.8705C19.0407 14.6031 19.213 14.3656 19.4328 14.1773C19.6525 13.989 19.9137 13.8552 20.1949 13.7868C22.0681 13.332 22.0681 10.6668 20.1949 10.2132C19.9135 10.145 19.6522 10.0114 19.4323 9.82312C19.2123 9.63485 19.04 9.39731 18.9292 9.12982C18.8184 8.86233 18.7724 8.57246 18.7949 8.28382C18.8174 7.99518 18.9077 7.71593 19.0585 7.4688C20.0617 5.8224 18.1777 3.9384 16.5313 4.9416C16.2842 5.09242 16.0049 5.18274 15.7163 5.2052C15.4276 5.22767 15.1378 5.18165 14.8703 5.07089C14.6028 4.96013 14.3652 4.78776 14.177 4.56781C13.9887 4.34787 13.8551 4.08658 13.7869 3.8052L13.7881 3.804ZM12.0001 15.6C12.9549 15.6 13.8705 15.2207 14.5457 14.5456C15.2208 13.8705 15.6001 12.9548 15.6001 12C15.6001 11.0452 15.2208 10.1295 14.5457 9.45442C13.8705 8.77929 12.9549 8.4 12.0001 8.4C11.0453 8.4 10.1296 8.77929 9.45451 9.45442C8.77938 10.1295 8.40009 11.0452 8.40009 12C8.40009 12.9548 8.77938 13.8705 9.45451 14.5456C10.1296 15.2207 11.0453 15.6 12.0001 15.6Z"
      />
    </svg>
  )
}
