# AGENTS.md

This file provides guidance for AI coding agents (Cursor, Codex, Claude, etc.) working in this repository.

## Project Overview

Vue 3 scaffold using Domain-Driven Design (DDD) folder structure.

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

## Folder Structure

```text
src/
├── modules/            # Feature modules (DDD)
│   └── <feature>/
│       ├── api/        # HTTP requests for this feature
│       ├── domain/     # TypeScript interfaces and types
│       ├── store/      # Pinia setup store
│       ├── <feature>.routes.ts
│       └── <feature>.vue
├── i18n/
│   ├── index.ts
│   └── locales/
│       ├── en-US.ts
│       └── pt-BR.ts
├── plugins/
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
```
