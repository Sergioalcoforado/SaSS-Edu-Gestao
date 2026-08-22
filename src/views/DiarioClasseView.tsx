import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpenCheck, CheckCircle2, XCircle, AlertCircle, Save, Calendar, Award, Calculator } from 'lucide-react';

export const DiarioClasseView: React.FC = () => {
  const { turmas, disciplinas, alunos, presencas, salvarPresencaLote, salvarNotasLote } = useApp();

  const [selectedTurmaId, setSelectedTurmaId] = useState(turmas[0]?.id || '');
  const [selectedDisciplinaId, setSelectedDisciplinaId] = useState(disciplinas[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'PRESENCA' | 'NOTAS'>('NOTAS');

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

  // Partial Evaluation Grades States (Av1, Av2, Atividades/Trabalhos)
  const [av1State, setAv1State] = useState<Record<string, number>>(() => ({
    'aluno-1': 8.5,
    'aluno-2': 6.5,
    'aluno-3': 9.5,
    'aluno-4': 7.0
  }));

  const [av2State, setAv2State] = useState<Record<string, number>>(() => ({
    'aluno-1': 8.0,
    'aluno-2': 7.0,
    'aluno-3': 10.0,
    'aluno-4': 8.0
  }));

  const [ativState, setAtivState] = useState<Record<string, number>>(() => ({
    'aluno-1': 9.0,
    'aluno-2': 7.5,
    'aluno-3': 10.0,
    'aluno-4': 9.0
  }));

  // Helper to compute Bimestre Average dynamically
  const calcularMedia = (alunoId: string) => {
    const n1 = av1State[alunoId] ?? 8.0;
    const n2 = av2State[alunoId] ?? 8.0;
    const n3 = ativState[alunoId] ?? 8.0;
    const media = (n1 + n2 + n3) / 3;
    return Number(media.toFixed(1));
  };

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
      nota: calcularMedia(a.id),
      faltasTotais: 0
    }));
    salvarNotasLote(selectedTurmaId, selectedDisciplinaId, bimestre, payload);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel bg-gradient-to-r from-amber-950 via-orange-950 to-slate-900 text-white rounded-2xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-semibold mb-2">
            <BookOpenCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Módulo Diário de Classe Digital</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Lançamento de Frequência & Avaliações</h1>
          <p className="text-xs text-amber-200/80 mt-1">
            Lançamento de notas de Avaliações 1 e 2 e Atividades com cálculo automático da média bimestral.
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex gap-3">
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
          <table className="w-full text-left text-xs table-fixed">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                {/* 1ª Coluna: Aluno */}
                <th className="p-4 w-1/4">Aluno</th>

                {/* 2ª Coluna: Matrícula (Centralizada) */}
                <th className="p-4 text-center w-36">Matrícula</th>

                {activeTab === 'PRESENCA' ? (
                  <th className="p-4 text-center">Status Frequência ({dataChamada})</th>
                ) : (
                  <>
                    {/* 3ª Coluna: Avaliação 1 (Centralizada, sem o texto "(Prova 1)") */}
                    <th className="p-4 text-center w-36 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 border-x border-amber-100 dark:border-amber-900/40">
                      Avaliação 1
                    </th>

                    {/* 4ª Coluna: Avaliação 2 (Centralizada, sem o texto "(Prova 2)") */}
                    <th className="p-4 text-center w-36 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 border-r border-amber-100 dark:border-amber-900/40">
                      Avaliação 2
                    </th>

                    {/* 5ª Coluna: Atividades & Trabalhos (Centralizada) */}
                    <th className="p-4 text-center w-44 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 border-r border-amber-100 dark:border-amber-900/40">
                      Atividades & Trabalhos
                    </th>

                    {/* 6ª Coluna: Média Bimestral */}
                    <th className="p-4 text-center w-44 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-black">
                      <div className="flex items-center justify-center gap-1.5">
                        <Calculator className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>Média {bimestre}º Bimestre</span>
                      </div>
                    </th>

                    {/* 7ª Coluna: Conceito Final */}
                    <th className="p-4 text-center w-36">Conceito Final</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {alunosDaTurma.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Nenhum aluno matriculado nesta turma.
                  </td>
                </tr>
              ) : (
                alunosDaTurma.map((aluno) => {
                  const currentPresenca = presencaState[aluno.id] || 'PRESENTE';

                  const n1 = av1State[aluno.id] !== undefined ? av1State[aluno.id] : 8.0;
                  const n2 = av2State[aluno.id] !== undefined ? av2State[aluno.id] : 8.0;
                  const n3 = ativState[aluno.id] !== undefined ? ativState[aluno.id] : 8.0;
                  const mediaCalculada = calcularMedia(aluno.id);

                  return (
                    <tr key={aluno.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      
                      {/* 1ª Coluna: Aluno Name & Photo */}
                      <td className="p-4 flex items-center gap-3 truncate">
                        <img 
                          src={aluno.foto} 
                          alt={aluno.nome}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-500/20 shrink-0" 
                        />
                        <span className="font-bold text-slate-900 dark:text-white truncate">{aluno.nome}</span>
                      </td>

                      {/* 2ª Coluna: Matricula (Centralizada) */}
                      <td className="p-4 text-center font-mono font-semibold text-slate-500">
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
                          {/* 3ª Coluna: Avaliação 1 (Centralizada) */}
                          <td className="p-4 text-center bg-amber-50/20 dark:bg-amber-950/10 border-x border-amber-100/60 dark:border-amber-900/30">
                            <input 
                              type="number" 
                              step="0.1"
                              min="0"
                              max="10"
                              value={n1}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setAv1State(prev => ({ ...prev, [aluno.id]: isNaN(val) ? 0 : val }));
                              }}
                              className="w-20 mx-auto px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-center focus:ring-2 focus:ring-amber-500"
                            />
                          </td>

                          {/* 4ª Coluna: Avaliação 2 (Centralizada) */}
                          <td className="p-4 text-center bg-amber-50/20 dark:bg-amber-950/10 border-r border-amber-100/60 dark:border-amber-900/30">
                            <input 
                              type="number" 
                              step="0.1"
                              min="0"
                              max="10"
                              value={n2}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setAv2State(prev => ({ ...prev, [aluno.id]: isNaN(val) ? 0 : val }));
                              }}
                              className="w-20 mx-auto px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white text-center focus:ring-2 focus:ring-amber-500"
                            />
                          </td>

                          {/* 5ª Coluna: Atividades & Trabalhos (Centralizada) */}
                          <td className="p-4 text-center bg-amber-50/20 dark:bg-amber-950/10 border-r border-amber-100/60 dark:border-amber-900/30">
                            <input 
                              type="number" 
                              step="0.1"
                              min="0"
                              max="10"
                              value={n3}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setAtivState(prev => ({ ...prev, [aluno.id]: isNaN(val) ? 0 : val }));
                              }}
                              className="w-20 mx-auto px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-center focus:ring-2 focus:ring-amber-500"
                            />
                          </td>

                          {/* 6ª Coluna: Média Bimestral (Centralizada) */}
                          <td className="p-4 text-center bg-indigo-50/40 dark:bg-indigo-950/30 font-black text-indigo-900 dark:text-indigo-200 text-sm">
                            <span className="inline-block px-3 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 font-black">
                              {mediaCalculada.toFixed(1)}
                            </span>
                          </td>

                          {/* 7ª Coluna: Conceito Final */}
                          <td className="p-4 text-center font-bold">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-extrabold ${
                              mediaCalculada >= 7.0 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : mediaCalculada >= 5.0
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}>
                              {mediaCalculada >= 7.0 ? '🟢 Aprovado' : mediaCalculada >= 5.0 ? '🟡 Recuperação' : '🔴 Insuficiente'}
                            </span>
                          </td>
                        </>
                      )}

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
