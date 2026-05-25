# AppFollow — Reviews feed prototype

Кликабельный прототип для тестового задания. Стек: Vite + React + Tailwind.

## Локально

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # сборка в dist/
npm run preview  # локальный просмотр продакшен-сборки
```

## Структура

```
src/
  App.jsx                — корень (роутер сцен)
  scenes/
    ReviewsFeed.jsx      — сцена Reviews feed
  components/            — один блок = один файл (легко переставлять и перестилизовывать)
    Header.jsx
    AppSelector.jsx
    MetricsBar.jsx
    Tabs.jsx
    AiSummary.jsx
    ReviewCard.jsx
    AiDraft.jsx
    ReviewMeta.jsx
    FilterPanel.jsx
    Stars.jsx
  data/reviews.js        — статичные демо-данные
```

Перестановка блоков на сцене — это просто смена порядка JSX в `scenes/*.jsx`.
Tailwind подключён через `index.css` (`@tailwind base/components/utilities`).
Палитра AppFollow — в `tailwind.config.js` (`theme.extend.colors.af`).

## Деплой на GitHub Pages

`.github/workflows/deploy.yml` собирает прод-бандл и публикует на Pages при каждом push в `main`.

### Первый раз

1. Создай пустой репозиторий на GitHub (без README/license).
2. В корне проекта:
   ```bash
   git remote add origin git@github.com:<USER>/<REPO>.git
   git branch -M main
   git push -u origin main
   ```
3. В Settings → Pages выбери **Source: GitHub Actions**.
4. После завершения workflow ссылка появится в Actions → Deploy to GitHub Pages → `page_url`,
   либо просто `https://<USER>.github.io/<REPO>/`.

`VITE_BASE` подставляется автоматически из имени репозитория, ничего вручную не правишь.
