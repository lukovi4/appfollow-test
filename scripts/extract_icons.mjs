import fs from 'node:fs'
import { parse } from 'node-html-parser'

const html = fs.readFileSync('Automation hub/Automation hub.html', 'utf8')
const root = parse(html)
const body = root.querySelector('body')

function listSvgs(selector, label) {
  const el = body.querySelector(selector)
  if (!el) { console.log(`${label}: not found`); return }
  const svgs = el.querySelectorAll('svg')
  console.log(`\n=== ${label} (svg count: ${svgs.length}) ===`)
  const seen = new Set()
  for (const s of svgs) {
    const cls = s.getAttribute('class') || ''
    const vb = s.getAttribute('viewBox') || ''
    const paths = s.querySelectorAll('path')
    const key = cls + '|' + vb + '|' + paths.map(p => (p.getAttribute('d')||'').slice(0, 40)).join(',')
    if (seen.has(key)) continue
    seen.add(key)
    console.log(`\n>>> class="${cls}" viewBox="${vb}"`)
    for (const p of paths) {
      const d = p.getAttribute('d') || ''
      const fill = p.getAttribute('fill') || ''
      console.log(`  fill=${fill}`)
      console.log(`  d=${d}`)
    }
  }
}

listSvgs('.COEEZoK', 'LEFT FORM')
listSvgs('.F2MdcC6', 'RIGHT PREVIEW')
