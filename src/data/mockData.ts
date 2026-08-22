import type { Tenant, User, Aluno, Turma, Disciplina, Cobranca, RegraCobranca, PresencaRegistro, NotaRegistro, Comunicado, AnoLetivo } from '../types';

export const INITIAL_ANOS_LETIVOS: AnoLetivo[] = [
  {
    id: 'ano-2026-dominus',
    tenantId: 'tenant-dominus',
    ano: '2026',
    status: 'ATIVO',
    dataInicio: '2026-01-26',
    dataFim: '2026-12-18',
    turmasCount: 12
  },
  {
    id: 'ano-2027-dominus',
    tenantId: 'tenant-dominus',
    ano: '2027',
    status: 'PLANEJAMENTO',
    dataInicio: '2027-01-25',
    dataFim: '2027-12-17',
    turmasCount: 0
  },
  {
    id: 'ano-2025-dominus',
    tenantId: 'tenant-dominus',
    ano: '2025',
    status: 'ENCERRADO',
    dataInicio: '2025-01-20',
    dataFim: '2025-12-15',
    turmasCount: 10
  }
];

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant-dominus',
    nome: 'Colégio Dominus Excellence',
    cnpj: '12.345.678/0001-90',
    subdominio: 'dominus.edugestao.com',
    logo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=150&auto=format&fit=crop&q=80',
    plano: 'PRO',
    status: 'ATIVO',
    alunosCount: 420,
    mensalidadesTotal: 294000,
    corPrimaria: '#4f46e5', // Indigo
    emailContato: 'contato@colegiodominus.com.br',
    telefoneContato: '(11) 3456-7890',
    dataCriacao: '2025-02-15',
    limiteAlunos: 600,
    valorMensalidadePlano: 990
  },
  {
    id: 'tenant-futuro',
    nome: 'Escola Futuro do Saber',
    cnpj: '98.765.432/0001-11',
    subdominio: 'futuro.edugestao.com',
    logo: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=150&auto=format&fit=crop&q=80',
    plano: 'BASIC',
    status: 'ATIVO',
    alunosCount: 185,
    mensalidadesTotal: 111000,
    corPrimaria: '#059669', // Emerald
    emailContato: 'secretaria@futurodosaber.com.br',
    telefoneContato: '(11) 2233-4455',
    dataCriacao: '2025-06-10',
    limiteAlunos: 250,
    valorMensalidadePlano: 490
  },
  {
    id: 'tenant-inovacao',
    nome: 'Instituto de Ensino Inovação',
    cnpj: '44.555.666/0001-22',
    subdominio: 'inovacao.edugestao.com',
    logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop&q=80',
    plano: 'ENTERPRISE',
    status: 'SUSPENSO',
    alunosCount: 850,
    mensalidadesTotal: 680000,
    corPrimaria: '#dc2626', // Red
    emailContato: 'diretoria@ieinovacao.edu.br',
    telefoneContato: '(11) 98765-0000',
    dataCriacao: '2024-11-20',
    limiteAlunos: 1500,
    valorMensalidadePlano: 1990
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-superadmin',
    tenantId: 'tenant-dominus',
    nome: 'Carlos Eduardo (SaaS Admin)',
    email: 'admin@edugestao.com',
    role: 'SUPER_ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    telefone: '(11) 99887-1122'
  },
  {
    id: 'user-diretora',
    tenantId: 'tenant-dominus',
    nome: 'Dra. Helena Mendonça',
    email: 'diretoria@colegiodominus.com.br',
    role: 'DIRETORIA',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    telefone: '(11) 98765-4321'
  },
  {
    id: 'user-secretaria',
    tenantId: 'tenant-dominus',
    nome: 'Mariana Ribeiro',
    email: 'secretaria@colegiodominus.com.br',
    role: 'SECRETARIA',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    telefone: '(11) 97654-3210'
  },
  {
    id: 'user-financeiro',
    tenantId: 'tenant-dominus',
    nome: 'Roberto Alves',
    email: 'financeiro@colegiodominus.com.br',
    role: 'FINANCEIRO',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    telefone: '(11) 96543-2109'
  },
  {
    id: 'user-professor',
    tenantId: 'tenant-dominus',
    nome: 'Prof. Ricardo Santos',
    email: 'ricardo.santos@colegiodominus.com.br',
    role: 'PROFESSOR',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    telefone: '(11) 95432-1098',
    especialidade: 'Matemática e Raciocínio Lógico',
    turmasAtribuidasIds: ['turma-9a', 'turma-3em']
  },
  {
    id: 'user-prof-fernanda',
    tenantId: 'tenant-dominus',
    nome: 'Profa. Fernanda Costa',
    email: 'fernanda.costa@colegiodominus.com.br',
    role: 'PROFESSOR',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    telefone: '(11) 98111-2233',
    especialidade: 'Língua Portuguesa e Redação',
    turmasAtribuidasIds: ['turma-9a', 'turma-6b']
  },
  {
    id: 'user-prof-marcelo',
    tenantId: 'tenant-dominus',
    nome: 'Prof. Marcelo Andrade',
    email: 'marcelo.andrade@colegiodominus.com.br',
    role: 'PROFESSOR',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    telefone: '(11) 97222-3344',
    especialidade: 'História e Geociências',
    turmasAtribuidasIds: ['turma-3em']
  },
  {
    id: 'user-prof-camila',
    tenantId: 'tenant-dominus',
    nome: 'Profa. Camila Lima',
    email: 'camila.lima@colegiodominus.com.br',
    role: 'PROFESSOR',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    telefone: '(11) 96333-4455',
    especialidade: 'Biologia e Ciências Naturais',
    turmasAtribuidasIds: ['turma-6b']
  },
  {
    id: 'user-pai',
    tenantId: 'tenant-dominus',
    nome: 'Marcelo Oliveira',
    email: 'marcelo.oliveira@gmail.com',
    role: 'RESPONSAVEL',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    telefone: '(11) 99811-2233',
    alunoDependenteId: 'aluno-1'
  },
  {
    id: 'user-aluno',
    tenantId: 'tenant-dominus',
    nome: 'Lucas Oliveira',
    email: 'lucas.oliveira@aluno.colegiodominus.com.br',
    role: 'ALUNO',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    telefone: '(11) 99811-2234',
    alunoDependenteId: 'aluno-1'
  }
];

