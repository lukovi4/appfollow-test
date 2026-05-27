// Pattern confidence — насколько финальный текст (что пользователь отправил)
// совпадает с базовым (что AI/Template подставил).
//
// Метрика: word-level edit-distance (Levenshtein по словам),
// нормализованная к проценту:
//   confidence = (1 - dist / max(words1.length, words2.length)) * 100
//
// Слова приводятся к lowercase и очищаются от пунктуации в начале/конце.
// Пустая строка vs непустая → 0%.

function tokenize(text) {
  if (!text) return []
  return text
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''))
    .filter(Boolean)
}

function wordEditDistance(a, b) {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m
  // DP с двумя строками для экономии памяти.
  let prev = new Array(n + 1)
  let curr = new Array(n + 1)
  for (let j = 0; j <= n; j++) prev[j] = j
  for (let i = 1; i <= m; i++) {
    curr[0] = i
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(
        prev[j] + 1, // удаление
        curr[j - 1] + 1, // вставка
        prev[j - 1] + cost, // замена
      )
    }
    ;[prev, curr] = [curr, prev]
  }
  return prev[n]
}

export function patternConfidence(baselineText, finalText) {
  const a = tokenize(baselineText)
  const b = tokenize(finalText)
  const max = Math.max(a.length, b.length)
  if (max === 0) return 0
  const dist = wordEditDistance(a, b)
  const ratio = 1 - dist / max
  return Math.max(0, Math.min(100, Math.round(ratio * 100)))
}
