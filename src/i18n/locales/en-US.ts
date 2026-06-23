export default {
  home: {
    badge: 'AI-Powered',
    badgeFree: '100% Free',
    headline: 'Talk to your money. ',
    headlineHighlight: 'It finally has the answers',
    description:
      'Track expenses, income, and accounts in one place, then chat with your built-in expense assistant. It answers in plain language from your actual data: totals, trends, and comparisons, so you see where your money really goes.',
    trustNote: 'Private by default. Your records stay linked to your secure account.',
    cta: {
      login: 'Login and start tracking',
      howItWorks: 'How it works',
    },
    mockup: {
      month: 'April overview',
      title: 'Monthly snapshot',
      status: 'On track',
      income: 'Income',
      expenses: 'Expenses',
      monthlyCosts: 'Monthly costs trend',
      categories: 'Spending by category',
      currentMonth: 'Current month',
      recent: 'Recent activity',
    },
    actions: {
      title: 'What you can do with Money Plan',
      items: {
        expenses: 'Add daily expenses with date, amount, category, account, and note.',
        income: 'Register your monthly income and extra money coming in.',
        accounts: 'Organize spending by Cash, Bank Accounts, Card, or custom accounts.',
        categories: 'Use default categories or create new ones that match your real life.',
        stats: 'See current-month category totals and understand where money goes.',
        secure: 'Login securely and keep your records connected to your account.',
      },
    },
    features: {
      chatbot: {
        title: 'AI Expense Chat',
        description: 'Ask your financial data questions in plain language. Get totals, trends, and comparisons without reading a single chart.',
      },
      tracking: {
        title: 'Daily Expense Tracking',
        description: 'Capture every expense in seconds with date, amount, account, category, and note.',
      },
      categories: {
        title: 'Smart Categories',
        description: 'Use default categories from day one and create custom ones as your life evolves.',
      },
      accounts: {
        title: 'Accounts in One Place',
        description: 'Organize cash, bank accounts, and cards with a consistent and simple workflow.',
      },
      monthlyStats: {
        title: 'Monthly Insights',
        description: 'Visualize category totals and quickly identify spending patterns each month.',
      },
    },
    how: {
      title: 'How it works',
      description: 'The product is built around one simple habit: record, organize, review.',
      steps: {
        capture: {
          title: 'Login securely',
          description: 'Access your private finance space and keep your records protected.',
        },
        organize: {
          title: 'Add income and expenses',
          description: 'Record money coming in and every daily expense as it happens.',
        },
        chat: {
          title: 'Ask the AI assistant',
          description: 'Chat with your data: ask totals, trends, and comparisons in plain language — no charts, no manual math.',
        },
      },
    },
    footer: 'Money Plan — Simple finance control for everyday life',
  },
  common: {
    loading: 'Loading...',
    unexpectedError: 'Unexpected error',
    add: 'Add',
    edit: 'Edit',
    save: 'Save',
    delete: 'Delete',
    cancel: 'Cancel',
    close: 'Close',
    saving: 'Saving…',
  },
  toast: {
    saveSuccess: 'Saved successfully.',
  },
  theme: {
    light: 'Light mode',
    dark: 'Dark mode',
  },
  preferences: {
    currency: 'Currency',
    currencyAuto: 'Auto · {code}',
  },
  auth: {
    login: {
      badge: 'Secure access',
      title: 'Welcome back',
      createTitle: 'Create your account',
      description: 'Sign in to keep your expenses, income, and monthly insights connected to your account.',
      emailLabel: 'Email',
      emailPlaceholder: 'Enter your email',
      passwordLabel: 'Password',
      passwordPlaceholder: 'At least 6 characters',
      emailSubmit: 'Login with email',
      createSubmit: 'Create account',
      or: 'or',
      googleButton: 'Sign in with Google',
      appleButton: 'Sign in with Apple',
      appleCreateButton: 'Sign up with Apple',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      createLink: 'Create one',
      loginLink: 'Login',
      errors: {
        invalidCredential: 'Email or password is incorrect.',
        invalidCredentialApple:
          'Apple sign-in could not be completed. In Firebase Authentication → Apple, recheck Services ID, Team ID, Key ID, and the .p8 private key (full file, correct line breaks). Also confirm the Apple Services ID return URL is https://money-plan-23efb.firebaseapp.com/__/auth/handler.',
        accountExistsDifferentCredential:
          'This email is already registered with another sign-in method (for example Google or email). Sign in that way first, or use a different Apple account.',
        emailInUse: 'This email is already registered.',
        weakPassword: 'Use a password with at least 6 characters.',
        invalidEmail: 'Enter a valid email address.',
        popupClosed: 'Sign-in was cancelled.',
        popupBlocked:
          'Your browser blocked the sign-in window. Allow pop-ups for this site, or try again — we will use a full-page sign-in if needed.',
        unauthorizedDomain:
          'Google sign-in is not allowed on this address. Open Money Plan at localhost or your production URL (for example moneyplann.com).',
        unauthorizedDomainApple:
          'Sign in with Apple is not allowed on this address. Add this domain under Firebase Authentication → Settings → Authorized domains, and in Apple Developer configure your Services ID with the same domain.',
        operationNotAllowed:
          'This sign-in method is disabled for this app. Enable it in Firebase Authentication.',
        operationNotAllowedGoogle:
          'Google sign-in is disabled for this app. Enable the Google provider in Firebase Authentication.',
        operationNotAllowedApple:
          'Sign in with Apple is not configured for the web app. In Firebase Authentication → Apple, add your Apple Services ID, Team ID, Key ID, and private key (web requires these in addition to the iOS app). In Apple Developer, set the return URL to https://money-plan-23efb.firebaseapp.com/__/auth/handler.',
        networkFailed: 'Network error while signing in. Check your connection and try again.',
        internalError: 'Sign-in failed unexpectedly. Try again or use email login.',
        internalErrorApple:
          'Sign in with Apple failed unexpectedly. Confirm the Apple provider is fully configured for web in Firebase and Apple Developer.',
        argumentErrorGoogle:
          'Google sign-in is misconfigured for this app. Confirm Google is enabled in Firebase Authentication and the Web OAuth client is set up.',
        argumentErrorApple:
          'Sign in with Apple is misconfigured for the web app. Confirm the Apple Services ID, Team ID, Key ID, and private key are set in Firebase Authentication → Apple.',
        localDevOrigin:
          'Google sign-in needs this dev URL authorized: {origin}. In Google Cloud Console → Credentials → your Firebase Web client → Authorized JavaScript origins, add that exact URL, save, wait a minute, then retry.',
        withCode: 'Unable to authenticate ({code}). Try again or use email login.',
        generic: 'Unable to authenticate. Please try again.',
      },
    },
    deleteAccount: {
      menu: 'Delete account',
      confirmTitle: 'Delete your account?',
      confirmBody:
        'This permanently deletes your Money Plan account, all expenses, income, accounts, and categories. This cannot be undone.',
      confirmAction: 'Delete account',
      success: 'Your account was deleted.',
    },
  },
  appNav: {
    brand: 'Money Plan',
    overview: 'Overview',
    income: 'Income',
    expenses: 'Expenses',
    stats: 'Stats',
    accounts: 'Accounts',
    add: 'Add',
    me: 'Me',
    cashFlow: 'Cash flow',
    logout: 'Logout',
    settingsMenu: 'Settings and account',
    chatbot: 'Chatbot',
  },
  chatbot: {
    title: 'Expense assistant',
    subtitle:
      'Ask about your spending in your own words—we’ll help with totals, comparisons, and spotting patterns in the expenses you’ve already saved.',
    empty: 'Examples: “How much did I spend on 2026-05-02?” · “Sum for last month” · “Top spending categories this year”.',
    you: 'You',
    assistant: 'Assistant',
    placeholder: 'Ask about your expenses…',
    send: 'Send',
    sending: 'Thinking…',
    clear: 'New chat',
    inputLabel: 'Your message',
    loadingLive: 'Assistant is preparing a reply',
    actionsAria: 'More actions',
    aiConsent: {
      title: 'Third-party AI processing',
      intro:
        'Before you use the Expense assistant, please review what we send and who receives it. We only send data after you agree below.',
      whatTitle: 'What we send',
      whatBody:
        'Your chat messages, recent messages in this conversation, and expense records from your account that are needed to answer your question (for example totals, categories, or expense lines for a date range you ask about).',
      whoTitle: 'Who receives it',
      whoBody:
        'OpenAI processes this data on our behalf through our backend API to generate replies. OpenAI does not receive your password or unrelated app data.',
      howTitle: 'How we use it',
      howBody:
        'Only to answer your expense questions inside Money Plan. We do not use the assistant for advertising or sell your data.',
      agree: 'Agree and continue',
      decline: 'Not now',
      blockedHint: 'Agree to AI processing above to send messages.',
      bannerBody:
        'To use Chat, you must agree to send your messages and relevant expense data to OpenAI via our servers. See details in the prompt or our Privacy Policy.',
      privacyLink: 'Privacy Policy',
    },
  },
  income: {
    title: 'Income',
    subtitle: 'Salary, freelance, and extra money in.',
    summary: {
      totalIncome: 'Total income · April',
      details: '{count} entries · last on {date}',
    },
    quickAdd: {
      title: 'Quick add',
    },
    recent: {
      title: 'Recent income',
    },
    form: {
      date: 'Date',
      amount: 'Amount',
      note: 'Note',
      notePlaceholder: 'Note (e.g. Freelance, refund)',
      submit: 'Add income',
    },
    confirmDelete: {
      title: 'Delete income?',
      body: 'This income entry will be removed. This cannot be undone.',
    },
  },
  expenses: {
    title: 'Expenses',
    subtitle: 'Daily spending — {count} entries this month.',
    searchPlaceholder: 'Search notes or categories',
    empty: 'No expenses found for this filter.',
    actions: {
      addExpense: 'Add expense',
    },
    list: {
      reorderHint:
        'Drag the grip on each row to reorder this month’s expenses (clear search, category filters, and date range first). Order is saved automatically.',
      dragHandleAria: 'Drag to reorder expense',
    },
    filters: {
      all: 'All',
      range: 'Range',
      from: 'From',
      to: 'To',
      clearDate: 'Clear',
      quickRange: 'Quick',
      last3Days: 'Last 3 days',
      last7Days: 'Last 7 days',
      tripWeek: 'Trip week',
      tripWeekModalTitle: 'Select trip range',
      tripWeekModalDescription: 'Choose the start and end dates to track spending for your travel period.',
      applyRange: 'Apply range',
      selectedDateSpend: 'Spent on {date}: {amount}',
      selectedDateRangeSpend: 'Spent in {date}: {amount}',
    },
    summary: {
      totalSpent: 'Total spent',
      dailyAverage: 'Daily avg',
      largestDay: 'Largest day',
      cashFlow: 'Cash flow',
    },
    mobile: {
      spentInApril: 'Spent in April',
      earnedAmount: 'of {amount} earned',
    },
    emptyMonth: {
      title: 'No expenses yet this month',
      description: 'Start by adding your first expense to unlock category insights and account balances.',
      cta: 'Add first expense',
    },
    panels: {
      byCategory: 'By category',
      byAccount: 'By account',
      byCategoryEmptyTitle: 'Nothing to show yet',
      byCategoryEmptyDescription:
        'This chart fills in from your expenses. Add a few entries to see how spending splits across categories this month.',
    },
    form: {
      title: 'New expense',
      editTitle: 'Edit expense',
      date: 'Date',
      amount: 'Amount',
      category: 'Category',
      account: 'Account',
      note: 'Note',
      submit: 'Add expense',
    },
    addAccount: {
      title: 'Add account',
      placeholder: 'Account name',
    },
    addCategory: {
      title: 'Add category',
      placeholder: 'Category name',
    },
    renameModal: {
      editAccount: 'Rename account',
      editCategory: 'Rename category',
      accountNameLabel: 'Account name',
      categoryNameLabel: 'Category name',
    },
    confirmDelete: {
      expenseTitle: 'Delete expense?',
      expenseBody: 'This expense will be removed. This cannot be undone.',
      accountTitle: 'Delete account?',
      accountBody: 'The account will be deleted only if no expenses are linked to it.',
      categoryTitle: 'Delete category?',
      categoryBody: 'The category will be deleted only if no expenses are linked to it.',
    },
  },
  accountsPage: {
    title: 'Accounts',
    subtitle: 'Cash, bank accounts, and cards used across income and expenses.',
    listTitle: 'Your accounts',
    empty: 'No accounts yet. Add one above.',
    defaultBadge: 'Default',
    balanceCaption: 'Current balance',
    dragHint:
      'Drag the handle to reorder. The first account is pre-selected for new expenses and income.',
    dragHandleAria: 'Drag to reorder accounts',
  },
  overview: {
    title: 'Overview',
    subtitle:
      'Income, spending, category mix, and balances for any week, month, or year—see where to adjust your budget.',
    period: {
      week: 'Week',
      month: 'Month',
      year: 'Year',
    },
    periodPrev: 'Previous period',
    periodNext: 'Next period',
    kpiIncome: 'Income',
    kpiExpenses: 'Expenses',
    kpiNet: 'Net',
    kpiSavingsRate: 'Savings rate',
    kpiAccounts: 'All accounts',
    chartTitle: 'Income vs expenses',
    chartIncome: 'Income',
    chartExpenses: 'Expenses',
    chartEmpty: 'No transactions in this range.',
    categoriesTitle: 'Top spending categories',
    insightsTitle: 'Where to focus',
    insightCta: 'Open',
    insights: {
      deficit: 'Spending exceeded income in this period—review expenses and cut optional categories first.',
      topCategory:
        '{name} represents about {pct}% of spending—open Stats to rebalance or set category targets.',
      savingsPositive: 'You retained roughly {pct}% of income after expenses—solid habit to keep.',
      emptyPeriod: 'No income or expenses in this range yet—start logging to unlock trends.',
      allGood: 'No single category dominates spending—keep logging monthly for steady insight.',
    },
    quickLinks: 'Jump to',
    linkExpenses: 'Expenses',
    linkIncome: 'Income',
    linkStats: 'Stats',
    linkAccounts: 'Accounts',
  },
  stats: {
    title: 'Monthly stats',
    subtitle: 'Each pillar is a category. Each brick is one expense. Stack height shows what dominated your month.',
    totalCaption: 'spent across {count} categories',
    mobileTotalCaption: '{count} categories',
    entryLabel: 'entry',
    brickHint: 'Brighter shade = larger expense in that category.',
    hoverHint: 'Hover for details.',
    lineupTitle: 'The line-up',
  },
  pwa: {
    updateReady: 'A new version is available.',
    reload: 'Reload',
    dismiss: 'Dismiss',
    install: 'Install App',
    addToHomeScreen: 'Add to Home Screen',
    iosInstructions: 'Tap the Share button in Safari, then select "Add to Home Screen".',
    gotIt: 'Got it',
  },
}
