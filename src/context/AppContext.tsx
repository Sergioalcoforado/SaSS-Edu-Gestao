import React, { createContext, useContext, useState } from 'react';
import type { 
  Tenant, User, Role, Aluno, Turma, Disciplina, Cobranca, 
  RegraCobranca, PresencaRegistro, NotaRegistro, Comunicado, StatusTenant, AnoLetivo 
} from '../types';
import { 
  INITIAL_TENANTS, INITIAL_USERS, INITIAL_ALUNOS, INITIAL_TURMAS, 
  INITIAL_DISCIPLINAS, INITIAL_COBRANCAS, INITIAL_REGRAS_COBRANCA, 
  INITIAL_NOTAS, INITIAL_PRESENCAS, INITIAL_COMUNICADOS, INITIAL_ANOS_LETIVOS 
} from '../data/mockData';

interface AppContextType {
  // Tenant & RBAC State
  currentTenant: Tenant;
  setCurrentTenant: (tenant: Tenant) => void;
  currentUser: User;
  setCurrentRole: (role: Role) => void;
  tenantsList: Tenant[];
  usersList: User[];
  professores: User[];
  
  // Data Filtered by Active Tenant
  alunos: Aluno[];
  turmas: Turma[];
  disciplinas: Disciplina[];
  cobrancas: Cobranca[];
  regrasCobranca: RegraCobranca[];
  notas: NotaRegistro[];
  presencas: PresencaRegistro[];
  comunicados: Comunicado[];
  anosLetivos: AnoLetivo[];
  
  // SuperAdmin Tenant Actions & Modals
  adicionarEscola: (escola: Omit<Tenant, 'id' | 'alunosCount' | 'mensalidadesTotal' | 'dataCriacao'>) => void;
  atualizarEscola: (id: string, dadosAtualizados: Partial<Tenant>) => void;
  alterarStatusEscola: (id: string, novoStatus: StatusTenant) => void;
  showModalCadastroEscola: boolean;
  setShowModalCadastroEscola: (show: boolean) => void;

  // Secretaria Academic Actions (Anos Letivos, Turmas, Professores, Disciplinas)
  adicionarAnoLetivo: (anoData: Omit<AnoLetivo, 'id' | 'tenantId' | 'turmasCount'>) => void;
  atualizarAnoLetivo: (id: string, anoData: Partial<AnoLetivo>) => void;
  adicionarTurma: (turmaData: Omit<Turma, 'id' | 'tenantId' | 'alunosMatriculados'>) => void;
  atualizarTurma: (id: string, turmaData: Partial<Turma>) => void;
  adicionarProfessor: (profData: Omit<User, 'id' | 'tenantId' | 'role'>) => void;
  atualizarProfessor: (id: string, profData: Partial<User>) => void;
  adicionarDisciplina: (discData: Omit<Disciplina, 'id' | 'tenantId'>) => void;
  atualizarDisciplina: (id: string, discData: Partial<Disciplina>) => void;

  // Actions & Webhooks
  simularPagamentoPix: (cobrancaId: string) => void;
  dispararReguaWhatsapp: (cobrancaId: string, regraId: string) => { sucesso: boolean; mensagem: string };
  adicionarAluno: (aluno: Omit<Aluno, 'id' | 'tenantId' | 'matricula' | 'dataMatricula'>) => void;
  salvarNotasLote: (turmaId: string, disciplinaId: string, bimestre: 1 | 2 | 3 | 4, novosRegistros: { alunoId: string; nota: number; faltasTotais: number }[]) => void;
  salvarPresencaLote: (turmaId: string, disciplinaId: string, data: string, registros: { alunoId: string; status: 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO' }[]) => void;
  salvarRegraCobranca: (regra: Omit<RegraCobranca, 'id' | 'tenantId'>) => void;
  alternarStatusRegra: (regraId: string) => void;
  adicionarComunicado: (comunicado: Omit<Comunicado, 'id' | 'tenantId' | 'data' | 'lidoPorCount'>) => void;

  // Selected Modal State
  selectedPixCobranca: Cobranca | null;
  setSelectedPixCobranca: (cobranca: Cobranca | null) => void;
  
  // App Theme
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  
  // System Toast Alerts
  notifications: { id: string; titulo: string; mensagem: string; tipo: 'SUCESSO' | 'INFO' | 'AVISO' }[];
  addNotification: (titulo: string, mensagem: string, tipo?: 'SUCESSO' | 'INFO' | 'AVISO') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenantsList, setTenantsList] = useState<Tenant[]>(INITIAL_TENANTS);
  const [currentTenant, setCurrentTenant] = useState<Tenant>(INITIAL_TENANTS[0]);
  
  // Active User & RBAC
  const [usersList, setUsersList] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[1]); // Default Diretoria