export const INITIAL_TURMAS: Turma[] = [
  {
    id: 'turma-9a',
    tenantId: 'tenant-dominus',
    nome: '9º Ano A - Ensino Fundamental II',
    anoLetivo: '2026',
    turno: 'MANHA',
    nivel: 'FUNDAMENTAL_2',
    capacidade: 35,
    alunosMatriculados: 32,
    professorTitularId: '',
    professorTitularNome: ''
  },
  {
    id: 'turma-3em',
    tenantId: 'tenant-dominus',
    nome: '3º Ano Terceirão - Ensino Médio',
    anoLetivo: '2026',
    turno: 'MANHA',
    nivel: 'MEDIO',
    capacidade: 40,
    alunosMatriculados: 38,
    professorTitularId: '',
    professorTitularNome: ''
  },
  {
    id: 'turma-6b',
    tenantId: 'tenant-dominus',
    nome: '6º Ano B - Ensino Fundamental II',
    anoLetivo: '2026',
    turno: 'TARDE',
    nivel: 'FUNDAMENTAL_2',
    capacidade: 30,
    alunosMatriculados: 28,
    professorTitularId: '',
    professorTitularNome: ''
  }
];

export const INITIAL_DISCIPLINAS: Disciplina[] = [
  {
    id: 'disc-mat-9a',
    tenantId: 'tenant-dominus',
    turmaId: 'turma-9a',
    nome: 'Matemática e Raciocínio Lógico',
    cargaHorariaSemanal: 5,
    professorId: 'user-professor',
    professorNome: 'Prof. Ricardo Santos'
  },
  {
    id: 'disc-fis-9a',
    tenantId: 'tenant-dominus',
    turmaId: 'turma-9a',
    nome: 'Física Geral e Aplicada',
    cargaHorariaSemanal: 3,
    professorId: 'user-professor',
    professorNome: 'Prof. Ricardo Santos'
  },
  {
    id: 'disc-por-9a',
    tenantId: 'tenant-dominus',
    turmaId: 'turma-9a',
    nome: 'Língua Portuguesa e Redação',
    cargaHorariaSemanal: 5,
    professorId: 'user-prof-fernanda',
    professorNome: 'Profa. Fernanda Costa'
  },
  {
    id: 'disc-his-3em',
    tenantId: 'tenant-dominus',
    turmaId: 'turma-3em',
    nome: 'História do Brasil e Geral',
    cargaHorariaSemanal: 4,
    professorId: 'user-prof-marcelo',
    professorNome: 'Prof. Marcelo Andrade'
  },
  {
    id: 'disc-bio-6b',
    tenantId: 'tenant-dominus',
    turmaId: 'turma-6b',
    nome: 'Ciências Naturais e Biologia',
    cargaHorariaSemanal: 4,
    professorId: 'user-prof-camila',
    professorNome: 'Profa. Camila Lima'
  }
];

