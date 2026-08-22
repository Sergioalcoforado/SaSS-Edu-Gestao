import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpenCheck, CheckCircle2, XCircle, AlertCircle, Save, Calendar, Award } from 'lucide-react';

export const DiarioClasseView: React.FC = () => {
  const { turmas, disciplinas, alunos, presencas, notas, salvarPresencaLote, salvarNotasLote } = useApp();

  const [selectedTurmaId, setSelectedTurmaId] = useState(turmas[0]?.id || '');
  const [selectedDisciplinaId, setSelectedDisciplinaId] = useState(disciplinas[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'PRESENCA' | 'NOTAS'>('PRESENCA');

  // Dates & Bimestres
  const [dataChamada, setDataChamada] = useState(new Date().toISOString().split('T')[0]);
  const [bimestre, setBimestre] = useState<1 | 2 | 3 | 4>(1);

  // Filtered Students
  const alunosDaTurma = alunos.filter(a => a.turmaId === selectedTurmaId);

  // Local Attendance State for batch editing
  const [presencaState, setPresencaState] = useState<Record<string, 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO'>>(() => {
    const initial: Record<string, 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO'> = {};
    alunosDaTurma.forEach(a => {
      const ex = presencas.find(p => p.turmaId === selectedTurmaId && p.alunoId === a.id && p.data === dataChamada);
      initial[a.id] = ex ? ex.status : 'PRESENTE';
    });
    return initial;
  });

  // Local Grades State for batch editing
  const [notaState, setNotaState] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    alunosDaTurma.forEach(a => {
      const ex = notas.find(n => n.turmaId === selectedTurmaId && n.alunoId === a.id && n.bimestre === bimestre);
      initial[a.id] = ex ? ex.nota : 8.0;
    });
    return initial;
  });

  const handleTogglePresenca = (alunoId: string, status: 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO') => {
    setPresencaState(prev => ({ ...prev, [alunoId]: status }));
  };

  const handleSalvarFrequencia = () => {
    const payload = alunosDaTurma.map(a => ({
      alunoId: a.id,
      status: presencaState[a.id] || 'PRESENTE'
    }));
    salvarPresencaLote(selectedTurmaId, selectedDisciplinaId, dataChamada, payload);
  };

  const handleSalvarNotas = () => {
    const payload = alunosDaTurma.map(a => ({
      alunoId: a.id,
      nota: Number(notaState[a.id] || 0),
      faltasTotais: 0
    }));
    salvarNotasLote(selectedTurmaId, selectedDisciplinaId, bimestre, payload);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel bg-gradient-to-r from-amber-900 via-orange-900 to-slate-900 text-white rounded-2xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-semibold mb-2">
            <BookOpenCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Módulo Diário de Classe Digital</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Lançamento de Frequência & Notas</h1>
          <p className="text-xs text-amber-200/80 mt-1">
            Interface rápida para professores registrarem presença diária e boletim escolar.
          </p>
        </div>

        {/* Selection Pickers */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedTurmaId}
            onChange={(e) => setSelectedTurmaId(e.target.value)}
            className="px-3 py-2 text-xs bg-white/10 border border-white/20 rounded-xl text-white font-bold"
          >
            {turmas.map(t => (
              <option key={t.id} value={t.id} className="text-slate-900">{t.nome}</option>
            ))}
          </select>

          <select
            value={selectedDisciplinaId}
            onChange={(e) => setSelectedDisciplinaId(e.target.value)}
            className="px-3 py-2 text-xs bg-white/10 border border-white/20 rounded-xl text-white font-bold"
          >
            {disciplinas.map(d => (
              <option key={d.id} value={d.id} className="text-slate-900">{d.nome}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('PRESENCA')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'PRESENCA'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Frequência Diária</span>
          </button>

          <button
            onClick={() => setActiveTab('NOTAS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'NOTAS'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Lançamento de Notas / Avaliações</span>
          </button>
        </div>

        {activeTab === 'PRESENCA' ? (
          <div className="flex items-center gap-3">
            <input 
              type="date" 
              value={dataChamada}
              onChange={(e) => setDataChamada(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-medium"
            />
            <button
              onClick={handleSalvarFrequencia}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Frequência em Lote</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {[1, 2, 3, 4].map(b => (
                <button
                  key={b}
                  onClick={() => setBimestre(b as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    bimestre === b ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {b}º Bimestre
                </button>
              ))}
            </div>
            <button
              onClick={handleSalvarNotas}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Notas ({bimestre}º Bimestre)</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-4">Aluno</th>
                <th className="p-4">Matrícula</th>
                {activeTab === 'PRESENCA' ? (
                  <th className="p-4 text-center">Status Frequência ({dataChamada})</th>
                ) : (
                  <>
                    <th className="p-4">Nota ({bimestre}º Bimestre)</th>
                    <th className="p-4">Conceito</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {alunosDaTurma.map((aluno) => {
                const currentPresenca = presencaState[aluno.id] || 'PRESENTE';
                const currentNota = notaState[aluno.id] !== undefined ? notaState[aluno.id] : 8.0;

                return (
                  <tr key={aluno.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    
                    <td className="p-4 flex items-center gap-3">
                      <img 
                        src={aluno.foto} 
                        alt={aluno.nome}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-500/20" 
                      />
                      <span className="font-bold text-slate-900 dark:text-white">{aluno.nome}</span>
                    </td>

                    <td className="p-4 font-mono font-semibold text-slate-500">
                      {aluno.matricula}
                    </td>

                    {activeTab === 'PRESENCA' ? (
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          
                          <button
                            onClick={() => handleTogglePresenca(aluno.id, 'PRESENTE')}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                              currentPresenca === 'PRESENTE'
                                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/40'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Presente</span>
                          </button>

                          <button
                            onClick={() => handleTogglePresenca(aluno.id, 'AUSENTE')}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                              currentPresenca === 'AUSENTE'
                                ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-500/40'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Ausente</span>
                          </button>

                          <button
                            onClick={() => handleTogglePresenca(aluno.id, 'JUSTIFICADO')}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                              currentPresenca === 'JUSTIFICADO'
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`}
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Justificado</span>
                          </button>

                        </div>
                      </td>
                    ) : (
                      <>
                        <td className="p-4">
                          <input 
                            type="number" 
                            step="0.1"
                            min="0"
                            max="10"
                            value={currentNota}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setNotaState(prev => ({ ...prev, [aluno.id]: val }));
                            }}
                            className="w-24 px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                          />
                        </td>

                        <td className="p-4 font-bold">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] ${
                            currentNota >= 7.0 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : currentNota >= 5.0
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {currentNota >= 7.0 ? 'Aprovado' : currentNota >= 5.0 ? 'Recuperação' : 'Insuficiente'}
                          </span>
                        </td>
                      </>
                    )}

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
