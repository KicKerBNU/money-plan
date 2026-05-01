# money-plan-frontend

Vue 3 frontend for **Money Plan** — a personal finance web app for tracking income, daily expenses, accounts, categories, and monthly spending insights. It talks to the `money-plan-backend` REST API using Firebase-authenticated requests.

## Features

### Authentication

- Email/password and Google sign-in via Firebase Auth
- Protected app routes; API calls attach `Authorization: Bearer <Firebase ID token>` (`src/lib/api.ts`)

### Home

- Marketing landing page describing product capabilities

### Expenses (`/app/expenses`)

- Loads expenses for the **current calendar month** from `GET /v1/expenses?year=&month=`
- Summary cards computed on the client: total spent, daily average (`total ÷ days elapsed in month`), largest single-day total, cash flow vs monthly income
- Search across note (shown as title), category name, account name, and short date label
- Category chips show up to **5** categories (first in list order) to avoid horizontal overflow
- **Date range filtering**
  - Quick presets: last 3 days, last 7 days (anchored to “today” when viewing the current month; otherwise end of selected month)
  - **Trip week**: modal to pick **start** and **end** dates; list filters to inclusive range and shows spent-in-range summary (respects category chip when set)
- Inline **edit/delete** on expense rows; add expense opens sidebar form (create vs edit with save/cancel)
- Empty month: illustrated empty state with CTA to add first expense
- Sidebar panels when form is open: add/edit/delete **accounts** and **categories** (wired to backend)
- Mobile: condensed expense cards with same actions

### Income (`/app/income`)

- Loads incomes for the current month from `GET /v1/incomes?year=&month=`
- Quick add requires **account** selection (`accountId`); totals and “recent income” from API data
- **Edit/delete** on rows using PUT/DELETE

### Stats (`/app/stats`)

- Loads `GET /v1/stats/monthly-expenses?year=&month=`
- Pillar visualization uses per-category **entry counts**; percentages and ranking computed on the client

### Shared UX

- Light/dark theme toggle (Pinia + CSS variables)
- English (`en-US`) and Portuguese (`pt-BR`) via `vue-i18n`

## Objective