export const INITIAL_ALUNOS: Aluno[] = [
  {
    id: 'aluno-1',
    tenantId: 'tenant-dominus',
    nome: 'Lucas Oliveira',
    matricula: '2026-00912',
    cpf: '456.789.123-00',
    dataNascimento: '2011-04-14',
    turmaId: 'turma-9a',
    turmaNome: '9º Ano A - Ensino Fundamental II',
    responsavelId: 'user-pai',
    responsavelNome: 'Marcelo Oliveira',
    responsavelTelefone: '(11) 99811-2233',
    responsavelEmail: 'marcelo.oliveira@gmail.com',
    status: 'ATIVO',
    foto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    dataMatricula: '2026-01-10'
  },
  {
    id: 'aluno-2',
    tenantId: 'tenant-dominus',
    nome: 'Beatriz Silva Santos',
    matricula: '2026-00913',
    cpf: '321.654.987-11',
    dataNascimento: '2011-08-22',
    turmaId: 'turma-9a',
    turmaNome: '9º Ano A - Ensino Fundamental II',
    responsavelId: 'resp-2',
    responsavelNome: 'Ana Paula Silva',
    responsavelTelefone: '(11) 98822-3344',
    responsavelEmail: 'anapaula.silva@hotmail.com',
    status: 'ATIVO',
    foto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    dataMatricula: '2026-01-12'
  },
  {
    id: 'aluno-3',
    tenantId: 'tenant-dominus',
    nome: 'Gabriel Mendes Rocha',
    matricula: '2026-00914',
    cpf: '789.123.456-22',
    dataNascimento: '2011-02-05',
    turmaId: 'turma-9a',
    turmaNome: '9º Ano A - Ensino Fundamental II',
    responsavelId: 'resp-3',
    responsavelNome: 'Fábio Rocha',
    responsavelTelefone: '(11) 97733-4455',
    responsavelEmail: 'fabio.rocha@empresa.com.br',
    status: 'ATIVO',
    foto: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80',
    dataMatricula: '2026-01-15'
  },
  {
    id: 'aluno-4',
    tenantId: 'tenant-dominus',
    nome: 'Sophia Martins Ferraz',
    matricula: '2026-00915',
    cpf: '159.357.258-33',
    dataNascimento: '2011-11-30',
    turmaId: 'turma-9a',
    turmaNome: '9º Ano A - Ensino Fundamental II',
    responsavelId: 'resp-4',
    responsavelNome: 'Renata Ferraz',
    responsavelTelefone: '(11) 96644-5566',
    responsavelEmail: 'renata.ferraz@outlook.com',
    status: 'ATIVO',
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    dataMatricula: '2026-01-18'
  }
];

