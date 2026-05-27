import { useState } from 'react'
import ReviewsFeed from './scenes/ReviewsFeed.jsx'
import AddAutomation from './scenes/AddAutomation.jsx'

// Корень приложения. Простой роутер через state: 'reviews' | 'automation'.
// Переключение — из SidebarNew. Никакого react-router'а пока не нужно.
export default function App() {
  const [page, setPage] = useState('reviews')

  if (page === 'automation') {
    return <AddAutomation onNavigate={setPage} />
  }
  return <ReviewsFeed onNavigate={setPage} />
}
