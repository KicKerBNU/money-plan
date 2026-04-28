export default {
  home: {
    badge: 'Money Plan',
    headline: 'Controle seu dinheiro com',
    headlineHighlight: 'clareza e confiança',
    description:
      'Registre suas despesas diárias, organize cada categoria e entenda exatamente para onde vai seu orçamento mensal em um painel seguro.',
    trustNote: 'Privado por padrão. Seus registros ficam vinculados à sua conta segura.',
    cta: {
      login: 'Entrar e começar',
      howItWorks: 'Como funciona',
    },
    mockup: {
      month: 'Resumo de abril',
      title: 'Visão mensal',
      status: 'No controle',
      income: 'Receitas',
      expenses: 'Despesas',
      monthlyCosts: 'Evolução dos custos mensais',
      categories: 'Gastos por categoria',
      currentMonth: 'Mês atual',
      recent: 'Atividade recente',
    },
    actions: {
      title: 'O que você pode fazer com o Money Plan',
      items: {
        expenses: 'Adicionar despesas diárias com data, valor, categoria, conta e observação.',
        income: 'Registrar sua receita mensal e entradas extras de dinheiro.',
        accounts: 'Organizar gastos por Dinheiro, Contas Bancárias, Cartão ou contas personalizadas.',
        categories: 'Usar categorias padrão ou criar novas categorias para sua rotina real.',
        stats: 'Ver totais do mês por categoria e entender para onde o dinheiro vai.',
        secure: 'Entrar com segurança e manter seus registros conectados à sua conta.',
      },
    },
    features: {
      tracking: {
        title: 'Registro diário de despesas',
        description: 'Registre cada despesa em segundos com data, valor, conta, categoria e observação.',
      },
      categories: {
        title: 'Categorias inteligentes',
        description: 'Use categorias padrão desde o início e crie novas conforme sua rotina evolui.',
      },
      accounts: {
        title: 'Contas em um só lugar',
        description: 'Organize dinheiro, contas bancárias e cartões com um fluxo simples e consistente.',
      },
      monthlyStats: {
        title: 'Insights mensais',
        description: 'Visualize totais por categoria e identifique padrões de gasto ao longo do mês.',
      },
    },
    how: {
      title: 'Como funciona',
      description: 'O produto nasce de um hábito simples: registrar, organizar e revisar.',
      steps: {
        capture: {
          title: 'Entre com segurança',
          description: 'Acesse seu espaço financeiro privado e mantenha seus registros protegidos.',
        },
        organize: {
          title: 'Adicione receitas e despesas',
          description: 'Registre o dinheiro que entra e cada despesa diária quando ela acontece.',
        },
        analyze: {
          title: 'Revise seu mês',
          description: 'Use totais por categoria e gráficos para decidir melhor antes do mês acabar.',
        },
      },
    },
    footer: 'Money Plan — Controle financeiro simples para o dia a dia',
  },
  common: {
    loading: 'Carregando...',
    unexpectedError: 'Erro inesperado',
    add: 'Adicionar',
  },
  theme: {
    light: 'Modo claro',
    dark: 'Modo escuro',
  },
  auth: {
    login: {
      badge: 'Acesso seguro',
      title: 'Bem-vindo de volta',
      createTitle: 'Crie sua conta',
      description: 'Entre para manter suas despesas, receitas e insights mensais conectados à sua conta.',
      emailLabel: 'Email',
      emailPlaceholder: 'Digite seu email',
      passwordLabel: 'Senha',
      passwordPlaceholder: 'Pelo menos 6 caracteres',
      emailSubmit: 'Entrar com email',
      createSubmit: 'Criar conta',
      or: 'ou',
      googleButton: 'Fazer login com o Google',
      noAccount: 'Ainda não tem uma conta?',
      hasAccount: 'Já tem uma conta?',
      createLink: 'Criar uma',
      loginLink: 'Entrar',
      errors: {
        invalidCredential: 'Email ou senha incorretos.',
        emailInUse: 'Este email já está cadastrado.',
        weakPassword: 'Use uma senha com pelo menos 6 caracteres.',
        invalidEmail: 'Informe um email válido.',
        generic: 'Não foi possível autenticar. Tente novamente.',
      },
    },
  },
  appNav: {
    brand: 'Money Plan',
    period: 'Abril 2026',
    overview: 'Resumo',
    income: 'Receitas',
    expenses: 'Despesas',
    stats: 'Estatísticas',
    accounts: 'Contas',
    add: 'Adicionar',
    me: 'Eu',
    netLabel: 'Saldo abril',
    netValue: '+US$ 2.010',
    logout: 'Sair',
  },
  income: {
    title: 'Receitas',
    subtitle: 'Salário, freelas e entradas extras.',
    summary: {
      totalIncome: 'Receita total · abril',
      details: '4 lançamentos · último em 22 de abr',
    },
    quickAdd: {
      title: 'Adicionar rápido',
    },
    recent: {
      title: 'Receitas recentes',
    },
    form: {
      date: 'Data',
      amount: 'Valor',
      note: 'Observação',
      notePlaceholder: 'Observação (ex: Freela, reembolso)',
      submit: 'Adicionar receita',
    },
  },
  expenses: {
    title: 'Despesas',
    subtitle: 'Gastos diários — {count} lançamentos neste mês.',
    searchPlaceholder: 'Buscar observações ou categorias',
    empty: 'Nenhuma despesa encontrada para este filtro.',
    actions: {
      addExpense: 'Adicionar despesa',
    },
    filters: {
      all: 'Todos',
    },
    summary: {
      totalSpent: 'Total gasto',
      dailyAverage: 'Média diária',
      largestDay: 'Maior dia',
      cashFlow: 'Fluxo de caixa',
    },
    panels: {
      byCategory: 'Por categoria',
      byAccount: 'Por conta',
    },
    form: {
      title: 'Nova despesa',
      date: 'Data',
      amount: 'Valor',
      category: 'Categoria',
      account: 'Conta',
      note: 'Observação',
      submit: 'Adicionar despesa',
    },
    addAccount: {
      title: 'Adicionar conta',
      placeholder: 'Nome da conta',
    },
    addCategory: {
      title: 'Adicionar categoria',
      placeholder: 'Nome da categoria',
    },
  },
  stats: {
    title: 'Estatísticas mensais',
    subtitle: 'Despesas do mês atual por categoria.',
    refresh: 'Atualizar',
    total: 'Total de despesas',
  },
}
