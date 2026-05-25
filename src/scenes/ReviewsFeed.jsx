import Header from '../components/Header.jsx'
import AppSelector from '../components/AppSelector.jsx'
import MetricsBar from '../components/MetricsBar.jsx'
import Tabs from '../components/Tabs.jsx'
import AiSummary from '../components/AiSummary.jsx'
import ReviewCard from '../components/ReviewCard.jsx'
import FilterPanel from '../components/FilterPanel.jsx'
import { reviews } from '../data/reviews.js'

// Сцена Reviews feed — копия ux.png. Блоки расположены сверху вниз в одном flex-контейнере,
// порядок легко поменять простой перестановкой JSX-узлов.
export default function ReviewsFeed() {
  return (
    <div className="flex h-full bg-white text-af-text">
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <div className="space-y-5 px-8 pb-8">
          <AppSelector />
          <MetricsBar />
          <Tabs />
          <AiSummary />
          <div className="space-y-3">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </div>
      </div>
      <FilterPanel />
    </div>
  )
}
