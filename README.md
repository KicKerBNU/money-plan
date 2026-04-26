# Vue 3 Scaffold

A production-ready Vue 3 scaffold built with Domain-Driven Design (DDD), designed to scale cleanly as the application grows. Each feature lives in its own self-contained module with clearly separated layers for API calls, TypeScript contracts, and state management.

## Objective

Provide a solid starting point for Vue 3 projects that enforces a consistent, modular architecture from day one — avoiding the flat component soup that most scaffolds encourage.

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

## Folder Structure

```
src/
├── modules/                  # Feature modules (DDD)
│   └── <feature>/
│       ├── api/              # HTTP requests for this feature
│       ├── domain/           # TypeScript interfaces and types
│       ├── store/            # Pinia store
│       ├── <feature>.routes.ts
│       └── <feature>.vue
├── i18n/
│   ├── index.ts              # createI18n — auto-detects browser locale
│   └── locales/
│       ├── en-US.ts
│       └── pt-BR.ts
├── plugins/
│   └── fontawesome.ts        # FA library setup + global component registration
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

## Adding a New Feature Module

1. Create the folder `src/modules/<feature>/`
2. Add the sub-folders: `api/`, `domain/`, `store/`
3. Create `<feature>.routes.ts` and `<feature>.vue`
4. Import and spread the routes in `src/router/index.ts`
5. Add translation keys to every locale file under `src/i18n/locales/`
