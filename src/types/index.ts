export type Role = 
  | 'SUPER_ADMIN' 
  | 'DIRETORIA' 
  | 'SECRETARIA' 
  | 'FINANCEIRO' 
  | 'PROFESSOR' 
  | 'RESPONSAVEL' 
  | 'ALUNO';

export type StatusCobranca = 'PAGO' | 'PENDENTE' | 'ATRASADO' | 'CANCELADO';
export type TipoCobranca = 'MENSALIDADE' | 'MATRICULA' | 'MATERIAL' | 'TAXA_EXTRA';
export type CanalCobranca = 'WHATSAPP' | 'EMAIL' | 'AMBOS';

export type StatusTenant = 'ATIVO' | 'SUSPENSO' | 'PENDENTE';
export type PlanoTenant = 'BASIC' | 'PRO' | 'ENTERPRISE';

export interface Tenant {
  id: string;
  nome: string;
  cnpj: string;
  subdominio: string;
  logo: string;
  plano: PlanoTenant;
  status: StatusTenant;
  alunosCount: number;
  mensalidadesTotal: number;
  corPrimaria: string;
  emailContato: string;
  telefoneContato: string;
  dataCriacao: string;
  limiteAlunos: number;
  valorMensalidadePlano: number;
}

export interface User {
  id: string;
  tenantId: string;
  nome: string;
  email: string;
  role: Role;
  avatar: string;
  cpf?: string;
  telefone?: string;
  especialidade?: string; // ex: "Matemática", "Língua Portuguesa"
  turmasAtribuidasIds?: string[]; // Para professores
  alunoDependenteId?: string; // Para pais
}

export interface AnoLetivo {
  id: string;
  tenantId: string;
  ano: string; // ex: "2026", "2027"
  status: 'ATIVO' | 'PLANEJAMENTO' | 'ENCERRADO';
  dataInicio: string;
  dataFim: string;
  turmasCount: number;
}

export interface Aluno {
  id: string;
  tenantId: string;
  nome: string;
  matricula: string;
  cpf: string;
  dataNascimento: string;
  turmaId: string;
  turmaNome: string;
  responsavelId: string;
  responsavelNome: string;
  responsavelTelefone: string;
  responsavelEmail: string;
  status: 'ATIVO' | 'INATIVO' | 'TRANSFERIDO';
  foto: string;
  dataMatricula: string;
}

export interface Turma {
  id: string;
  tenantId: string;
  nome: string; // ex: "9º Ano A"
  anoLetivo: string; // ex: "2026"
  turno: 'MANHA' | 'TARDE' | 'INTEGRAL' | 'NOITE';
  nivel: 'INFANTIL' | 'FUNDAMENTAL_1' | 'FUNDAMENTAL_2' | 'MEDIO';
  capacidade: number;
  alunosMatriculados: number;
  professorTitularId: string;
  professorTitularNome: string;
}

export interface Disciplina {
  id: string;
  tenantId: string;
  turmaId: string;
  nome: string; // ex: "Matemática"
  cargaHorariaSemanal: number;
  professorId: string;
  professorNome: string;
}

export interface Cobranca {
  id: string;
  tenantId: string;
  alunoId: string;
  alunoNome: string;
  responsavelId: string;
  responsavelNome: string;
  responsavelTelefone: string;
  responsavelEmail: string;
  valor: number;
  vencimento: string; // YYYY-MM-DD
  dataPagamento?: string;
  status: StatusCobranca;
  tipo: TipoCobranca;
  referencia: string; // ex: "Mensalidade Agosto/2026"
  codigoPix: string;
  qrCodePix: string;
  linhaDigitavelBoleto: string;
  historicoEnvios: {
    id: string;
    data: string;
    canal: CanalCobranca;
    tipoNotificacao: 'LEMBRETE_PREVIO' | 'VENCIMENTO_HOJE' | 'ATRASO_CRITICO';
    statusEnvio: 'ENVIADO' | 'LIDO' | 'FALHA';
  }[];
}

export interface RegraCobranca {
  id: string;
  tenantId: string;
  nome: string;
  diasGatilho: number; // ex: -5 (5 dias antes), 0 (no dia), +3 (3 dias após)
  canal: CanalCobranca;
  modeloMensagem: string;
  ativa: boolean;
}

export interface PresencaRegistro {
  id: string;
  tenantId: string;
  turmaId: string;
  disciplinaId: string;
  alunoId: string;
  data: string; // YYYY-MM-DD
  status: 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO';
  observacao?: string;
}

export interface NotaRegistro {
  id: string;
  tenantId: string;
  turmaId: string;
  disciplinaId: string;
  alunoId: string;
  bimestre: 1 | 2 | 3 | 4;
  nota: number; // 0.0 - 10.0
  faltasTotais: number;
}

export interface Comunicado {
  id: string;
  tenantId: string;
  titulo: string;
  conteudo: string;
  data: string;
  autorNome: string;
  autorCargo: string;
  destinatarioRole: Role | 'TODOS';
  urgente: boolean;
  lidoPorCount: number;
}
