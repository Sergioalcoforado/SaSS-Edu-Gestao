import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, QrCode, Copy, CheckCircle2, Calendar, ShieldCheck, Zap, Download } from 'lucide-react';

export const PixPaymentModal: React.FC = () => {
  const { selectedPixCobranca, setSelectedPixCobranca, simularPagamentoPix } = useApp();
  const [copiadoPix, setCopiadoPix] = useState(false);
  const [copiadoBoleto, setCopiadoBoleto] = useState(false);
  const [processando, setProcessando] = useState(false);

  if (!selectedPixCobranca) return null;

  const cobranca = selectedPixCobranca;
  const isPago = cobranca.status === 'PAGO';

  const handleCopyPix = () => {
    navigator.clipboard.writeText(cobranca.codigoPix);
    setCopiadoPix(true);
    setTimeout(() => setCopiadoPix(false), 2500);
  };

  const handleCopyBoleto = () => {
    navigator.clipboard.writeText(cobranca.linhaDigitavelBoleto);
    setCopiadoBoleto(true);
    setTimeout(() => setCopiadoBoleto(false), 2500);
  };

  const handleSimularPagamento = () => {
    setProcessando(true);
    setTimeout(() => {
      simularPagamentoPix(cobranca.id);
      setProcessando(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden glass-panel bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Pagamento via PIX & Boleto</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{cobranca.referencia}</p>
            </div>
          </div>
          <button 
            onClick={() => setSelectedPixCobranca(null)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Status Banner */}
          {isPago ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-sm">Cobrança Paga com Sucesso!</p>
                <p className="text-xs opacity-90">Pago em {cobranca.dataPagamento || 'Hoje'} via PIX Dinâmico.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Valor a Pagar</span>
                <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  R$ {cobranca.valor.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Vencimento</span>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-end gap-1.5 mt-0.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {cobranca.vencimento}
                </p>
              </div>
            </div>
          )}

          {/* QR Code Container */}
          {!isPago && (
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-100 mb-3">
                <img 
                  src={cobranca.qrCodePix} 
                  alt="QR Code PIX" 
                  className="w-48 h-48 object-contain"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>QR Code Válido com Split e Conciliação Instantânea</span>
              </div>
            </div>
          )}

          {/* Copia e Cola PIX */}
          {!isPago && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Código PIX Copia e Cola</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={cobranca.codigoPix}
                  className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-mono truncate"
                />
                <button
                  onClick={handleCopyPix}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-xs transition-colors shrink-0 shadow-sm"
                >
                  {copiadoPix ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiadoPix ? 'Copiado!' : 'Copiar PIX'}
                </button>
              </div>
            </div>
          )}

          {/* Linha Digitável Boleto */}
          {!isPago && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Linha Digitável do Boleto</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={cobranca.linhaDigitavelBoleto}
                  className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-mono truncate"
                />
                <button
                  onClick={handleCopyBoleto}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-medium text-xs transition-colors shrink-0"
                >
                  {copiadoBoleto ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  {copiadoBoleto ? 'Copiado!' : 'Boleto PDF'}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50/80 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => setSelectedPixCobranca(null)}
            className="px-4 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            Fechar
          </button>

          {!isPago && (
            <button
              onClick={handleSimularPagamento}
              disabled={processando}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md hover:shadow-emerald-500/20 disabled:opacity-50 animate-pulse-glow"
            >
              <Zap className="w-4 h-4 fill-white" />
              {processando ? 'Processando Webhook...' : 'Simular Pagamento Instantâneo (PIX Gateway)'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
