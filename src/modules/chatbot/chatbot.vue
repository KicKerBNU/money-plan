<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FinanceNav from '@/modules/app/finance-nav.vue'
import FinancePageSkeleton from '@/modules/app/FinancePageSkeleton.vue'
import { sendExpenseChat, type ExpenseChatMessage } from '@/modules/chatbot/expense-chat.api'
import { CHATBOT_LOADING_VERBS } from '@/modules/chatbot/chatbotLoadingVerbs'

const { t } = useI18n()

const messages = ref<ExpenseChatMessage[]>([])
const draft = ref('')
const isSending = ref(false)
const errorMessage = ref<string | null>(null)
const scrollAnchor = ref<HTMLElement | null>(null)

const loadingVerb = ref('')
const loadingDotsCount = ref(1)

let dotsInterval: ReturnType<typeof setInterval> | null = null

function clearDotsAnimation() {
  if (dotsInterval) {
    clearInterval(dotsInterval)
    dotsInterval = null
  }
}

function pickLoadingVerb() {
  const verbs = CHATBOT_LOADING_VERBS
  const i = Math.floor(Math.random() * verbs.length)
  loadingVerb.value = verbs[i] ?? 'Thinking'
}

function startDotsAnimation() {
  clearDotsAnimation()
  loadingDotsCount.value = 1
  dotsInterval = setInterval(() => {
    loadingDotsCount.value = loadingDotsCount.value >= 3 ? 1 : loadingDotsCount.value + 1
  }, 1000)
}

watch(isSending, (sending) => {
  if (sending) {
    pickLoadingVerb()
    startDotsAnimation()
    void nextTick(() => scrollToBottom())
    return
  }
  clearDotsAnimation()
  loadingVerb.value = ''
  loadingDotsCount.value = 1
})

const loadingDotsText = computed(() => '.'.repeat(loadingDotsCount.value))

const showThreadHydrateSkeleton = ref(true)
let hydrateSkeletonTimer: number | null = null

onMounted(() => {
  hydrateSkeletonTimer = window.setTimeout(() => {
    showThreadHydrateSkeleton.value = false
    hydrateSkeletonTimer = null
  }, 175)
})

onBeforeUnmount(() => {
  if (hydrateSkeletonTimer !== null) {
    window.clearTimeout(hydrateSkeletonTimer)
    hydrateSkeletonTimer = null
  }
  clearDotsAnimation()
})

function scrollToBottom() {
  void nextTick(() => {
    scrollAnchor.value?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  })
}

async function send() {
  const text = draft.value.trim()
  if (!text || isSending.value) return

  errorMessage.value = null
  const userMessage: ExpenseChatMessage = { role: 'user', content: text }
  messages.value = [...messages.value, userMessage]
  draft.value = ''
  isSending.value = true
  scrollToBottom()

  try {
    const { reply } = await sendExpenseChat(messages.value, {
      toast: { silentSuccess: true, silentError: true },
    })

    messages.value = [...messages.value, { role: 'assistant', content: reply }]
    scrollToBottom()
  } catch (e) {
    const msg = e instanceof Error ? e.message : t('common.unexpectedError')
    errorMessage.value = msg
    messages.value = messages.value.filter((m) => m !== userMessage)
  } finally {
    isSending.value = false
  }
}

function clearChat() {
  if (isSending.value) return
  messages.value = []
  errorMessage.value = null
}

const showMessageList = computed(() => messages.value.length > 0 || isSending.value)
</script>

