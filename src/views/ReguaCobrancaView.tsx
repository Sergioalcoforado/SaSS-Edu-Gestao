import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { CanalCobranca } from '../types';
import { Zap, Plus, Clock, Play, Smartphone } from 'lucide-react';

export const ReguaCobrancaView: React.FC = () => {
  const { regrasCobranca, salvarRegraCobranca, alternarStatusRegra, cobrancas, dispararReguaWhatsapp } = useApp();
  
  const [showModal, setShowModal] = useState(false);
  const [nome, setNome] = useState('');
  const [diasGatilho, setDiasGatilho] = useState(-3);
  const [canal, setCanal] = useState<CanalCobranca>('WHATSAPP');
  const [modeloMensagem, setModeloMensagem] = useState(
    'Olá {NOME_RESPONSAVEL}! Lembramos que a mensalidade de {ALUNO_NOME} ({REFERENCIA}) vence em {VENCIMENTO}. Pague rápido pelo PIX: {LINK_PIX}'
  );

  const handleCriarRegra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) return;
    salvarRegraCobranca({
      nome,
      diasGatilho,
      canal,
      modeloMensagem,
      ativa: true
    });
    setShowModal(false);
    setNome('');
  };

  // Extract all WhatsApp execution logs
  const todosEnvios = cobrancas.flatMap(c => 
    c.historicoEnvios.map(h => ({
      ...h,
      alunoNome: c.alunoNome,
      responsavelNome: c.responsavelNome,
      telefone: c.responsavelTelefone
    }))
  ).sort((a, b) => b.data.localeCompare(a.data));

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Automação Meta Cloud API & WhatsApp Gateway</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Régua de Cobrança Automatizada</h1>
          <p className="text-xs text-emerald-200/80 mt-1">
            Configure gatilhos automáticos para lembrete e cobrança de mensalidades via WhatsApp e E-mail.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Nova Automação</span>
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Rules List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            <span>Regras de Notificação Ativas</span>
          </h3>

          <div className="space-y-4">
            {regrasCobranca.map((regra) => (
              <div key={regra.id} className="glass-panel bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        regra.diasGatilho < 0 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : regra.diasGatilho === 0 
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {regra.diasGatilho < 0 
                          ? `${Math.abs(regra.diasGatilho)} dias Antes do Vencimento` 
                          : regra.diasGatilho === 0 
                          ? 'No Dia do Vencimento' 
                          : `${regra.diasGatilho} dias Após Vencimento`}
                      </span>

                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                        {regra.canal}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2">{regra.nome}</h4>
                  </div>

                  {/* Active Switch */}
                  <button
                    onClick={() => alternarStatusRegra(regra.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      regra.ativa ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      regra.ativa ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Template Message Box */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-mono leading-relaxed">
                    "{regra.modeloMensagem}"
                  </p>
                </div>

                {/* Action */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                  <span>Variavéis suportadas: <code>{'{NOME_RESPONSAVEL}'}</code>, <code>{'{ALUNO_NOME}'}</code>, <code>{'{LINK_PIX}'}</code></span>
                  
                  <button
                    onClick={() => {
                      if (cobrancas.length > 0) {
                        dispararReguaWhatsapp(cobrancas[0].id, regra.id);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-xl font-bold text-xs transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Testar Disparo Agora</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp Mobile Mockup Preview */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-600" />
            <span>Preview WhatsApp do Pai</span>
          </h3>

          <div className="glass-panel bg-slate-900 text-white rounded-3xl p-4 shadow-2xl border-4 border-slate-800 relative">
            {/* Phone Screen Top */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs">
                  E
                </div>
                <div>
                  <p className="text-xs font-bold">Colégio Dominus (Cobrança)</p>
                  <p className="text-[10px] text-emerald-400">Oficial WhatsApp Business ✅</p>
                </div>
              </div>
            </div>

            {/* Chat Bubble */}
            <div className="space-y-3 min-h-[220px]">
              <div className="p-3 bg-emerald-950/80 border border-emerald-800/60 rounded-2xl rounded-tl-none max-w-[90%] text-xs leading-relaxed space-y-2">
                <p className="text-emerald-100">
                  Olá <strong>Marcelo Oliveira</strong>! Passando para lembrar que a mensalidade de <strong>Lucas Oliveira</strong> (Mensalidade Setembro/2026) vence em 5 dias.
                </p>
                <div className="p-2 bg-slate-900/90 rounded-xl border border-emerald-700/50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400">Total a pagar</p>
                    <p className="text-sm font-extrabold text-emerald-400">R$ 780,00</p>
                  </div>
                  <span className="px-2 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold">
                    Pagar no PIX ⚡
                  </span>
                </div>
                <span className="block text-[9px] text-slate-400 text-right">14:32 ✔✔</span>
              </div>
            </div>
          </div>

          {/* Logs History */}
          <div className="glass-panel bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Últimos Envios do WhatsApp Engine</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {todosEnvios.length === 0 ? (
                <p className="text-xs text-slate-400">Nenhum envio registrado até agora.</p>
              ) : (
                todosEnvios.map(env => (
                  <div key={env.id} className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{env.responsavelNome}</p>
                      <p className="text-[10px] text-slate-400">{env.data} • {env.telefone}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                      {env.statusEnvio}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Modal Nova Regra */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg glass-panel bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Criar Nova Regra de Cobrança</h3>
            
            <form onSubmit={handleCriarRegra} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Nome da Automação</label>
                <input 
                  type="text"
                  required
                  placeholder="ex: Cobrança Crítica 15 Dias Atrasado"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Dias de Gatilho</label>
                  <input 
                    type="number"
                    value={diasGatilho}
                    onChange={(e) => setDiasGatilho(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                  <span className="text-[10px] text-slate-400">Use valores negativos para dias antes e positivos para após vencimento.</span>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Canal de Envio</label>
                  <select
                    value={canal}
                    onChange={(e) => setCanal(e.target.value as CanalCobranca)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                  >
                    <option value="WHATSAPP">WhatsApp (Meta Cloud API)</option>
                    <option value="EMAIL">E-mail</option>
                    <option value="AMBOS">Ambos (WhatsApp + E-mail)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Modelo de Mensagem</label>
                <textarea 
                  rows={4}
                  value={modeloMensagem}
                  onChange={(e) => setModeloMensagem(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-500 font-medium hover:text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  Salvar Regra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
