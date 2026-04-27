# Project Overview

Vue 3 frontend for Money Plan, a personal finance app for tracking income, expenses, accounts, categories, and monthly stats.

## Tech Stack

- **Vue 3** with `<script setup>` and Composition API
- **TypeScript** (strict mode)
- **Vite** (build tool)
- **Vue Router 5** (client-side routing)
- **Pinia 3** (state management)
- **Tailwind CSS 4** (utility-first styling, via `@tailwindcss/vite`)
- **vue-i18n 11** (internationalization — `legacy: false`, Composition API mode)
- **FontAwesome 7** (icons via `@fortawesome/vue-fontawesome`, registered globally as `<FontAwesomeIcon>`)
- **Storybook 10** (component development and visual testing)
- **Firebase Auth** (email/password and Google sign-in)
- **Netlify** (production deployment)

## Folder Structure

```
src/
├── modules/            # Feature modules (DDD)
│   ├── app/            # Authenticated app navigation
│   ├── auth/           # Login + Firebase auth store
│   ├── expenses/       # Expense list/form/API/domain
│   ├── home/           # Product landing page
│   ├── income/         # Income list/form/API/domain
│   ├── stats/          # Monthly stats page
│   └── theme/          # Light/dark theme store + toggle
├── lib/
│   └── api.ts          # Authenticated backend fetch wrapper
├── i18n/
│   ├── index.ts        # createI18n instance
│   └── locales/
│       ├── en-US.ts
│       └── pt-BR.ts
├── plugins/
│   ├── firebase.ts     # Firebase app/auth/analytics setup
│   └── fontawesome.ts  # Registers FA library + <FontAwesomeIcon> globally
├── router/
│   └── index.ts        # Global router — imports and spreads module routes
├── assets/
│   └── styles/
│       └── main.css    # Tailwind entry (@import "tailwindcss")
├── App.vue             # Root component — only contains <RouterView />
└── main.ts             # App bootstrap — registers Pinia, Router, i18n, FA
```

## Conventions

- No `components/` folder at the `src` root — components belong inside their feature module
- Each feature module owns its routes; `src/router/index.ts` spreads them all
- Pinia stores use the **Setup Store** style (`defineStore` with `ref`/`computed`)
- Use the `@/` alias for all absolute imports (e.g. `@/modules/home/home.vue`)
- TypeScript contracts (interfaces, types) go in the feature's `domain/` folder
- All UI text must go through `useI18n` — no hardcoded strings in templates
- FA icons are added to the library in `src/plugins/fontawesome.ts`; use `<FontAwesomeIcon icon="icon-name" />`
- Translation keys are namespaced by feature (e.g. `home.features.vite.title`)
- Storybook stories live under `src/<feature>/` alongside the component; global plugins are registered in `.storybook/preview.ts`
- Protected finance routes live under `/app/*`
- Use `src/lib/api.ts` for backend requests so Firebase ID tokens are sent
- Theme tokens and semantic classes live in `src/assets/styles/main.css`
- Prefer semantic theme classes over hardcoded dark-only colors

## Commands

```bash
npm run dev           # Start dev server (http://localhost:5173)
npm run build         # Type-check + build
npm run preview       # Preview production build
npm run storybook     # Start Storybook (http://localhost:6006)
npm run build-storybook  # Build static Storybook
npx netlify deploy --prod --dir=dist  # Deploy current dist to Netlify
```

## Deployment

Netlify is configured in `netlify.toml`.

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

Production URL:

```text
https://money-plan-frontend.netlify.app
```
