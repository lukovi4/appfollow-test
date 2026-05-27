// .TDao5NC — узкий sidebar (60px).
//   .JeDjddJ × 2 — верхний и нижний блок (justify-between у родителя).
//   .QeHSgKa.YWrEyY0 — slot логотипа (min-height 55px, border-bottom).
//   .cdKoN8X — wrapper одной кнопки/ссылки (margin-y 8px).
//   .ef_aTrn.e5JBFNf — сама ссылка с иконкой + текстом.
//   .tD36Smz — квадратная плашка 32x32 radius-lg (фон иконки).
//   .safAm4i — подпись 10px, mt 4px.
//   .aC0e9YX — активный (font-bold).
import {
  IconHome,
  IconReviews,
  IconAso,
  IconIntegrations,
  IconTheme,
  IconHelp,
  IconNotifications,
} from './icons.jsx'

const top = [
  { key: 'home', label: 'Home hub', icon: IconHome },
  { key: 'reviews', label: 'Reviews', icon: IconReviews, active: true },
  { key: 'aso', label: 'ASO', icon: IconAso },
  { key: 'integrations', label: 'Integrations', icon: IconIntegrations },
]

export default function SidebarNarrow() {
  return (
    <div className="relative flex h-screen w-af-sidebar-narrow min-w-af-sidebar-narrow flex-col items-center justify-between border-r border-af-bg-stroke bg-af-bg-primary pb-af-lg pt-af-xxxs">
      {/* Верх: логотип + навигация */}
      <div className="flex w-full flex-col items-center">
        {/* .QeHSgKa.YWrEyY0 — слот логотипа */}
        <div className="flex min-h-[55px] w-full items-center justify-center border-b border-af-bg-stroke">
          <div className="flex h-8 w-8 items-center justify-center rounded-af-lg bg-af-blue-5">
            <span className="text-af-md font-af-bold text-af-text-white">AF</span>
          </div>
        </div>

        {/* Навигация */}
        {top.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.key} className="my-af-xxs flex w-full items-center justify-center">
              <a
                href="#"
                className={`flex flex-col items-center text-af-blue-5 ${
                  item.active ? 'font-af-bold' : 'font-normal'
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-af-lg transition-colors ${
                    item.active ? 'bg-af-blue-1 text-af-blue-5' : 'text-af-icon-secondary hover:bg-af-bg-secondaryWhite'
                  }`}
                >
                  <Icon />
                </span>
                <span className="mt-af-xxxs text-af-xs leading-none text-af-text-primary">
                  {item.label}
                </span>
              </a>
            </div>
          )
        })}
      </div>

      {/* Низ: theme / help / notifications / account */}
      <div className="flex w-full flex-col items-center gap-af-xs">
        <button className="flex h-8 w-8 items-center justify-center rounded-af-lg text-af-icon-secondary hover:bg-af-bg-secondaryWhite">
          <IconTheme />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-af-lg text-af-icon-secondary hover:bg-af-bg-secondaryWhite">
          <IconHelp />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-af-lg text-af-icon-secondary hover:bg-af-bg-secondaryWhite">
          <IconNotifications />
        </button>
        {/* Account */}
        <a href="#" className="flex flex-col items-center">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-af-yellow-3 text-af-xs font-af-bold text-af-text-primary">
            EB
          </span>
          <span className="mt-af-xxxs text-af-xs leading-none text-af-text-primary">Account</span>
        </a>
      </div>
    </div>
  )
}
