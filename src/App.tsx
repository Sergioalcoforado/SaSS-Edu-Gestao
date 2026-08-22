import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { PixPaymentModal } from './components/PixPaymentModal';
import { FinanceiroDashboard } from './views/FinanceiroDashboard';
import { ReguaCobrancaView } from './views/ReguaCobrancaView';
import { SecretariaView } from './views/SecretariaView';
import { AnosTurmasView } from './views/AnosTurmasView';
import { ProfessoresDisciplinasView } from './views/ProfessoresDisciplinasView';
import { DiarioClasseView } from './views/DiarioClasseView';
import { PortalPaisView } from './views/PortalPaisView';
import { SuperAdminView } from './views/SuperAdminView';
import { CheckCircle2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentUser, isDarkMode } = useApp();
  const [activeTab, setActiveTab] = useState<string>('financeiro');

  // Adjust active tab when role changes
  useEffect(() => {
    switch (currentUser.role) {
      case 'SUPER_ADMIN':
        setActiveTab('superadmin');
        break;
      case 'PROFESSOR':
        setActiveTab('diario');
        break;
      case 'RESPONSAVEL':
      case 'ALUNO':
        setActiveTab('portal_pais');
        break;
      case 'SECRETARIA':
        setActiveTab('secretaria');
        break;
      default:
        setActiveTab('financeiro');
    }
  }, [currentUser.role]);

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Top Bar */}
      <Navbar />

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        
        {/* Left Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Center Content View Container */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeTab === 'financeiro' && <FinanceiroDashboard />}
          {activeTab === 'regua' && <ReguaCobrancaView />}
          {activeTab === 'secretaria' && <SecretariaView />}
          {activeTab === 'anos_turmas' && <AnosTurmasView />}
          {activeTab === 'professores_disciplinas' && <ProfessoresDisciplinasView />}
          {activeTab === 'diario' && <DiarioClasseView />}
          {activeTab === 'portal_pais' && <PortalPaisView />}
          {activeTab === 'superadmin' && <SuperAdminView />}
        </main>

      </div>

      {/* Global Modals */}
      <PixPaymentModal />

      {/* Toast Notification Container */}
      <ToastContainer />

    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { notifications } = useApp();
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm w-full pointer-events-none">
      {notifications.map(n => (
        <div key={n.id} className="pointer-events-auto p-4 glass-panel bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 flex items-start gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h5 className="font-bold text-xs">{n.titulo}</h5>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{n.mensagem}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
