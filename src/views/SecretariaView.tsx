import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Plus, Search } from 'lucide-react';

export const SecretariaView: React.FC = () => {
  const { alunos, turmas, adicionarAluno, currentTenant } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTurmaFilter, setSelectedTurmaFilter] = useState('TODAS');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [nomeAluno, setNomeAluno] = useState('');
  const [cpfAluno, setCpfAluno] = useState('');
  const [turmaId, setTurmaId] = useState(turmas[0]?.id || '');
  const [nomeResp, setNomeResp] = useState('');
  const [telResp, setTelResp] = useState('');
  const [emailResp, setEmailResp] = useState('');

  const handleCadastrar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeAluno || !nomeResp || !turmaId) return;

    const turmaObj = turmas.find(t => t.id === turmaId);

    adicionarAluno({
      nome: nomeAluno,
      cpf: cpfAluno || '000.000.000-00',
      dataNascimento: '2011-05-20',
      turmaId,
      turmaNome: turmaObj?.nome || 'Turma Sem Nome',
      responsavelId: `resp-${Date.now()}`,
      responsavelNome: nomeResp,
      responsavelTelefone: telResp || '(11) 99999-8888',
      responsavelEmail: emailResp || `${nomeResp.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      status: 'ATIVO',
      foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    });

    setShowModal(false);
    setNomeAluno('');
    setCpfAluno('');
    setNomeResp('');
    setTelResp('');
    setEmailResp('');
  };

  const alunosFiltrados = alunos.filter(a => {
    const matchesSearch = a.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.responsavelNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.matricula.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTurma = selectedTurmaFilter === 'TODAS' || a.turmaId === selectedTurmaFilter;
    return matchesSearch && matchesTurma;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Módulo de Secretaria & Gestão Acadêmica</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Secretaria & Cadastros Escolares</h1>
          <p className="text-xs text-blue-200/80 mt-1">
            Gestão de alunos, responsáveis, enturmação e matrículas do {currentTenant.nome}.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Matricular Novo Aluno</span>
        </button>
      </div>

      {/* Turmas Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {turmas.map(t => (
          <div key={t.id} className="p-4 glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">{t.turno} • {t.anoLetivo}</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">{t.nome}</h4>
              <p className="text-xs text-slate-500 mt-1">Prof: {t.professorTitularNome}</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{t.alunosMatriculados}</span>
              <span className="text-xs text-slate-400 font-normal"> / {t.capacidade} vagas</span>
            </div>
          </div>
        ))}
      </div>

      {/* Students List Container */}
      <div className="glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Filter bar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Alunos Matriculados</h3>
            <p className="text-xs text-slate-500">{alunosFiltrados.length} alunos cadastrados nesta unidade</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text"
                placeholder="Buscar por aluno, matrícula ou responsável..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 w-64"
              />
            </div>

            {/* Turma filter */}
            <select
              value={selectedTurmaFilter}
              onChange={(e) => setSelectedTurmaFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
            >
              <option value="TODAS">Todas as Turmas</option>
              {turmas.map(t => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-4">Aluno</th>
                <th className="p-4">Matrícula</th>
                <th className="p-4">Turma Atribuída</th>
                <th className="p-4">Responsável Legal</th>
                <th className="p-4">Contato</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {alunosFiltrados.map((aluno) => (
                <tr key={aluno.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img 
                      src={aluno.foto} 
                      alt={aluno.nome}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20" 
                    />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{aluno.nome}</p>
                      <p className="text-[10px] text-slate-400">CPF: {aluno.cpf}</p>
                    </div>
                  </td>

                  <td className="p-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                    {aluno.matricula}
                  </td>

                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      {aluno.turmaNome}
                    </span>
                  </td>

                  <td className="p-4 font-semibold">
                    {aluno.responsavelNome}
                  </td>

                  <td className="p-4">
                    <p className="text-slate-600 dark:text-slate-400">{aluno.responsavelTelefone}</p>
                    <p className="text-[10px] text-slate-400">{aluno.responsavelEmail}</p>
                  </td>

                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                      {aluno.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal Matrícula */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg glass-panel bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Matricular Novo Aluno</h3>
            
            <form onSubmit={handleCadastrar} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Nome Completo do Aluno</label>
                <input 
                  type="text"
                  required
                  placeholder="ex: Enzo Gabriel Ferreira"
                  value={nomeAluno}
                  onChange={(e) => setNomeAluno(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">CPF do Aluno</label>
                  <input 
                    type="text"
                    placeholder="123.456.789-00"
                    value={cpfAluno}
                    onChange={(e) => setCpfAluno(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Turma de Enturmação</label>
                  <select
                    value={turmaId}
                    onChange={(e) => setTurmaId(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                  >
                    {turmas.map(t => (
                      <option key={t.id} value={t.id}>{t.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white mb-2">Dados do Responsável Financeiro</p>
                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Nome do Responsável</label>
                    <input 
                      type="text"
                      required
                      placeholder="ex: Fernando Ferreira"
                      value={nomeResp}
                      onChange={(e) => setNomeResp(e.target.value)}
                      className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Telefone (WhatsApp)</label>
                      <input 
                        type="text"
                        placeholder="(11) 98888-7777"
                        value={telResp}
                        onChange={(e) => setTelResp(e.target.value)}
                        className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">E-mail</label>
                      <input 
                        type="email"
                        placeholder="fernando@email.com"
                        value={emailResp}
                        onChange={(e) => setEmailResp(e.target.value)}
                        className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-500 font-medium hover:text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                >
                  Efetuar Matrícula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
