import { supabase } from '../lib/supabase';
import { 
  INITIAL_TENANTS, 
  INITIAL_USERS, 
  INITIAL_ALUNOS, 
  INITIAL_TURMAS, 
  INITIAL_DISCIPLINAS, 
  INITIAL_COBRANCAS, 
  INITIAL_REGRAS_COBRANCA, 
  INITIAL_NOTAS, 
  INITIAL_PRESENCAS, 
  INITIAL_COMUNICADOS, 
  INITIAL_ANOS_LETIVOS 
} from '../data/mockData';
import type { Tenant, User, Aluno, Turma, Disciplina, Cobranca, RegraCobranca, PresencaRegistro, NotaRegistro, Comunicado, AnoLetivo } from '../types';

export class DbService {
  static isSupabaseConfigured(): boolean {
    const url = import.meta.env.VITE_SUPABASE_URL;
    return Boolean(url && url.includes('supabase.co'));
  }

  // TENANTS
  static async getTenants(): Promise<Tenant[]> {
    if (!this.isSupabaseConfigured()) return INITIAL_TENANTS;
    try {
      const { data, error } = await supabase.from('tenants').select('*');
      if (error || !data || data.length === 0) return INITIAL_TENANTS;
      return data.map((t) => ({
        id: t.id,
        nome: t.nome,
        cnpj: t.cnpj,
        subdominio: t.subdominio,
        logo: t.logo || '',
        plano: t.plano,
        status: t.status,
        alunosCount: t.alunos_count,
        mensalidadesTotal: Number(t.mensalidades_total),
        corPrimaria: t.cor_primaria,
        emailContato: t.email_contato,
        telefoneContato: t.telefone_contato,
        dataCriacao: t.data_criacao,
        limiteAlunos: t.limite_alunos,
        valorMensalidadePlano: Number(t.valor_mensalidade_plano)
      }));
    } catch {
      return INITIAL_TENANTS;
    }
  }

