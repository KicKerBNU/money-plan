# Project Overview

Vue 3 frontend for Money Plan — a personal finance app for tracking income, expenses, accounts, categories, and monthly stats.

## Tech Stack

- **Vue 3** with `<script setup>` and Composition API
- **TypeScript** (strict mode)
- **Vite 8** (build tool)
- **Vue Router 5** (client-side routing)
- **Pinia 3** (state management — Setup Store style only)
- **Tailwind CSS 4** (utility-first styling, via `@tailwindcss/vite`)
- **vue-i18n 11** (internationalization — `legacy: false`, Composition API mode)
- **FontAwesome 7** (icons via `@fortawesome/vue-fontawesome`, registered globally as `<FontAwesomeIcon>`)
- **Storybook 10** (component development and visual testing)
- **Firebase Auth** (email/password and Google sign-in)
- **Netlify** (production deployment)

## Folder Structure

```
src/
├── modules/                   # Feature modules (DDD-style)
│   ├── app/                   # Authenticated shell: FinanceNav, FinancePageSkeleton, app-settings-menu
│   │   └── store/
│   │       └── cash-flow.store.ts  # Current-month net cash flow (income − expenses) for the sidebar
│   ├── auth/                  # Login page + Firebase auth store (Google + email/password)
│   │   └── store/
│   │       └── auth.store.ts  # Pinia store: user, ready, isAuthenticated, init/login/logout
│   ├── accounts/              # Accounts list/CRUD — part of the expenses page
│   ├── chatbot/               # AI expense-chat page (POST /v1/ai/expense-chat)
│   │   ├── chatbot.vue        # Full chat UI with message thread, loading animation, and clear button
│   │   └── expense-chat.api.ts
│   ├── expenses/              # Expense list/form/CRUD/API/domain — the core finance page
│   │   ├── api/expenses.api.ts
│   │   └── domain/expenses.types.ts  # Account, Category, Expense interfaces
│   ├── home/                  # Public landing page
│   ├── income/                # Income list/form/CRUD/API/domain
│   │   └── domain/income.types.ts
│   ├── overview/              # Overview page: week/month/year presets, SVG bar charts, insights
│   │   └── lib/overviewPeriod.ts  # Period math, bucket grouping, chart label helpers
│   ├── stats/                 # Monthly stats: category bar chart + ranked lineup
│   └── theme/                 # Light/dark theme store + toggle button
│       └── store/theme.store.ts
├── lib/
│   ├── api.ts                 # apiFetch — authenticated backend fetch wrapper (adds Bearer token, toast)
│   ├── categoryIcons.ts       # Maps category name strings to FontAwesome icon names
│   ├── dateDisplay.ts         # formatMonthYear and other locale-aware date formatters
│   └── defaultAccount.ts     # getDefaultAccountId — picks the default account from a list
├── i18n/
│   ├── index.ts               # createI18n instance (legacy: false)
│   └── locales/
│       ├── en-US.ts           # English translations
│       └── pt-BR.ts           # Brazilian Portuguese translations
├── plugins/
│   ├── firebase.ts            # Firebase app/auth/analytics setup; exports firebaseAuth
│   └── fontawesome.ts         # Registers FA library + FontAwesomeIcon globally
├── router/
│   └── index.ts               # Global router — spreads all module routes; handles auth guards
├── assets/
│   └── styles/
│       └── main.css           # Tailwind entry + CSS custom properties + semantic component classes
├── utils/
│   ├── components/
│   │   ├── Toaster.vue        # Global toast notifications (mounted in App.vue)
│   │   └── ConfirmModal.vue   # Global confirm dialog (mounted in App.vue)
│   ├── toast.ts               # showToast(type, message) helper
│   └── confirmModal.ts        # openConfirmModal(options) Promise helper
├── App.vue                    # Root: <RouterView />, <Toaster />, <ConfirmModal />
└── main.ts                    # Bootstrap: Pinia, Router, i18n, FontAwesome, Firebase Analytics, theme/auth init
```

## Routes

| Path | Module | Auth required |
|---|---|---|
| `/` | home | No |
| `/login` | auth | No (redirects to `/app/expenses` if logged in) |
| `/app` | — | Yes (redirects to `/app/expenses`) |
| `/app/expenses` | expenses | Yes |
| `/app/income` | income | Yes |
| `/app/accounts` | accounts | Yes |
| `/app/overview` | overview | Yes |
| `/app/stats` | stats | Yes |
| `/app/chatbot` | chatbot | Yes |

## Conventions

- No `components/` folder at `src` root — components belong inside their feature module.
- Each feature module exports its routes from `<module>.routes.ts`; `src/router/index.ts` spreads them all.
- Pinia stores use the **Setup Store** style only (`defineStore` with `ref`/`computed`).
- Use the `@/` alias for all absolute imports (e.g. `@/modules/home/home.vue`).
- TypeScript contracts (interfaces, types) live in the feature's `domain/` folder.
- All UI text must go through `useI18n` — no hardcoded strings in templates. Keys are namespaced by feature (e.g. `expenses.title`).
- FA icons are added to the library in `src/plugins/fontawesome.ts`; use `<FontAwesomeIcon icon="icon-name" />`.
- Storybook stories live under `src/stories/`; global plugins are registered in `.storybook/preview.ts`.
- Use `src/lib/api.ts` (`apiFetch`) for all backend requests — it attaches the Firebase ID token and handles toast feedback.
- The `apiFetch` `toast` option: `silentError`, `silentSuccess`, `successMessage` let callers suppress or customize automatic toasts.
- Theme tokens and semantic classes live in `src/assets/styles/main.css`. Prefer semantic classes (`finance-card`, `theme-muted`, `theme-input`, etc.) over hardcoded dark-only colors.

## Theme System

Default is **dark mode** (`color-scheme: dark` on `:root`). Light mode activates via `:root[data-theme="light"]`. Toggle is managed by `theme.store.ts` which sets/reads `localStorage` and the `data-theme` attribute.

Key CSS custom properties: `--color-page`, `--color-surface`, `--color-surface-soft`, `--color-border`, `--color-text`, `--color-muted`, `--color-primary`, `--color-positive`, `--color-danger`.

Key semantic classes: `finance-card`, `theme-card`, `theme-muted`, `theme-subtle`, `theme-border`, `theme-input`, `theme-button-primary`, `theme-button-secondary`, `app-shell`, `app-content`, `app-sidebar`, `app-nav-item`, `mobile-bottom-nav`, `mobile-nav-item`, `expense-row`, `income-entry-row`, `stats-card`.

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend base URL (defaults to `http://localhost:3000`) |
| `VITE_USE_FIREBASE_AUTH_EMULATOR` | Set to `true` in `preview` mode to use the local Firebase Auth emulator |

## Commands

```bash
npm run dev               # Start dev server at http://localhost:1074
npm run build             # Type-check (vue-tsc) + Vite build
npm run preview           # Runs Firebase Auth emulator + Vite preview with emulator flag
npm run storybook         # Start Storybook at http://localhost:6006
npm run build-storybook   # Build static Storybook
npm run format            # Prettier format src/
npx netlify deploy --prod --dir=dist  # Deploy to Netlify
```

## Deployment

Netlify is configured in `netlify.toml`. Production URL:

```
https://money-plan-frontend.netlify.app
```