<template>
  <div class="app-shell">
    <FinanceNav />

    <main class="app-content app-mobile-screen" :aria-busy="showThreadHydrateSkeleton">
      <div class="app-finance-page-inner">
        <header class="mobile-page-header flex flex-wrap items-start justify-between gap-4 pt-9 lg:pt-0">
          <div>
            <p class="theme-muted text-xs font-black uppercase tracking-[0.16em]">
              {{ t('appNav.brand') }} · {{ t('appNav.chatbot') }}
            </p>
            <h1 class="mt-1 text-2xl font-black leading-tight tracking-tight lg:text-[2rem]">
              {{ t('chatbot.title') }}
            </h1>
            <p class="theme-muted mt-1 max-w-3xl text-sm lg:text-[0.95rem]">{{ t('chatbot.subtitle') }}</p>
          </div>
          <button
            v-if="messages.length > 0"
            type="button"
            class="theme-muted shrink-0 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors hover:bg-[color-mix(in_srgb,var(--color-border)_55%,transparent)]"
            style="border-color: var(--color-border); color: var(--color-primary)"
            @click="clearChat"
          >
            {{ t('chatbot.clear') }}
          </button>
        </header>

        <div
          class="finance-card mt-6 flex min-h-[min(22rem,calc(100svh-12rem))] max-h-[calc(100svh-12.5rem)] flex-col overflow-hidden rounded-2xl lg:max-h-[calc(100vh-10.5rem)]"
        >
          <div class="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
              <template v-if="!showMessageList && showThreadHydrateSkeleton">
                <FinancePageSkeleton variant="chat" />
              </template>
              <template v-else-if="!showMessageList">
                <p class="theme-muted text-sm">{{ t('chatbot.empty') }}</p>
              </template>

              <ul v-else class="flex flex-col gap-3">
                <li
                  v-for="(msg, index) in messages"
                  :key="index"
                  class="flex"
                  :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
                >
                  <div
                    class="max-w-[min(100%,28rem)] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                    :class="
                      msg.role === 'user'
                        ? 'rounded-br-md font-semibold text-white'
                        : 'finance-card rounded-bl-md'
                    "
                    :style="
                      msg.role === 'user' ? { backgroundColor: 'var(--color-primary)' } : {}
                    "
                  >
                    <p class="mb-1 text-[0.65rem] font-black uppercase tracking-wide opacity-70">
                      {{ msg.role === 'user' ? t('chatbot.you') : t('chatbot.assistant') }}
                    </p>
                    <p class="whitespace-pre-wrap">{{ msg.content }}</p>
                  </div>
                </li>

                <li v-if="isSending" class="flex justify-start">
                  <div
                    class="chatbot-loading-bubble animate-pulse max-w-[min(100%,28rem)] rounded-2xl rounded-bl-md px-3.5 py-2.5 text-sm finance-card motion-reduce:animate-none motion-reduce:opacity-95"
                    :aria-label="t('chatbot.loadingLive')"
                    role="status"
                    aria-live="polite"
                    aria-busy="true"
                  >
                    <p class="mb-1 text-[0.65rem] font-black uppercase tracking-wide opacity-70">
                      {{ t('chatbot.assistant') }}
                    </p>
                    <p class="font-semibold tracking-tight text-[color:var(--color-text)]">
                      <span class="chatbot-loading-verb">{{ loadingVerb }}</span
                      ><span class="tabular-nums text-[color:var(--color-primary)]">{{
                        loadingDotsText
                      }}</span>
                    </p>
                  </div>
                </li>
              </ul>
              <div ref="scrollAnchor" class="h-1 w-full shrink-0" aria-hidden="true" />
            </div>

            <div
              v-if="errorMessage"
              class="theme-border border-t px-5 py-3 text-sm sm:px-6"
              style="color: var(--color-danger)"
            >
              {{ errorMessage }}
            </div>

            <form
              class="theme-border flex flex-col gap-3 border-t px-5 py-4 sm:px-6"
              style="background: var(--color-surface-soft)"
              @submit.prevent="send"
            >
              <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
                <label
                  class="flex min-h-0 min-w-0 flex-1 cursor-text flex-col gap-2 rounded-xl border-2 px-4 py-3 shadow-sm outline-none ring-offset-2 ring-offset-[var(--color-surface-soft)] transition-[border-color,box-shadow] focus-within:border-[color-mix(in_srgb,var(--color-primary)_55%,var(--color-border))] focus-within:ring-2 focus-within:ring-[color-mix(in_srgb,var(--color-primary)_32%,transparent)]"
                  style="
                    border-color: var(--color-border);
                    background: var(--color-surface);
                    --tw-ring-offset-color: var(--color-surface-soft);
                  "
                >
                  <span
                    class="theme-muted pointer-events-none text-[0.65rem] font-black uppercase tracking-wide select-none"
                  >
                    {{ t('chatbot.inputLabel') }}
                  </span>
                  <textarea
                    id="chatbot-input"
                    v-model="draft"
                    rows="3"
                    :disabled="isSending"
                    maxlength="6000"
                    class="min-h-[5.5rem] w-full flex-1 resize-y border-0 bg-transparent p-0 text-sm text-[var(--color-text)] outline-none ring-0 placeholder:text-[var(--color-muted)] focus:ring-0 disabled:cursor-not-allowed disabled:opacity-55"
                    :placeholder="t('chatbot.placeholder')"
                    @keydown.enter.exact.prevent="send"
                  />
                </label>
                <button
                  type="submit"
                  class="flex h-11 shrink-0 items-center justify-center gap-2 self-stretch rounded-xl px-5 text-sm font-black text-white sm:self-auto disabled:opacity-45"
                  style="background: var(--color-primary)"
                  :disabled="isSending || !draft.trim()"
                >
                  <FontAwesomeIcon v-if="isSending" icon="spinner" class="animate-spin motion-reduce:animate-none" />
                  {{ isSending ? t('chatbot.sending') : t('chatbot.send') }}
                </button>
              </div>
            </form>
        </div>
      </div>
    </main>
  </div>
</template>
