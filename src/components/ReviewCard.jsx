import Stars from './Stars.jsx'
import ReviewMeta from './ReviewMeta.jsx'
import AiDraft from './AiDraft.jsx'

// Карточка одного отзыва. Если у отзыва есть aiDraft.enabled — рендерим панель AI-генерации.
export default function ReviewCard({ review }) {
  return (
    <div className="rounded-md border border-af-border bg-white p-4">
      <div className="flex gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <Stars value={review.rating} />
            <span className="rounded bg-af-bg px-1.5 py-0.5 text-[11px] font-medium text-af-muted">
              {review.badge}
            </span>
            <span className="text-xs text-af-muted">{review.date}</span>
            {review.report && (
              <button className="ml-auto text-xs font-medium text-rose-500 hover:underline">
                ⚑ Report
              </button>
            )}
          </div>

          <h3 className="mt-2 text-base font-semibold text-af-text">{review.title}</h3>
          <p className="mt-1 text-sm text-af-text">{review.text}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="text-af-muted">Tags</span>
            {review.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-af-bg px-2 py-0.5 text-af-muted hover:bg-af-border"
              >
                {tag}
              </span>
            ))}
          </div>

          {review.aiDraft?.enabled && <AiDraft draft={review.aiDraft} />}
        </div>

        <ReviewMeta meta={review.meta} />
      </div>
    </div>
  )
}
