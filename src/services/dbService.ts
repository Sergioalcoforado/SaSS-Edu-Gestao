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

  // TENANTS READ & WRITE
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
        alunosCount: t.alunos_count || 0,
        mensalidadesTotal: Number(t.mensalidades_total || 0),
        corPrimaria: t.cor_primaria || '#4F46E5',
        emailContato: t.email_contato || '',
        telefoneContato: t.telefone_contato || '',
        dataCriacao: t.data_criacao || new Date().toISOString().split('T')[0],
        limiteAlunos: t.limite_alunos || 600,
        valorMensalidadePlano: Number(t.valor_mensalidade_plano || 990)
      }));
    } catch {
      return INITIAL_TENANTS;
    }
  }

  static async createTenant(tenant: Tenant): Promise<boolean> {
    if (!this.isSupabaseConfigured()) return true;
    try {
      const { error } = await supabase.from('tenants').insert({
        id: tenant.id.includes('tenant-') ? undefined : tenant.id,
        nome: tenant.nome,
        cnpj: tenant.cnpj,
        subdominio: tenant.subdominio,
        logo: tenant.logo,
        plano: tenant.plano,
        status: tenant.status,
        alunos_count: tenant.alunosCount,
        mensalidades_total: tenant.mensalidadesTotal,
        cor_primaria: tenant.corPrimaria,
        email_contato: tenant.emailContato,
        telefone_contato: tenant.telefoneContato,
        limite_alunos: tenant.limiteAlunos,
        valor_mensalidade_plano: tenant.valorMensalidadePlano
      });
      return !error;
    } catch {
      return false;
    }
  }

  static async updateTenant(id: string, updates: Partial<Tenant>): Promise<boolean> {
    if (!this.isSupabaseConfigured()) return true;
    try {
      const payload: Record<string, any> = {};
      if (updates.nome) payload.nome = updates.nome;
      if (updates.status) payload.status = updates.status;
      if (updates.plano) payload.plano = updates.plano;
      if (updates.alunosCount !== undefined) payload.alunos_count = updates.alunosCount;
      if (updates.mensalidadesTotal !== undefined) payload.mensalidades_total = updates.mensalidadesTotal;

      const { error } = await supabase.from('tenants').update(payload).eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  // USERS READ
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

  // ALUNOS READ & WRITE
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

  static async createAluno(aluno: Aluno): Promise<boolean> {
    if (!this.isSupabaseConfigured()) return true;
    try {
      const { error } = await supabase.from('alunos').insert({
        id: aluno.id.includes('aluno-') ? undefined : aluno.id,
        tenant_id: aluno.tenantId,
        nome: aluno.nome,
        matricula: aluno.matricula,
        cpf: aluno.cpf,
        data_nascimento: aluno.dataNascimento || null,
        turma_id: aluno.turmaId.includes('turma-') ? null : aluno.turmaId,
        turma_nome: aluno.turmaNome,
        responsavel_nome: aluno.responsavelNome,
        responsavel_telefone: aluno.responsavelTelefone,
        responsavel_email: aluno.responsavelEmail,
        status: aluno.status,
        foto: aluno.foto
      });
      return !error;
    } catch {
      return false;
    }
  }

  // TURMAS READ & WRITE
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
        alunosMatriculados: t.alunos_matriculados || 0,
        professorTitularId: t.professor_titular_id || '',
        professorTitularNome: t.professor_titular_nome || ''
      }));
    } catch {
      return tenantId ? INITIAL_TURMAS.filter(t => t.tenantId === tenantId) : INITIAL_TURMAS;
    }
  }

  static async createTurma(turma: Turma): Promise<boolean> {
    if (!this.isSupabaseConfigured()) return true;
    try {
      const { error } = await supabase.from('turmas').insert({
        tenant_id: turma.tenantId,
        nome: turma.nome,
        ano_letivo: turma.anoLetivo,
        turno: turma.turno,
        nivel: turma.nivel,
        capacidade: turma.capacidade,
        alunos_matriculados: turma.alunosMatriculados
      });
      return !error;
    } catch {
      return false;
    }
  }

  // DISCIPLINAS READ & WRITE
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

  // COBRANCAS READ & MUTATE
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

  static async updateCobrancaStatus(id: string, status: 'PAGO' | 'PENDENTE' | 'ATRASADO', dataPagamento?: string): Promise<boolean> {
    if (!this.isSupabaseConfigured()) return true;
    try {
      const { error } = await supabase.from('cobrancas').update({
        status,
        data_pagamento: dataPagamento || new Date().toISOString()
      }).eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  // REGRAS DE COBRANCA READ
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

  // NOTAS READ & WRITE
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
        faltasTotais: n.faltas_totais || 0
      }));
    } catch {
      return tenantId ? INITIAL_NOTAS.filter(n => n.tenantId === tenantId) : INITIAL_NOTAS;
    }
  }

  static async saveNotasBatch(
    tenantId: string,
    turmaId: string,
    disciplinaId: string,
    bimestre: number,
    registros: { alunoId: string; nota: number; faltasTotais: number }[]
  ): Promise<boolean> {
    if (!this.isSupabaseConfigured()) return true;
    try {
      // Validar UUIDs
      const validTurmaId = turmaId.includes('turma-') ? null : turmaId;
      const validDisciplinaId = disciplinaId.includes('disc-') ? null : disciplinaId;
      if (!validTurmaId || !validDisciplinaId) return true;

      const payload = registros.map(r => ({
        tenant_id: tenantId,
        turma_id: validTurmaId,
        disciplina_id: validDisciplinaId,
        aluno_id: r.alunoId,
        bimestre,
        nota: r.nota,
        faltas_totais: r.faltasTotais
      }));

      const { error } = await supabase.from('notas').upsert(payload, { onConflict: 'tenant_id,turma_id,disciplina_id,aluno_id,bimestre' });
      return !error;
    } catch {
      return false;
    }
  }

  // PRESENCAS READ
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

  // COMUNICADOS READ & WRITE
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
        lidoPorCount: c.lido_por_count || 0
      }));
    } catch {
      return tenantId ? INITIAL_COMUNICADOS.filter(c => c.tenantId === tenantId) : INITIAL_COMUNICADOS;
    }
  }

  static async createComunicado(comunicado: Comunicado): Promise<boolean> {
    if (!this.isSupabaseConfigured()) return true;
    try {
      const { error } = await supabase.from('comunicados').insert({
        tenant_id: comunicado.tenantId,
        titulo: comunicado.titulo,
        conteudo: comunicado.conteudo,
        autor_nome: comunicado.autorNome,
        autor_cargo: comunicado.autorCargo,
        destinatario_role: comunicado.destinatarioRole,
        urgente: comunicado.urgente
      });
      return !error;
    } catch {
      return false;
    }
  }

  // ANOS LETIVOS READ & WRITE
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
        turmasCount: a.turmas_count || 0
      }));
    } catch {
      return tenantId ? INITIAL_ANOS_LETIVOS.filter(a => a.tenantId === tenantId) : INITIAL_ANOS_LETIVOS;
    }
  }

  static async createAnoLetivo(anoLetivo: AnoLetivo): Promise<boolean> {
    if (!this.isSupabaseConfigured()) return true;
    try {
      const { error } = await supabase.from('anos_letivos').insert({
        tenant_id: anoLetivo.tenantId,
        ano: anoLetivo.ano,
        status: anoLetivo.status,
        data_inicio: anoLetivo.dataInicio,
        data_fim: anoLetivo.dataFim,
        turmas_count: anoLetivo.turmasCount
      });
      return !error;
    } catch {
      return false;
    }
  }
}
