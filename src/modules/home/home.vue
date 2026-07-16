<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ThemeToggle from '@/modules/theme/theme-toggle.vue'

const { t } = useI18n()

const features = [
  { icon: 'comments', key: 'chatbot' },
  { icon: 'database', key: 'tracking' },
  { icon: 'layer-group', key: 'categories' },
  { icon: 'route', key: 'accounts' },
  { icon: 'book', key: 'monthlyStats' },
] as const

const steps = [
  { icon: 'bolt', key: 'capture' },
  { icon: 'code', key: 'organize' },
  { icon: 'comments', key: 'chat' },
] as const

const actions = ['expenses', 'income', 'accounts', 'categories', 'stats', 'secure'] as const

const iosHighlights = ['native', 'sync', 'apple', 'free'] as const

const APP_STORE_URL = 'https://apps.apple.com/us/app/money-plann/id6777957861'
</script>

<template>
  <div class="theme-page relative min-h-screen overflow-hidden">
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-[36rem] animate-pulse-slow bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.25),transparent_60%)]"
    />
    <div class="floating-orb floating-orb-cyan" />
    <div class="floating-orb floating-orb-amber" />

    <div class="relative mx-auto hidden max-w-6xl justify-end px-6 pt-6 lg:flex">
      <ThemeToggle />
    </div>

    <!-- Hero -->
    <section class="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-8 sm:pb-24 sm:pt-12 lg:grid-cols-[1fr_0.95fr]">
      <div class="text-center lg:text-left">
        <span class="theme-badge mb-5 inline-flex animate-fade-up rounded-full px-4 py-1.5 text-sm font-medium">
          {{ t('home.badge') }} · {{ t('home.badgeFree') }}
        </span>

        <h1 class="animate-fade-up text-5xl font-semibold tracking-tight sm:text-6xl">
          {{ t('home.headline') }}
          <span class="headline-gradient bg-clip-text text-transparent">
            {{ t('home.headlineHighlight') }}
          </span>
        </h1>

        <p class="theme-muted mt-6 animate-fade-up text-lg leading-relaxed">
          {{ t('home.description') }}
        </p>

        <p class="theme-subtle mt-4 animate-fade-up text-sm">
          {{ t('home.trustNote') }}
        </p>

        <div class="mt-10 flex animate-fade-up flex-wrap justify-center gap-4 lg:justify-start">
          <RouterLink
            to="/login"
            class="theme-button-primary rounded-xl px-7 py-3 font-semibold shadow-lg shadow-amber-500/25"
          >
            {{ t('home.cta.login') }}
          </RouterLink>
          <a
            :href="APP_STORE_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="theme-button-secondary inline-flex items-center gap-2.5 rounded-xl px-6 py-3 font-semibold"
          >
            <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
              />
            </svg>
            {{ t('home.cta.appStore') }}
          </a>
          <a
            href="#how-it-works"
            class="theme-button-secondary hidden rounded-xl px-6 py-3 font-semibold lg:inline-flex"
          >
            {{ t('home.cta.howItWorks') }}
          </a>
        </div>
      </div>

      <div class="dashboard-mockup animate-fade-up">
        <div class="mb-5 flex items-center justify-between">
          <div>
            <p class="theme-muted text-sm">{{ t('home.mockup.month') }}</p>
            <h2 class="text-2xl font-semibold">{{ t('home.mockup.title') }}</h2>
          </div>
          <span class="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            {{ t('home.mockup.status') }}
          </span>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <div class="theme-card-soft rounded-xl p-4">
            <p class="theme-muted text-sm">{{ t('home.mockup.income') }}</p>
            <p class="mt-2 text-2xl font-semibold text-emerald-300">$3,850</p>
          </div>
          <div class="theme-card-soft rounded-xl p-4">
            <p class="theme-muted text-sm">{{ t('home.mockup.expenses') }}</p>
            <p class="mt-2 text-2xl font-semibold text-rose-300">$2,140</p>
          </div>
        </div>

        <div class="theme-card-soft mt-5 rounded-xl p-4">
          <div class="mb-3 flex items-center justify-between text-sm">
            <span>{{ t('home.mockup.monthlyCosts') }}</span>
            <span class="text-rose-300">$2,140</span>
          </div>
          <div class="mockup-line-chart" aria-hidden="true">
            <div class="chart-grid" />
            <svg viewBox="0 0 320 120" preserveAspectRatio="none">
              <path
                d="M0,82 C35,70 42,48 78,55 C118,64 120,28 158,36 C200,45 204,92 240,78 C278,64 286,34 320,42"
                fill="none"
                stroke="url(#monthlyCostGradient)"
                stroke-width="4"
                stroke-linecap="round"
              />
              <path
                d="M0,82 C35,70 42,48 78,55 C118,64 120,28 158,36 C200,45 204,92 240,78 C278,64 286,34 320,42 L320,120 L0,120 Z"
                fill="url(#monthlyCostFill)"
              />
              <defs>
                <linearGradient id="monthlyCostGradient" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stop-color="#f59e0b" />
                  <stop offset="100%" stop-color="#14b8a6" />
                </linearGradient>
                <linearGradient id="monthlyCostFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.22" />
                  <stop offset="100%" stop-color="#14b8a6" stop-opacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div class="mt-3 grid grid-cols-4 text-center text-xs text-gray-500">
            <span>W1</span>
            <span>W2</span>
            <span>W3</span>
            <span>W4</span>
          </div>
        </div>

        <div class="theme-card-soft mt-5 rounded-xl p-4">
          <div class="mb-3 flex justify-between text-sm">
            <span>{{ t('home.mockup.categories') }}</span>
            <span class="text-gray-500">{{ t('home.mockup.currentMonth') }}</span>
          </div>
          <div class="space-y-3">
            <div class="mockup-bar-row">
              <span>Food</span>
              <div><span style="width: 78%" /></div>
              <strong>$640</strong>
            </div>
            <div class="mockup-bar-row">
              <span>Transport</span>
              <div><span style="width: 45%" /></div>
              <strong>$370</strong>
            </div>
            <div class="mockup-bar-row">
              <span>Social</span>
              <div><span style="width: 35%" /></div>
              <strong>$290</strong>
            </div>
          </div>
        </div>

        <div class="theme-card-soft mt-5 rounded-xl p-4">
          <p class="theme-muted mb-3 text-sm">{{ t('home.mockup.recent') }}</p>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between"><span>Groceries</span><span class="text-rose-300">-$42.80</span></div>
            <div class="flex justify-between"><span>Salary</span><span class="text-emerald-300">+$3,850</span></div>
            <div class="flex justify-between"><span>Bus card</span><span class="text-rose-300">-$24.00</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="relative mx-auto max-w-6xl px-6 pb-20">
      <div class="theme-card rounded-3xl p-6 backdrop-blur">
        <h2 class="text-2xl font-semibold">{{ t('home.actions.title') }}</h2>
        <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="action in actions" :key="action" class="theme-card-soft rounded-xl p-4 text-sm">
            {{ t(`home.actions.items.${action}`) }}
          </div>
        </div>
      </div>
    </section>

    <!-- Feature cards -->
    <section class="relative mx-auto max-w-6xl px-6 pb-20">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="feature in features"
          :key="feature.key"
          class="theme-card theme-hover-accent group rounded-2xl p-6 backdrop-blur transition duration-300 hover:-translate-y-1"
        >
          <div class="theme-icon mb-4 flex h-10 w-10 items-center justify-center rounded-lg transition group-hover:scale-110">
            <FontAwesomeIcon :icon="feature.icon" class="text-lg" />
          </div>
          <h3 class="mb-2 font-semibold">
            {{ t(`home.features.${feature.key}.title`) }}
          </h3>
          <p class="theme-muted text-sm leading-relaxed">
            {{ t(`home.features.${feature.key}.description`) }}
          </p>
        </div>
      </div>
    </section>

    <!-- iOS App Store -->
    <section id="ios-app" class="relative mx-auto max-w-6xl px-6 pb-20">
      <div class="ios-promo relative overflow-hidden rounded-3xl border border-[var(--color-border)] p-8 sm:p-10 lg:p-12">
        <div class="ios-promo-glow pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full opacity-40 blur-3xl" />
        <div class="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span class="theme-badge mb-4 inline-flex rounded-full px-4 py-1.5 text-sm font-medium">
              {{ t('home.ios.badge') }}
            </span>
            <h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">
              {{ t('home.ios.title') }}
            </h2>
            <p class="theme-muted mt-4 max-w-xl text-base leading-relaxed sm:text-lg">
              {{ t('home.ios.description') }}
            </p>

            <ul class="mt-8 space-y-3">
              <li
                v-for="item in iosHighlights"
                :key="item"
                class="flex items-start gap-3 text-sm sm:text-base"
              >
                <span class="theme-icon mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  <FontAwesomeIcon icon="check" class="text-xs" />
                </span>
                <span>{{ t(`home.ios.highlights.${item}`) }}</span>
              </li>
            </ul>

            <div class="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <a
                :href="APP_STORE_URL"
                target="_blank"
                rel="noopener noreferrer"
                class="theme-button-primary inline-flex items-center gap-3 rounded-xl px-7 py-3.5 font-semibold shadow-lg shadow-amber-500/25"
              >
                <svg class="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path
                    d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
                  />
                </svg>
                {{ t('home.ios.cta') }}
              </a>
              <p class="theme-subtle text-sm">{{ t('home.ios.note') }}</p>
            </div>
          </div>

          <div class="ios-phone-frame mx-auto w-full max-w-[280px]" aria-hidden="true">
            <div class="ios-phone-screen">
              <div class="ios-phone-notch" />
              <div class="px-5 pt-10 pb-6">
                <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-300/90">
                  Money Plan
                </p>
                <p class="mt-2 text-xl font-semibold text-white">
                  {{ t('home.headline') }}
                </p>
                <div class="mt-5 space-y-2.5">
                  <div class="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur">
                    <p class="text-[11px] text-white/60">{{ t('home.mockup.expenses') }}</p>
                    <p class="text-lg font-semibold text-rose-300">$2,140</p>
                  </div>
                  <div class="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur">
                    <p class="text-[11px] text-white/60">{{ t('home.mockup.income') }}</p>
                    <p class="text-lg font-semibold text-emerald-300">$3,850</p>
                  </div>
                  <div class="rounded-xl bg-amber-400/15 px-3 py-2.5">
                    <p class="text-[11px] text-amber-200/90">{{ t('home.features.chatbot.title') }}</p>
                    <p class="mt-1 text-xs leading-snug text-white/80">
                      “How much on food this month?”
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section id="how-it-works" class="relative mx-auto max-w-6xl px-6 pb-24">
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-semibold">{{ t('home.how.title') }}</h2>
        <p class="theme-muted mt-2">{{ t('home.how.description') }}</p>
      </div>

      <div class="grid gap-5 md:grid-cols-3">
        <div
          v-for="(step, index) in steps"
          :key="step.key"
          class="theme-card theme-hover-accent rounded-2xl p-6 backdrop-blur transition duration-300"
        >
          <div class="mb-4 flex items-center justify-between">
            <div class="theme-icon-accent flex h-11 w-11 items-center justify-center rounded-lg">
              <FontAwesomeIcon :icon="step.icon" class="text-lg" />
            </div>
            <span class="text-xs font-semibold tracking-wide text-gray-500">0{{ index + 1 }}</span>
          </div>
          <h3 class="text-lg font-semibold">{{ t(`home.how.steps.${step.key}.title`) }}</h3>
          <p class="theme-muted mt-2 text-sm leading-relaxed">
            {{ t(`home.how.steps.${step.key}.description`) }}
          </p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="theme-border theme-subtle border-t py-8 text-center text-sm">
      {{ t('home.footer') }} ·
      <a :href="APP_STORE_URL" target="_blank" rel="noopener noreferrer" class="hover:underline">
        {{ t('home.ios.cta') }}
      </a>
      ·
      <RouterLink to="/faq" class="hover:underline">FAQ</RouterLink>
      ·
      <RouterLink to="/privacy" class="hover:underline">Privacy</RouterLink>
    </footer>
  </div>
