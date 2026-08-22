import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Tenant, StatusTenant, PlanoTenant } from '../types';
import { 
  Globe, Building2, Users, ShieldCheck, Plus, Search, 
  Edit3, Phone, Mail, X, Sparkles 
} from 'lucide-react';

export const SuperAdminView: React.FC = () => {
  const { 
    tenantsList, adicionarEscola, atualizarEscola, 
    alterarStatusEscola, setCurrentTenant,
    showModalCadastroEscola, setShowModalCadastroEscola
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  
  // Edit modal state
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  // Form states for Create/Edit
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [subdominio, setSubdominio] = useState('');
  const [plano, setPlano] = useState<PlanoTenant>('PRO');
  const [status, setStatus] = useState<StatusTenant>('ATIVO');
  const [emailContato, setEmailContato] = useState('');
  const [telefoneContato, setTelefoneContato] = useState('');
  const [limiteAlunos, setLimiteAlunos] = useState(500);
  const [logo, setLogo] = useState('');
  const [corPrimaria, setCorPrimaria] = useState('#4f46e5');

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

  const abrirModalCadastro = () => {
    setNome('');
    setCnpj('');
    setSubdominio('');
    setPlano('PRO');
    setStatus('ATIVO');
    setEmailContato('');
    setTelefoneContato('');
    setLimiteAlunos(500);
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
    setLimiteAlunos(tenant.limiteAlunos);
    setLogo(tenant.logo);
    setCorPrimaria(tenant.corPrimaria);
  };

  const handleSalvarCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !cnpj) return;

    const valorPlano = plano === 'BASIC' ? 490 : plano === 'PRO' ? 990 : 1990;

    adicionarEscola({
      nome,
      cnpj,
      subdominio: subdominio.endsWith('.edugestao.com') ? subdominio : `${subdominio.toLowerCase().replace(/\s+/g, '')}.edugestao.com`,
      logo: logo || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
      plano,
      status,
      corPrimaria,
      emailContato: emailContato || `contato@${subdominio}`,
      telefoneContato: telefoneContato || '(11) 98888-0000',
      limiteAlunos,
      valorMensalidadePlano: valorPlano
    });

    setShowModalCadastroEscola(false);
  };

  const handleSalvarEdicao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;

    const valorPlano = plano === 'BASIC' ? 490 : plano === 'PRO' ? 990 : 1990;

    atualizarEscola(editingTenant.id, {
      nome,
      cnpj,
      subdominio,
      plano,
      status,
      emailContato,
      telefoneContato,
      limiteAlunos,
      logo,
      corPrimaria,
      valorMensalidadePlano: valorPlano
    });

    setEditingTenant(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-semibold mb-2">
            <Globe className="w-3.5 h-3.5 text-purple-300" />
            <span>Gestão Global de Escolas (Multi-tenant Admin)</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Painel SuperAdmin SaaS</h1>
          <p className="text-xs text-purple-200/80 mt-1">
            Cadastro de instituições, alteração de contratos e controle de situação (Ativo / Suspenso).
          </p>
        </div>

        <button
          onClick={abrirModalCadastro}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Nova Escola</span>
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

        {/* Uptime SLA */}
        <div className="p-5 glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">SLA de Segurança</span>
            <div className="p-2 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">99.98%</p>
          <p className="text-xs text-slate-400 mt-2">RLS ativado e isolamento lógico</p>
        </div>

      </div>

      {/* Tenants Table & Controls */}
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
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                          tenant.plano === 'ENTERPRISE'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200'
                            : tenant.plano === 'PRO'
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
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

                      {/* Contact */}
                      <td className="p-4">
                        <p className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{tenant.emailContato}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />
                          <span>{tenant.telefoneContato}</span>
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
                          
                          {/* Edit Data Button */}
                          <button
                            onClick={() => abrirModalEdicao(tenant)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:hover:bg-purple-900/80 dark:text-purple-300 rounded-xl font-bold text-[11px] transition-colors"
                            title="Alterar dados cadastrais"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>

                          {/* Switch Tenant Simulator */}
                          <button
                            onClick={() => {
                              setCurrentTenant(tenant);
                            }}
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
                    onChange={(e) => setPlano(e.target.value as PlanoTenant)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
                  >
                    <option value="BASIC">Plano BASIC (R$ 490/mês - até 250 alunos)</option>
                    <option value="PRO">Plano PRO (R$ 990/mês - até 600 alunos)</option>
                    <option value="ENTERPRISE">Plano ENTERPRISE (R$ 1.990/mês - até 2000 alunos)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    onChange={(e) => setPlano(e.target.value as PlanoTenant)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
                  >
                    <option value="BASIC">Plano BASIC (R$ 490/mês)</option>
                    <option value="PRO">Plano PRO (R$ 990/mês)</option>
                    <option value="ENTERPRISE">Plano ENTERPRISE (R$ 1.990/mês)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">E-mail Contato</label>
                  <input 
                    type="email"
                    value={emailContato}
                    onChange={(e) => setEmailContato(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
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
