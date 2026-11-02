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
- Netlify — production via GitHub-linked continuous deployment (details below)

## Netlify

**Production deploys:** Link the repo in Netlify (**Import from Git**). Netlify’s Git integration triggers a **production deploy on every push** to the configured **production branch** (commonly `master`). **GitHub Actions are not required** for that workflow unless you add them separately.

**Monorepo:** If Netlify is attached at the repo root (parent of `money-plan-frontend`), set the Netlify **base directory** to `money-plan-frontend`.

**Config:** `netlify.toml` in this package defines build (`npm run build`), publish dir (`dist`), and SPA redirects.

**Manual CLI deploy** (optional):

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

## Folder Structure

```text
src/
├── modules/            # Feature modules (DDD)
│   ├── accounts/       # Dedicated accounts screen (/app/accounts); API helpers in expenses.api
│   ├── app/            # App navigation
│   ├── auth/           # Login + auth store
│   ├── expenses/       # Expenses UI/API/domain
│   ├── home/           # Landing page
│   ├── income/         # Income UI/API/domain
│   ├── overview/       # Consolidated dashboard (/app/overview), period presets + chart
│   ├── stats/          # Monthly stats UI/API/domain
│   ├── chatbot/        # Expense assistant chat (/app/chatbot), OpenAI via backend
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
- Lay out authenticated finance pages with `main.app-content.app-mobile-screen` → `div.app-finance-page-inner` (full inner width max `80rem`, same as Overview/Accounts). Expense chat uses the same shell; message bubbles stay a readable column inside the shared card.
- Use `src/lib/api.ts` for backend requests so Firebase ID tokens are attached.
- Use `src/modules/theme` and semantic theme classes for light/dark styling.
- Keep user-facing text in both `en-US.ts` and `pt-BR.ts`.

## Mutations and server sync

Use **optimistic updates** for user-driven mutations whenever the predicted UI state is clear (creates, updates, deletes, reorder, toggles): apply the change to local/Pinia state **immediately**, then call the API; on success, reconcile with the response if needed (or refresh ancillary data); on failure, **revert** the optimistic state and refetch if necessary so the UI matches the server. Avoid waiting on the network before updating lists and summaries when the UX would feel laggy — this is the default expectation for Money Plan frontend work.

## Agent Guidelines

- Prefer minimal, targeted edits over broad refactors.
- Preserve existing architecture and naming conventions.
- Avoid introducing new dependencies unless necessary.
- When changing UI text, update locale files accordingly.
- After substantial edits, run relevant checks.

## Commands

```bash
yarn dev
yarn build
yarn preview
yarn storybook
yarn build-storybook
yarn test              # unit tests (Vitest, node) — prefer this for regression
yarn test:watch
yarn test:coverage
yarn test:storybook    # Storybook browser Vitest project (Playwright)
yarn test:e2e          # Playwright smoke e2e (starts Vite unless E2E_BASE_URL is set)
yarn test:ci           # unit + e2e build gates (same as the start of yarn build)
# Pre-commit (install once): ./scripts/install-git-hooks.sh
# Blocks git commit unless yarn test:ci passes (bypass: SKIP_TEST_HOOK=1)
```

Unit specs live next to source as `*.spec.ts` under `src/` (e.g. `src/lib/money.spec.ts`).
E2E specs live under `e2e/` (`playwright.config.ts`). `yarn build` / Netlify runs unit then e2e before `vue-tsc` + Vite.
Successful login e2e uses the **Firebase Auth emulator** (Java required): Playwright starts auth on `:9099`, seeds `e2e@money-plan.test` in `e2e/global-setup.ts`, and runs Vite with `VITE_USE_FIREBASE_AUTH_EMULATOR=true`. Override email/password only via `E2E_EMAIL` / `E2E_PASSWORD` env (never commit real credentials).

## Backend

`src/lib/api.ts` uses **`VITE_API_BASE_URL`** with default **`http://localhost:3000`**. For **Netlify production**, set **`VITE_API_BASE_URL`** to the **AWS App Runner** HTTPS origin (Environment variables → Production; value from `money-plan-backend/.apprunner-url` after `./scripts/deploy-apprunner.sh`); redeploy so Vite bakes it into the build. See **`.env.example`** for local overrides / `.env.production.local`. Persistence is PostgreSQL on **Supabase** (`DATABASE_URL` in the backend `.env`); see `money-plan-backend/README.md`. Workspace overview: repo root **`AGENTS.md`**.

## UI conventions

See `.cursor/rules/ui-interactions.mdc` (always applied in Cursor). Summary: enabled `<button>` elements use a pointer cursor (also enforced in global CSS); row/toolbar **Edit** and **Delete** are icon-only with `aria-label` and hover/focus tooltips, never visible text labels; **modals** include a top-right **xmark** close button with `aria-label` `common.close`; **destructive actions** use `openConfirmModal()` + global **ConfirmModal**, not `window.confirm`.