Provide a clean personal finance experience where users can securely sign in, record expenses and income, organize categories and accounts, filter spending by period (including travel ranges), and review monthly stats.

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Vue 3](https://vuejs.org/) | ^3.5 | UI framework — Composition API with `<script setup>` |
| [TypeScript](https://www.typescriptlang.org/) | ~6.0 | Strict typing across all layers |
| [Vite](https://vite.dev/) | ^8.0 | Dev server and build tool |
| [Vue Router](https://router.vuejs.org/) | ^5.0 | Client-side routing |
| [Pinia](https://pinia.vuejs.org/) | ^3.0 | State management (Setup Store style) |
| [Tailwind CSS](https://tailwindcss.com/) | ^4.0 | Utility-first styling via `@tailwindcss/vite` |
| [vue-i18n](https://vue-i18n.intlify.dev/) | ^11.0 | Internationalization — auto-detects browser language |
| [FontAwesome](https://fontawesome.com/) | ^7.0 | Icons — registered globally as `<FontAwesomeIcon>` |
| [Storybook](https://storybook.js.org/) | ^10.0 | Isolated component development and visual testing |
| [Firebase](https://firebase.google.com/) | ^12.0 | Frontend authentication |
| [Netlify](https://www.netlify.com/) | CLI | Production deployment |

## Folder Structure

```
src/
├── modules/                  # Feature modules (DDD)
│   ├── app/                  # Authenticated app navigation
│   ├── auth/                 # Login + Firebase auth store
│   ├── expenses/             # Expenses UI + api/domain + CRUD filters
│   ├── home/                 # Marketing landing page
│   ├── income/               # Income UI + api/domain + CRUD
│   ├── stats/                # Monthly stats + API client
│   └── theme/                # Light/dark theme store and toggle
├── i18n/
│   ├── index.ts              # createI18n — auto-detects browser locale
│   └── locales/
│       ├── en-US.ts
│       └── pt-BR.ts
├── plugins/
│   ├── firebase.ts           # Firebase app/auth/analytics setup
│   └── fontawesome.ts        # FA library setup + global component registration
├── lib/
│   └── api.ts                # Authenticated fetch (Bearer token, handles 204)
├── router/
│   └── index.ts              # Global router — spreads routes from each module
├── assets/
│   └── styles/
│       └── main.css          # Tailwind entry point
├── App.vue                   # Root — only contains <RouterView />
└── main.ts                   # Bootstrap — registers Pinia, Router, i18n, FA
```

## Key Conventions

**Modules**

- No `components/` at the `src` root — every component belongs to a feature module
- Each module declares its own routes in `<feature>.routes.ts`; the global router spreads them all
- TypeScript contracts live in the module's `domain/` folder; HTTP wrappers in `api/`

**State**

- Pinia stores use the Setup Store style (`defineStore` with `ref` / `computed`)

**Internationalization**

- The app detects the browser's preferred language (`navigator.languages`)
- Exact match first (`pt-BR`), then prefix (`pt` → `pt-BR`), fallback `en-US`
- UI copy goes through `useI18n`; translation keys are namespaced by feature (e.g. `expenses.filters`)

**Icons**

- Register icons in `src/plugins/fontawesome.ts`
- Use `<FontAwesomeIcon icon="icon-name" />` in templates

**Storybook**

- Stories live alongside components; global plugins in `.storybook/preview.ts`

**Imports**

- Use `@/` for absolute imports: `@/modules/home/home.vue`

**Auth**

- Firebase Auth in `src/plugins/firebase.ts`; state in `src/modules/auth/store/auth.store.ts`
- Protected `/app/*` routes require an authenticated user
- `src/lib/api.ts` attaches the Firebase ID token

**Theme**

- Tokens and semantic classes in `src/assets/styles/main.css`
- Prefer semantic classes (`theme-page`, `finance-card`, `theme-button-primary`, etc.)

## Getting Started

```bash
npm install
npm run dev
```

## Available Commands

```bash
npm run dev              # Dev server (default port 1074 — see package.json)
npm run build            # vue-tsc + production build
npm run preview          # Production preview + Firebase Auth emulator (see package.json)
npm run storybook        # Storybook at http://localhost:6006
npm run build-storybook  # Static Storybook build
npm run format           # Prettier write src/
```

## Mobile Preview

Use `yarn preview` when testing the production build on a phone (Firebase Auth emulator + Vite preview). See terminal output for the network URL and emulator ports.

## Backend Integration

Base URL defaults to `http://localhost:3000`. Override:

```bash
VITE_API_BASE_URL=https://your-api.example.com
```

### API surface used by the frontend

| Area | Methods | Notes |
|------|---------|--------|
| Expenses | `GET`, `POST`, `PUT`, `DELETE` `/v1/expenses` | List uses `year` + `month`; optional server-side `startDate`, `endDate`, `categoryId` available for tighter queries |
| Incomes | `GET`, `POST`, `PUT`, `DELETE` `/v1/incomes` | List uses `year` + `month`; body includes `accountId` |
| Accounts | `GET`, `POST`, `PUT`, `DELETE` `/v1/accounts/{id}` | List returns `initialBalance` and `currentBalance` |
| Categories | `GET`, `POST`, `PUT`, `DELETE` `/v1/categories/{id}` | |
| Stats | `GET` `/v1/stats/monthly-expenses` | Query: `year`, `month` |
| Profile | `GET` `/v1/me` | Optional |

Keep backend and OpenAPI in sync; see `money-plan-backend/README.md` for full query rules.

## Netlify Deployment

This project may include `netlify.toml` with SPA fallback. Typical flow:

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

Production site (if configured):

```text
https://money-plan-frontend.netlify.app
```

## Adding a New Feature Module

1. Create `src/modules/<feature>/`
2. Add `api/`, `domain/`, `store/` as needed
3. Add `<feature>.routes.ts` and `<feature>.vue`
4. Spread routes in `src/router/index.ts`
5. Add keys to every file under `src/i18n/locales/`
