// Демо-данные отзывов для прототипа. Без бекенда — просто статика.

export const reviews = [
  {
    id: 'r1',
    rating: 4,
    title: 'Great',
    text: 'Great game, I love playing it, I miss the stories though, that was a fun way to reach out to the community and get your questions out there. Please bring back.',
    author: 'Anonymous',
    date: 'May 25, 2026, 12:34 AM',
    badge: 'Unanswered',
    report: true,
    tags: ['2 month(s) ago', 'Crash', 'Bug', 'Thank you', 'Add tag'],
    meta: {
      app: 'Candy Crush Saga: Sweet Puzzle',
      reviewId: '00222912',
      country: 'United States',
      language: 'English',
      appVersion: '2.21.0',
    },
    aiDraft: {
      enabled: true,
      tone: 'Something else',
      flag: 'Offensive material',
      regenLeft: 477,
      draft:
        '“Thank you for the great review and for sharing what you love. We’re really glad you enjoy the game, and we hear you on missing the stories and the community questions. Please keep an eye on updates, since we sometimes send back community content in season player polls.\n\nHi [Name]:1287] It’s wonderful to hear how much you enjoy the game and the community aspect! Your feedback about the stories is truly appreciated, and it’s clear how much they meant to you. We’re always looking for ways to enhance the experience, so your thoughts are invaluable. Thank you for sharing! We hope to bring back those enjoyable story moments soon!"',
      trial: '14 AI generations left for free. Start trial to use unlimited.',
    },
  },
  {
    id: 'r2',
    rating: 3,
    title: 'Review',
    text: 'To many ads, but love testing my knowledge!',
    author: 'Anonymous',
    date: 'May 25, 2026, 11:11 PM',
    badge: 'Unanswered',
    report: true,
    tags: ['2 month(s) ago', 'Crash', 'Bug', 'Thank you', 'Add tag'],
    meta: {
      app: 'Candy Crush Saga: Sweet Puzzle',
      reviewId: '00222913',
      country: 'United States',
      language: 'English',
      appVersion: '2.21.0',
    },
  },
]
