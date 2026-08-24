export interface PlanSpec {

  id: string; // Aceita PlanoTenant ('BASIC' | 'PRO' | 'ENTERPRISE') ou IDs customizados
  nome: string;
  badgeColor: string;
  precoMensal: number;
  limiteAlunos: number;
  descricao: string;
  recursos: string[];
  recursosBloqueados?: string[];
  permitePixAutomatico: boolean;
  permiteReguaWhatsapp: boolean;
  permiteDiarioClasse: boolean;
  permiteMultiUnidades: boolean;
  suporteDedicado: boolean;
}

export const INITIAL_PLANS_LIST: PlanSpec[] = [
  {
    id: 'BASIC',
    nome: 'Plano Basic',
    badgeColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200',
    precoMensal: 490,
    limiteAlunos: 250,
    descricao: 'Ideal para escolas pequenas ou em fase inicial que precisam organizar cadastros e financeira básica.',
    recursos: [
      'Até 250 Alunos Matriculados',
      'Gestão de Secretaria & Alunos',
      'Anos Letivos & Turmas',
      'Emissão de Carnês/Boletos Manuais',
      'Portal do Aluno Básico'
    ],
    recursosBloqueados: [
      'Régua Automática de Cobrança WhatsApp (API Meta)',
      'Baixa Automática Instantânea via PIX Webhook',
      'Diário de Classe & Frequência Avançada',
      'Suporte VIP 24/7'
    ],
    permitePixAutomatico: false,
    permiteReguaWhatsapp: false,
    permiteDiarioClasse: false,
    permiteMultiUnidades: false,
    suporteDedicado: false
  },
  {
    id: 'PRO',
    nome: 'Plano Pro (Mais Popular)',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200',
    precoMensal: 990,
    limiteAlunos: 600,
    descricao: 'Solução completa para escolas de médio porte com automação financeira no WhatsApp e Diário de Classe.',
    recursos: [
      'Até 600 Alunos Matriculados',
      'Tudo do Plano Basic',
      'PIX Dinâmico com Baixa Automática Instantânea',
      'Régua Automática de Cobrança no WhatsApp',
      'Diário de Classe Completo & Lançamento de Notas',
      'Boletim Digital Interativo no Portal dos Pais'
    ],
    permitePixAutomatico: true,
    permiteReguaWhatsapp: true,
    permiteDiarioClasse: true,
    permiteMultiUnidades: false,
    suporteDedicado: false
  },
  {
    id: 'ENTERPRISE',
    nome: 'Plano Enterprise',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200',
    precoMensal: 1990,
    limiteAlunos: 2000,
    descricao: 'Para grandes redes de ensino e colégios tradicionais que exigem altíssima capacidade e suporte dedicado.',
    recursos: [
      'Até 2.000 Alunos Matriculados (Capacidade Expandida)',
      'Tudo do Plano Pro',
      'Suporte Prioritário VIP & Gerente de Conta 24/7',
      'SLA Garantido de 99.98% e RLS Avançado',
      'Webhooks Dedicados e Multi-unidades',
      'Treinamento presencial/online da equipe'
    ],
    permitePixAutomatico: true,
    permiteReguaWhatsapp: true,
    permiteDiarioClasse: true,
    permiteMultiUnidades: true,
    suporteDedicado: true
  }
];

export class PlanConfig {
  static getPlan(plano: string, dynamicList?: PlanSpec[]): PlanSpec {
    const list = dynamicList || INITIAL_PLANS_LIST;
    const found = list.find(p => p.id === plano);
    if (found) return found;
    return INITIAL_PLANS_LIST[1]; // Default PRO
  }
}
