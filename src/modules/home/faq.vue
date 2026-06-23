<script setup lang="ts">
import { ref } from 'vue'
import ThemeToggle from '@/modules/theme/theme-toggle.vue'

const supportEmail = 'support@moneyplann.com'
const openIndex = ref<number | null>(null)

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}

const supportTopics = [
  'Account sign-in, password reset, or Sign in with Apple / Google',
  'Expenses, income, accounts, or the Expense assistant (Chat)',
  'Deleting your account or privacy requests',
  'Bug reports and feedback about the iOS app or website',
] as const

const faqs = [
  {
    q: 'How do I contact Money Plan support?',
    a: `Email us at ${supportEmail}. We read every message and usually reply within two business days. Include the email tied to your account and, if relevant, whether you use the iOS app or the website.`,
  },
  {
    q: 'How do I delete my Money Plan account?',
    a: 'Open the app (iOS or web), tap the settings gear icon, and choose Delete account. That permanently removes your login and all stored finance data. You can also email support@moneyplann.com from the email on your account if you need help.',
  },
  {
    q: 'What is Money Plan?',
    a: 'Money Plan is a free personal finance web app that helps you track expenses, income, and budgets in one place. It includes a built-in AI expense chat assistant that answers questions about your finances in plain language — for example, "How much did I spend on food last month?" or "What is my biggest expense this year?" There is no subscription and no paywalls.',
  },
  {
    q: 'Is Money Plan really free?',
    a: 'Yes, 100% free. Money Plan has no subscription, no premium tier, and no hidden fees. All features — including the AI expense chat, expense and income tracking, monthly statistics, and multi-account support — are available at no cost.',
  },
  {
    q: 'How does the AI expense chat work?',
    a: 'Once you have logged your expenses and income, you can open the Chat page and ask questions about your data in plain English. The AI reads your actual records and replies with totals, trends, and comparisons. You do not need to write code or fill out reports — just ask naturally, as if talking to a financial assistant.',
  },
  {
    q: 'What can I ask the AI assistant?',
    a: 'You can ask things like: "What did I spend on transport this month?", "Compare my food spending in March vs April", "What is my biggest expense category?", "How much is left from my income after expenses?", or "Show me all expenses above $100." The AI answers from your real data, not generic advice.',
  },
  {
    q: 'How is Money Plan different from YNAB, Mint, or Copilot?',
    a: 'Money Plan is completely free with no subscription — YNAB costs $14.99/month and Copilot costs $13/month. The core differentiator is the built-in AI chat: instead of reading charts and tables, you simply ask your data a question and get a plain-language answer. Money Plan is also a Progressive Web App, so it installs on your phone like a native app without going through the App Store.',
  },
  {
    q: 'Does Money Plan work on iPhone and Android?',
    a: 'Yes. Money Plan is a Progressive Web App (PWA). On iPhone, open moneyplann.com in Safari and tap Share → Add to Home Screen. On Android, open it in Chrome and tap Install. Once installed, it behaves like a native app — full screen, offline-ready, and no App Store required.',
  },
  {
    q: 'Can I use Money Plan offline?',
    a: 'Money Plan caches the app shell for offline use so the interface loads even without a connection. Syncing new expenses or income requires an internet connection, but you can browse previously loaded data while offline.',
  },
  {
    q: 'Is my financial data private and secure?',
    a: 'Your records are linked to your private account and protected by Firebase Authentication (the same infrastructure used by Google). Money Plan does not sell your data or share it with advertisers. Your expense and income records are only visible to you.',
  },
  {
    q: 'What expense categories does Money Plan support?',
    a: 'Money Plan comes with a set of default categories (Food, Transport, Housing, Health, Entertainment, Education, and more) and lets you create fully custom categories that match your real spending habits. You can organize categories however makes sense for your life.',
  },
  {
    q: 'How do I get started with Money Plan?',
    a: 'Go to moneyplann.com, click "Login and start tracking", and create a free account with your email or Google. Once inside, add your accounts (cash, bank, or card), then start logging expenses. After a few entries, open the Chat page and ask the AI assistant about your spending. The whole setup takes under two minutes.',
  },
] as const
</script>