export const INITIAL_COBRANCAS: Cobranca[] = [
  {
    id: 'cob-101',
    tenantId: 'tenant-dominus',
    alunoId: 'aluno-1',
    alunoNome: 'Lucas Oliveira',
    responsavelId: 'user-pai',
    responsavelNome: 'Marcelo Oliveira',
    responsavelTelefone: '(11) 99811-2233',
    responsavelEmail: 'marcelo.oliveira@gmail.com',
    valor: 780.00,
    vencimento: '2026-08-10',
    dataPagamento: '2026-08-08',
    status: 'PAGO',
    tipo: 'MENSALIDADE',
    referencia: 'Mensalidade Agosto/2026',
    codigoPix: '00020126580014BR.GOV.BCB.PIX0136d8f5832a-7c91-4e2b-a193-edugestao0214MensalidadeAgosto5204000053039865405780.005802BR5925Colegio Dominus Excellence6009SAO PAULO62070503***6304A1B2',
    qrCodePix: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020126580014BR.GOV.BCB.PIX0136d8f5832a-7c91-4e2b-a193-edugestao0214MensalidadeAgosto5204000053039865405780.005802BR5925Colegio Dominus Excellence6009SAO PAULO62070503***6304A1B2',
    linhaDigitavelBoleto: '34191.79001 01043.510047 91020.150008 8 98000000078000',
    historicoEnvios: [
      { id: 'env-1', data: '2026-08-05 09:00', canal: 'WHATSAPP', tipoNotificacao: 'LEMBRETE_PREVIO', statusEnvio: 'LIDO' }
    ]
  },
  {
    id: 'cob-102',
    tenantId: 'tenant-dominus',
    alunoId: 'aluno-1',
    alunoNome: 'Lucas Oliveira',
    responsavelId: 'user-pai',
    responsavelNome: 'Marcelo Oliveira',
    responsavelTelefone: '(11) 99811-2233',
    responsavelEmail: 'marcelo.oliveira@gmail.com',
    valor: 780.00,
    vencimento: '2026-09-10',
    status: 'PENDENTE',
    tipo: 'MENSALIDADE',
    referencia: 'Mensalidade Setembro/2026',
    codigoPix: '00020126580014BR.GOV.BCB.PIX0136e9f6943b-8d02-5f3c-b204-edugestao0215MensalidadeSetembro5204000053039865405780.005802BR5925Colegio Dominus Excellence6009SAO PAULO62070503***6304B3C4',
    qrCodePix: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020126580014BR.GOV.BCB.PIX0136e9f6943b-8d02-5f3c-b204-edugestao0215MensalidadeSetembro5204000053039865405780.005802BR5925Colegio Dominus Excellence6009SAO PAULO62070503***6304B3C4',
    linhaDigitavelBoleto: '34191.79001 01043.510047 91020.150008 8 98310000078000',
    historicoEnvios: []
  },
  {
    id: 'cob-103',
    tenantId: 'tenant-dominus',
    alunoId: 'aluno-2',
    alunoNome: 'Beatriz Silva Santos',
    responsavelId: 'resp-2',
    responsavelNome: 'Ana Paula Silva',
    responsavelTelefone: '(11) 98822-3344',
    responsavelEmail: 'anapaula.silva@hotmail.com',
    valor: 780.00,
    vencimento: '2026-08-10',
    status: 'ATRASADO',
    tipo: 'MENSALIDADE',
    referencia: 'Mensalidade Agosto/2026',
    codigoPix: '00020126580014BR.GOV.BCB.PIX0136a1b2c3d4-5e6f-7a8b-9c0d-edugestao0214MensalidadeAgosto5204000053039865405780.005802BR5925Colegio Dominus Excellence6009SAO PAULO62070503***6304C5D6',
    qrCodePix: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020126580014BR.GOV.BCB.PIX0136a1b2c3d4-5e6f-7a8b-9c0d-edugestao0214MensalidadeAgosto5204000053039865405780.005802BR5925Colegio Dominus Excellence6009SAO PAULO62070503***6304C5D6',
    linhaDigitavelBoleto: '34191.79001 01043.510047 91020.150008 8 98000000078000',
    historicoEnvios: [
      { id: 'env-2', data: '2026-08-05 09:15', canal: 'WHATSAPP', tipoNotificacao: 'LEMBRETE_PREVIO', statusEnvio: 'LIDO' },
      { id: 'env-3', data: '2026-08-10 08:00', canal: 'WHATSAPP', tipoNotificacao: 'VENCIMENTO_HOJE', statusEnvio: 'LIDO' },
      { id: 'env-4', data: '2026-08-17 10:30', canal: 'WHATSAPP', tipoNotificacao: 'ATRASO_CRITICO', statusEnvio: 'ENVIADO' }
    ]
  },
  {
    id: 'cob-104',
    tenantId: 'tenant-dominus',
    alunoId: 'aluno-3',
    alunoNome: 'Gabriel Mendes Rocha',
    responsavelId: 'resp-3',
    responsavelNome: 'Fábio Rocha',
    responsavelTelefone: '(11) 97733-4455',
    responsavelEmail: 'fabio.rocha@empresa.com.br',
    valor: 780.00,
    vencimento: '2026-08-10',
    dataPagamento: '2026-08-09',
    status: 'PAGO',
    tipo: 'MENSALIDADE',
    referencia: 'Mensalidade Agosto/2026',
    codigoPix: '00020126580014BR.GOV.BCB.PIX0136f1e2d3c4-5b6a-7f8e-9d0c-edugestao0214MensalidadeAgosto5204000053039865405780.005802BR5925Colegio Dominus Excellence6009SAO PAULO62070503***6304E7F8',
    qrCodePix: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020126580014BR.GOV.BCB.PIX0136f1e2d3c4-5b6a-7f8e-9d0c-edugestao0214MensalidadeAgosto5204000053039865405780.005802BR5925Colegio Dominus Excellence6009SAO PAULO62070503***6304E7F8',
    linhaDigitavelBoleto: '34191.79001 01043.510047 91020.150008 8 98000000078000',
    historicoEnvios: []
  }
];