</template>

<style scoped>
.hero-visual-wrapper {
  position: relative;
}

.dashboard-mockup {
  position: relative;
  border: 1px solid var(--color-border);
  border-radius: 1.5rem;
  background: linear-gradient(145deg, var(--color-surface), var(--color-surface-soft));
  box-shadow: 0 20px 60px rgba(2, 6, 23, 0.62);
  padding: 1.25rem;
  animation: float-soft 7s ease-in-out infinite;
}

.headline-gradient {
  background-image: linear-gradient(90deg, var(--color-accent), var(--color-primary));
}

.ios-promo {
  background: linear-gradient(145deg, var(--color-surface), var(--color-surface-soft));
  box-shadow: 0 20px 60px rgba(2, 6, 23, 0.35);
}

.ios-promo-glow {
  background: radial-gradient(circle, rgba(20, 184, 166, 0.45), transparent 70%);
}

.ios-phone-frame {
  border-radius: 2rem;
  padding: 0.65rem;
  background: linear-gradient(160deg, #334155, #0f172a);
  box-shadow:
    0 25px 50px rgba(2, 6, 23, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.ios-phone-screen {
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  background: linear-gradient(165deg, #1e293b 0%, #0f172a 55%, #134e4a 100%);
  min-height: 22rem;
}

.ios-phone-notch {
  position: absolute;
  top: 0.65rem;
  left: 50%;
  transform: translateX(-50%);
  width: 6.5rem;
  height: 1.35rem;
  border-radius: 9999px;
  background: #020617;
}

.mockup-bar-row {
  display: grid;
  grid-template-columns: 5rem 1fr 3.5rem;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-muted);
  font-size: 0.875rem;
}

.mockup-bar-row div {
  height: 0.5rem;
  border-radius: 9999px;
  background: var(--color-surface-soft);
  overflow: hidden;
}

.mockup-bar-row div span {
  display: block;
  height: 100%;
  border-radius: 9999px;
  background: linear-gradient(90deg, rgb(245 158 11), rgb(20 184 166));
}

.mockup-bar-row strong {
  text-align: right;
  color: var(--color-text);
  font-weight: 600;
}

.mockup-line-chart {
  position: relative;
  height: 8rem;
  overflow: hidden;
  border-radius: 0.75rem;
  background: var(--color-surface-soft);
}

.mockup-line-chart svg,
.chart-grid {
  position: absolute;
  inset: 0;
}

.chart-grid {
  background-image:
    linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
  background-size: 100% 33.333%, 25% 100%;
}

.floating-orb {
  pointer-events: none;
  position: absolute;
  border-radius: 9999px;
  filter: blur(44px);
  opacity: 0.35;
}

.floating-orb-cyan {
  right: -4rem;
  top: 16rem;
  height: 14rem;
  width: 14rem;
  background: rgba(34, 211, 238, 0.35);
  animation: drift-vertical 10s ease-in-out infinite;
}

.floating-orb-amber {
  left: -4rem;
  top: 32rem;
  height: 16rem;
  width: 16rem;
  background: rgba(245, 158, 11, 0.28);
  animation: drift-vertical 12s ease-in-out infinite reverse;
}

.animate-fade-up {
  animation: fade-up 0.7s ease-out both;
}

.animate-pulse-slow {
  animation: pulse-slow 6s ease-in-out infinite;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float-soft {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes drift-vertical {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-18px);
  }
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.95;
  }
  50% {
    opacity: 0.65;
  }
}
</style>