  // Domain Collections
  const [alunos, setAlunos] = useState<Aluno[]>(INITIAL_ALUNOS);
  const [turmas, setTurmas] = useState<Turma[]>(INITIAL_TURMAS);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(INITIAL_DISCIPLINAS);
  const [cobrancas, setCobrancas] = useState<Cobranca[]>(INITIAL_COBRANCAS);
  const [regrasCobranca, setRegrasCobranca] = useState<RegraCobranca[]>(INITIAL_REGRAS_COBRANCA);
  const [notas, setNotas] = useState<NotaRegistro[]>(INITIAL_NOTAS);
  const [presencas, setPresencas] = useState<PresencaRegistro[]>(INITIAL_PRESENCAS);
  const [comunicados, setComunicados] = useState<Comunicado[]>(INITIAL_COMUNICADOS);
  const [anosLetivos, setAnosLetivos] = useState<AnoLetivo[]>(INITIAL_ANOS_LETIVOS);

  // UI state
  const [selectedPixCobranca, setSelectedPixCobranca] = useState<Cobranca | null>(null);
  const [showModalCadastroEscola, setShowModalCadastroEscola] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<{ id: string; titulo: string; mensagem: string; tipo: 'SUCESSO' | 'INFO' | 'AVISO' }[]>([]);