export const INITIAL_REGRAS_COBRANCA: RegraCobranca[] = [
  {
    id: 'regra-1',
    tenantId: 'tenant-dominus',
    nome: 'Lembrete Amigável Pré-Vencimento (5 Dias Antes)',
    diasGatilho: -5,
    canal: 'WHATSAPP',
    modeloMensagem: 'Olá {NOME_RESPONSAVEL}! Passando para lembrar que a mensalidade de {ALUNO_NOME} ({REFERENCIA}) vence em 5 dias ({VENCIMENTO}). Pague com facilidade via PIX: {LINK_PIX}',
    ativa: true
  },
  {
    id: 'regra-2',
    tenantId: 'tenant-dominus',
    nome: 'Aviso Vencimento Hoje',
    diasGatilho: 0,
    canal: 'AMBOS',
    modeloMensagem: 'Prezado(a) {NOME_RESPONSAVEL}, a mensalidade de {ALUNO_NOME} vence HOJE ({VENCIMENTO}). Evite juros gerando seu PIX instantâneo aqui: {LINK_PIX}',
    ativa: true
  },
  {
    id: 'regra-3',
    tenantId: 'tenant-dominus',
    nome: 'Alerta de Atraso (7 Dias de Inadimplência)',
    diasGatilho: 7,
    canal: 'WHATSAPP',
    modeloMensagem: 'Atenção {NOME_RESPONSAVEL}: Constamos a mensalidade de {ALUNO_NOME} ({REFERENCIA}) pendente há 7 dias. Clique no link para regularizar ou negociar: {LINK_PIX}',
    ativa: true
  }
];

