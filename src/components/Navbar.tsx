import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Role } from '../types';
import { 
  Building2, Sun, Moon, Bell, ChevronDown, 
  Sparkles, Check, CheckCircle2 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentTenant, setCurrentTenant, tenantsList, 
    currentUser, setCurrentRole, isDarkMode, setIsDarkMode,
    notifications 
  } = useApp();

  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const rolesList: { role: Role; label: string; desc: string; badgeColor: string }[] = [
    { role: 'SUPER_ADMIN', label: 'SuperAdmin SaaS', desc: 'Visão Global e Gestão de Escolas', badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300' },
    { role: 'DIRETORIA', label: 'Diretoria Geral', desc: 'Relatórios executivos e gestão completa', badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300' },
    { role: 'SECRETARIA', label: 'Secretaria Escola', desc: 'Cadastros de alunos, matrículas e turmas', badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' },
    { role: 'FINANCEIRO', label: 'Financeiro', desc: 'Emissão de mensalidades e régua WhatsApp', badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' },
    { role: 'PROFESSOR', label: 'Professor', desc: 'Lançamento de diário de classe e notas', badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' },
    { role: 'RESPONSAVEL', label: 'Portal do Pai / Mãe', desc: 'Segunda via PIX, boletim e presença', badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' },
    { role: 'ALUNO', label: 'Portal do Aluno', desc: 'Notas, presença e avisos escolares', badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300' }
  ];

  const currentRoleInfo = rolesList.find(r => r.role === currentUser.role) || rolesList[1];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Brand & Active School Tenant Switcher */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
              E
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                EduGestão <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold">SaaS</span>
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

          {/* School Selector (Tenant) */}
          <div className="relative">
            <button
              onClick={() => setShowTenantDropdown(!showTenantDropdown)}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-colors border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="max-w-[160px] truncate">{currentTenant.nome}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showTenantDropdown && (
              <div className="absolute left-0 mt-2 w-64 glass-panel bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fade-in">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Instituições de Ensino (Tenants)
                </div>
                {tenantsList.map((tenant) => (
                  <button
                    key={tenant.id}
                    onClick={() => {
                      setCurrentTenant(tenant);
                      setShowTenantDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${tenant.id === currentTenant.id ? 'font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    <div>
                      <p>{tenant.nome}</p>
                      <p className="text-[10px] text-slate-400 font-normal">{tenant.subdominio}</p>
                    </div>
                    {tenant.id === currentTenant.id && <Check className="w-4 h-4 text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: RBAC Role Simulator & User Utilities */}
        <div className="flex items-center gap-3">

          {/* Dynamic RBAC Role Simulator Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/80 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Simular Papel: <strong>{currentRoleInfo.label}</strong></span>
              <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-72 glass-panel bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Simulador de Permissões (RBAC)</p>
                  <p className="text-[11px] text-slate-500">Alterne entre papéis para testar as regras de acesso.</p>
                </div>
                <div className="py-1">
                  {rolesList.map((item) => (
                    <button
                      key={item.role}
                      onClick={() => {
                        setCurrentRole(item.role);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-start justify-between ${currentUser.role === item.role ? 'bg-indigo-50/60 dark:bg-indigo-950/40' : ''}`}
                    >
                      <div>
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${item.badgeColor}`}>
                          {item.label}
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
                      </div>
                      {currentUser.role === item.role && <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Alternar Tema Escuro / Claro"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-600 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 glass-panel bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Alertas do Sistema</h4>
                  <span className="text-[10px] text-slate-400">{notifications.length} recentes</span>
                </div>
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">Nenhuma notificação recente.</p>
                ) : (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{n.titulo}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.mensagem}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.nome}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/20" 
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[130px]">{currentUser.nome}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
