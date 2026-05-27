// Инспектор реального DOM Reviews feed.
// Запуск с аргументом — селектор: node scripts/inspect.mjs ".AJ1eTTY"
// Без аргумента — общая карта верхнего уровня.
// Env: DEPTH=N (глубина, default 10), SHOW_SVG=1 (показывать svg/path).
import fs from 'node:fs'
import { parse } from 'node-html-parser'

const html = fs.readFileSync('Reviews_feed.html', 'utf8')
const root = parse(html)
const body = root.querySelector('body')

const SHOW_SVG = process.env.SHOW_SVG === '1'
const SKIP = SHOW_SVG
  ? new Set(['script', 'style', 'noscript', 'iframe'])
  : new Set(['script', 'style', 'noscript', 'svg', 'path', 'circle', 'rect', 'line', 'polygon', 'polyline', 'g', 'defs', 'use', 'iframe'])
const MAX_DEPTH = +(process.env.DEPTH ?? 10)

function shortClass(cls) {
  if (!cls) return ''
  return cls.split(/\s+/).filter(Boolean).map((c) => '.' + c).join('')
}
function ownText(node) {
  let t = ''
  for (const c of node.childNodes) if (c.nodeType === 3) t += c.rawText
  t = t.trim().replace(/\s+/g, ' ')
  return t.length > 70 ? t.slice(0, 67) + '…' : t
}
function walk(node, depth = 0) {
  if (depth > MAX_DEPTH) return
  if (!node || !node.tagName) return
  const tag = node.tagName.toLowerCase()
  if (SKIP.has(tag)) return
  const cls = shortClass(node.getAttribute('class'))
  const attrs = []
  for (const k of ['data-status', 'data-type', 'role', 'aria-label', 'd', 'fill', 'viewBox', 'width', 'height']) {
    const v = node.getAttribute(k)
    if (v) attrs.push(`[${k}=${v.length > 40 ? v.slice(0, 37) + '…' : v}]`)
  }
  const txt = ownText(node)
  const marker = txt ? ` "${txt}"` : ''
  console.log('  '.repeat(depth) + `${tag}${cls}${attrs.join('')}${marker}`)
  for (const child of node.childNodes) if (child.nodeType === 1) walk(child, depth + 1)
}

const sel = process.argv[2]
if (sel) {
  const el = body.querySelector(sel)
  if (!el) { console.error('not found:', sel); process.exit(1) }
  walk(el, 0)
} else {
  walk(body, 0)
}