export const INITIAL_NOTAS: NotaRegistro[] = [
  { id: 'n1', tenantId: 'tenant-dominus', turmaId: 'turma-9a', disciplinaId: 'disc-mat-9a', alunoId: 'aluno-1', bimestre: 1, nota: 8.5, faltasTotais: 1 },
  { id: 'n2', tenantId: 'tenant-dominus', turmaId: 'turma-9a', disciplinaId: 'disc-mat-9a', alunoId: 'aluno-1', bimestre: 2, nota: 9.0, faltasTotais: 0 },
  { id: 'n3', tenantId: 'tenant-dominus', turmaId: 'turma-9a', disciplinaId: 'disc-mat-9a', alunoId: 'aluno-1', bimestre: 3, nota: 8.0, faltasTotais: 2 },
  { id: 'n4', tenantId: 'tenant-dominus', turmaId: 'turma-9a', disciplinaId: 'disc-mat-9a', alunoId: 'aluno-2', bimestre: 1, nota: 7.0, faltasTotais: 3 },
  { id: 'n5', tenantId: 'tenant-dominus', turmaId: 'turma-9a', disciplinaId: 'disc-mat-9a', alunoId: 'aluno-2', bimestre: 2, nota: 6.5, faltasTotais: 4 },
  { id: 'n6', tenantId: 'tenant-dominus', turmaId: 'turma-9a', disciplinaId: 'disc-mat-9a', alunoId: 'aluno-3', bimestre: 1, nota: 9.8, faltasTotais: 0 },
  { id: 'n7', tenantId: 'tenant-dominus', turmaId: 'turma-9a', disciplinaId: 'disc-mat-9a', alunoId: 'aluno-3', bimestre: 2, nota: 9.5, faltasTotais: 0 }
];

export const INITIAL_PRESENCAS: PresencaRegistro[] = [
  { id: 'p1', tenantId: 'tenant-dominus', turmaId: 'turma-9a', disciplinaId: 'disc-mat-9a', alunoId: 'aluno-1', data: '2026-08-22', status: 'PRESENTE' },
  { id: 'p2', tenantId: 'tenant-dominus', turmaId: 'turma-9a', disciplinaId: 'disc-mat-9a', alunoId: 'aluno-2', data: '2026-08-22', status: 'AUSENTE', observacao: 'Falta sem justificativa médica' },
  { id: 'p3', tenantId: 'tenant-dominus', turmaId: 'turma-9a', disciplinaId: 'disc-mat-9a', alunoId: 'aluno-3', data: '2026-08-22', status: 'PRESENTE' },
  { id: 'p4', tenantId: 'tenant-dominus', turmaId: 'turma-9a', disciplinaId: 'disc-mat-9a', alunoId: 'aluno-4', data: '2026-08-22', status: 'PRESENTE' }
];

export const INITIAL_COMUNICADOS: Comunicado[] = [
  {
    id: 'com-1',
    tenantId: 'tenant-dominus',
    titulo: 'Reunião de Pais e Mestres - 3º Bimestre',
    conteudo: 'Convidamos todos os responsáveis para a nossa reunião presencial no dia 30/08 às 19:00 no auditório principal. Pauta: Desempenho acadêmico e feira de ciências.',
    data: '2026-08-20',
    autorNome: 'Dra. Helena Mendonça',
    autorCargo: 'Diretora Geral',
    destinatarioRole: 'TODOS',
    urgente: true,
    lidoPorCount: 310
  },
  {
    id: 'com-2',
    tenantId: 'tenant-dominus',
    titulo: 'Início das Inscrições para a Olímpiada de Matemática (OBMEP)',
    conteudo: 'Alunos do 6º ao 9º Ano e Ensino Médio interessados em participar devem procurar o Prof. Ricardo na sala dos professores até a próxima sexta-feira.',
    data: '2026-08-18',
    autorNome: 'Prof. Ricardo Santos',
    autorCargo: 'Coordenador de Exatas',
    destinatarioRole: 'ALUNO',
    urgente: false,
    lidoPorCount: 145
  }
];
