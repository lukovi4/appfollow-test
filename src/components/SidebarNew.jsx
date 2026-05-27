import { useState, useEffect, useRef } from 'react'

// Новый sidebar с draggable-ползунком справа.
// При drag на разделитель меняется CSS-переменная `--sidebar-width` на root
// (через document.documentElement.style), которой пользуется layout сцены.
//
// Параметры:
//   default width: 275px (как combined narrow+wide оригинала)
//   min/max:       180 ... 600px
//
// Сохранение: localStorage ключ "af-sidebar-w".
const DEFAULT_W = 275
const MIN_W = 180
const MAX_W = 600
const STORAGE_KEY = 'af-sidebar-w'

export default function SidebarNew() {
  const [width, setWidth] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_W
    const stored = window.localStorage.getItem(STORAGE_KEY)
    const n = stored ? Number(stored) : DEFAULT_W
    if (!Number.isFinite(n)) return DEFAULT_W
    return Math.min(MAX_W, Math.max(MIN_W, n))
  })

  // При изменении width — синхронизируем CSS-переменную и localStorage.
  useEffect(() => {
    document.documentElement.style.setProperty('--af-sidebar-w', `${width}px`)
    window.localStorage.setItem(STORAGE_KEY, String(width))
  }, [width])

  const draggingRef = useRef(false)

  // Начало drag — навешиваем глобальные mousemove/mouseup.
  const onPointerDown = (e) => {
    e.preventDefault()
    draggingRef.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    const onMove = (ev) => {
      if (!draggingRef.current) return
      const x = ev.clientX
      const next = Math.min(MAX_W, Math.max(MIN_W, x))
      setWidth(next)
    }
    const onUp = () => {
      draggingRef.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  // Двойной клик по разделителю — сброс на default.
  const onDoubleClick = () => setWidth(DEFAULT_W)

  return (
    <div
      className="sticky top-0 flex h-screen shrink-0"
      style={{ width: `${width}px` }}
    >
      <div className="flex h-full w-full flex-col items-center justify-center border-r border-af-bg-stroke bg-af-bg-primary p-af-lg text-center">
        <div className="text-af-h-sm font-af-bold text-af-text-primary">New sidebar</div>
        <div className="mt-af-xxs text-af-md font-af-normal leading-af-md tracking-af-sm text-af-text-secondary">
          Заглушка. Содержимое появится позже.
        </div>
        <div className="mt-af-sm text-af-sm text-af-text-tertiary">{width}px</div>
      </div>

      {/*
        Разделитель — узкая полоска 4px на правой границе sidebar.
        cursor: col-resize, hover/active меняет цвет.
        Висит абсолютно поверх границы, чтобы попадать в неё мышью было комфортно.
      */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
        tabIndex={0}
        onMouseDown={onPointerDown}
        onDoubleClick={onDoubleClick}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setWidth((w) => Math.max(MIN_W, w - 16))
          if (e.key === 'ArrowRight') setWidth((w) => Math.min(MAX_W, w + 16))
        }}
        className="absolute right-[-2px] top-0 z-10 h-full w-1 cursor-col-resize bg-transparent transition-colors hover:bg-af-blue-3 active:bg-af-blue-5"
        title="Drag to resize. Double-click to reset."
      />
    </div>
  )
}
