<script setup lang="ts">
import ThemeToggle from '@/modules/theme/theme-toggle.vue'

const lastUpdated = 'June 23, 2026'
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
            and accounts, and ask questions about your spending through a built-in
            <strong class="text-[var(--color-text)]">Expense assistant</strong>.
            The service is operated by Money Plan and is available at
            <a href="https://www.moneyplann.com" class="underline">moneyplann.com</a>.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold">2. Account-based service and sign-in</h2>
          <p class="theme-muted mt-3 text-sm leading-relaxed">
            Money Plan is an <strong class="text-[var(--color-text)]">account-based</strong>
            personal finance app. You must create an account and sign in to use the service,
            including the Expense assistant (Chat).
          </p>
          <ul class="theme-muted mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
            <li>
              Expenses, income, accounts, overview, and the Expense assistant all read or write
              <strong class="text-[var(--color-text)]">your private financial data</strong>
              stored under your account on our servers.
            </li>
            <li>
              The Expense assistant is <strong class="text-[var(--color-text)]">not</strong>
              a general-purpose AI chatbot. It only answers questions about
              <strong class="text-[var(--color-text)]">your logged-in account’s expense records</strong>.
              Without sign-in we cannot identify you or access your data, so the assistant cannot
              function.
            </li>
            <li>
              There is no guest mode and no anonymous use of finance or chat features.
              Registration is required because the product’s core functionality depends on your
              account-linked data.
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold">3. Information we collect</h2>
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
              <strong class="text-[var(--color-text)]">Expense assistant messages:</strong>
              questions you send in Chat and the replies generated for you during that session.
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
          <h2 class="text-xl font-semibold">4. How we use your information</h2>
          <ul class="theme-muted mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
            <li>Authenticate you and keep your account secure.</li>
            <li>Store and sync your expense, income, and account data across your devices.</li>
            <li>
              Run the Expense assistant so it can query and summarize
              <strong class="text-[var(--color-text)]">your</strong> expense records when you ask.
            </li>
            <li>Improve reliability, fix bugs, and respond to support requests.</li>
          </ul>
          <p class="theme-muted mt-3 text-sm leading-relaxed">
            We do not sell your personal or financial data. We do not use your data for
            third-party advertising. We do not use the Expense assistant to train our own models.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold">5. Expense assistant (AI) and LLM processing</h2>
          <p class="theme-muted mt-3 text-sm leading-relaxed">
            When you use Chat after signing in, your messages are sent to our backend API.
            Our servers may call
            <strong class="text-[var(--color-text)]">OpenAI</strong>
            (a large language model provider) to generate a reply. This happens only for
            authenticated users and only in the context of your account.
          </p>

          <h3 class="mt-5 text-base font-semibold">What we send for AI processing</h3>
          <ul class="theme-muted mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed">
            <li>Your chat messages and recent messages in the current conversation (up to a limit per request).</li>
            <li>
              Expense data retrieved from <strong class="text-[var(--color-text)]">your account only</strong>
              when needed to answer your question — for example totals, category breakdowns, or
              individual expense lines for a date range you asked about.
            </li>
            <li>
              A calendar “today” date from your device so relative phrases like “this month” are
              interpreted correctly.
            </li>
            <li>Instructions that restrict the assistant to expense-related questions about your data.</li>
          </ul>

          <h3 class="mt-5 text-base font-semibold">What we do not send or allow</h3>
          <ul class="theme-muted mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed">
            <li>Other users’ data — queries are scoped to the signed-in account only.</li>
            <li>
              Income or account-balance data through the assistant (the assistant is limited to
              read-only expense queries unless you enter that information yourself in a message).
            </li>
            <li>General knowledge, trivia, or off-topic requests — the assistant is designed to refuse them.</li>
            <li>Your data for third-party advertising.</li>
          </ul>

          <h3 class="mt-5 text-base font-semibold">Storage of chat content</h3>
          <p class="theme-muted mt-2 text-sm leading-relaxed">
            Chat conversations are processed to produce each reply. We do not maintain a separate
            long-term chat history database. Message content in a session exists in the app until
            you clear it or delete your account. Our backend processes requests transiently to
            call OpenAI and return an answer.
          </p>

          <p class="theme-muted mt-3 text-sm leading-relaxed">
            OpenAI processes content on our behalf under their
            <a
              href="https://openai.com/policies/privacy-policy"
              class="underline"
              target="_blank"
              rel="noopener noreferrer"
            >Privacy Policy</a>
            and
            <a
              href="https://openai.com/policies/api-data-usage-policies"
              class="underline"
              target="_blank"
              rel="noopener noreferrer"
            >API data usage policies</a>.
            We use the OpenAI API to provide the feature, not to build public-facing AI products
            from your chats.
          </p>
          <p class="theme-muted mt-3 text-sm leading-relaxed">
            Before your first use of the Expense assistant, the app asks for your
            <strong class="text-[var(--color-text)]">explicit permission</strong>
            in a disclosure that explains what data is sent and that it is shared with OpenAI.
            If you decline, the assistant will not send any data.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold">6. Service providers</h2>
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
              generating Expense assistant replies as described in section 5 (authenticated,
              account-scoped expense queries only).
            </li>
            <li>
              <strong class="text-[var(--color-text)]">Apple / Google:</strong>
              only when you choose their sign-in options.
            </li>
          </ul>
          <p class="theme-muted mt-3 text-sm leading-relaxed">
            These providers process data on our behalf under their own privacy and security
            obligations.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold">7. Data retention and deletion</h2>
          <p class="theme-muted mt-3 text-sm leading-relaxed">
            We keep your account and finance records while your account is active so the
            service can function. You can delete your account at any time from the app
            settings menu (gear icon) under
            <strong class="text-[var(--color-text)]">Delete account</strong>
            (website and iOS app). That permanently removes your Firebase login and all stored
            finance data. You can also contact us at
            <a :href="`mailto:${contactEmail}`" class="underline">{{ contactEmail }}</a>
            from the email tied to your account if you need help. We will delete or anonymize your data within
            a reasonable period, except where we must retain information for legal or
            security reasons.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold">8. Security</h2>
          <p class="theme-muted mt-3 text-sm leading-relaxed">
            We use industry-standard measures including HTTPS encryption in transit,
            Firebase Authentication, and access controls on our API and database.
            No method of transmission or storage is 100% secure, but we work to protect
            your information.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold">9. Children</h2>
          <p class="theme-muted mt-3 text-sm leading-relaxed">
            Money Plan is not directed to children under 13, and we do not knowingly collect
            personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold">10. Your rights</h2>
          <p class="theme-muted mt-3 text-sm leading-relaxed">
            Depending on where you live, you may have rights to access, correct, export, or
            delete your personal data. To exercise these rights, email
            <a :href="`mailto:${contactEmail}`" class="underline">{{ contactEmail }}</a>.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold">11. Changes to this policy</h2>
          <p class="theme-muted mt-3 text-sm leading-relaxed">
            We may update this Privacy Policy from time to time. We will revise the
            “Last updated” date at the top of this page when we do. Continued use of Money
            Plan after changes means you accept the updated policy.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold">12. Contact</h2>
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
