// Утилиты для имитации AI-генерации.
// Все ответы общие — выбираем случайные без привязки к рейтингу/тону.

import { aiReplies } from '../data/aiReplies.js'
import { templates } from '../data/templates.js'

// Случайный выбор N разных элементов из массива.
function sampleN(arr, n) {
  if (arr.length <= n) return [...arr]
  const copy = [...arr]
  const out = []
  while (out.length < n && copy.length) {
    const i = Math.floor(Math.random() * copy.length)
    out.push(copy.splice(i, 1)[0])
  }
  return out
}

// Возвращает массив из count случайных AI-ответов.
export function generateReplies(count = 2) {
  return sampleN(aiReplies, count)
}

// Возвращает массив из count случайных шаблонов.
export function generateTemplates(count = 2) {
  return sampleN(templates, count)
}

// Один случайный AI-ответ.
export function pickOneReply() {
  return aiReplies[Math.floor(Math.random() * aiReplies.length)]
}
