export default {
  home: {
    badge: 'Com IA',
    badgeFree: '100% Grátis',
    headline: 'Fale com seu dinheiro. ',
    headlineHighlight: 'Ele finalmente tem as respostas',
    description:
      'Centralize receitas, despesas e contas em um painel seguro—e converse com o assistente de despesas. Ele responde em linguagem simples usando os seus próprios lançamentos: totais, tendências e comparativos, para você enxergar para onde vai o seu dinheiro.',
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
      chatbot: {
        title: 'Chat de Despesas com IA',
        description: 'Faça perguntas sobre seus dados financeiros em linguagem natural. Totais, tendências e comparativos sem precisar ler um único gráfico.',
      },
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
        chat: {
          title: 'Pergunte ao assistente de IA',
          description: 'Converse com seus dados: totais, tendências e comparativos em linguagem natural — sem gráficos, sem cálculos manuais.',
        },
      },
    },
    footer: 'Money Plan — Controle financeiro simples para o dia a dia',
  },
  common: {
    loading: 'Carregando...',
    unexpectedError: 'Erro inesperado',
    add: 'Adicionar',
    edit: 'Editar',
    save: 'Salvar',
    delete: 'Excluir',
    cancel: 'Cancelar',
    close: 'Fechar',
    saving: 'Salvando…',
  },
  toast: {
    saveSuccess: 'Salvo com sucesso.',
  },
  theme: {
    light: 'Modo claro',
    dark: 'Modo escuro',
  },
  preferences: {
    currency: 'Moeda',
    currencyAuto: 'Automática · {code}',
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
      appleButton: 'Entrar com a Apple',
      appleCreateButton: 'Criar conta com a Apple',
      noAccount: 'Ainda não tem uma conta?',
      hasAccount: 'Já tem uma conta?',
      createLink: 'Criar uma',
      loginLink: 'Entrar',
      errors: {
        invalidCredential: 'Email ou senha incorretos.',
        invalidCredentialApple:
          'Não foi possível concluir o login com Apple. Em Firebase Authentication → Apple, confira Services ID, Team ID, Key ID e a chave .p8 (arquivo completo, quebras de linha corretas). Confirme também a return URL do Services ID: https://money-plan-23efb.firebaseapp.com/__/auth/handler.',
        accountExistsDifferentCredential:
          'Este email já está cadastrado com outro método (por exemplo Google ou email). Entre desse jeito primeiro ou use outra conta Apple.',
        emailInUse: 'Este email já está cadastrado.',
        weakPassword: 'Use uma senha com pelo menos 6 caracteres.',
        invalidEmail: 'Informe um email válido.',
        popupClosed: 'O login foi cancelado.',
        popupBlocked:
          'O navegador bloqueou a janela de login. Permita pop-ups neste site ou tente de novo — usaremos login em página inteira se necessário.',
        unauthorizedDomain:
          'Login com Google não é permitido neste endereço. Abra o Money Plan em localhost ou na URL de produção (por exemplo moneyplann.com).',
        unauthorizedDomainApple:
          'Login com Apple não é permitido neste endereço. Adicione este domínio em Firebase Authentication → Settings → Authorized domains e, no Apple Developer, configure o Services ID com o mesmo domínio.',
        operationNotAllowed:
          'Este método de login está desativado neste app. Ative-o no Firebase Authentication.',
        operationNotAllowedGoogle:
          'Login com Google está desativado neste app. Ative o provedor Google no Firebase Authentication.',
        operationNotAllowedApple:
          'Login com Apple não está configurado para a web. Em Firebase Authentication → Apple, adicione o Services ID, Team ID, Key ID e chave privada da Apple (a web exige isso além do app iOS). No Apple Developer, defina a return URL como https://money-plan-23efb.firebaseapp.com/__/auth/handler.',
        networkFailed: 'Erro de rede ao fazer login. Verifique a conexão e tente de novo.',
        internalError: 'Falha inesperada no login. Tente de novo ou use email.',
        internalErrorApple:
          'Falha inesperada no login com Apple. Confirme que o provedor Apple está totalmente configurado para web no Firebase e no Apple Developer.',
        argumentErrorGoogle:
          'Login com Google mal configurado neste app. Confirme que o Google está ativo no Firebase Authentication e que o cliente OAuth Web está configurado.',
        argumentErrorApple:
          'Login com Apple mal configurado para a web. Confirme Services ID, Team ID, Key ID e chave privada em Firebase Authentication → Apple.',
        localDevOrigin:
          'O login com Google precisa desta URL de dev autorizada: {origin}. No Google Cloud Console → Credentials → cliente Web do Firebase → Authorized JavaScript origins, adicione essa URL exata, salve, aguarde um minuto e tente de novo.',
        withCode: 'Não foi possível autenticar ({code}). Tente de novo ou use email.',
        generic: 'Não foi possível autenticar. Tente novamente.',
      },
    },
    deleteAccount: {
      menu: 'Excluir conta',
      confirmTitle: 'Excluir sua conta?',
      confirmBody:
        'Isso exclui permanentemente sua conta Money Plan, todas as despesas, receitas, contas e categorias. Não dá para desfazer.',
      confirmAction: 'Excluir conta',
      success: 'Sua conta foi excluída.',
    },
  },
  appNav: {
    brand: 'Money Plan',
    overview: 'Resumo',
    income: 'Receitas',
    expenses: 'Despesas',
    stats: 'Estatísticas',
    accounts: 'Contas',
    add: 'Adicionar',
    me: 'Eu',
    cashFlow: 'Fluxo do mês',
    logout: 'Sair',
    settingsMenu: 'Configurações e conta',
    chatbot: 'Chatbot',
  },
  chatbot: {
    title: 'Assistente de despesas',
    subtitle:
      'Pergunte sobre seus gastos do jeito que preferir — ajudamos com totais, comparações e a entender padrões nos lançamentos que você já tem no app.',
    empty: 'Ex.: “Quanto gastei em 2026-05-02?” · “Total do mês passado” · “Principais categorias este ano”.',
    you: 'Você',
    assistant: 'Assistente',
    placeholder: 'Pergunte sobre suas despesas…',
    send: 'Enviar',
    sending: 'Pensando…',
    clear: 'Novo papo',
    inputLabel: 'Sua mensagem',
    loadingLive: 'O assistente está preparando uma resposta',
    actionsAria: 'Mais ações',
  },
  income: {
    title: 'Receitas',
    subtitle: 'Salário, freelas e entradas extras.',
    summary: {
      totalIncome: 'Receita total · abril',
      details: '{count} lançamentos · último em {date}',
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
    confirmDelete: {
      title: 'Excluir receita?',
      body: 'Este lançamento será removido. Esta ação não pode ser desfeita.',
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
    list: {
      reorderHint:
        'Arraste o ícone em cada linha para reordenar as despesas do mês (limpe busca, filtros de categoria e intervalo de datas primeiro). A ordem é salva automaticamente.',
      dragHandleAria: 'Arrastar para reordenar despesa',
    },
    filters: {
      all: 'Todos',
      range: 'Período',
      from: 'De',
      to: 'Até',
      clearDate: 'Limpar',
      quickRange: 'Rápido',
      last3Days: 'Últimos 3 dias',
      last7Days: 'Últimos 7 dias',
      tripWeek: 'Semana da viagem',
      tripWeekModalTitle: 'Selecionar período da viagem',
      tripWeekModalDescription:
        'Escolha as datas de início e fim para acompanhar os gastos da sua viagem.',
      applyRange: 'Aplicar período',
      selectedDateSpend: 'Gasto em {date}: {amount}',
      selectedDateRangeSpend: 'Gasto em {date}: {amount}',
    },
    summary: {
      totalSpent: 'Total gasto',
      dailyAverage: 'Média diária',
      largestDay: 'Maior dia',
      cashFlow: 'Fluxo de caixa',
    },
    mobile: {
      spentInApril: 'Gasto em abril',
      earnedAmount: 'de {amount} recebidos',
    },
    emptyMonth: {
      title: 'Ainda sem despesas neste mês',
      description:
        'Comece adicionando sua primeira despesa para liberar os insights por categoria e os saldos das contas.',
      cta: 'Adicionar primeira despesa',
    },
    panels: {
      byCategory: 'Por categoria',
      byAccount: 'Por conta',
      byCategoryEmptyTitle: 'Nada para mostrar ainda',
      byCategoryEmptyDescription:
        'Este painel é preenchido pelas suas despesas. Adicione lançamentos para ver como o gasto se divide entre categorias neste mês.',
    },
    form: {
      title: 'Nova despesa',
      editTitle: 'Editar despesa',
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
    renameModal: {
      editAccount: 'Renomear conta',
      editCategory: 'Renomear categoria',
      accountNameLabel: 'Nome da conta',
      categoryNameLabel: 'Nome da categoria',
    },
    confirmDelete: {
      expenseTitle: 'Excluir despesa?',
      expenseBody: 'Esta despesa será removida. Esta ação não pode ser desfeita.',
      accountTitle: 'Excluir conta?',
      accountBody: 'A conta só será excluída se não houver despesas vinculadas a ela.',
      categoryTitle: 'Excluir categoria?',
      categoryBody: 'A categoria só será excluída se não houver despesas vinculadas a ela.',
    },
  },
  accountsPage: {
    title: 'Contas',
    subtitle: 'Dinheiro, contas bancárias e cartões usados em receitas e despesas.',
    listTitle: 'Suas contas',
    empty: 'Nenhuma conta ainda. Adicione uma acima.',
    defaultBadge: 'Padrão',
    balanceCaption: 'Saldo atual',
    dragHint:
      'Arraste o ícone para reordenar. A primeira conta é usada por padrão em novas despesas e receitas.',
    dragHandleAria: 'Arrastar para reordenar contas',
  },
  overview: {
    title: 'Visão geral',
    subtitle:
      'Receitas, gastos, categorias e saldos por semana, mês ou ano—veja onde ajustar o orçamento.',
    period: {
      week: 'Semana',
      month: 'Mês',
      year: 'Ano',
    },
    periodPrev: 'Período anterior',
    periodNext: 'Próximo período',
    kpiIncome: 'Receitas',
    kpiExpenses: 'Despesas',
    kpiNet: 'Saldo',
    kpiSavingsRate: 'Taxa de poupança',
    kpiAccounts: 'Todas as contas',
    chartTitle: 'Receitas x despesas',
    chartIncome: 'Receitas',
    chartExpenses: 'Despesas',
    chartEmpty: 'Sem lançamentos neste período.',
    categoriesTitle: 'Principais categorias de gasto',
    insightsTitle: 'Onde focar',
    insightCta: 'Abrir',
    insights: {
      deficit:
        'Os gastos passaram da receita neste período—revise despesas e corte categorias opcionais primeiro.',
      topCategory:
        '{name} representa cerca de {pct}% dos gastos—abra Estatísticas para rebalancear ou definir metas.',
      savingsPositive: 'Você manteve cerca de {pct}% da receita após os gastos—bom hábito.',
      emptyPeriod: 'Sem receitas ou despesas neste período—comece a registrar para ver tendências.',
      allGood: 'Nenhuma categoria domina os gastos—continue registrando todo mês.',
    },
    quickLinks: 'Ir para',
    linkExpenses: 'Despesas',
    linkIncome: 'Receitas',
    linkStats: 'Estatísticas',
    linkAccounts: 'Contas',
  },
  stats: {
    title: 'Estatísticas mensais',
    subtitle: 'Cada pilar é uma categoria. Cada bloco é uma despesa. A altura mostra o que dominou seu mês.',
    totalCaption: 'gastos em {count} categorias',
    mobileTotalCaption: '{count} categorias',
    entryLabel: 'lançamento',
    brickHint: 'Tom mais claro = maior despesa nessa categoria.',
    hoverHint: 'Passe o mouse para detalhes.',
    lineupTitle: 'O ranking',
  },
  pwa: {
    updateReady: 'Uma nova versão está disponível.',
    reload: 'Recarregar',
    dismiss: 'Dispensar',
    install: 'Instalar App',
    addToHomeScreen: 'Adicionar à Tela Inicial',
    iosInstructions: 'Toque no botão Compartilhar no Safari e selecione "Adicionar à Tela de Início".',
    gotIt: 'Entendi',
  },
}
