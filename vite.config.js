import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base пробрасывается из CI (имя репозитория) при деплое на GitHub Pages.
// Локально base = '/'.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
})
