import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  DollarSign, Users, GraduationCap, 
  BookOpenCheck, Zap, ShieldAlert, Globe, Plus, Building2, ChevronRight, Calendar, UserCheck 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, tenantsList, currentTenant, setCurrentTenant, setShowModalCadastroEscola } = useApp();
  const role = currentUser.role;

  // Filter available sidebar tabs based on RBAC role
  const getNavItems = () => {
    switch (role) {
      case 'SUPER_ADMIN':
        return [
          { id: 'superadmin', label: 'Painel SaaS Global', icon: Globe, badge: 'SaaS' },
          { id: 'financeiro', label: 'Financeiro Geral', icon: DollarSign },
        ];

      case 'DIRETORIA':
        return [
          { id: 'financeiro', label: 'Dashboard Financeiro', icon: DollarSign, badge: 'PIX' },
          { id: 'regua', label: 'Régua de Cobrança WhatsApp', icon: Zap, badge: 'Auto' },
          { id: 'secretaria', label: 'Alunos & Matrículas', icon: Users },
          { id: 'anos_turmas', label: 'Anos Letivos & Turmas', icon: Calendar, badge: 'Secretaria' },
          { id: 'professores_disciplinas', label: 'Professores & Disciplinas', icon: UserCheck, badge: 'Docentes' },
          { id: 'diario', label: 'Diário de Classe', icon: BookOpenCheck },
          { id: 'portal_pais', label: 'Visão Portal dos Pais', icon: GraduationCap },
        ];

      case 'SECRETARIA':
        return [
          { id: 'secretaria', label: 'Alunos & Matrículas', icon: Users, badge: 'Alunos' },
          { id: 'anos_turmas', label: 'Anos Letivos & Turmas', icon: Calendar, badge: 'Ano 2026' },
          { id: 'professores_disciplinas', label: 'Professores & Disciplinas', icon: UserCheck, badge: 'Docentes' },
          { id: 'diario', label: 'Consultar Turmas', icon: BookOpenCheck },
        ];

      case 'FINANCEIRO':
        return [
          { id: 'financeiro', label: 'Gestão Financeira & PIX', icon: DollarSign, badge: 'MRR' },
          { id: 'regua', label: 'Régua de Cobrança WhatsApp', icon: Zap, badge: 'API' },
        ];

      case 'PROFESSOR':
        return [
          { id: 'diario', label: 'Diário de Classe (Lançamento)', icon: BookOpenCheck, badge: 'Prof' },
          { id: 'secretaria', label: 'Minhas Turmas & Alunos', icon: Users },
        ];

      case 'RESPONSAVEL':
      case 'ALUNO':
        return [
          { id: 'portal_pais', label: 'Portal do Aluno & Pais', icon: GraduationCap, badge: 'Boletim' },
        ];

      default:
        return [
          { id: 'financeiro', label: 'Dashboard Financeiro', icon: DollarSign },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 glass-panel border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-65px)]">
      <div className="space-y-5">

        {/* Primary SuperAdmin Action Button */}
        {role === 'SUPER_ADMIN' && (
          <div className="space-y-2">
            <button
              onClick={() => {
                setActiveTab('superadmin');
                setShowModalCadastroEscola(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/20 transition-all animate-pulse-glow"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Nova Escola</span>
            </button>
          </div>
        )}
        
        {/* Navigation Category */}
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Módulos Habilitados ({role})
          </p>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase ${
                      isActive ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dedicated "Acessar Tenant" Quick Section for SuperAdmin */}
        {role === 'SUPER_ADMIN' && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between px-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                Acessar Tenant (Escola)
              </span>
              <span className="text-[9px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded font-bold">
                {tenantsList.length}
              </span>
            </div>

            <div className="space-y-1 max-h-48 overflow-y-auto">
              {tenantsList.map((tenant) => {
                const isCurrent = tenant.id === currentTenant.id;
                const isAtivo = tenant.status === 'ATIVO';

                return (
                  <button
                    key={tenant.id}
                    onClick={() => {
                      setCurrentTenant(tenant);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all border ${
                      isCurrent 
                        ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 font-bold text-purple-900 dark:text-purple-200' 
                        : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${isAtivo ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span className="truncate max-w-[120px]">{tenant.nome}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] opacity-70 uppercase font-mono">{tenant.plano}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Security & Multi-tenant Isolation Notice */}
        <div className="p-3.5 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/60 text-xs">
          <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 font-bold mb-1">
            <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Multi-Tenant RLS</span>
          </div>
          <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80">
            Isolamento de dados via <code>tenant_id</code> ativo.
          </p>
        </div>

      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-400 text-center">
        EduGestão v2.4 SaaS MVP
      </div>
    </aside>
  );
};