<template>
  <div class="theme-page relative min-h-screen">
    <div class="relative mx-auto hidden max-w-4xl justify-end px-6 pt-6 lg:flex">
      <ThemeToggle />
    </div>

    <div class="mx-auto max-w-4xl px-6 pb-24 pt-10 lg:pt-6">
      <div class="mb-3">
        <RouterLink
          to="/"
          class="theme-muted inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold hover:underline"
        >
          <FontAwesomeIcon icon="arrow-left" class="text-xs" />
          Back to Money Plan
        </RouterLink>
      </div>

      <header class="mb-10">
        <span class="theme-badge mb-4 inline-flex rounded-full px-4 py-1.5 text-sm font-semibold">
          Help &amp; Support
        </span>
        <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">
          Support &amp; FAQ
        </h1>
        <p class="theme-muted mt-4 max-w-2xl text-lg leading-relaxed">
          Contact us for account help, technical issues, or privacy requests. Browse
          common questions about Money Plan below.
        </p>
      </header>

      <section
        class="theme-card mb-10 rounded-2xl px-6 py-6 sm:px-8"
        aria-labelledby="support-heading"
      >
        <h2 id="support-heading" class="text-xl font-semibold">Contact support</h2>
        <p class="theme-muted mt-3 text-sm leading-relaxed">
          Need help with Money Plan? Send us an email — we are happy to assist with
          sign-in, data in your account, the Expense assistant, or the iOS app.
        </p>

        <div class="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <a
            :href="`mailto:${supportEmail}`"
            class="theme-button-primary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
          >
            <FontAwesomeIcon icon="envelope" />
            {{ supportEmail }}
          </a>
          <p class="theme-muted text-sm">
            Typical response time: within <strong class="text-[var(--color-text)]">2 business days</strong>.
          </p>
        </div>

        <h3 class="mt-6 text-sm font-semibold uppercase tracking-wide">We can help with</h3>
        <ul class="theme-muted mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
          <li v-for="topic in supportTopics" :key="topic">{{ topic }}</li>
        </ul>

        <p class="theme-muted mt-5 text-sm leading-relaxed">
          Privacy and data use:
          <RouterLink to="/privacy" class="font-semibold underline">Privacy Policy</RouterLink>.
          Money Plan is operated by Money Plan (moneyplann.com).
        </p>
      </section>

      <h2 class="mb-4 text-lg font-semibold">Frequently asked questions</h2>

      <div class="space-y-3">
        <article
          v-for="(item, i) in faqs"
          :key="i"
          class="theme-card rounded-2xl overflow-hidden"
        >
          <button
            type="button"
            class="flex w-full cursor-pointer items-start justify-between gap-4 px-5 py-4 text-left"
            :aria-expanded="openIndex === i"
            @click="toggle(i)"
          >
            <h2 class="text-base font-semibold leading-snug">{{ item.q }}</h2>
            <FontAwesomeIcon
              icon="chevron-down"
              class="mt-0.5 shrink-0 text-sm transition-transform duration-200"
              :style="{ transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)' }"
            />
          </button>
          <div
            v-show="openIndex === i"
            class="theme-border border-t px-5 pb-5 pt-3"
          >
            <p class="theme-muted text-sm leading-relaxed">{{ item.a }}</p>
          </div>
        </article>
      </div>

      <div class="mt-12 rounded-2xl p-6 text-center" style="background: var(--color-accent-soft); border: 1px solid var(--color-border)">
        <h2 class="text-xl font-semibold">Still need help?</h2>
        <p class="theme-muted mt-2 text-sm">
          Email
          <a :href="`mailto:${supportEmail}`" class="font-semibold underline">{{ supportEmail }}</a>
          and we will get back to you.
        </p>
        <RouterLink
          to="/login"
          class="theme-button-primary mt-5 inline-flex cursor-pointer rounded-xl px-7 py-3 font-semibold"
        >
          Open Money Plan
        </RouterLink>
      </div>
    </div>

    <footer class="theme-border theme-subtle border-t py-8 text-center text-sm">
      Money Plan — Simple finance control for everyday life ·
      <RouterLink to="/" class="hover:underline">Home</RouterLink>
      ·
      <RouterLink to="/privacy" class="hover:underline">Privacy</RouterLink>
    </footer>
  </div>
</template>
