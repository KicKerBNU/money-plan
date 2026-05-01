# AGENTS.md

This file provides guidance for AI coding agents (Cursor, Codex, Claude, etc.) working in this repository.

## Project Overview

Vue 3 frontend for Money Plan, a personal finance app for tracking daily expenses, income, accounts, categories, and monthly stats.

## Tech Stack

- Vue 3 with `<script setup>` and Composition API
- TypeScript (strict mode)
- Vite
- Vue Router 5
- Pinia 3
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- vue-i18n 11 (`legacy: false`, Composition API mode)
- FontAwesome 7 (registered globally as `<FontAwesomeIcon>`)
- Storybook 10
- Firebase Auth
- Netlify deployment

## Folder Structure

```text
src/
├── modules/            # Feature modules (DDD)
│   ├── app/            # App navigation
│   ├── auth/           # Login + auth store
│   ├── expenses/       # Expenses UI/API/domain
│   ├── home/           # Landing page
│   ├── income/         # Income UI/API/domain
│   ├── stats/          # Monthly stats UI/API/domain
│   └── theme/          # Light/dark theme store + toggle
├── lib/
│   └── api.ts          # Authenticated API client
├── i18n/
│   ├── index.ts
│   └── locales/
│       ├── en-US.ts
│       └── pt-BR.ts
├── plugins/
│   ├── firebase.ts
│   └── fontawesome.ts
├── router/
│   └── index.ts
├── assets/
│   └── styles/
│       └── main.css
├── App.vue
└── main.ts
```

## Conventions

- Keep UI, domain, store, and API code inside the corresponding feature module in `src/modules/`.
- Do not create a root-level `src/components/` folder; components belong to a feature module.
- Each feature owns its own routes; aggregate them in `src/router/index.ts`.
- Use Pinia setup stores (`defineStore` + `ref`/`computed`).
- Use `@/` alias for absolute imports.
- Put TypeScript interfaces/types inside each feature's `domain/` directory.
- Do not hardcode user-facing strings in templates; use `useI18n`.
- Keep translation keys namespaced by feature (for example: `home.features.vite.title`).
- Add FontAwesome icons to `src/plugins/fontawesome.ts` before using them.
- Keep Storybook stories next to the feature component files.
- Keep authenticated finance screens under `/app/*`.
- Use `src/lib/api.ts` for backend requests so Firebase ID tokens are attached.
- Use `src/modules/theme` and semantic theme classes for light/dark styling.
- Keep user-facing text in both `en-US.ts` and `pt-BR.ts`.

## Agent Guidelines

- Prefer minimal, targeted edits over broad refactors.
- Preserve existing architecture and naming conventions.
- Avoid introducing new dependencies unless necessary.
- When changing UI text, update locale files accordingly.
- After substantial edits, run relevant checks.

## Commands

```bash
npm run dev
npm run build
npm run preview
npm run storybook
npm run build-storybook
npx netlify deploy --prod --dir=dist
```

## Backend

Local backend default URL is `http://localhost:3000`. Override with `VITE_API_BASE_URL`.

## Netlify

The frontend is configured with `netlify.toml`. Production deploy command:

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

## UI conventions

See `.cursor/rules/ui-interactions.mdc` (always applied in Cursor). Summary: enabled `<button>` elements use a pointer cursor (also enforced in global CSS); row/toolbar **Edit** and **Delete** are icon-only with `aria-label` and hover/focus tooltips, never visible text labels.
