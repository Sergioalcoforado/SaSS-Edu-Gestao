import React from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, QrCode, Award, Bell, CheckCircle2 } from 'lucide-react';

export const PortalPaisView: React.FC = () => {
  const { alunos, cobrancas, notas, presencas, comunicados, setSelectedPixCobranca, currentUser } = useApp();

  // Find dependent student
  const aluno = alunos.find(a => a.id === currentUser.alunoDependenteId) || alunos[0];
  const minhasCobrancas = cobrancas.filter(c => c.alunoId === aluno.id);
  const minhasNotas = notas.filter(n => n.alunoId === aluno.id);
  const minhasPresencas = presencas.filter(p => p.alunoId === aluno.id);

  // Compute stats
  const totalPresencas = minhasPresencas.filter(p => p.status === 'PRESENTE').length;
  const taxaFrequencia = minhasPresencas.length > 0 
    ? ((totalPresencas / minhasPresencas.length) * 100).toFixed(0) 
    : '98';

  const mediaGeral = minhasNotas.length > 0 
    ? (minhasNotas.reduce((acc, n) => acc + n.nota, 0) / minhasNotas.length).toFixed(1)
    : '8.8';

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      {/* Student Profile Hero Header */}
      <div className="p-6 glass-panel bg-gradient-to-r from-rose-900 via-pink-900 to-slate-900 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img 
            src={aluno.foto} 
            alt={aluno.nome}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-rose-500/30 shadow-lg"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-[11px] font-bold mb-1">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Portal dos Pais & Alunos</span>
            </div>
            <h1 className="text-2xl font-black">{aluno.nome}</h1>
            <p className="text-xs text-rose-200/80 mt-0.5">
              {aluno.turmaNome} • Matrícula: <span className="font-mono">{aluno.matricula}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl text-center border border-white/10">
            <p className="text-[10px] text-rose-200 font-bold uppercase">Média Geral</p>
            <p className="text-2xl font-black text-amber-300">{mediaGeral}</p>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl text-center border border-white/10">
            <p className="text-[10px] text-rose-200 font-bold uppercase">Frequência</p>
            <p className="text-2xl font-black text-emerald-300">{taxaFrequencia}%</p>
          </div>
        </div>
      </div>

      {/* Grid: Financial Quick Pay + School Notices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Financial Section */}
        <div className="glass-panel bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-indigo-600" />
              <span>Mensalidades & 2ª Via PIX</span>
            </h3>
            <span className="text-xs text-slate-400">Segurança bancária</span>
          </div>

          <div className="space-y-3">
            {minhasCobrancas.map(cob => {
              const isPago = cob.status === 'PAGO';
              return (
                <div key={cob.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">{cob.referencia}</span>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                      R$ {cob.valor.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-[11px] text-slate-500">Vencimento: {cob.vencimento}</p>
                  </div>

                  {isPago ? (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold rounded-full text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Pago</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedPixCobranca(cob)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 animate-pulse-glow"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Pagar no PIX</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Announcements / Avisos */}
        <div className="glass-panel bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-rose-600" />
            <span>Comunicados da Escola</span>
          </h3>

          <div className="space-y-3">
            {comunicados.map(com => (
              <div key={com.id} className="p-4 bg-rose-50/50 dark:bg-rose-950/30 rounded-xl border border-rose-100 dark:border-rose-900/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                    {com.urgente ? '🚨 URGENTE' : 'AVISO OFICIAL'}
                  </span>
                  <span className="text-[10px] text-slate-400">{com.data}</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">{com.titulo}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">{com.conteudo}</p>
                <p className="text-[9px] text-slate-400 pt-1">Autor: {com.autorNome} ({com.autorCargo})</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Academic Bulletin (Boletim Escolar) */}
      <div className="glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Boletim Escolar Digital (2026)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-3">Disciplina</th>
                <th className="p-3 text-center">1º Bim</th>
                <th className="p-3 text-center">2º Bim</th>
                <th className="p-3 text-center">3º Bim</th>
                <th className="p-3 text-center">Média Parcial</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              {[
                { nome: 'Matemática e Raciocínio Lógico', b1: 8.5, b2: 9.0, b3: 8.0, media: 8.5 },
                { nome: 'Física Geral e Aplicada', b1: 9.0, b2: 8.8, b3: 9.2, media: 9.0 },
                { nome: 'Língua Portuguesa e Redação', b1: 8.0, b2: 8.5, b3: 8.8, media: 8.4 },
                { nome: 'História do Brasil e Geral', b1: 9.5, b2: 9.0, b3: 9.2, media: 9.2 }
              ].map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{m.nome}</td>
                  <td className="p-3 text-center font-mono">{m.b1}</td>
                  <td className="p-3 text-center font-mono">{m.b2}</td>
                  <td className="p-3 text-center font-mono">{m.b3}</td>
                  <td className="p-3 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">{m.media}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                      Aprovado
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
