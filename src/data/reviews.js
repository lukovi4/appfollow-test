// Демо-данные отзывов. 5 разных типов: разные рейтинги, объёмы текста, теги,
// с AI-draft (collapsed/expanded) и без.
//
// Структура tags: { label, variant }
//   variant: 'ai' — AI-tag (.sMnXdhw, фиолетовый, sparkle icon)
//            'regular' (default) — обычный тег (.rQluApH, серая обводка, plus icon)
//            'add' — кнопка добавления (.UV2WGQv, blue link)
//
// aiDraft.enabled — true показывает блок ответа (expanded или collapsed input).

export const reviews = [
  // 1) Средний короткий — 3 звезды.
  // Стартовое состояние: AI-draft развёрнут, Ask AI активен,
  // первый AI-вариант выбран и его текст подставлен в textarea.
  {
    id: 'r2',
    rating: 3,
    title: 'Decent but laggy',
    text: 'Works fine most of the time, but lags every few minutes on my older phone. Hope it gets fixed.',
    date: 'May 24, 2026, 06:42 PM',
    tags: [
      { label: 'Performance' },
      { label: 'Bug' },
    ],
    meta: {
      username: 'tech_grandpa',
      country: 'Germany',
      language: 'German',
      appVersion: '4.11.3',
    },
    aiDraft: {
      enabled: true,
      mode: 'ai',
      // Фиксируем варианты, чтобы initialReplyText точно совпал с первым из них
      // (иначе выбор не подсветится — текст должен совпасть с variants[0]).
      variants: [
        "Thanks for the honest review! We hear you on the lag — we've been actively optimising for older devices, and a memory-fix pass is in the next release. Hang tight.",
        "Hi tech_grandpa! Sorry about the lag — could you share your device model via support@? We'll add you to the beta cohort getting the performance fix first.",
      ],
      initialSelection: { mode: 'ai', index: 0 },
      initialReplyText:
        "Thanks for the honest review! We hear you on the lag — we've been actively optimising for older devices, and a memory-fix pass is in the next release. Hang tight.",
      tone: '',
      flag: '',
      regenLeft: '',
      trial: '',
    },
  },

  // 3) Негативный длинный — 1 звезда + развернутый AI-draft
  {
    id: 'r3',
    rating: 1,
    title: 'Constantly crashing after the latest update',
    text: "Absolutely unusable since the update last week. The app crashes every time I try to open the settings, my data has been reset twice, and customer support hasn't replied to my ticket in five days. I've been a paying customer for over a year and this is how you treat us? Refund please.",
    date: 'May 24, 2026, 02:11 PM',
    tags: [
      { label: '4 semantic tags', variant: 'ai' },
      { label: 'Crash' },
      { label: 'Data loss' },
      { label: 'Support' },
      { label: 'Refund' },
    ],
    meta: {
      username: 'angry_user_42',
      country: 'France',
      language: 'French',
      appVersion: '4.12.0',
    },
    aiDraft: {
      enabled: true,
      mode: 'template',
      // Фиксируем единственный шаблон, чтобы initialReplyText.text совпал точно.
      templates: [
        {
          name: 'Apology · escalation',
          text:
            "We're truly sorry for the trouble you've had since the update. I've escalated your support ticket and someone will reach out within 24 hours. For the data loss, please check Settings → Restore — we automatically back up the last 7 days. Thanks for your patience while we make this right.",
        },
      ],
      initialSelection: { mode: 'template', index: 0 },
      initialReplyText:
        "We're truly sorry for the trouble you've had since the update. I've escalated your support ticket and someone will reach out within 24 hours. For the data loss, please check Settings → Restore — we automatically back up the last 7 days. Thanks for your patience while we make this right.",
      tone: 'Apologetic',
      flag: 'Critical bug',
      regenLeft: '123',
      variants: [
        "We're truly sorry to hear about the trouble you've had since the update — that's not the experience we want anyone to have. I've escalated your support ticket and someone will reach out today. For the data loss, please check Settings → Restore — we automatically back up the last 7 days.",
        "Hi, this sounds incredibly frustrating and I'm sorry it's taken so long to get a response. Could you DM us your ticket number so we can prioritise it? We're also pushing a hotfix for the settings crash tomorrow.",
      ],
      trial: '14 AI generations left for free. Start trial to get unlimited.',
    },
  },

  // 3) Длинный позитивный — 5 звёзд + развернутый AI-draft (2 варианта).
  // Перенесён в конец списка: эта карточка отслеживает время ответа,
  // поэтому используется как финальный "test it"-якорь из сайдбара.
  {
    id: 'r1',
    rating: 5,
    title: "Best app ever, can't live without it!",
    text: "I've been using this app for almost two years now, and it has genuinely changed how I manage my day. The interface is clean, the notifications are smart and not annoying, and every update brings something useful. I especially love the new analytics screen — it gives me a clear picture of my habits and what I need to work on. The developers actually listen to feedback (I reported a bug last month and it was fixed within a week!). Keep it up, this is the gold standard of productivity apps.",
    date: 'May 25, 2026, 09:17 AM',
    tags: [
      { label: '3 semantic tags', variant: 'ai' },
      { label: 'Praise' },
      { label: 'Thank you' },
      { label: 'Feature request' },
    ],
    meta: {
      username: 'productivity_pro',
      country: 'United Kingdom',
      language: 'English',
      appVersion: '4.12.0',
    },
    aiDraft: {
      enabled: true,
      mode: null, // стартовое состояние switcher'а: ни Ask AI, ни Template не выбраны
      trackTime: true, // считать время от focus textarea до клика Send Reply
      tone: 'Grateful',
      flag: 'Praise',
      regenLeft: '124',
      variants: [
        "Wow, thank you so much for taking the time to write such a thoughtful review! It really means a lot to our team that you've stayed with us for almost two years. We'll keep working hard to ship updates you'll love — and your feedback on analytics has been noted!",
        "Hi productivity_pro! Two years and still going strong — that's incredible to hear. Glad the analytics screen has been useful, and thanks again for that bug report last month. Reviews like yours are why we love building this app.",
      ],
      trial: '14 AI generations left for free. Start trial to get unlimited.',
    },
  },

  // 4 и 5 скрыты — закомментированы по запросу.
  // {
  //   id: 'r4', rating: 4, title: 'Pretty good',
  //   text: 'Solid app overall. The widgets are great. One star off because dark mode could be darker.',
  //   date: 'May 23, 2026, 11:55 PM',
  //   tags: [{ label: '2 semantic tags', variant: 'ai' }, { label: 'UI' }, { label: 'Dark mode' }],
  //   meta: { username: 'minimalist_dev', country: 'Japan', language: 'Japanese', appVersion: '4.12.0' },
  //   aiDraft: { enabled: true, collapsed: true, tone: '', flag: '', regenLeft: '', variants: [], trial: '' },
  // },
  // {
  //   id: 'r5', rating: 2, title: 'Meh', text: 'Used to be better.',
  //   date: 'May 22, 2026, 08:03 AM',
  //   tags: [{ label: 'Regression' }],
  //   meta: { username: 'old_school_user', country: 'Canada', language: 'English', appVersion: '4.10.1' },
  //   aiDraft: { enabled: true, collapsed: true, tone: '', flag: '', regenLeft: '', variants: [], trial: '' },
  // },
]
