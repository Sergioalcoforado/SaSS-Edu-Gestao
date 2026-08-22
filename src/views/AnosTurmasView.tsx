import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { AnoLetivo, Turma } from '../types';
import { 
  Calendar, BookOpenCheck, Plus, Edit3, Search, X 
} from 'lucide-react';

export const AnosTurmasView: React.FC = () => {
  const { 
    anosLetivos, turmas, currentTenant, 
    adicionarAnoLetivo, atualizarAnoLetivo, 
    adicionarTurma, atualizarTurma, alunos 
  } = useApp();

  const [selectedAnoFilter, setSelectedAnoFilter] = useState<string>('2026');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal States
  const [showAnoModal, setShowAnoModal] = useState(false);
  const [editingAno, setEditingAno] = useState<AnoLetivo | null>(null);

  const [showTurmaModal, setShowTurmaModal] = useState(false);
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null);

  // Ano Letivo Form State
  const [anoValor, setAnoValor] = useState('2027');
  const [anoStatus, setAnoStatus] = useState<'ATIVO' | 'PLANEJAMENTO' | 'ENCERRADO'>('PLANEJAMENTO');
  const [dataInicio, setDataInicio] = useState('2027-01-25');
  const [dataFim, setDataFim] = useState('2027-12-17');

  // Turma Form State
  const [nomeTurma, setNomeTurma] = useState('');
  const [turmaAnoLetivo, setTurmaAnoLetivo] = useState('2026');
  const [turno, setTurno] = useState<'MANHA' | 'TARDE' | 'INTEGRAL' | 'NOITE'>('MANHA');
  const [nivel, setNivel] = useState<'INFANTIL' | 'FUNDAMENTAL_1' | 'FUNDAMENTAL_2' | 'MEDIO'>('FUNDAMENTAL_2');
  const [capacidade, setCapacidade] = useState(35);

  // Filtered and sorted Anos Letivos (only ATIVO and PLANEJAMENTO, sorted alphabetically)
  const anosLetivosExibidos = anosLetivos
    .filter(a => a.status === 'ATIVO' || a.status === 'PLANEJAMENTO')
    .sort((a, b) => a.ano.localeCompare(b.ano, 'pt-BR', { numeric: true }));

  // Filtered and sorted turmas (sorted alphabetically)
  const turmasDoAno = turmas
    .filter(t => {
      const matchesAno = selectedAnoFilter === 'TODOS' || t.anoLetivo === selectedAnoFilter;
      const matchesSearch = t.nome.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesAno && matchesSearch;
    })
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { numeric: true }));

  const abrirModalNovoAno = () => {
    setEditingAno(null);
    setAnoValor('2027');
    setAnoStatus('PLANEJAMENTO');
    setDataInicio('2027-01-25');
    setDataFim('2027-12-17');
    setShowAnoModal(true);
  };

  const abrirModalEditarAno = (anoObj: AnoLetivo) => {
    setEditingAno(anoObj);
    setAnoValor(anoObj.ano);
    setAnoStatus(anoObj.status);
    setDataInicio(anoObj.dataInicio);
    setDataFim(anoObj.dataFim);
    setShowAnoModal(true);
  };

  const handleSalvarAno = (e: React.FormEvent) => {
    e.preventDefault();
    if (!anoValor) return;

    if (editingAno) {
      atualizarAnoLetivo(editingAno.id, {
        ano: anoValor,
        status: anoStatus,
        dataInicio,
        dataFim
      });
    } else {
      adicionarAnoLetivo({
        ano: anoValor,
        status: anoStatus,
        dataInicio,
        dataFim
      });
    }
    setShowAnoModal(false);
  };

  const abrirModalNovaTurma = () => {
    setEditingTurma(null);
    setNomeTurma('');
    setTurmaAnoLetivo(selectedAnoFilter === 'TODOS' ? '2026' : selectedAnoFilter);
    setTurno('MANHA');
    setNivel('FUNDAMENTAL_2');
    setCapacidade(35);
    setShowTurmaModal(true);
  };

  const abrirModalEditarTurma = (turmaObj: Turma) => {
    setEditingTurma(turmaObj);
    setNomeTurma(turmaObj.nome);
    setTurmaAnoLetivo(turmaObj.anoLetivo);
    setTurno(turmaObj.turno);
    setNivel(turmaObj.nivel);
    setCapacidade(turmaObj.capacidade);
    setShowTurmaModal(true);
  };

  const handleSalvarTurma = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeTurma) return;

    if (editingTurma) {
      atualizarTurma(editingTurma.id, {
        nome: nomeTurma,
        anoLetivo: turmaAnoLetivo,
        turno,
        nivel,
        capacidade
      });
    } else {
      adicionarTurma({
        nome: nomeTurma,
        anoLetivo: turmaAnoLetivo,
        turno,
        nivel,
        capacidade,
        professorTitularId: '',
        professorTitularNome: ''
      });
    }
    setShowTurmaModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5 text-blue-300" />
            <span>Módulo de Secretaria & Estrutura Acadêmica</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Anos Letivos & Gestão de Turmas</h1>
          <p className="text-xs text-blue-200/80 mt-1">
            Cadastro de anos acadêmicos e criação de turmas por período no {currentTenant.nome}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={abrirModalNovoAno}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Ano Letivo</span>
          </button>

          <button
            onClick={abrirModalNovaTurma}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Nova Turma</span>
          </button>
        </div>
      </div>

      {/* Section 1: Anos Letivos Cards (Somente Ativos e em Planejamento, Ordem Alfabética) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <span>Anos Letivos Cadastrados (Ativos e Planejamento)</span>
          </h3>
          <span className="text-xs text-slate-400">Total: {anosLetivosExibidos.length} períodos exibidos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {anosLetivosExibidos.map((anoObj) => {
            const isAtivo = anoObj.status === 'ATIVO';
            const isPlanejamento = anoObj.status === 'PLANEJAMENTO';

            return (
              <div 
                key={anoObj.id}
                className={`p-5 glass-panel bg-white dark:bg-slate-900 rounded-2xl border transition-all ${
                  selectedAnoFilter === anoObj.ano 
                    ? 'ring-2 ring-indigo-500 border-indigo-300 dark:border-indigo-700 shadow-md' 
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Ano Acadêmico</span>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{anoObj.ano}</h4>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    isAtivo 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                      : isPlanejamento 
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' 
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {anoObj.status}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1 text-slate-500 dark:text-slate-400">
                  <p>Período: <strong>{anoObj.dataInicio}</strong> até <strong>{anoObj.dataFim}</strong></p>
                  <p>Turmas Ativas: <strong>{turmas.filter(t => t.anoLetivo === anoObj.ano).length} turmas</strong></p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setSelectedAnoFilter(anoObj.ano)}
                    className={`text-xs font-bold ${
                      selectedAnoFilter === anoObj.ano ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {selectedAnoFilter === anoObj.ano ? '✓ Filtrando Turmas' : 'Filtrar Turmas'}
                  </button>

                  <button
                    onClick={() => abrirModalEditarAno(anoObj)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                    title="Editar Ano Letivo"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Turmas Management Table & Cards (Ordem Alfabética) */}
      <div className="glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header Controls */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Turmas do Ano Letivo {selectedAnoFilter}</h3>
            <p className="text-xs text-slate-500">Gestão de enturmação e capacidade máxima de alunos (Ordenação Alfabética).</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text"
                placeholder="Buscar por nome da turma..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 w-56"
              />
            </div>

            {/* Ano Filter Select */}
            <select
              value={selectedAnoFilter}
              onChange={(e) => setSelectedAnoFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
            >
              <option value="TODOS">Todos os Anos</option>
              {anosLetivosExibidos.map(a => (
                <option key={a.id} value={a.ano}>Ano Letivo {a.ano}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Turmas Grid Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {turmasDoAno.length === 0 ? (
            <div className="col-span-full text-center py-10 text-slate-400">
              Nenhuma turma cadastrada para o filtro selecionado. Clique em "+ Criar Nova Turma" para adicionar.
            </div>
          ) : (
            turmasDoAno.map((turma) => {
              const alunosNaTurma = alunos.filter(a => a.turmaId === turma.id).length;
              const pctOcupacao = Math.round((alunosNaTurma / turma.capacidade) * 100);

              return (
                <div key={turma.id} className="p-4 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-extrabold text-[10px] uppercase">
                        {turma.turno} • {turma.nivel}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">{turma.nome}</h4>
                      <p className="text-[11px] text-slate-400">Ano Letivo: {turma.anoLetivo}</p>
                    </div>

                    <button
                      onClick={() => abrirModalEditarTurma(turma)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                      title="Editar dados da turma"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Ocupação Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">Alunos Matriculados</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{alunosNaTurma} / {turma.capacidade} vagas</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${pctOcupacao >= 100 ? 'bg-rose-500' : 'bg-indigo-600'}`} 
                        style={{ width: `${Math.min(pctOcupacao, 100)}%` }}
                      />
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Modal Ano Letivo */}
      {showAnoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md glass-panel bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span>{editingAno ? 'Editar Ano Letivo' : 'Criar Novo Ano Letivo'}</span>
              </h3>
              <button onClick={() => setShowAnoModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvarAno} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Ano Acadêmico</label>
                <input 
                  type="text"
                  required
                  placeholder="ex: 2027"
                  value={anoValor}
                  onChange={(e) => setAnoValor(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Status do Período</label>
                <select
                  value={anoStatus}
                  onChange={(e) => setAnoStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
                >
                  <option value="ATIVO">🟢 ATIVO (Ano Corrente)</option>
                  <option value="PLANEJAMENTO">🟡 PLANEJAMENTO (Próximo Ano)</option>
                  <option value="ENCERRADO">⚪ ENCERRADO (Ano Passado)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Data Início das Aulas</label>
                  <input 
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Data Fim do Ano</label>
                  <input 
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAnoModal(false)}
                  className="px-4 py-2 text-slate-500 font-medium hover:text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                >
                  Salvar Ano Letivo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Turma */}
      {showTurmaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg glass-panel bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpenCheck className="w-5 h-5 text-blue-600" />
                <span>{editingTurma ? 'Editar Turma' : 'Criar Nova Turma'}</span>
              </h3>
              <button onClick={() => setShowTurmaModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvarTurma} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Nome da Turma</label>
                <input 
                  type="text"
                  required
                  placeholder="ex: 9º Ano B - Ensino Fundamental II"
                  value={nomeTurma}
                  onChange={(e) => setNomeTurma(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Ano Letivo Pertencente</label>
                  <select
                    value={turmaAnoLetivo}
                    onChange={(e) => setTurmaAnoLetivo(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
                  >
                    {anosLetivosExibidos.map(a => (
                      <option key={a.id} value={a.ano}>Ano Letivo {a.ano}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Turno de Aulas</label>
                  <select
                    value={turno}
                    onChange={(e) => setTurno(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                  >
                    <option value="MANHA">Manhã</option>
                    <option value="TARDE">Tarde</option>
                    <option value="INTEGRAL">Integral</option>
                    <option value="NOITE">Noite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Nível de Ensino</label>
                  <select
                    value={nivel}
                    onChange={(e) => setNivel(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                  >
                    <option value="INFANTIL">Educação Infantil</option>
                    <option value="FUNDAMENTAL_1">Fundamental I (1º-5º)</option>
                    <option value="FUNDAMENTAL_2">Fundamental II (6º-9º)</option>
                    <option value="MEDIO">Ensino Médio</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Capacidade de Alunos</label>
                  <input 
                    type="number"
                    value={capacidade}
                    onChange={(e) => setCapacidade(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowTurmaModal(false)}
                  className="px-4 py-2 text-slate-500 font-medium hover:text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                >
                  Salvar Turma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
