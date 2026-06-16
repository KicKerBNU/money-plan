<script setup lang="ts">
import ThemeToggle from '@/modules/theme/theme-toggle.vue'

const lastUpdated = 'June 8, 2026'
const contactEmail = 'support@moneyplann.com'
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
        <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">
          Privacy Policy
        </h1>
        <p class="theme-muted mt-4 text-sm">
          Last updated: {{ lastUpdated }}
        </p>
        <p class="theme-muted mt-4 max-w-2xl text-lg leading-relaxed">
          Money Plan (“we”, “us”, or “our”) explains here how we collect, use, and protect
          your information when you use the Money Plan website, iOS app, and related services.
        </p>
      </header>

      <div class="theme-card space-y-10 rounded-2xl px-6 py-8 sm:px-8">
        <section>
          <h2 class="text-xl font-semibold">1. Who we are</h2>
          <p class="theme-muted mt-3 text-sm leading-relaxed">
            Money Plan is a personal finance application that lets you track expenses, income,
            and accounts, and ask questions about your finances through a built-in AI assistant.
            The service is operated by Money Plan and is available at
            <a href="https://www.moneyplann.com" class="underline">moneyplann.com</a>.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold">2. Information we collect</h2>
          <ul class="theme-muted mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
            <li>
              <strong class="text-[var(--color-text)]">Account information:</strong>
              email address and authentication identifiers when you sign up or sign in
              (including Sign in with Apple or Google Sign-In).
            </li>
            <li>
              <strong class="text-[var(--color-text)]">Financial information you enter:</strong>
              expenses, income, account names, categories, notes, and amounts you choose to log.
            </li>
            <li>
              <strong class="text-[var(--color-text)]">Chat messages:</strong>
              questions you send to the AI expense assistant and the responses generated for you.
            </li>
            <li>
              <strong class="text-[var(--color-text)]">Technical data:</strong>
              basic request data needed to operate the service (for example, app version,
              timestamps, and error logs). On the website we may use Firebase Analytics;
              the iOS app does not include analytics tracking.
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold">3. How we use your information</h2>
          <ul class="theme-muted mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
            <li>Authenticate you and keep your account secure.</li>
            <li>Store and sync your expense, income, and account data across your devices.</li>
            <li>Power the AI chat so it can answer questions about your records.</li>
            <li>Improve reliability, fix bugs, and respond to support requests.</li>
          </ul>
          <p class="theme-muted mt-3 text-sm leading-relaxed">
            We do not sell your personal or financial data. We do not use your data for
            third-party advertising.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold">4. Service providers</h2>
          <p class="theme-muted mt-3 text-sm leading-relaxed">
            We use trusted providers to run Money Plan. Depending on how you use the app,
            data may be processed by:
          </p>
          <ul class="theme-muted mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
            <li>
              <strong class="text-[var(--color-text)]">Firebase (Google):</strong>
              authentication and account security.
            </li>
            <li>
              <strong class="text-[var(--color-text)]">Supabase / PostgreSQL:</strong>
              encrypted storage of your finance records on our backend.
            </li>
            <li>
              <strong class="text-[var(--color-text)]">Railway:</strong>
              hosting of our API servers.
            </li>
            <li>
              <strong class="text-[var(--color-text)]">OpenAI:</strong>
              processing chat messages you send to the AI assistant so we can generate replies
              based on your data.
            </li>
            <li>
              <strong class="text-[var(--color-text)]">Apple / Google:</strong>
              only when you choose their sign-in options.
            </li>
          </ul>
          <p class="theme-muted mt-3 text-sm leading-relaxed">
            These providers process data on our behalf under their own privacy and security
            obligations. Chat content sent for AI processing is limited to what is needed to
            answer your question.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold">5. Data retention and deletion</h2>
          <p class="theme-muted mt-3 text-sm leading-relaxed">
            We keep your account and finance records while your account is active so the
            service can function. You can delete your account at any time from the app
            settings menu (gear icon) under <strong class="text-[var(--color-text)]">Delete account</strong>.
            That permanently removes your Firebase login and all stored finance data.
            You can also contact us at
            <a :href="`mailto:${contactEmail}`" class="underline">{{ contactEmail }}</a>
            from the email tied to your account if you need help. We will delete or anonymize your data within
            a reasonable period, except where we must retain information for legal or
            security reasons.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold">6. Security</h2>
          <p class="theme-muted mt-3 text-sm leading-relaxed">
            We use industry-standard measures including HTTPS encryption in transit,
            Firebase Authentication, and access controls on our API and database.
            No method of transmission or storage is 100% secure, but we work to protect
            your information.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold">7. Children</h2>
          <p class="theme-muted mt-3 text-sm leading-relaxed">
            Money Plan is not directed to children under 13, and we do not knowingly collect
            personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold">8. Your rights</h2>
          <p class="theme-muted mt-3 text-sm leading-relaxed">
            Depending on where you live, you may have rights to access, correct, export, or
            delete your personal data. To exercise these rights, email
            <a :href="`mailto:${contactEmail}`" class="underline">{{ contactEmail }}</a>.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold">9. Changes to this policy</h2>
          <p class="theme-muted mt-3 text-sm leading-relaxed">
            We may update this Privacy Policy from time to time. We will revise the
            “Last updated” date at the top of this page when we do. Continued use of Money
            Plan after changes means you accept the updated policy.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold">10. Contact</h2>
          <p class="theme-muted mt-3 text-sm leading-relaxed">
            Questions about privacy or this policy:
            <a :href="`mailto:${contactEmail}`" class="underline">{{ contactEmail }}</a>.
            Support page:
            <RouterLink to="/faq" class="underline">FAQ</RouterLink>.
          </p>
        </section>
      </div>
    </div>

    <footer class="theme-border theme-subtle border-t py-8 text-center text-sm">
      Money Plan — Simple finance control for everyday life ·
      <RouterLink to="/" class="hover:underline">Home</RouterLink>
      ·
      <RouterLink to="/faq" class="hover:underline">FAQ</RouterLink>
    </footer>
  </div>
</template>