  // USERS
  static async getUsers(tenantId?: string): Promise<User[]> {
    if (!this.isSupabaseConfigured()) {
      return tenantId ? INITIAL_USERS.filter(u => u.tenantId === tenantId) : INITIAL_USERS;
    }
    try {
      let query = supabase.from('users').select('*');
      if (tenantId) query = query.eq('tenant_id', tenantId);
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return tenantId ? INITIAL_USERS.filter(u => u.tenantId === tenantId) : INITIAL_USERS;
      }
      return data.map((u) => ({
        id: u.id,
        tenantId: u.tenant_id,
        nome: u.nome,
        email: u.email,
        role: u.role,
        avatar: u.avatar || '',
        cpf: u.cpf || '',
        telefone: u.telefone || '',
        especialidade: u.especialidade || '',
        turmasAtribuidasIds: u.turmas_atribuidas_ids || [],
        alunoDependenteId: u.aluno_dependente_id || ''
      }));
    } catch {
      return tenantId ? INITIAL_USERS.filter(u => u.tenantId === tenantId) : INITIAL_USERS;
    }
  }

  // ALUNOS
  static async getAlunos(tenantId?: string): Promise<Aluno[]> {
    if (!this.isSupabaseConfigured()) {
      return tenantId ? INITIAL_ALUNOS.filter(a => a.tenantId === tenantId) : INITIAL_ALUNOS;
    }
    try {
      let query = supabase.from('alunos').select('*');
      if (tenantId) query = query.eq('tenant_id', tenantId);
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return tenantId ? INITIAL_ALUNOS.filter(a => a.tenantId === tenantId) : INITIAL_ALUNOS;
      }
      return data.map((a) => ({
        id: a.id,
        tenantId: a.tenant_id,
        nome: a.nome,
        matricula: a.matricula,
        cpf: a.cpf || '',
        dataNascimento: a.data_nascimento || '',
        turmaId: a.turma_id || '',
        turmaNome: a.turma_nome || '',
        responsavelId: a.responsavel_id || '',
        responsavelNome: a.responsavel_nome || '',
        responsavelTelefone: a.responsavel_telefone || '',
        responsavelEmail: a.responsavel_email || '',
        status: a.status,
        foto: a.foto || '',
        dataMatricula: a.data_matricula || ''
      }));
    } catch {
      return tenantId ? INITIAL_ALUNOS.filter(a => a.tenantId === tenantId) : INITIAL_ALUNOS;
    }
  }

  // TURMAS
  static async getTurmas(tenantId?: string): Promise<Turma[]> {
    if (!this.isSupabaseConfigured()) {
      return tenantId ? INITIAL_TURMAS.filter(t => t.tenantId === tenantId) : INITIAL_TURMAS;
    }
    try {
      let query = supabase.from('turmas').select('*');
      if (tenantId) query = query.eq('tenant_id', tenantId);
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return tenantId ? INITIAL_TURMAS.filter(t => t.tenantId === tenantId) : INITIAL_TURMAS;
      }
      return data.map((t) => ({
        id: t.id,
        tenantId: t.tenant_id,
        nome: t.nome,
        anoLetivo: t.ano_letivo,
        turno: t.turno,
        nivel: t.nivel,
        capacidade: t.capacidade,
        alunosMatriculados: t.alunos_matriculados,
        professorTitularId: t.professor_titular_id || '',
        professorTitularNome: t.professor_titular_nome || ''
      }));
    } catch {
      return tenantId ? INITIAL_TURMAS.filter(t => t.tenantId === tenantId) : INITIAL_TURMAS;
    }
  }

  // DISCIPLINAS
  static async getDisciplinas(tenantId?: string): Promise<Disciplina[]> {
    if (!this.isSupabaseConfigured()) {
      return tenantId ? INITIAL_DISCIPLINAS.filter(d => d.tenantId === tenantId) : INITIAL_DISCIPLINAS;
    }
    try {
      let query = supabase.from('disciplinas').select('*');
      if (tenantId) query = query.eq('tenant_id', tenantId);
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return tenantId ? INITIAL_DISCIPLINAS.filter(d => d.tenantId === tenantId) : INITIAL_DISCIPLINAS;
      }
      return data.map((d) => ({
        id: d.id,
        tenantId: d.tenant_id,
        turmaId: d.turma_id,
        nome: d.nome,
        cargaHorariaSemanal: d.carga_horaria_semanal,
        professorId: d.professor_id || '',
        professorNome: d.professor_nome || ''
      }));
    } catch {
      return tenantId ? INITIAL_DISCIPLINAS.filter(d => d.tenantId === tenantId) : INITIAL_DISCIPLINAS;
    }
  }

  // COBRANCAS
  static async getCobrancas(tenantId?: string): Promise<Cobranca[]> {
    if (!this.isSupabaseConfigured()) {
      return tenantId ? INITIAL_COBRANCAS.filter(c => c.tenantId === tenantId) : INITIAL_COBRANCAS;
    }
    try {
      let query = supabase.from('cobrancas').select('*');
      if (tenantId) query = query.eq('tenant_id', tenantId);
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return tenantId ? INITIAL_COBRANCAS.filter(c => c.tenantId === tenantId) : INITIAL_COBRANCAS;
      }
      return data.map((c) => ({
        id: c.id,
        tenantId: c.tenant_id,
        alunoId: c.aluno_id,
        alunoNome: c.aluno_nome,
        responsavelId: c.responsavel_id || '',
        responsavelNome: c.responsavel_nome || '',
        responsavelTelefone: c.responsavel_telefone || '',
        responsavelEmail: c.responsavel_email || '',
        valor: Number(c.valor),
        vencimento: c.vencimento,
        dataPagamento: c.data_pagamento,
        status: c.status,
        tipo: c.tipo,
        referencia: c.referencia,
        codigoPix: c.codigo_pix || '',
        qrCodePix: c.qr_code_pix || '',
        linhaDigitavelBoleto: c.linha_digitavel_boleto || '',
        historicoEnvios: c.historico_envios || []
      }));
    } catch {
      return tenantId ? INITIAL_COBRANCAS.filter(c => c.tenantId === tenantId) : INITIAL_COBRANCAS;
    }
  }

  // REGRAS DE COBRANCA
  static async getRegrasCobranca(tenantId?: string): Promise<RegraCobranca[]> {
    if (!this.isSupabaseConfigured()) {
      return tenantId ? INITIAL_REGRAS_COBRANCA.filter(r => r.tenantId === tenantId) : INITIAL_REGRAS_COBRANCA;
    }
    try {
      let query = supabase.from('regras_cobranca').select('*');
      if (tenantId) query = query.eq('tenant_id', tenantId);
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return tenantId ? INITIAL_REGRAS_COBRANCA.filter(r => r.tenantId === tenantId) : INITIAL_REGRAS_COBRANCA;
      }
      return data.map((r) => ({
        id: r.id,
        tenantId: r.tenant_id,
        nome: r.nome,
        diasGatilho: r.dias_gatilho,
        canal: r.canal,
        modeloMensagem: r.modelo_mensagem,
        ativa: r.ativa
      }));
    } catch {
      return tenantId ? INITIAL_REGRAS_COBRANCA.filter(r => r.tenantId === tenantId) : INITIAL_REGRAS_COBRANCA;
    }
  }

  // NOTAS
  static async getNotas(tenantId?: string): Promise<NotaRegistro[]> {
    if (!this.isSupabaseConfigured()) {
      return tenantId ? INITIAL_NOTAS.filter(n => n.tenantId === tenantId) : INITIAL_NOTAS;
    }
    try {
      let query = supabase.from('notas').select('*');
      if (tenantId) query = query.eq('tenant_id', tenantId);
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return tenantId ? INITIAL_NOTAS.filter(n => n.tenantId === tenantId) : INITIAL_NOTAS;
      }
      return data.map((n) => ({
        id: n.id,
        tenantId: n.tenant_id,
        turmaId: n.turma_id,
        disciplinaId: n.disciplina_id,
        alunoId: n.aluno_id,
        bimestre: n.bimestre,
        nota: Number(n.nota),
        faltasTotais: n.faltas_totais
      }));
    } catch {
      return tenantId ? INITIAL_NOTAS.filter(n => n.tenantId === tenantId) : INITIAL_NOTAS;
    }
  }

  // PRESENCAS
  static async getPresencas(tenantId?: string): Promise<PresencaRegistro[]> {
    if (!this.isSupabaseConfigured()) {
      return tenantId ? INITIAL_PRESENCAS.filter(p => p.tenantId === tenantId) : INITIAL_PRESENCAS;
    }
    try {
      let query = supabase.from('presencas').select('*');
      if (tenantId) query = query.eq('tenant_id', tenantId);
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return tenantId ? INITIAL_PRESENCAS.filter(p => p.tenantId === tenantId) : INITIAL_PRESENCAS;
      }
      return data.map((p) => ({
        id: p.id,
        tenantId: p.tenant_id,
        turmaId: p.turma_id,
        disciplinaId: p.disciplina_id,
        alunoId: p.aluno_id,
        data: p.data,
        status: p.status,
        observacao: p.observacao || ''
      }));
    } catch {
      return tenantId ? INITIAL_PRESENCAS.filter(p => p.tenantId === tenantId) : INITIAL_PRESENCAS;
    }
  }

  // COMUNICADOS
  static async getComunicados(tenantId?: string): Promise<Comunicado[]> {
    if (!this.isSupabaseConfigured()) {
      return tenantId ? INITIAL_COMUNICADOS.filter(c => c.tenantId === tenantId) : INITIAL_COMUNICADOS;
    }
    try {
      let query = supabase.from('comunicados').select('*');
      if (tenantId) query = query.eq('tenant_id', tenantId);
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return tenantId ? INITIAL_COMUNICADOS.filter(c => c.tenantId === tenantId) : INITIAL_COMUNICADOS;
      }
      return data.map((c) => ({
        id: c.id,
        tenantId: c.tenant_id,
        titulo: c.titulo,
        conteudo: c.conteudo,
        data: c.data,
        autorNome: c.autor_nome,
        autorCargo: c.autor_cargo,
        destinatarioRole: c.destinatario_role,
        urgente: c.urgente,
        lidoPorCount: c.lido_por_count
      }));
    } catch {
      return tenantId ? INITIAL_COMUNICADOS.filter(c => c.tenantId === tenantId) : INITIAL_COMUNICADOS;
    }
  }

  // ANOS LETIVOS
  static async getAnosLetivos(tenantId?: string): Promise<AnoLetivo[]> {
    if (!this.isSupabaseConfigured()) {
      return tenantId ? INITIAL_ANOS_LETIVOS.filter(a => a.tenantId === tenantId) : INITIAL_ANOS_LETIVOS;
    }
    try {
      let query = supabase.from('anos_letivos').select('*');
      if (tenantId) query = query.eq('tenant_id', tenantId);
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return tenantId ? INITIAL_ANOS_LETIVOS.filter(a => a.tenantId === tenantId) : INITIAL_ANOS_LETIVOS;
      }
      return data.map((a) => ({
        id: a.id,
        tenantId: a.tenant_id,
        ano: a.ano,
        status: a.status,
        dataInicio: a.data_inicio,
        dataFim: a.data_fim,
        turmasCount: a.turmas_count
      }));
    } catch {
      return tenantId ? INITIAL_ANOS_LETIVOS.filter(a => a.tenantId === tenantId) : INITIAL_ANOS_LETIVOS;
    }
  }
}
