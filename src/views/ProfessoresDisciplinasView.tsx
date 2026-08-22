import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { User, Disciplina } from '../types';
import { 
  UserCheck, BookOpen, Plus, Edit3, Search, 
  Mail, Phone, Clock, Award, X 
} from 'lucide-react';

export const ProfessoresDisciplinasView: React.FC = () => {
  const { 
    professores, disciplinas, turmas, currentTenant, 
    adicionarProfessor, atualizarProfessor, 
    adicionarDisciplina, atualizarDisciplina 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'PROFESSORES' | 'DISCIPLINAS'>('PROFESSORES');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTurmaFilter, setSelectedTurmaFilter] = useState('TODAS');

  // Modals state
  const [showProfModal, setShowProfModal] = useState(false);
  const [editingProf, setEditingProf] = useState<User | null>(null);

  const [showDiscModal, setShowDiscModal] = useState(false);
  const [editingDisc, setEditingDisc] = useState<Disciplina | null>(null);

  // Professor Form State
  const [profNome, setProfNome] = useState('');
  const [profEmail, setProfEmail] = useState('');
  const [profTelefone, setProfTelefone] = useState('');
  const [profCpf, setProfCpf] = useState('');
  const [profEspecialidade, setProfEspecialidade] = useState('Matemática');
  const [profAvatar, setProfAvatar] = useState('');

  // Disciplina Form State
  const [discNome, setDiscNome] = useState('');
  const [discTurmaId, setDiscTurmaId] = useState(turmas[0]?.id || '');
  const [discCargaHoraria, setDiscCargaHoraria] = useState(4);
  const [discProfId, setDiscProfId] = useState(professores[0]?.id || '');

  // Metrics
  const totalProfessores = professores.length;
  const totalDisciplinas = disciplinas.length;
  const cargaHorariaTotalGlobal = disciplinas.reduce((acc, d) => acc + d.cargaHorariaSemanal, 0);
  const mediaCargaHoraria = totalProfessores > 0 ? (cargaHorariaTotalGlobal / totalProfessores).toFixed(1) : '0';

  // Filtered lists
  const professoresFiltrados = professores
    .filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 (p.especialidade && p.especialidade.toLowerCase().includes(searchTerm.toLowerCase())))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

  const disciplinasFiltradas = disciplinas
    .filter(d => {
      const matchesSearch = d.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            d.professorNome.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTurma = selectedTurmaFilter === 'TODOS' || d.turmaId === selectedTurmaFilter;
      return matchesSearch && matchesTurma;
    })
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

  // Helpers
  const getDisciplinasDoProfessor = (profId: string) => {
    return disciplinas.filter(d => d.professorId === profId);
  };

  // Handlers
  const abrirModalNovoProf = () => {
    setEditingProf(null);
    setProfNome('');
    setProfEmail('');
    setProfTelefone('');
    setProfCpf('');
    setProfEspecialidade('Matemática e Ciências');
    setProfAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80');
    setShowProfModal(true);
  };

  const abrirModalEditarProf = (prof: User) => {
    setEditingProf(prof);
    setProfNome(prof.nome);
    setProfEmail(prof.email);
    setProfTelefone(prof.telefone || '');
    setProfCpf(prof.cpf || '');
    setProfEspecialidade(prof.especialidade || 'Geral');
    setProfAvatar(prof.avatar);
    setShowProfModal(true);
  };

  const handleSalvarProf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profNome || !profEmail) return;

    if (editingProf) {
      atualizarProfessor(editingProf.id, {
        nome: profNome,
        email: profEmail,
        telefone: profTelefone,
        cpf: profCpf,
        especialidade: profEspecialidade,
        avatar: profAvatar
      });
    } else {
      adicionarProfessor({
        nome: profNome,
        email: profEmail,
        telefone: profTelefone,
        cpf: profCpf,
        especialidade: profEspecialidade,
        avatar: profAvatar
      });
    }
    setShowProfModal(false);
  };

  const abrirModalNovaDisc = () => {
    setEditingDisc(null);
    setDiscNome('');
    setDiscTurmaId(turmas[0]?.id || '');
    setDiscCargaHoraria(4);
    setDiscProfId(professores[0]?.id || '');
    setShowDiscModal(true);
  };

  const abrirModalEditarDisc = (disc: Disciplina) => {
    setEditingDisc(disc);
    setDiscNome(disc.nome);
    setDiscTurmaId(disc.turmaId);
    setDiscCargaHoraria(disc.cargaHorariaSemanal);
    setDiscProfId(disc.professorId);
    setShowDiscModal(true);
  };

  const handleSalvarDisc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discNome || !discTurmaId) return;

    const profObj = professores.find(p => p.id === discProfId);

    if (editingDisc) {
      atualizarDisciplina(editingDisc.id, {
        nome: discNome,
        turmaId: discTurmaId,
        cargaHorariaSemanal: discCargaHoraria,
        professorId: discProfId,
        professorNome: profObj?.nome || 'Não atribuído'
      });
    } else {
      adicionarDisciplina({
        nome: discNome,
        turmaId: discTurmaId,
        cargaHorariaSemanal: discCargaHoraria,
        professorId: discProfId,
        professorNome: profObj?.nome || 'Não atribuído'
      });
    }
    setShowDiscModal(false);
  };

  const handleTrocarProfessorDisciplina = (disciplinaId: string, novoProfId: string) => {
    const profObj = professores.find(p => p.id === novoProfId);
    if (!profObj) return;

    atualizarDisciplina(disciplinaId, {
      professorId: novoProfId,
      professorNome: profObj.nome
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 text-white rounded-2xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-semibold mb-2">
            <UserCheck className="w-3.5 h-3.5 text-purple-300" />
            <span>Módulo de Secretaria & Corpo Docente</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Professores & Disciplinas</h1>
          <p className="text-xs text-purple-200/80 mt-1">
            Cadastro de professores, vinculação de disciplinas por turma e gestão de carga horária no {currentTenant.nome}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={abrirModalNovoProf}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Novo Professor</span>
          </button>

          <button
            onClick={abrirModalNovaDisc}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Nova Disciplina</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Professores Cadastrados</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalProfessores} Docentes</p>
            <p className="text-xs text-slate-400 mt-1">Atuando no {currentTenant.nome}</p>
          </div>
          <div className="p-3 bg-purple-100 dark:bg-purple-950 text-purple-600 rounded-2xl">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Disciplinas Oferecidas</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalDisciplinas} Matérias</p>
            <p className="text-xs text-slate-400 mt-1">Distribuídas nas turmas da escola</p>
          </div>
          <div className="p-3 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Carga Horária Média</span>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{mediaCargaHoraria}h / semana</p>
            <p className="text-xs text-slate-400 mt-1">Média por docente</p>
          </div>
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Container with Tabs */}
      <div className="glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Navigation SubTabs */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700">
            <button
              onClick={() => setActiveSubTab('PROFESSORES')}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 ${
                activeSubTab === 'PROFESSORES' 
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Corpo Docente ({totalProfessores})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('DISCIPLINAS')}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 ${
                activeSubTab === 'DISCIPLINAS' 
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Grade de Disciplinas ({totalDisciplinas})</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text"
                placeholder={activeSubTab === 'PROFESSORES' ? "Buscar professor ou especialidade..." : "Buscar disciplina ou professor..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 w-64"
              />
            </div>

            {/* Turma Filter (only on DISCIPLINAS tab) */}
            {activeSubTab === 'DISCIPLINAS' && (
              <select
                value={selectedTurmaFilter}
                onChange={(e) => setSelectedTurmaFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
              >
                <option value="TODAS">Todas as Turmas</option>
                {turmas.map(t => (
                  <option key={t.id} value={t.id}>{t.nome}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Tab Content 1: Professores */}
        {activeSubTab === 'PROFESSORES' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {professoresFiltrados.length === 0 ? (
              <div className="col-span-full text-center py-10 text-slate-400">
                Nenhum professor encontrado com os termos de busca. Clique em "+ Cadastrar Novo Professor" para adicionar.
              </div>
            ) : (
              professoresFiltrados.map((prof) => {
                const disciplinasDoProf = getDisciplinasDoProfessor(prof.id);
                const cargaTotalProf = disciplinasDoProf.reduce((acc, d) => acc + d.cargaHorariaSemanal, 0);

                return (
                  <div key={prof.id} className="p-5 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                    
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={prof.avatar} 
                          alt={prof.nome} 
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/20" 
                        />
                        <div>
                          <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{prof.nome}</h4>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                            <Award className="w-3.5 h-3.5" />
                            <span>{prof.especialidade || 'Área Geral'}</span>
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => abrirModalEditarProf(prof)}
                        className="p-1.5 text-slate-400 hover:text-purple-600 transition-colors"
                        title="Editar dados do professor"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Contacts */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <p className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{prof.email}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{prof.telefone || '(11) 98888-0000'}</span>
                      </p>
                    </div>

                    {/* Disciplinas Responsável */}
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-600 dark:text-slate-400">Disciplinas sob Responsabilidade</span>
                        <span className="font-bold text-purple-600 dark:text-purple-400">{cargaTotalProf}h/semana</span>
                      </div>

                      {disciplinasDoProf.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic">Nenhuma disciplina atribuída no momento.</p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {disciplinasDoProf.map(d => {
                            const turmaObj = turmas.find(t => t.id === d.turmaId);
                            return (
                              <span key={d.id} className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-bold border border-purple-100 dark:border-purple-900">
                                {d.nome} • {turmaObj?.nome || 'Turma'} ({d.cargaHorariaSemanal}h)
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab Content 2: Disciplinas Table */}
        {activeSubTab === 'DISCIPLINAS' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-4">Disciplina / Matéria</th>
                  <th className="p-4">Turma Atribuída</th>
                  <th className="p-4">Carga Horária Semanal</th>
                  <th className="p-4">Professor Responsável</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {disciplinasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400">
                      Nenhuma disciplina encontrada para os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  disciplinasFiltradas.map((disc) => {
                    const turmaObj = turmas.find(t => t.id === disc.turmaId);

                    return (
                      <tr key={disc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        
                        {/* Disciplina Name */}
                        <td className="p-4 font-bold text-slate-900 dark:text-white text-sm">
                          {disc.nome}
                        </td>

                        {/* Turma */}
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs">
                            {turmaObj?.nome || 'Turma não informada'}
                          </span>
                        </td>

                        {/* Carga Horaria */}
                        <td className="p-4 font-semibold text-purple-600 dark:text-purple-400">
                          {disc.cargaHorariaSemanal} horas / semana
                        </td>

                        {/* Interactive Teacher Switcher */}
                        <td className="p-4">
                          <select
                            value={disc.professorId}
                            onChange={(e) => handleTrocarProfessorDisciplina(disc.id, e.target.value)}
                            className="p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer focus:outline-none"
                          >
                            {professores.map(p => (
                              <option key={p.id} value={p.id}>{p.nome} ({p.especialidade || 'Docente'})</option>
                            ))}
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() => abrirModalEditarDisc(disc)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                            title="Editar disciplina"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Modal Cadastro/Edição de Professor */}
      {showProfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg glass-panel bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-600" />
                <span>{editingProf ? 'Editar Professor' : 'Cadastrar Novo Professor'}</span>
              </h3>
              <button onClick={() => setShowProfModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvarProf} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Nome Completo do Professor</label>
                <input 
                  type="text"
                  required
                  placeholder="ex: Prof. Ricardo Santos"
                  value={profNome}
                  onChange={(e) => setProfNome(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">E-mail de Acesso</label>
                  <input 
                    type="email"
                    required
                    placeholder="professor@escola.com.br"
                    value={profEmail}
                    onChange={(e) => setProfEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Telefone / WhatsApp</label>
                  <input 
                    type="text"
                    placeholder="(11) 98888-7777"
                    value={profTelefone}
                    onChange={(e) => setProfTelefone(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">CPF</label>
                  <input 
                    type="text"
                    placeholder="000.000.000-00"
                    value={profCpf}
                    onChange={(e) => setProfCpf(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Especialidade / Área</label>
                  <input 
                    type="text"
                    placeholder="ex: Matemática e Física"
                    value={profEspecialidade}
                    onChange={(e) => setProfEspecialidade(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">URL da Foto / Avatar</label>
                <input 
                  type="text"
                  placeholder="https://..."
                  value={profAvatar}
                  onChange={(e) => setProfAvatar(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowProfModal(false)}
                  className="px-4 py-2 text-slate-500 font-medium hover:text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl"
                >
                  Salvar Professor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cadastro/Edição de Disciplina */}
      {showDiscModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg glass-panel bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>{editingDisc ? 'Editar Disciplina' : 'Criar Nova Disciplina'}</span>
              </h3>
              <button onClick={() => setShowDiscModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvarDisc} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Nome da Disciplina / Matéria</label>
                <input 
                  type="text"
                  required
                  placeholder="ex: Matemática e Raciocínio Lógico"
                  value={discNome}
                  onChange={(e) => setDiscNome(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Turma Atribuída</label>
                  <select
                    value={discTurmaId}
                    onChange={(e) => setDiscTurmaId(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
                  >
                    {turmas.map(t => (
                      <option key={t.id} value={t.id}>{t.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Carga Horária Semanal (horas)</label>
                  <input 
                    type="number"
                    value={discCargaHoraria}
                    onChange={(e) => setDiscCargaHoraria(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Professor Responsável</label>
                <select
                  value={discProfId}
                  onChange={(e) => setDiscProfId(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
                >
                  {professores.map(p => (
                    <option key={p.id} value={p.id}>{p.nome} ({p.especialidade || 'Docente'})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDiscModal(false)}
                  className="px-4 py-2 text-slate-500 font-medium hover:text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                >
                  Salvar Disciplina
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
