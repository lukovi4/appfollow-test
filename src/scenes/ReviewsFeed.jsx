import { useState } from 'react'
import Sidebar from '../components/Sidebar.jsx' // оставлен на случай возврата
import SidebarNew from '../components/SidebarNew.jsx'
import Header from '../components/Header.jsx'
import AppSelector from '../components/AppSelector.jsx'
import MetricsBar from '../components/MetricsBar.jsx'
import Tabs from '../components/Tabs.jsx'
import AiSummary from '../components/AiSummary.jsx'
import BulkBar from '../components/BulkBar.jsx'
import ReviewCard from '../components/ReviewCard.jsx'
import FilterPanel from '../components/FilterPanel.jsx'
import { reviews } from '../data/reviews.js'

// Структура:
// .AYhzJ9f (bg page, flex w-full)
//   Sidebar (sticky h-screen — внутри уже)
//   .i2LoI4C (flex column, min-w-0, w-full)
//     .ZyyAtz7 (padding 24)
//       Header
//       .Aw_bmjl (grid, gap pd-sm)
//         AppSelector
//         MetricsBar
//         section.AJ1eTTY.iOfzpNa.npfiQI3 (Tabs обёртка)
//           .ZKgdKXU > tabs strip + actions (внутри Tabs)
//           .BJCLxMB (grid 1fr / 230)
//             .fhN_Cxo (левая колонка)
//               section.AJ1eTTY.iOfzpNa.EMfyQwu (AiSummary вложенная)
//               .JapvtJL (BulkBar)
//               .cE_vAAr (список карточек)
//             .GJLHQAz (FilterPanel)
//     footer.KTYCmPI
export default function ReviewsFeed({ onNavigate }) {
  // Глобальный счётчик "общего" времени по сессии (суммирует время от всех Send Reply
  // в карточках с trackTime). Сбрасывается только при reload страницы.
  const [overallTimeSpent, setOverallTimeSpent] = useState(null)
  const handleSessionTimeAdd = (seconds) => {
    setOverallTimeSpent((prev) => (prev ?? 0) + seconds)
  }

  return (
    <div className="flex min-h-screen w-full bg-af-bg-page text-af-text-primary">
      <SidebarNew currentPage="reviews" onNavigate={onNavigate} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="relative p-af-lg">
          <Header />
          <div className="mt-af-sm grid w-full gap-af-sm">
            <AppSelector />
            <MetricsBar />

            <Tabs>
              {/* .BJCLxMB — grid 1fr / 230px, grid-gap pd-xxs (8px), items-start, transition .3s.
                  FilterPanel скрыт — grid схлопывается в одну колонку. */}
              <div className="grid grid-cols-1 items-start gap-af-xxs">
                {/* .U2B5TKY.Zsrb_6y.vRl208d.fhN_Cxo — левая колонка:
                    flex column, gap pd-sm (16px), text-align left,
                    padding: 12px 16px 16px 16px (pd-xs pd-sm pd-sm).
                    На ≥5xl/6xl AppFollow увеличивает горизонтальные паддинги. */}
                <div className="flex min-w-0 flex-col gap-af-sm px-af-sm pb-af-sm pt-af-xs text-left 5xl:px-af-xxl 6xl:pl-af-xxl 6xl:pr-[80px]">
                  <AiSummary />
                  {/* .JapvtJL имеет margin-left: 8px и margin-bottom: -2px относительно flow */}
                  <div className="-mb-[2px] ml-af-xxs">
                    <BulkBar />
                  </div>
                  {/* .cE_vAAr — flex column w-100% min-w-0 */}
                  <div className="flex w-full min-w-0 flex-col">
                    {reviews.map((r) => (
                      <ReviewCard
                        key={r.id}
                        review={r}
                        overallTimeSpent={overallTimeSpent}
                        onSessionTimeAdd={handleSessionTimeAdd}
                      />
                    ))}
                  </div>
                </div>
                {/* Фильтры скрыты по запросу. Компонент сохранён в исходниках. */}
                {/* <FilterPanel /> */}
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
