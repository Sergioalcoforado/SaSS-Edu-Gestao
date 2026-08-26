import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Tenant, StatusTenant, PlanoTenant } from '../types';
import type { PlanSpec } from '../config/plans';
import { 
  Globe, Building2, Users, Plus, Search, 
  Edit3, Phone, Mail, X, Sparkles, CheckCircle2, Layers,
  Trash2, Copy, Check, DollarSign, QrCode, MessageSquare, Calendar
} from 'lucide-react';


export interface FaturaSaaS {
  id: string;
  tenantId: string;
  escolaNome: string;
  escolaLogo: string;
  cnpj: string;
  plano: string;
  referencia: string;
  valor: number;
  vencimento: string;
  status: 'PAGO' | 'PENDENTE' | 'ATRASADO';
  telefoneContato: string;
}

export const SuperAdminView: React.FC = () => {
  const { 
    tenantsList, adicionarEscola, atualizarEscola, 
    alterarStatusEscola, setCurrentTenant,
    showModalCadastroEscola, setShowModalCadastroEscola,
    plansList, adicionarPlano, atualizarPlano, excluirPlano,
    setSelectedPixCobranca, addNotification
  } = useApp();

  // Active Sub-Tab: 'escolas' | 'planos' | 'faturas'
  const [activeTab, setActiveTab] = useState<'escolas' | 'planos' | 'faturas'>('escolas');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  
  // School Modals state
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  // Plan Modals state
  const [showModalPlano, setShowModalPlano] = useState<boolean>(false);
  const [editingPlan, setEditingPlan] = useState<PlanSpec | null>(null);

  // Faturas SaaS Dynamic State
  const [faturasSaaS, setFaturasSaaS] = useState<FaturaSaaS[]>(() => {
    // Gerar faturas de demonstração baseadas nas escolas clientes existentes
    return [
      {
        id: 'fat-saas-101',
        tenantId: 'tenant-futuro-saber',
        escolaNome: 'Colégio Futuro Saber',
        escolaLogo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
        cnpj: '12.345.678/0001-90',
        plano: 'PRO',
        referencia: 'Plano PRO - Agosto/2026',
        valor: 990,
        vencimento: '2026-08-10',
        status: 'PAGO',
        telefoneContato: '(11) 98888-0000'
      },
      {
        id: 'fat-saas-102',
        tenantId: 'tenant-futuro-saber',
        escolaNome: 'Colégio Futuro Saber',
        escolaLogo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
        cnpj: '12.345.678/0001-90',
        plano: 'PRO',
        referencia: 'Plano PRO - Setembro/2026',
        valor: 990,
        vencimento: '2026-09-10',
        status: 'PENDENTE',
        telefoneContato: '(11) 98888-0000'
      },
      {
        id: 'fat-saas-103',
        tenantId: 'tenant-aprendiz',
        escolaNome: 'Escola Aprendiz do Amanhã',
        escolaLogo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=150&auto=format&fit=crop&q=80',
        cnpj: '98.765.432/0001-10',
        plano: 'BASIC',
        referencia: 'Plano BASIC - Agosto/2026',
        valor: 490,
        vencimento: '2026-08-10',
        status: 'ATRASADO',
        telefoneContato: '(11) 97777-1111'
      }
    ];
  });

  // Form states for School Create/Edit
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [subdominio, setSubdominio] = useState('');
  const [plano, setPlano] = useState<string>('PRO');
  const [status, setStatus] = useState<StatusTenant>('ATIVO');
  const [emailContato, setEmailContato] = useState('');
  const [telefoneContato, setTelefoneContato] = useState('');
  const [dataInicioPrestacaoServico, setDataInicioPrestacaoServico] = useState('');
  const [limiteAlunos, setLimiteAlunos] = useState(500);
  const [logo, setLogo] = useState('');
  const [corPrimaria, setCorPrimaria] = useState('#4f46e5');

  // Form states for Plan Create/Edit
  const [planId, setPlanId] = useState('');
  const [planNome, setPlanNome] = useState('');
  const [planPreco, setPlanPreco] = useState(990);
  const [planLimiteAlunos, setPlanLimiteAlunos] = useState(600);
  const [planDescricao, setPlanDescricao] = useState('');
  const [planBadgeColor, setPlanBadgeColor] = useState('bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200');
  const [permitePix, setPermitePix] = useState(true);
  const [permiteWhatsapp, setPermiteWhatsapp] = useState(true);
  const [permiteDiario, setPermiteDiario] = useState(true);
  const [permiteMulti, setPermiteMulti] = useState(false);
  const [suporteDedicado, setSuporteDedicado] = useState(false);
  const [recursosText, setRecursosText] = useState('Gestão de Alunos & Secretaria\nAnos Letivos & Turmas\nDiário de Classe & Frequência\nPIX Automático com Baixa Instantânea');

  // Stats calculation
  const totalEscolas = tenantsList.length;
  const escolasAtivas = tenantsList.filter(t => t.status === 'ATIVO').length;
  const escolasSuspensas = tenantsList.filter(t => t.status === 'SUSPENSO').length;
  const escolasPendentes = tenantsList.filter(t => t.status === 'PENDENTE').length;

  const totalMRR = tenantsList.reduce((acc, t) => acc + (t.status === 'ATIVO' ? t.valorMensalidadePlano : 0), 0);
  const totalAlunosGlobal = tenantsList.reduce((acc, t) => acc + t.alunosCount, 0);

  // Filtered tenants
  const tenantsFiltrados = tenantsList.filter(t => {
    const matchesSearch = t.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.cnpj.includes(searchTerm) || 
                          t.subdominio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'TODOS' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered faturas SaaS
  const faturasFiltradas = faturasSaaS.filter(f => {
    const matchesSearch = f.escolaNome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.cnpj.includes(searchTerm) || 
                          f.referencia.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'TODOS' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Modal Handlers - School
  const abrirModalCadastro = () => {
    setNome('');
    setCnpj('');
    setSubdominio('');
    setPlano(plansList[0]?.id || 'PRO');
    setStatus('ATIVO');
    setEmailContato('');
    setTelefoneContato('');
    setDataInicioPrestacaoServico(new Date().toISOString().split('T')[0]);
    setLimiteAlunos(plansList[0]?.limiteAlunos || 500);
    setLogo('https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80');
    setCorPrimaria('#4f46e5');
    setShowModalCadastroEscola(true);
  };

  const abrirModalEdicao = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setNome(tenant.nome);
    setCnpj(tenant.cnpj);
    setSubdominio(tenant.subdominio);
    setPlano(tenant.plano);
    setStatus(tenant.status);
    setEmailContato(tenant.emailContato);
    setTelefoneContato(tenant.telefoneContato);
    setDataInicioPrestacaoServico(tenant.dataInicioPrestacaoServico || tenant.dataCriacao || new Date().toISOString().split('T')[0]);
    setLimiteAlunos(tenant.limiteAlunos);
    setLogo(tenant.logo);
    setCorPrimaria(tenant.corPrimaria);
  };

  const handleSalvarCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !cnpj) return;

    const planSpec = plansList.find(p => p.id === plano) || plansList[0];
    const dataInicioFinal = dataInicioPrestacaoServico || new Date().toISOString().split('T')[0];

    adicionarEscola({
      nome,
      cnpj,
      subdominio: subdominio.endsWith('.edugestao.com') ? subdominio : `${subdominio.toLowerCase().replace(/\s+/g, '')}.edugestao.com`,
      logo: logo || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
      plano: plano as PlanoTenant,
      status,
      corPrimaria,
      emailContato: emailContato || `contato@${subdominio}`,
      telefoneContato: telefoneContato || '(11) 98888-0000',
      dataInicioPrestacaoServico: dataInicioFinal,
      limiteAlunos: limiteAlunos || planSpec.limiteAlunos,
      valorMensalidadePlano: planSpec.precoMensal
    });

    // Adicionar fatura inicial para a nova escola
    const novaFatura: FaturaSaaS = {
      id: `fat-saas-${Date.now()}`,
      tenantId: `tenant-${Date.now()}`,
      escolaNome: nome,
      escolaLogo: logo || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
      cnpj,
      plano,
      referencia: `Plano ${plano} - Setembro/2026`,
      valor: planSpec.precoMensal,
      vencimento: '2026-09-10',
      status: 'PENDENTE',
      telefoneContato: telefoneContato || '(11) 98888-0000'
    };

    setFaturasSaaS(prev => [novaFatura, ...prev]);
    setShowModalCadastroEscola(false);
  };

  const handleSalvarEdicao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;

    const planSpec = plansList.find(p => p.id === plano) || plansList[0];
    const dataInicioFinal = dataInicioPrestacaoServico || editingTenant.dataInicioPrestacaoServico || new Date().toISOString().split('T')[0];

    atualizarEscola(editingTenant.id, {
      nome,
      cnpj,
      subdominio,
      plano: plano as PlanoTenant,
      status,
      emailContato,
      telefoneContato,
      dataInicioPrestacaoServico: dataInicioFinal,
      limiteAlunos: limiteAlunos || planSpec.limiteAlunos,
      logo,
      corPrimaria,
      valorMensalidadePlano: planSpec.precoMensal
    });

    setEditingTenant(null);
  };

  // Modal Handlers - Plan
  const abrirModalCriarPlano = () => {
    setEditingPlan(null);
    setPlanId(`PLANO_${Date.now().toString().substring(8)}`);
    setPlanNome('Plano Comercial Personalizado');
    setPlanPreco(1290);
    setPlanLimiteAlunos(800);
    setPlanDescricao('Ideal para escolas de grande porte que precisam de capacidade expandida e automações completas.');
    setPlanBadgeColor('bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200');
    setPermitePix(true);
    setPermiteWhatsapp(true);
    setPermiteDiario(true);
    setPermiteMulti(false);
    setSuporteDedicado(true);
    setRecursosText('Gestão de Alunos & Secretaria\nAnos Letivos & Turmas\nDiário de Classe Completo\nPIX Automático com Baixa Instantânea\nRégua de Cobrança WhatsApp (API Meta)');
    setShowModalPlano(true);
  };

  const abrirModalEditarPlano = (p: PlanSpec) => {
    setEditingPlan(p);
    setPlanId(p.id);
    setPlanNome(p.nome);
    setPlanPreco(p.precoMensal);
    setPlanLimiteAlunos(p.limiteAlunos);
    setPlanDescricao(p.descricao);
    setPlanBadgeColor(p.badgeColor);
    setPermitePix(p.permitePixAutomatico);
    setPermiteWhatsapp(p.permiteReguaWhatsapp);
    setPermiteDiario(p.permiteDiarioClasse);
    setPermiteMulti(p.permiteMultiUnidades);
    setSuporteDedicado(p.suporteDedicado);
    setRecursosText(p.recursos.join('\n'));
    setShowModalPlano(true);
  };

  const handleSalvarPlano = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planId || !planNome) return;

    const recursosList = recursosText.split('\n').map(r => r.trim()).filter(r => r.length > 0);

    const planObject: PlanSpec = {
      id: planId.toUpperCase().replace(/\s+/g, '_'),
      nome: planNome,
      precoMensal: Number(planPreco),
      limiteAlunos: Number(planLimiteAlunos),
      descricao: planDescricao,
      badgeColor: planBadgeColor,
      recursos: recursosList,
      permitePixAutomatico: permitePix,
      permiteReguaWhatsapp: permiteWhatsapp,
      permiteDiarioClasse: permiteDiario,
      permiteMultiUnidades: permiteMulti,
      suporteDedicado: suporteDedicado
    };

    if (editingPlan) {
      atualizarPlano(editingPlan.id, planObject);
    } else {
      adicionarPlano(planObject);
    }

    setShowModalPlano(false);
  };

  // Actions on SaaS Invoices
  const handleGerarPixSaaS = (fat: FaturaSaaS) => {
    setSelectedPixCobranca({
      id: fat.id,
      tenantId: fat.tenantId,
      alunoId: 'escola-direcao',
      alunoNome: fat.escolaNome,
      responsavelId: 'resp-direcao',
      responsavelNome: `Direção da Instituição (${fat.cnpj})`,
      responsavelTelefone: fat.telefoneContato,
      responsavelEmail: `diretoria@${fat.escolaNome.toLowerCase().replace(/\s+/g, '')}.com.br`,
      referencia: fat.referencia,
      valor: fat.valor,
      vencimento: fat.vencimento,
      status: fat.status,
      tipo: 'MENSALIDADE',
      codigoPix: '00020126580014BR.GOV.BCB.PIX0136edugestao-saas-pagamentos5204000053039865802BR5925EduGestao SaaS Plataforma6009SAO PAULO62070503***6304E8A9',

      qrCodePix: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020126580014BR.GOV.BCB.PIX0136edugestao-saas-pagamentos5204000053039865802BR5925EduGestao',
      linhaDigitavelBoleto: '34191.79001 01043.510047 91020.150008 8 98000000099000',
      historicoEnvios: []
    });
  };


  const handleCobrarWhatsappSaaS = (fat: FaturaSaaS) => {
    const num = fat.telefoneContato.replace(/\D/g, '');
    const msg = encodeURIComponent(
      `Olá Direção do ${fat.escolaNome}! Lembrete de pagamento da fatura do plano ${fat.plano} (${fat.referencia}) no valor de R$ ${fat.valor.toFixed(2)}. Acesse o painel para baixar seu comprovante.`
    );
    window.open(`https://wa.me/55${num}?text=${msg}`, '_blank');
    addNotification('Cobrança Enviada', `Mensagem de cobrança enviada para o WhatsApp da escola ${fat.escolaNome}!`, 'SUCESSO');
  };

  const handleAlterarStatusFatura = (id: string, novoStatus: 'PAGO' | 'PENDENTE' | 'ATRASADO') => {
    setFaturasSaaS(prev => prev.map(f => f.id === id ? { ...f, status: novoStatus } : f));
    addNotification('Status da Fatura Atualizado', `Fatura alterada para ${novoStatus}!`, 'INFO');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-semibold mb-2">
            <Globe className="w-3.5 h-3.5 text-purple-300" />
            <span>Gestão Global SaaS (Multi-Tenant, Planos & Arrecadação)</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Painel SuperAdmin SaaS</h1>
          <p className="text-xs text-purple-200/80 mt-1">
            Controle de instituições de ensino, CRUD de planos comerciais e arrecadação de faturas SaaS das escolas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {activeTab === 'escolas' ? (
            <button
              onClick={abrirModalCadastro}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Nova Escola</span>
            </button>
          ) : activeTab === 'planos' ? (
            <button
              onClick={abrirModalCriarPlano}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Novo Plano Comercial</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Primary Sub-Tab Navigation */}
      <div className="flex bg-slate-200/80 dark:bg-slate-800/80 p-1.5 rounded-2xl max-w-2xl">
        <button
          onClick={() => setActiveTab('escolas')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'escolas' 
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-md' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Escolas Clientes ({tenantsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('planos')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'planos' 
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Gestão de Planos ({plansList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('faturas')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'faturas' 
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-md' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Faturas & Arrecadação SaaS ({faturasSaaS.length})</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Escolas */}
        <div className="p-5 glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total de Escolas</span>
            <div className="p-2 bg-purple-100 dark:bg-purple-950 text-purple-600 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{totalEscolas} Clientes</p>
          <div className="flex items-center gap-2 mt-2 text-[11px]">
            <span className="text-emerald-600 font-bold">{escolasAtivas} Ativas</span>
            <span className="text-slate-300">•</span>
            <span className="text-rose-600 font-bold">{escolasSuspensas} Suspensas</span>
            <span className="text-slate-300">•</span>
            <span className="text-amber-600 font-bold">{escolasPendentes} Pendentes</span>
          </div>
        </div>

        {/* Total MRR SaaS */}
        <div className="p-5 glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">MRR Recorrente SaaS</span>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            R$ {totalMRR.toLocaleString('pt-BR')}/mês
          </p>
          <p className="text-xs text-slate-400 mt-2">Faturamento dos planos assinados</p>
        </div>

        {/* Total Alunos Impactados */}
        <div className="p-5 glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Alunos na Plataforma</span>
            <div className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{totalAlunosGlobal}</p>
          <p className="text-xs text-slate-400 mt-2">Atendidos em todas as escolas</p>
        </div>

        {/* Total Planos Criados */}
        <div className="p-5 glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Planos Ativos</span>
            <div className="p-2 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{plansList.length} Opções</p>
          <p className="text-xs text-slate-400 mt-2">Modelos comerciais disponíveis</p>
        </div>

      </div>

      {/* TAB 1: ESCOLAS CLIENTES */}
      {activeTab === 'escolas' && (
        <div className="glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          
          {/* Header Search & Filter */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Escolas Clientes Cadastradas</h3>
              <p className="text-xs text-slate-500">Gerencie cadastros, planos e ative ou suspenda o acesso das escolas.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="text"
                  placeholder="Buscar por escola, CNPJ ou subdomínio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 w-64"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700">
                {['TODOS', 'ATIVO', 'SUSPENSO', 'PENDENTE'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      statusFilter === st 
                        ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-4">Instituição de Ensino</th>
                  <th className="p-4">CNPJ & Subdomínio</th>
                  <th className="p-4">Plano Assinado</th>
                  <th className="p-4">Uso de Alunos</th>
                  <th className="p-4">Contato Direção</th>
                  <th className="p-4 text-center">Situação (Status)</th>
                  <th className="p-4 text-center">Ações de Gestão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {tenantsFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      Nenhuma escola encontrada com os filtros informados.
                    </td>
                  </tr>
                ) : (
                  tenantsFiltrados.map((tenant) => {
                    const isAtivo = tenant.status === 'ATIVO';
                    const isSuspenso = tenant.status === 'SUSPENSO';
                    const pctAlunos = tenant.limiteAlunos ? Math.round((tenant.alunosCount / tenant.limiteAlunos) * 100) : 50;
                    const planSpec = plansList.find(p => p.id === tenant.plano) || { badgeColor: 'bg-purple-100 text-purple-800' };

                    return (
                      <tr key={tenant.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        
                        {/* Name & Logo */}
                        <td className="p-4 flex items-center gap-3">
                          <img 
                            src={tenant.logo} 
                            alt={tenant.nome} 
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-500/20" 
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{tenant.nome}</p>
                            <p className="text-[10px] text-slate-400">Criado em: {tenant.dataCriacao || '2025-01-10'}</p>
                          </div>
                        </td>

                        {/* CNPJ & Subdomain */}
                        <td className="p-4">
                          <p className="font-mono font-semibold text-purple-600 dark:text-purple-400">
                            {tenant.subdominio}
                          </p>
                          <p className="text-[10px] text-slate-400">CNPJ: {tenant.cnpj}</p>
                        </td>

                        {/* Plan */}
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${planSpec.badgeColor}`}>
                            {tenant.plano} • R${tenant.valorMensalidadePlano}/mês
                          </span>
                        </td>

                        {/* Capacity usage */}
                        <td className="p-4">
                          <div className="w-32 space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span className="font-bold">{tenant.alunosCount} alunos</span>
                              <span className="text-slate-400">limite {tenant.limiteAlunos}</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${pctAlunos > 90 ? 'bg-rose-500' : 'bg-purple-600'}`} 
                                style={{ width: `${Math.min(pctAlunos, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Contact & Service Start Date */}
                        <td className="p-4">
                          <p className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{tenant.emailContato}</span>
                          </p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{tenant.telefoneContato}</span>
                          </p>
                          <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 mt-1 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md w-fit">
                            <Calendar className="w-3 h-3 text-purple-500" />
                            <span>Início: {tenant.dataInicioPrestacaoServico || tenant.dataCriacao}</span>
                          </p>
                        </td>

                        {/* Interactive Status Selector */}
                        <td className="p-4 text-center">
                          <select
                            value={tenant.status}
                            onChange={(e) => alterarStatusEscola(tenant.id, e.target.value as StatusTenant)}
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border focus:outline-none cursor-pointer ${
                              isAtivo 
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800' 
                                : isSuspenso 
                                ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800' 
                                : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                            }`}
                          >
                            <option value="ATIVO">🟢 ATIVO</option>
                            <option value="SUSPENSO">🔴 SUSPENSO</option>
                            <option value="PENDENTE">🟡 PENDENTE</option>
                          </select>
                        </td>

                        {/* Quick Actions */}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => abrirModalEdicao(tenant)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:hover:bg-purple-900/80 dark:text-purple-300 rounded-xl font-bold text-[11px] transition-colors"
                              title="Alterar dados cadastrais"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Editar</span>
                            </button>

                            <button
                              onClick={() => setCurrentTenant(tenant)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-[11px] transition-colors"
                              title="Alternar ambiente ativo para esta escola"
                            >
                              Acessar Tenant
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: GESTÃO DE PLANOS COMMERCIAL (CRUD) */}
      {activeTab === 'planos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Gerenciador de Planos Comerciais</h3>
              <p className="text-xs text-slate-500">Crie, edite preços, ajuste limites de alunos e defina recursos liberados por plano.</p>
            </div>

            <button
              onClick={abrirModalCriarPlano}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Plano Comercial</span>
            </button>
          </div>

          {/* Cards Grid dos Planos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plansList.map((plan) => {
              const escolasNoPlano = tenantsList.filter(t => t.plano === plan.id);
              const mrrPlano = escolasNoPlano.reduce((acc, t) => acc + (t.status === 'ATIVO' ? t.valorMensalidadePlano : 0), 0);

              return (
                <div key={plan.id} className="glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between space-y-5 shadow-lg relative overflow-hidden group">
                  
                  {/* Top Bar Info */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${plan.badgeColor}`}>
                        {plan.id}
                      </span>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => abrirModalEditarPlano(plan)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
                          title="Editar Plano"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const clone: PlanSpec = {
                              ...plan,
                              id: `${plan.id}_CLONE_${Date.now().toString().substring(10)}`,
                              nome: `${plan.nome} (Cópia)`
                            };
                            adicionarPlano(clone);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/60 transition-colors"
                          title="Duplicar Plano"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => excluirPlano(plan.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                          title="Excluir Plano"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-xl font-black text-slate-900 dark:text-white mt-3">{plan.nome}</h4>
                    
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">R$ {plan.precoMensal}</span>
                      <span className="text-xs text-slate-400 font-medium">/mês</span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{plan.descricao}</p>

                    {/* Performance Metrics */}
                    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Assinantes</p>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{escolasNoPlano.length} Escolas</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">MRR do Plano</p>
                        <p className="font-bold text-emerald-600 dark:text-emerald-400">R$ {mrrPlano.toLocaleString('pt-BR')}</p>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Recursos e Permissões:</span>
                      
                      <div className="grid grid-cols-2 gap-1.5 text-[11px] font-medium pt-1">
                        <div className={`flex items-center gap-1.5 ${plan.permitePixAutomatico ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 opacity-60'}`}>
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span>PIX Webhook</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${plan.permiteReguaWhatsapp ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 opacity-60'}`}>
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span>WhatsApp API</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${plan.permiteDiarioClasse ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 opacity-60'}`}>
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span>Diário de Classe</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${plan.suporteDedicado ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 opacity-60'}`}>
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span>Suporte 24/7</span>
                        </div>
                      </div>

                      <div className="pt-2 space-y-1.5">
                        {plan.recursos.map((rec, i) => (
                          <p key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                            <span>{rec}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Capacidade:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{plan.limiteAlunos} Alunos</span>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: FATURAS & ARRECADAÇÃO SAAS (ESCOLAS) */}
      {activeTab === 'faturas' && (
        <div className="glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          
          {/* Header Search & Status Filter */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Lançamentos & Faturas SaaS das Escolas Clientes</h3>
              <p className="text-xs text-slate-500">Cobrança das mensalidades dos planos contratados pelas instituições de ensino.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="text"
                  placeholder="Buscar escola, CNPJ ou fatura..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 w-64"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700">
                {['TODOS', 'PAGO', 'PENDENTE', 'ATRASADO'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      statusFilter === st 
                        ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SaaS Invoices Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-4">Instituição de Ensino (Escola)</th>
                  <th className="p-4">Plano Assinado</th>
                  <th className="p-4">Referência do Contrato</th>
                  <th className="p-4">Valor Mensalidade SaaS</th>
                  <th className="p-4">Vencimento</th>
                  <th className="p-4 text-center">Status Fatura</th>
                  <th className="p-4 text-center">Ações Rápidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {faturasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      Nenhuma fatura de escola encontrada com os filtros informados.
                    </td>
                  </tr>
                ) : (
                  faturasFiltradas.map((fat) => {
                    const isPago = fat.status === 'PAGO';
                    const isAtrasado = fat.status === 'ATRASADO';

                    return (
                      <tr key={fat.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        
                        {/* School Info */}
                        <td className="p-4 flex items-center gap-3">
                          <img 
                            src={fat.escolaLogo} 
                            alt={fat.escolaNome} 
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/20" 
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{fat.escolaNome}</p>
                            <p className="text-[10px] text-slate-400">CNPJ: {fat.cnpj}</p>
                          </div>
                        </td>

                        {/* Plan */}
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200">
                            PLANO {fat.plano}
                          </span>
                        </td>

                        {/* Reference */}
                        <td className="p-4 font-medium">
                          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 text-[11px]">
                            {fat.referencia}
                          </span>
                        </td>

                        {/* Value */}
                        <td className="p-4">
                          <p className="font-black text-slate-900 dark:text-white text-sm">
                            R$ {fat.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </td>

                        {/* Due Date */}
                        <td className="p-4">
                          <span className={`font-semibold ${isAtrasado ? 'text-rose-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                            {fat.vencimento}
                          </span>
                        </td>

                        {/* Interactive Status Dropdown */}
                        <td className="p-4 text-center">
                          <select
                            value={fat.status}
                            onChange={(e) => handleAlterarStatusFatura(fat.id, e.target.value as 'PAGO' | 'PENDENTE' | 'ATRASADO')}
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border focus:outline-none cursor-pointer ${
                              isPago 
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800' 
                                : isAtrasado 
                                ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800' 
                                : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                            }`}
                          >
                            <option value="PAGO">🟢 PAGO</option>
                            <option value="PENDENTE">🟡 PENDENTE</option>
                            <option value="ATRASADO">🔴 ATRASADO</option>
                          </select>
                        </td>

                        {/* Quick Actions */}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* PIX SaaS Button */}
                            <button
                              onClick={() => handleGerarPixSaaS(fat)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-[11px] shadow-sm transition-all"
                              title="Gerar QR-Code PIX da Fatura SaaS"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>PIX SaaS</span>
                            </button>

                            {/* WhatsApp Direct Billing */}
                            <button
                              onClick={() => handleCobrarWhatsappSaaS(fat)}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 dark:text-emerald-300 rounded-xl font-bold text-[11px] transition-colors"
                              title="Disparar aviso de cobrança para a Direção da Escola"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Modal Cadastro / Edição de Plano SaaS */}
      {showModalPlano && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl glass-panel bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span>{editingPlan ? `Editar Plano: ${editingPlan.nome}` : 'Criar Novo Plano Comercial'}</span>
              </h3>
              <button onClick={() => setShowModalPlano(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSalvarPlano} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">ID do Plano (Código curto)</label>
                  <input 
                    type="text"
                    required
                    disabled={Boolean(editingPlan)}
                    placeholder="ex: PLANO_GOLD"
                    value={planId}
                    onChange={(e) => setPlanId(e.target.value.toUpperCase())}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Nome Comercial do Plano</label>
                  <input 
                    type="text"
                    required
                    placeholder="ex: Plano Gold Expanção"
                    value={planNome}
                    onChange={(e) => setPlanNome(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Preço Mensal (R$/mês)</label>
                  <input 
                    type="number"
                    required
                    value={planPreco}
                    onChange={(e) => setPlanPreco(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Limite Máximo de Alunos</label>
                  <input 
                    type="number"
                    required
                    value={planLimiteAlunos}
                    onChange={(e) => setPlanLimiteAlunos(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Descrição Comercial</label>
                <textarea 
                  rows={2}
                  value={planDescricao}
                  onChange={(e) => setPlanDescricao(e.target.value)}
                  placeholder="Descreva o público-alvo e o objetivo deste plano..."
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              {/* Resource Toggles */}
              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-2">Toggles de Funcionalidades Liberadas:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={permitePix} onChange={e => setPermitePix(e.target.checked)} className="rounded text-indigo-600" />
                    <span className="font-medium">PIX Webhook</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={permiteWhatsapp} onChange={e => setPermiteWhatsapp(e.target.checked)} className="rounded text-indigo-600" />
                    <span className="font-medium">Régua WhatsApp</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={permiteDiario} onChange={e => setPermiteDiario(e.target.checked)} className="rounded text-indigo-600" />
                    <span className="font-medium">Diário de Classe</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={permiteMulti} onChange={e => setPermiteMulti(e.target.checked)} className="rounded text-indigo-600" />
                    <span className="font-medium">Multi-Unidades</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={suporteDedicado} onChange={e => setSuporteDedicado(e.target.checked)} className="rounded text-indigo-600" />
                    <span className="font-medium">Suporte VIP 24/7</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Recursos Incluídos (Um por linha)</label>
                <textarea 
                  rows={4}
                  value={recursosText}
                  onChange={(e) => setRecursosText(e.target.value)}
                  placeholder="Digite cada funcionalidade em uma nova linha..."
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModalPlano(false)}
                  className="px-4 py-2 text-slate-500 font-medium hover:text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
                >
                  Salvar Plano
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cadastro de Nova Escola */}
      {showModalCadastroEscola && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl glass-panel bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                <span>Cadastrar Nova Instituição de Ensino</span>
              </h3>
              <button onClick={() => setShowModalCadastroEscola(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSalvarCadastro} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Nome da Escola / Razão Social</label>
                  <input 
                    type="text"
                    required
                    placeholder="ex: Colégio Saint Germain"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">CNPJ da Instituição</label>
                  <input 
                    type="text"
                    required
                    placeholder="00.000.000/0001-00"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Subdomínio SaaS (URL)</label>
                  <input 
                    type="text"
                    required
                    placeholder="saintgermain.edugestao.com"
                    value={subdominio}
                    onChange={(e) => setSubdominio(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Plano de Assinatura</label>
                  <select
                    value={plano}
                    onChange={(e) => {
                      const newPlanId = e.target.value;
                      setPlano(newPlanId);
                      const spec = plansList.find(p => p.id === newPlanId);
                      if (spec) setLimiteAlunos(spec.limiteAlunos);
                    }}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
                  >
                    {plansList.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nome} (R$ {p.precoMensal}/mês - até {p.limiteAlunos} alunos)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>Data de Início da Prestação de Serviço</span>
                  </label>
                  <input 
                    type="date"
                    required
                    value={dataInicioPrestacaoServico}
                    onChange={(e) => setDataInicioPrestacaoServico(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Telefone / WhatsApp</label>
                  <input 
                    type="text"
                    placeholder="(11) 98888-7777"
                    value={telefoneContato}
                    onChange={(e) => setTelefoneContato(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">E-mail de Contato da Direção</label>
                <input 
                  type="email"
                  placeholder="diretoria@escola.com.br"
                  value={emailContato}
                  onChange={(e) => setEmailContato(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Limite Máximo de Alunos</label>
                  <input 
                    type="number"
                    value={limiteAlunos}
                    onChange={(e) => setLimiteAlunos(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Situação Inicial (Status)</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as StatusTenant)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
                  >
                    <option value="ATIVO">🟢 ATIVO</option>
                    <option value="PENDENTE">🟡 PENDENTE</option>
                    <option value="SUSPENSO">🔴 SUSPENSO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">URL da Logomarca (Imagem PNG/JPG)</label>
                <input 
                  type="text"
                  placeholder="https://..."
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModalCadastroEscola(false)}
                  className="px-4 py-2 text-slate-500 font-medium hover:text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md"
                >
                  Cadastrar Escola
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edição de Escola */}
      {editingTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl glass-panel bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-purple-600" />
                <span>Editar Instituição: {editingTenant.nome}</span>
              </h3>
              <button onClick={() => setEditingTenant(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSalvarEdicao} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Nome da Escola</label>
                  <input 
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">CNPJ</label>
                  <input 
                    type="text"
                    required
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Subdomínio SaaS</label>
                  <input 
                    type="text"
                    required
                    value={subdominio}
                    onChange={(e) => setSubdominio(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Plano de Assinatura</label>
                  <select
                    value={plano}
                    onChange={(e) => {
                      const newPlanId = e.target.value;
                      setPlano(newPlanId);
                      const spec = plansList.find(p => p.id === newPlanId);
                      if (spec) setLimiteAlunos(spec.limiteAlunos);
                    }}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
                  >
                    {plansList.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nome} (R$ {p.precoMensal}/mês)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>Data de Início da Prestação de Serviço</span>
                  </label>
                  <input 
                    type="date"
                    required
                    value={dataInicioPrestacaoServico}
                    onChange={(e) => setDataInicioPrestacaoServico(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Telefone Contato</label>
                  <input 
                    type="text"
                    value={telefoneContato}
                    onChange={(e) => setTelefoneContato(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">E-mail Contato</label>
                <input 
                  type="email"
                  value={emailContato}
                  onChange={(e) => setEmailContato(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Limite Máximo de Alunos</label>
                  <input 
                    type="number"
                    value={limiteAlunos}
                    onChange={(e) => setLimiteAlunos(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Situação da Escola (Status)</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as StatusTenant)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
                  >
                    <option value="ATIVO">🟢 ATIVO</option>
                    <option value="PENDENTE">🟡 PENDENTE</option>
                    <option value="SUSPENSO">🔴 SUSPENSO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">URL da Logomarca</label>
                <input 
                  type="text"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTenant(null)}
                  className="px-4 py-2 text-slate-500 font-medium hover:text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