  const addNotification = (titulo: string, mensagem: string, tipo: 'SUCESSO' | 'INFO' | 'AVISO' = 'SUCESSO') => {
    const id = Math.random().toString();
    setNotifications(prev => [{ id, titulo, mensagem, tipo }, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Change Role Filter
  const setCurrentRole = (role: Role) => {
    const matchingUser = usersList.find(u => u.tenantId === currentTenant.id && u.role === role) 
      || {
        id: `user-${role.toLowerCase()}`,
        tenantId: currentTenant.id,
        nome: `Usuário ${role}`,
        email: `${role.toLowerCase()}@${currentTenant.subdominio}`,
        role: role,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        alunoDependenteId: role === 'RESPONSAVEL' || role === 'ALUNO' ? 'aluno-1' : undefined
      };
    setCurrentUser(matchingUser);
    addNotification('Perfil Alterado', `Modo de visualização alterado para: ${role}`, 'INFO');
  };

  // SuperAdmin School CRUD Actions
  const adicionarEscola = (escolaData: Omit<Tenant, 'id' | 'alunosCount' | 'mensalidadesTotal' | 'dataCriacao'>) => {
    const novoId = `tenant-${Date.now()}`;
    const dataCriacao = new Date().toISOString().split('T')[0];

    const novaEscola: Tenant = {
      ...escolaData,
      id: novoId,
      alunosCount: 0,
      mensalidadesTotal: 0,
      dataCriacao
    };

    setTenantsList(prev => [novaEscola, ...prev]);
    addNotification('Nova Escola Cadastrada', `Instituição "${novaEscola.nome}" cadastrada com sucesso com plano ${novaEscola.plano}!`, 'SUCESSO');
  };

  const atualizarEscola = (id: string, dadosAtualizados: Partial<Tenant>) => {
    setTenantsList(prev => prev.map(t => {
      if (t.id === id) {
        const atualizado = { ...t, ...dadosAtualizados };
        if (currentTenant.id === id) {
          setCurrentTenant(atualizado);
        }
        return atualizado;
      }
      return t;
    }));
    addNotification('Dados da Escola Atualizados', `Alterações gravadas com sucesso!`, 'SUCESSO');
  };

  const alterarStatusEscola = (id: string, novoStatus: StatusTenant) => {
    setTenantsList(prev => prev.map(t => {
      if (t.id === id) {
        const atualizado = { ...t, status: novoStatus };
        if (currentTenant.id === id) {
          setCurrentTenant(atualizado);
        }
        return atualizado;
      }
      return t;
    }));
    
    const avisoTipo = novoStatus === 'ATIVO' ? 'SUCESSO' : novoStatus === 'SUSPENSO' ? 'AVISO' : 'INFO';
    addNotification('Situação da Escola Alterada', `O status da instituição foi alterado para ${novoStatus}.`, avisoTipo);
  };

  // Secretaria Academic Actions
  const adicionarAnoLetivo = (anoData: Omit<AnoLetivo, 'id' | 'tenantId' | 'turmasCount'>) => {
    const novoAno: AnoLetivo = {
      ...anoData,
      id: `ano-${anoData.ano}-${currentTenant.id}`,
      tenantId: currentTenant.id,
      turmasCount: 0
    };
    setAnosLetivos(prev => [novoAno, ...prev]);
    addNotification('Ano Letivo Criado', `Ano Letivo ${novoAno.ano} criado com sucesso!`, 'SUCESSO');
  };

  const atualizarAnoLetivo = (id: string, anoData: Partial<AnoLetivo>) => {
    setAnosLetivos(prev => prev.map(a => {
      if (a.id === id) return { ...a, ...anoData };
      return a;
    }));
    addNotification('Ano Letivo Atualizado', `Alterações no Ano Letivo salvas!`, 'SUCESSO');
  };

  const adicionarTurma = (turmaData: Omit<Turma, 'id' | 'tenantId' | 'alunosMatriculados'>) => {
    const novaTurma: Turma = {
      ...turmaData,
      id: `turma-${Date.now()}`,
      tenantId: currentTenant.id,
      alunosMatriculados: 0
    };

    setTurmas(prev => [novaTurma, ...prev]);

    // Incrementar turmasCount no Ano Letivo correspondente
    setAnosLetivos(prev => prev.map(a => {
      if (a.tenantId === currentTenant.id && a.ano === turmaData.anoLetivo) {
        return { ...a, turmasCount: a.turmasCount + 1 };
      }
      return a;
    }));

    addNotification('Nova Turma Criada', `Turma "${novaTurma.nome}" criada para o Ano Letivo ${novaTurma.anoLetivo}!`, 'SUCESSO');
  };

  const atualizarTurma = (id: string, turmaData: Partial<Turma>) => {
    setTurmas(prev => prev.map(t => {
      if (t.id === id) return { ...t, ...turmaData };
      return t;
    }));
    addNotification('Turma Atualizada', `Dados da turma salvos com sucesso!`, 'SUCESSO');
  };

  const adicionarProfessor = (profData: Omit<User, 'id' | 'tenantId' | 'role'>) => {
    const novoProf: User = {
      ...profData,
      id: `user-prof-${Date.now()}`,
      tenantId: currentTenant.id,
      role: 'PROFESSOR',
      avatar: profData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    };
    setUsersList(prev => [novoProf, ...prev]);
    addNotification('Novo Professor Cadastrado', `Professor(a) "${novoProf.nome}" cadastrado(a) com sucesso!`, 'SUCESSO');
  };

  const atualizarProfessor = (id: string, profData: Partial<User>) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === id) return { ...u, ...profData };
      return u;
    }));
    addNotification('Professor Atualizado', `Dados do professor atualizados com sucesso!`, 'SUCESSO');
  };

  const adicionarDisciplina = (discData: Omit<Disciplina, 'id' | 'tenantId'>) => {
    const novaDisciplina: Disciplina = {
      ...discData,
      id: `disc-${Date.now()}`,
      tenantId: currentTenant.id
    };
    setDisciplinas(prev => [novaDisciplina, ...prev]);
    addNotification('Nova Disciplina Criada', `Matéria "${novaDisciplina.nome}" vinculada à turma!`, 'SUCESSO');
  };

  const atualizarDisciplina = (id: string, discData: Partial<Disciplina>) => {
    setDisciplinas(prev => prev.map(d => {
      if (d.id === id) return { ...d, ...discData };
      return d;
    }));
    addNotification('Disciplina Atualizada', `Professor/Carga horária atualizados!`, 'SUCESSO');
  };

  // Multi-tenant filtering helpers
  const tenantAlunos = alunos.filter(a => a.tenantId === currentTenant.id);
  const tenantTurmas = turmas.filter(t => t.tenantId === currentTenant.id);
  const tenantDisciplinas = disciplinas.filter(d => d.tenantId === currentTenant.id);
  const tenantCobrancas = cobrancas.filter(c => c.tenantId === currentTenant.id);
  const tenantRegrasCobranca = regrasCobranca.filter(r => r.tenantId === currentTenant.id);
  const tenantNotas = notas.filter(n => n.tenantId === currentTenant.id);
  const tenantPresencas = presencas.filter(p => p.tenantId === currentTenant.id);
  const tenantComunicados = comunicados.filter(c => c.tenantId === currentTenant.id);
  const tenantAnosLetivos = anosLetivos.filter(a => a.tenantId === currentTenant.id);
  const tenantProfessores = usersList.filter(u => u.tenantId === currentTenant.id && u.role === 'PROFESSOR');

  // Instant Webhook/Payment Simulation
  const simularPagamentoPix = (cobrancaId: string) => {
    const dataHoje = new Date().toISOString().split('T')[0];
    setCobrancas(prev => prev.map(c => {
      if (c.id === cobrancaId) {
        const atualizada: Cobranca = {
          ...c,
          status: 'PAGO',
          dataPagamento: dataHoje
        };
        if (selectedPixCobranca?.id === cobrancaId) {
          setSelectedPixCobranca(atualizada);
        }
        return atualizada;
      }
      return c;
    }));

    // Recalcular métricas do Tenant
    setTenantsList(prev => prev.map(t => {
      if (t.id === currentTenant.id) {
        return { ...t, mensalidadesTotal: t.mensalidadesTotal + 780 };
      }
      return t;
    }));

    addNotification('Pagamento Confirmado (PIX Webhook)', `Mensalidade confirmada instantaneamente com baixa automática!`, 'SUCESSO');
  };

  // Simulate WhatsApp Automated Rules
  const dispararReguaWhatsapp = (cobrancaId: string, regraId: string) => {
    const cob = cobrancas.find(c => c.id === cobrancaId);
    const regra = regrasCobranca.find(r => r.id === regraId);
    if (!cob || !regra) return { sucesso: false, mensagem: 'Cobrança ou regra não encontrada.' };

    const mensagemFormatada = regra.modeloMensagem
      .replace('{NOME_RESPONSAVEL}', cob.responsavelNome)
      .replace('{ALUNO_NOME}', cob.alunoNome)
      .replace('{REFERENCIA}', cob.referencia)
      .replace('{VENCIMENTO}', cob.vencimento)
      .replace('{LINK_PIX}', `https://pix.edugestao.com/pay/${cob.id}`);

    // Registra no histórico da cobrança
    const novoEnvio = {
      id: Math.random().toString(),
      data: new Date().toISOString().replace('T', ' ').substring(0, 16),
      canal: 'WHATSAPP' as const,
      tipoNotificacao: (regra.diasGatilho < 0 ? 'LEMBRETE_PREVIO' : regra.diasGatilho === 0 ? 'VENCIMENTO_HOJE' : 'ATRASO_CRITICO') as any,
      statusEnvio: 'ENVIADO' as const
    };

    setCobrancas(prev => prev.map(c => {
      if (c.id === cobrancaId) {
        return {
          ...c,
          historicoEnvios: [novoEnvio, ...c.historicoEnvios]
        };
      }
      return c;
    }));

    addNotification('Disparo via WhatsApp API Meta', `Notificação enviada para ${cob.responsavelTelefone}`, 'SUCESSO');

    return {
      sucesso: true,
      mensagem: `Mensagem enviada com sucesso para ${cob.responsavelNome} (${cob.responsavelTelefone}): "${mensagemFormatada.substring(0, 60)}..."`
    };
  };

  // CRUD Actions
  const adicionarAluno = (alunoData: Omit<Aluno, 'id' | 'tenantId' | 'matricula' | 'dataMatricula'>) => {
    const novoId = `aluno-${Date.now()}`;
    const anoAtual = new Date().getFullYear();
    const matriculaGerada = `${anoAtual}-${Math.floor(10000 + Math.random() * 90000)}`;
    const dataMatricula = new Date().toISOString().split('T')[0];

    const novoAluno: Aluno = {
      ...alunoData,
      id: novoId,
      tenantId: currentTenant.id,
      matricula: matriculaGerada,
      dataMatricula
    };

    setAlunos(prev => [novoAluno, ...prev]);

    // Incrementar alunosMatriculados na turma
    setTurmas(prev => prev.map(t => {
      if (t.id === alunoData.turmaId) {
        return { ...t, alunosMatriculados: t.alunosMatriculados + 1 };
      }
      return t;
    }));

    // Gerar primeira mensalidade automaticamente
    const novaCobranca: Cobranca = {
      id: `cob-${Date.now()}`,
      tenantId: currentTenant.id,
      alunoId: novoId,
      alunoNome: novoAluno.nome,
      responsavelId: novoAluno.responsavelId || `resp-${Date.now()}`,
      responsavelNome: novoAluno.responsavelNome,
      responsavelTelefone: novoAluno.responsavelTelefone,
      responsavelEmail: novoAluno.responsavelEmail,
      valor: 780.00,
      vencimento: '2026-09-10',
      status: 'PENDENTE',
      tipo: 'MATRICULA',
      referencia: 'Matrícula 2026 + 1ª Mensalidade',
      codigoPix: '00020126580014BR.GOV.BCB.PIX0136' + Math.random().toString(36).substring(2, 10),
      qrCodePix: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020126580014BR.GOV.BCB.PIX0136' + Math.random().toString(36).substring(2, 10),
      linhaDigitavelBoleto: '34191.79001 01043.510047 91020.150008 8 98310000078000',
      historicoEnvios: []
    };

    setCobrancas(prev => [novaCobranca, ...prev]);

    // Atualiza contagem no tenant
    setTenantsList(prev => prev.map(t => {
      if (t.id === currentTenant.id) {
        return { ...t, alunosCount: t.alunosCount + 1 };
      }
      return t;
    }));

    addNotification('Aluno Cadastrado', `Aluno ${novoAluno.nome} matriculado com sucesso e cobrança inicial gerada!`, 'SUCESSO');
  };

  const salvarNotasLote = (
    turmaId: string, 
    disciplinaId: string, 
    bimestre: 1 | 2 | 3 | 4, 
    novosRegistros: { alunoId: string; nota: number; faltasTotais: number }[]
  ) => {
    setNotas(prev => {
      const filtrados = prev.filter(n => !(n.tenantId === currentTenant.id && n.turmaId === turmaId && n.disciplinaId === disciplinaId && n.bimestre === bimestre));
      const novos = novosRegistros.map(r => ({
        id: `nota-${Date.now()}-${r.alunoId}`,
        tenantId: currentTenant.id,
        turmaId,
        disciplinaId,
        alunoId: r.alunoId,
        bimestre,
        nota: r.nota,
        faltasTotais: r.faltasTotais
      }));
      return [...filtrados, ...novos];
    });
    addNotification('Diário de Classe', `Notas do ${bimestre}º Bimestre salvas com sucesso!`, 'SUCESSO');
  };

  const salvarPresencaLote = (
    turmaId: string, 
    disciplinaId: string, 
    data: string, 
    registros: { alunoId: string; status: 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO' }[]
  ) => {
    setPresencas(prev => {
      const filtrados = prev.filter(p => !(p.tenantId === currentTenant.id && p.turmaId === turmaId && p.disciplinaId === disciplinaId && p.data === data));
      const novos = registros.map(r => ({
        id: `p-${Date.now()}-${r.alunoId}`,
        tenantId: currentTenant.id,
        turmaId,
        disciplinaId,
        alunoId: r.alunoId,
        data,
        status: r.status
      }));
      return [...filtrados, ...novos];
    });
    addNotification('Frequência Diária', `Presença gravada com sucesso para a data ${data}!`, 'SUCESSO');
  };

  const salvarRegraCobranca = (regraData: Omit<RegraCobranca, 'id' | 'tenantId'>) => {
    const novaRegra: RegraCobranca = {
      ...regraData,
      id: `regra-${Date.now()}`,
      tenantId: currentTenant.id
    };
    setRegrasCobranca(prev => [novaRegra, ...prev]);
    addNotification('Régua de Cobrança', `Automação "${novaRegra.nome}" criada com sucesso!`, 'SUCESSO');
  };

  const alternarStatusRegra = (regraId: string) => {
    setRegrasCobranca(prev => prev.map(r => {
      if (r.id === regraId) {
        return { ...r, ativa: !r.ativa };
      }
      return r;
    }));
  };

  const adicionarComunicado = (comunicadoData: Omit<Comunicado, 'id' | 'tenantId' | 'data' | 'lidoPorCount'>) => {
    const novo: Comunicado = {
      ...comunicadoData,
      id: `com-${Date.now()}`,
      tenantId: currentTenant.id,
      data: new Date().toISOString().split('T')[0],
      lidoPorCount: 0
    };
    setComunicados(prev => [novo, ...prev]);
    addNotification('Novo Comunicado', `Comunicado "${novo.titulo}" publicado para ${novo.destinatarioRole}!`, 'SUCESSO');
  };

  return (
    <AppContext.Provider
      value={{
        currentTenant,
        setCurrentTenant,
        currentUser,
        setCurrentRole,
        tenantsList,
        usersList,
        professores: tenantProfessores,
        alunos: tenantAlunos,
        turmas: tenantTurmas,
        disciplinas: tenantDisciplinas,
        cobrancas: tenantCobrancas,
        regrasCobranca: tenantRegrasCobranca,
        notas: tenantNotas,
        presencas: tenantPresencas,
        comunicados: tenantComunicados,
        anosLetivos: tenantAnosLetivos,
        adicionarEscola,
        atualizarEscola,
        alterarStatusEscola,
        showModalCadastroEscola,
        setShowModalCadastroEscola,
        adicionarAnoLetivo,
        atualizarAnoLetivo,
        adicionarTurma,
        atualizarTurma,
        adicionarProfessor,
        atualizarProfessor,
        adicionarDisciplina,
        atualizarDisciplina,
        simularPagamentoPix,
        dispararReguaWhatsapp,
        adicionarAluno,
        salvarNotasLote,
        salvarPresencaLote,
        salvarRegraCobranca,
        alternarStatusRegra,
        adicionarComunicado,
        selectedPixCobranca,
        setSelectedPixCobranca,
        isDarkMode,
        setIsDarkMode,
        notifications,
        addNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de AppProvider');
  return context;
};
