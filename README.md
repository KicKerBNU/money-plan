# money-plan-frontend

Vue 3 frontend for Money Plan, a personal finance web app for tracking income, daily expenses, accounts, categories, and monthly spending insights.

## Objective

Provide a clean personal finance experience where users can securely sign in, record daily expenses, add income, organize categories/accounts, and review monthly spending stats.

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
│   ├── expenses/             # Expense list/form and account/category helpers
│   ├── home/                 # Marketing landing page
│   ├── income/               # Income list/form
│   ├── stats/                # Monthly stats view
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
│   └── api.ts                # Authenticated API fetch wrapper
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
- TypeScript contracts (interfaces, types) live in the module's `domain/` folder

**State**
- Pinia stores use the Setup Store style (`defineStore` with `ref` / `computed`)

**Internationalization**
- The app detects the browser's preferred language automatically via `navigator.languages`
- Exact match is tried first (`pt-BR`), then language prefix (`pt` → `pt-BR`), then fallback to `en-US`
- All UI text goes through `useI18n` — no hardcoded strings in templates
- Translation keys are namespaced by feature: `home.features.vite.title`

**Icons**
- Add icons to the FA library in `src/plugins/fontawesome.ts`
- Use them in templates as `<FontAwesomeIcon icon="icon-name" />`

**Storybook**
- Stories live alongside their component inside the module folder
- Global plugins (Pinia, i18n, FA, Tailwind) are registered in `.storybook/preview.ts`

**Imports**
- Use the `@/` alias for all absolute imports: `@/modules/home/home.vue`

**Auth**
- Firebase Auth is initialized in `src/plugins/firebase.ts`
- Auth state is managed in `src/modules/auth/store/auth.store.ts`
- Protected `/app/*` routes require an authenticated user
- API requests use `src/lib/api.ts`, which attaches the Firebase ID token as a Bearer token

**Theme**
- Light/dark theme is managed in `src/modules/theme/store/theme.store.ts`
- Theme tokens and semantic classes live in `src/assets/styles/main.css`
- Prefer semantic theme classes (`theme-page`, `theme-card`, `theme-button-primary`, etc.) over hardcoded dark-only Tailwind classes

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Start Storybook
npm run storybook
```

## Available Commands

```bash
npm run dev              # Dev server at http://localhost:5173
npm run build            # Type-check + production build
npm run preview          # Preview production build locally
npm run storybook        # Storybook at http://localhost:6006
npm run build-storybook  # Build static Storybook
```

## Backend Integration

By default, API calls target:

```bash
http://localhost:3000
```

Override with a Vite environment variable when needed:

```bash
VITE_API_BASE_URL=https://your-api.example.com
```

## Netlify Deployment

This project includes `netlify.toml`:

- build command: `npm run build`
- publish directory: `dist`
- SPA fallback redirect to `index.html`

Deploy production from this folder:

```bash
npx netlify deploy --prod --dir=dist
```

If you want Netlify to run the build during deploy:

```bash
npx netlify deploy --prod
```

Current production site:

```text
https://money-plan-frontend.netlify.app
```

## Adding a New Feature Module

1. Create the folder `src/modules/<feature>/`
2. Add the sub-folders: `api/`, `domain/`, `store/`
3. Create `<feature>.routes.ts` and `<feature>.vue`
4. Import and spread the routes in `src/router/index.ts`
5. Add translation keys to every locale file under `src/i18n/locales/`
