<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const features = [
  { icon: 'database', key: 'tracking' },
  { icon: 'layer-group', key: 'categories' },
  { icon: 'route', key: 'accounts' },
  { icon: 'book', key: 'monthlyStats' },
] as const

const steps = [
  { icon: 'bolt', key: 'capture' },
  { icon: 'code', key: 'organize' },
  { icon: 'globe', key: 'analyze' },
] as const

const actions = ['expenses', 'income', 'accounts', 'categories', 'stats', 'secure'] as const
</script>

<template>
  <div class="theme-page relative min-h-screen overflow-hidden">
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-[36rem] animate-pulse-slow bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.25),transparent_60%)]"
    />
    <div class="floating-orb floating-orb-cyan" />
    <div class="floating-orb floating-orb-amber" />

    <!-- Hero -->
    <section class="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 sm:py-24 lg:grid-cols-[1fr_0.95fr]">
      <div class="text-center lg:text-left">
        <span class="theme-badge mb-5 inline-flex animate-fade-up rounded-full px-4 py-1.5 text-sm font-medium">
          {{ t('home.badge') }}
        </span>

        <h1 class="animate-fade-up text-5xl font-bold tracking-tight sm:text-6xl">
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
            href="#how-it-works"
            class="theme-button-secondary rounded-xl px-6 py-3 font-semibold"
          >
            {{ t('home.cta.howItWorks') }}
          </a>
        </div>
      </div>

      <div class="dashboard-mockup animate-fade-up">
        <div class="mb-5 flex items-center justify-between">
          <div>
            <p class="theme-muted text-sm">{{ t('home.mockup.month') }}</p>
            <h2 class="text-2xl font-bold">{{ t('home.mockup.title') }}</h2>
          </div>
          <span class="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            {{ t('home.mockup.status') }}
          </span>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <div class="theme-card-soft rounded-xl p-4">
            <p class="theme-muted text-sm">{{ t('home.mockup.income') }}</p>
            <p class="mt-2 text-2xl font-bold text-emerald-300">$3,850</p>
          </div>
          <div class="theme-card-soft rounded-xl p-4">
            <p class="theme-muted text-sm">{{ t('home.mockup.expenses') }}</p>
            <p class="mt-2 text-2xl font-bold text-rose-300">$2,140</p>
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
        <h2 class="text-2xl font-bold">{{ t('home.actions.title') }}</h2>
        <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="action in actions" :key="action" class="theme-card-soft rounded-xl p-4 text-sm">
            {{ t(`home.actions.items.${action}`) }}
          </div>
        </div>
      </div>
    </section>

    <!-- Feature cards -->
    <section class="relative mx-auto max-w-6xl px-6 pb-20">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

    <!-- How It Works -->
    <section id="how-it-works" class="relative mx-auto max-w-6xl px-6 pb-24">
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-bold">{{ t('home.how.title') }}</h2>
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
      {{ t('home.footer') }}
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
