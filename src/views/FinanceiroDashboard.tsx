import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  DollarSign, AlertTriangle, CheckCircle2, QrCode, 
  Send, Search, ArrowUpRight, ArrowDownRight, RefreshCw, Zap 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

export const FinanceiroDashboard: React.FC = () => {
  const { cobrancas, setSelectedPixCobranca, dispararReguaWhatsapp, regrasCobranca, simularPagamentoPix } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('TODOS');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Metrics calculation
  const totalPago = cobrancas.filter(c => c.status === 'PAGO').reduce((acc, c) => acc + c.valor, 0);
  const totalPendente = cobrancas.filter(c => c.status === 'PENDENTE').reduce((acc, c) => acc + c.valor, 0);
  const totalAtrasado = cobrancas.filter(c => c.status === 'ATRASADO').reduce((acc, c) => acc + c.valor, 0);
  const totalGeral = totalPago + totalPendente + totalAtrasado;
  
  const taxaInadimplencia = totalGeral > 0 ? ((totalAtrasado / totalGeral) * 100).toFixed(1) : '0.0';

  // Filtered List
  const cobrancasFiltradas = cobrancas.filter(c => {
    const matchesStatus = filterStatus === 'TODOS' || c.status === filterStatus;
    const matchesSearch = c.alunoNome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.responsavelNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.referencia.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Chart Data
  const dataArrecadacao = [
    { mes: 'Mai/26', Pago: 280000, Atrasado: 12000 },
    { mes: 'Jun/26', Pago: 290000, Atrasado: 15000 },
    { mes: 'Jul/26', Pago: 285000, Atrasado: 18000 },
    { mes: 'Ago/26', Pago: totalPago, Atrasado: totalAtrasado }
  ];

  const dataMetodos = [
    { name: 'PIX Dinâmico (Split)', value: 82, color: '#10b981' },
    { name: 'Boleto Bancário', value: 18, color: '#4f46e5' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Módulo Financeiro & Baixa Automática PIX</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Gestão Financeira & Cobrança Automatizada</h1>
          <p className="text-xs text-indigo-200/80 mt-1">
            Controle de mensalidades, conciliação em tempo real e régua de cobrança ativa.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 text-right">
            <p className="text-[10px] text-indigo-200 uppercase font-bold">MRR (Receita Recorrente)</p>
            <p className="text-xl font-extrabold text-white">R$ {(totalPago + totalPendente).toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Recebido */}
        <div className="p-5 glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Recebido (Mês)</span>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-semibold">
            <ArrowUpRight className="w-4 h-4" />
            <span>94.2% das cobranças conciliadas</span>
          </div>
        </div>

        {/* Em Aberto */}
        <div className="p-5 glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">A Vencer (Pendente)</span>
            <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-400 mt-2">Aguardando vencimento no mês</p>
        </div>

        {/* Inadimplência */}
        <div className="p-5 glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Inadimplência</span>
            <div className="p-2 bg-rose-100 dark:bg-rose-950/60 text-rose-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400">
            R$ {totalAtrasado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-600 font-semibold">
            <ArrowDownRight className="w-4 h-4" />
            <span>{taxaInadimplencia}% de taxa de atraso</span>
          </div>
        </div>

        {/* PIX Dinâmico Conversion */}
        <div className="p-5 glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Adopção do PIX</span>
            <div className="p-2 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 rounded-xl">
              <QrCode className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">82.5%</p>
          <p className="text-xs text-emerald-600 font-semibold mt-2">Redução de R$ 3,40 por boleto</p>
        </div>

      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Bar Chart */}
        <div className="lg:col-span-2 p-6 glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Histórico de Arrecadação x Inadimplência</h3>
              <p className="text-xs text-slate-500">Comparativo dos últimos 4 meses</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataArrecadacao}>
                <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `R$${v/1000}k`} />
                <Tooltip formatter={(value: any) => [`R$ ${Number(value || 0).toLocaleString('pt-BR')}`, '']} />
                <Legend />
                <Bar dataKey="Pago" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Atrasado" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Methods Pie Chart */}
        <div className="p-6 glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">Método de Pagamento</h3>
          <p className="text-xs text-slate-500 mb-4">Preferência dos responsáveis</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dataMetodos} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {dataMetodos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {dataMetodos.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{m.name}</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{m.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Ledger Table Section */}
      <div className="glass-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Table Filters Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Lançamentos & Cobranças de Mensalidades</h3>
            <p className="text-xs text-slate-500">Lista completa com geração de PIX e disparo WhatsApp</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar aluno ou responsável..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 w-56"
              />
            </div>

            {/* Status Pills */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700">
              {['TODOS', 'PAGO', 'PENDENTE', 'ATRASADO'].map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    filterStatus === st 
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-4">Aluno / Turma</th>
                <th className="p-4">Responsável Financial</th>
                <th className="p-4">Referência</th>
                <th className="p-4">Valor</th>
                <th className="p-4">Vencimento</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {cobrancasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Nenhuma cobrança encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                cobrancasFiltradas.map((cob) => {
                  const isPago = cob.status === 'PAGO';
                  const isAtrasado = cob.status === 'ATRASADO';
                  return (
                    <tr key={cob.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      
                      <td className="p-4">
                        <p className="font-bold text-slate-900 dark:text-white">{cob.alunoNome}</p>
                        <p className="text-[10px] text-slate-400">ID: {cob.alunoId}</p>
                      </td>

                      <td className="p-4">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{cob.responsavelNome}</p>
                        <p className="text-[10px] text-slate-400">{cob.responsavelTelefone}</p>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium text-[11px]">
                          {cob.referencia}
                        </span>
                      </td>

                      <td className="p-4 font-bold text-slate-900 dark:text-white">
                        R$ {cob.valor.toFixed(2).replace('.', ',')}
                      </td>

                      <td className="p-4">
                        <span className={isAtrasado ? 'text-rose-600 font-bold' : ''}>
                          {cob.vencimento}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          isPago ? 'badge-pago' : isAtrasado ? 'badge-atrasado' : 'badge-pendente'
                        }`}>
                          {cob.status}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          
                          {/* QR Code / Boleto Button */}
                          <button
                            onClick={() => setSelectedPixCobranca(cob)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/80 dark:text-indigo-300 rounded-xl font-bold text-[11px] transition-colors"
                            title="Ver QR Code PIX e Boleto"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>PIX / Boleto</span>
                          </button>

                          {/* WhatsApp Billing Engine Trigger */}
                          {!isPago && (
                            <button
                              onClick={() => {
                                const regra = regrasCobranca[isAtrasado ? 2 : 1] || regrasCobranca[0];
                                dispararReguaWhatsapp(cob.id, regra.id);
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 dark:text-emerald-300 rounded-xl font-bold text-[11px] transition-colors"
                              title="Disparar Cobrança por WhatsApp"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </button>
                          )}

                          {/* Simular Baixa instantânea */}
                          {!isPago && (
                            <button
                              onClick={() => simularPagamentoPix(cob.id)}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors"
                              title="Simular baixa automática imediata"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                          )}

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

    </div>
  );
};
