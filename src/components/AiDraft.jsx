// Раскрытая карточка генерации AI-ответа внутри ReviewCard.
// Содержит панель тулзов сверху, текст драфта, счётчик попыток и кнопку Send reply.
export default function AiDraft({ draft }) {
  return (
    <div className="mt-3 rounded-md border border-af-border bg-white p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 border-b border-af-border pb-2">
        <button className="inline-flex items-center gap-1 rounded-md border border-af-border px-2 py-1 text-xs font-medium text-af-text hover:bg-af-bg">
          🔄 Regenerate
        </button>
        <span className="text-xs text-af-muted">⏱ {draft.regenLeft}</span>
        <span className="ml-2 text-xs text-af-muted">|</span>
        <button className="rounded-md px-2 py-1 text-xs font-medium text-af-text hover:bg-af-bg">
          {draft.tone} ▾
        </button>
        <button className="rounded-md px-2 py-1 text-xs font-medium text-af-text hover:bg-af-bg">
          {draft.flag} ▾
        </button>
        <button className="ml-auto text-af-muted hover:text-af-text" aria-label="Close">
          ✕
        </button>
      </div>

      <div className="mt-3 space-y-2 text-sm text-af-text">
        {draft.draft.split('\n').map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-3 rounded-md border border-dashed border-af-border bg-af-bg px-3 py-2 text-sm text-af-muted">
        Enter reply text
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-af-muted">
          {draft.trial.split('Start trial')[0]}
          <a className="font-medium text-af-primary hover:underline" href="#">
            Start trial
          </a>
          {draft.trial.split('Start trial')[1]}
        </p>
        <button className="rounded-md bg-af-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-af-primaryDark">
          Send reply
        </button>
      </div>
    </div>
  )
}
