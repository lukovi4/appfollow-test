// Пул шаблонных ответов (Template mode в AiDraft).
// Каждый шаблон: { name, text }
//   name — короткое название шаблона (Bold, отображается в первой строке варианта)
//   text — текст шаблона (отображается под названием)

export const templates = [
  {
    name: 'Thanks · short',
    text: "Hi! Thanks for the review — we really appreciate you taking the time to share your experience.",
  },
  {
    name: 'Thanks · with CTA',
    text: "Thank you for your feedback! We're glad to have you with us. If you ever need anything, feel free to reach out.",
  },
  {
    name: 'Appreciation · neutral',
    text: "Hello! We appreciate your review. Your support means a lot to our team.",
  },
  {
    name: 'Feedback acknowledged',
    text: "Thanks for sharing your thoughts. We're always working to make the app better, and your feedback helps a lot.",
  },
  {
    name: 'Support contact',
    text: "Hi there! Thank you for the review. If you have any questions or suggestions, please don't hesitate to contact our support team.",
  },
  {
    name: 'Community thanks',
    text: "We really appreciate you taking the time to review the app. Thank you for being part of our community!",
  },
  {
    name: 'Feedback forwarded',
    text: "Thank you for your feedback. We've passed it along to our team and we'll keep working to improve.",
  },
  {
    name: 'Apology · soft',
    text: "Hi! We're sorry to hear about your experience. Please reach out at support@ so we can help resolve this.",
  },
  {
    name: 'Praise reply',
    text: "Thank you for the kind words! Reviews like yours keep our team motivated to build the best product possible.",
  },
  {
    name: 'Generic follow-up',
    text: "Hi! Thanks for the review. If there's anything specific we can help with, please email support@ and we'll take a look.",
  },
]
