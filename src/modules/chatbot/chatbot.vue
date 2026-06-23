<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FinanceNav from '@/modules/app/finance-nav.vue'
import FinancePageSkeleton from '@/modules/app/FinancePageSkeleton.vue'
import { sendExpenseChat, type ExpenseChatMessage } from '@/modules/chatbot/expense-chat.api'
import {
  grantExpenseChatAIConsent,
  hasExpenseChatAIConsent,
} from '@/modules/chatbot/expense-chat-consent'
import { CHATBOT_LOADING_VERBS } from '@/modules/chatbot/chatbotLoadingVerbs'
import { useAuthStore } from '@/modules/auth/store/auth.store'

const { t } = useI18n()
const authStore = useAuthStore()

const messages = ref<ExpenseChatMessage[]>([])
const draft = ref('')
const isSending = ref(false)
const errorMessage = ref<string | null>(null)
const scrollAnchor = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const showConsentSheet = ref(false)

const firebaseUid = computed(() => authStore.user?.uid ?? null)
const hasAIConsent = computed(() => {
  const uid = firebaseUid.value
  return uid ? hasExpenseChatAIConsent(uid) : false
})

const canSend = computed(() => draft.value.trim().length > 0 && !isSending.value && hasAIConsent.value)

/** Auto-grows the composer textarea up to ~6 lines, matching Gemini/ChatGPT input feel. */
function autosizeTextarea() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  const maxHeight = 168 // ~6 lines @ 28px line-height
  el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
}

watch(draft, () => {
  void nextTick(() => autosizeTextarea())
})

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

  if (firebaseUid.value && !hasExpenseChatAIConsent(firebaseUid.value)) {
    showConsentSheet.value = true
  }
})

watch(firebaseUid, (uid) => {
  if (uid && !hasExpenseChatAIConsent(uid)) {
    showConsentSheet.value = true
  }
})

function grantConsent() {
  const uid = firebaseUid.value
  if (!uid) return
  grantExpenseChatAIConsent(uid)
  showConsentSheet.value = false
}

function declineConsent() {
  showConsentSheet.value = false
}

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
  if (!text || isSending.value || !hasAIConsent.value) return

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

    <main class="app-content app-mobile-screen chatbot-screen" :aria-busy="showThreadHydrateSkeleton">
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
            class="theme-muted shrink-0 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-[color-mix(in_srgb,var(--color-border)_55%,transparent)]"
            style="border-color: var(--color-border); color: var(--color-primary)"
            @click="clearChat"
          >
            {{ t('chatbot.clear') }}
          </button>
        </header>

        <div
          class="chatbot-panel finance-card mt-6 flex min-h-[min(22rem,calc(100svh-12rem))] max-h-[calc(100svh-12.5rem)] flex-col overflow-hidden rounded-2xl lg:max-h-[calc(100vh-10.5rem)]"
        >
          <div class="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
              <template v-if="!showMessageList && showThreadHydrateSkeleton">
                <FinancePageSkeleton variant="chat" />
              </template>
              <template v-else-if="!showMessageList">
                <div v-if="!hasAIConsent" class="space-y-4">
                  <div class="finance-card rounded-2xl p-4 sm:p-5">
                    <h2 class="text-sm font-black">{{ t('chatbot.aiConsent.title') }}</h2>
                    <p class="theme-muted mt-2 text-sm leading-relaxed">
                      {{ t('chatbot.aiConsent.bannerBody') }}
                    </p>
                    <div class="mt-4 space-y-3 text-sm">
                      <div>
                        <p class="font-semibold">{{ t('chatbot.aiConsent.whatTitle') }}</p>
                        <p class="theme-muted mt-1 leading-relaxed">{{ t('chatbot.aiConsent.whatBody') }}</p>
                      </div>
                      <div>
                        <p class="font-semibold">{{ t('chatbot.aiConsent.whoTitle') }}</p>
                        <p class="theme-muted mt-1 leading-relaxed">{{ t('chatbot.aiConsent.whoBody') }}</p>
                      </div>
                      <div>
                        <p class="font-semibold">{{ t('chatbot.aiConsent.howTitle') }}</p>
                        <p class="theme-muted mt-1 leading-relaxed">{{ t('chatbot.aiConsent.howBody') }}</p>
                      </div>
                    </div>
                    <div class="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        class="theme-button-primary cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold"
                        @click="grantConsent"
                      >
                        {{ t('chatbot.aiConsent.agree') }}
                      </button>
                      <RouterLink to="/privacy" class="text-sm font-semibold underline">
                        {{ t('chatbot.aiConsent.privacyLink') }}
                      </RouterLink>
                    </div>
                  </div>
                </div>
                <p v-else class="theme-muted text-sm">{{ t('chatbot.empty') }}</p>
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
              v-if="hasAIConsent"
              class="chatbot-composer flex shrink-0 px-4 pt-3 pb-4 sm:px-6"
              @submit.prevent="send"
            >
              <label
                class="chatbot-pill flex w-full min-w-0 items-end gap-2 rounded-[1.65rem] px-2 py-2 transition-[box-shadow,border-color] focus-within:shadow-lg"
                :for="'chatbot-input'"
              >
                <span class="sr-only">{{ t('chatbot.inputLabel') }}</span>

                <button
                  type="button"
                  class="chatbot-pill-btn flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  :aria-label="t('chatbot.actionsAria')"
                  tabindex="-1"
                  disabled
                >
                  <FontAwesomeIcon icon="plus" />
                </button>

                <textarea
                  id="chatbot-input"
                  v-model="draft"
                  ref="textareaRef"
                  rows="1"
                  :disabled="isSending"
                  maxlength="6000"
                  enterkeyhint="send"
                  autocomplete="off"
                  autocorrect="on"
                  class="chatbot-input min-w-0 flex-1 resize-none self-center border-0 bg-transparent p-2 leading-snug text-[var(--color-text)] outline-none ring-0 placeholder:text-[var(--color-muted)] focus:ring-0 disabled:cursor-not-allowed disabled:opacity-55"
                  :placeholder="t('chatbot.placeholder')"
                  @keydown.enter.exact.prevent="send"
                  @input="autosizeTextarea"
                />

                <button
                  type="submit"
                  class="chatbot-send-btn flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  :class="canSend ? 'is-ready' : 'is-idle'"
                  :aria-label="t('chatbot.send')"
                  :disabled="isSending || !canSend"
                >
                  <FontAwesomeIcon
                    v-if="isSending"
                    icon="spinner"
                    class="animate-spin motion-reduce:animate-none"
                  />
                  <FontAwesomeIcon v-else icon="arrow-up" />
                </button>
              </label>
            </form>
            <p
              v-else
              class="theme-muted shrink-0 border-t px-5 py-4 text-center text-sm sm:px-6"
              style="border-color: var(--color-border)"
            >
              {{ t('chatbot.aiConsent.blockedHint') }}
            </p>
        </div>
      </div>
    </main>

    <Teleport to="body">
      <div
        v-if="showConsentSheet"
        class="fixed inset-0 z-[1100] flex items-end justify-center bg-black/40 px-4 pb-6 sm:items-center sm:pb-8"
        role="presentation"
        @click.self="declineConsent"
      >
        <div
          class="finance-card max-h-[min(90svh,40rem)] w-full max-w-lg overflow-y-auto rounded-2xl p-5 shadow-xl sm:p-6"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="ai-consent-title"
          @click.stop
        >
          <div class="flex items-start justify-between gap-3">
            <h2 id="ai-consent-title" class="text-lg font-black">{{ t('chatbot.aiConsent.title') }}</h2>
            <button
              type="button"
              class="theme-muted flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl hover:bg-[color-mix(in_srgb,var(--color-border)_70%,transparent)]"
              :aria-label="t('common.close')"
              @click="declineConsent"
            >
              <FontAwesomeIcon icon="xmark" />
            </button>
          </div>
          <p class="theme-muted mt-3 text-sm leading-relaxed">{{ t('chatbot.aiConsent.intro') }}</p>
          <div class="mt-4 space-y-3 text-sm">
            <div class="finance-card rounded-xl p-3">
              <p class="font-semibold">{{ t('chatbot.aiConsent.whatTitle') }}</p>
              <p class="theme-muted mt-1 leading-relaxed">{{ t('chatbot.aiConsent.whatBody') }}</p>
            </div>
            <div class="finance-card rounded-xl p-3">
              <p class="font-semibold">{{ t('chatbot.aiConsent.whoTitle') }}</p>
              <p class="theme-muted mt-1 leading-relaxed">{{ t('chatbot.aiConsent.whoBody') }}</p>
            </div>
            <div class="finance-card rounded-xl p-3">
              <p class="font-semibold">{{ t('chatbot.aiConsent.howTitle') }}</p>
              <p class="theme-muted mt-1 leading-relaxed">{{ t('chatbot.aiConsent.howBody') }}</p>
            </div>
          </div>
          <RouterLink to="/privacy" class="mt-4 inline-block text-sm font-semibold underline">
            {{ t('chatbot.aiConsent.privacyLink') }}
          </RouterLink>
          <div class="mt-6 grid grid-cols-2 gap-2">
            <button
              type="button"
              class="theme-button-secondary cursor-pointer rounded-xl px-4 py-3 text-sm"
              @click="declineConsent"
            >
              {{ t('chatbot.aiConsent.decline') }}
            </button>
            <button
              type="button"
              class="theme-button-primary cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold"
              @click="grantConsent"
            >
              {{ t('chatbot.aiConsent.agree') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
