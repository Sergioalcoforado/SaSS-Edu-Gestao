-- ============================================================================
-- EDUGESTÃO SAAS - MIGRATION SQL INICIAL (MULTI-TENANT + RLS + AUTH TRIGGER)
-- Data: 2026-08-23
-- ============================================================================

-- 1. EXTENSÕES & ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM (
    'SUPER_ADMIN', 
    'DIRETORIA', 
    'SECRETARIA', 
    'FINANCEIRO', 
    'PROFESSOR', 
    'RESPONSAVEL', 
    'ALUNO'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.status_tenant AS ENUM ('ATIVO', 'SUSPENSO', 'PENDENTE');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.plano_tenant AS ENUM ('BASIC', 'PRO', 'ENTERPRISE');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.status_cobranca AS ENUM ('PAGO', 'PENDENTE', 'ATRASADO', 'CANCELADO');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.tipo_cobranca AS ENUM ('MENSALIDADE', 'MATRICULA', 'MATERIAL', 'TAXA_EXTRA');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.canal_cobranca AS ENUM ('WHATSAPP', 'EMAIL', 'AMBOS');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.status_ano_letivo AS ENUM ('ATIVO', 'PLANEJAMENTO', 'ENCERRADO');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.status_aluno AS ENUM ('ATIVO', 'INATIVO', 'TRANSFERIDO');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.turno_turma AS ENUM ('MANHA', 'TARDE', 'INTEGRAL', 'NOITE');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.nivel_turma AS ENUM ('INFANTIL', 'FUNDAMENTAL_1', 'FUNDAMENTAL_2', 'MEDIO');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.status_presenca AS ENUM ('PRESENTE', 'AUSENTE', 'JUSTIFICADO');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 2. TABELAS DO SCHEMA PUBLIC
-- ============================================================================

-- Table 1: TENANTS
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cnpj TEXT NOT NULL UNIQUE,
  subdominio TEXT NOT NULL UNIQUE,
  logo TEXT,
  plano public.plano_tenant NOT NULL DEFAULT 'PRO',
  status public.status_tenant NOT NULL DEFAULT 'ATIVO',
  alunos_count INTEGER DEFAULT 0,
  mensalidades_total NUMERIC(12, 2) DEFAULT 0,
  cor_primaria TEXT DEFAULT '#4F46E5',
  email_contato TEXT,
  telefone_contato TEXT,
  data_criacao TIMESTAMPTZ DEFAULT now(),
  data_inicio_prestacao_servico DATE DEFAULT CURRENT_DATE,
  limite_alunos INTEGER DEFAULT 600,
  valor_mensalidade_plano NUMERIC(10, 2) DEFAULT 990.00
);

-- Table 2: USERS (Perfil público vinculado ao Auth Supabase)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role public.user_role NOT NULL DEFAULT 'ALUNO',
  avatar TEXT,
  cpf TEXT,
  telefone TEXT,
  especialidade TEXT,
  turmas_atribuidas_ids UUID[] DEFAULT '{}',
  aluno_dependente_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 3: ANOS LETIVOS
CREATE TABLE IF NOT EXISTS public.anos_letivos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  ano TEXT NOT NULL,
  status public.status_ano_letivo NOT NULL DEFAULT 'PLANEJAMENTO',
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  turmas_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 4: TURMAS
CREATE TABLE IF NOT EXISTS public.turmas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  ano_letivo TEXT NOT NULL,
  turno public.turno_turma NOT NULL,
  nivel public.nivel_turma NOT NULL,
  capacidade INTEGER NOT NULL DEFAULT 35,
  alunos_matriculados INTEGER DEFAULT 0,
  professor_titular_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  professor_titular_nome TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 5: ALUNOS
CREATE TABLE IF NOT EXISTS public.alunos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  matricula TEXT NOT NULL,
  cpf TEXT,
  data_nascimento DATE,
  turma_id UUID REFERENCES public.turmas(id) ON DELETE SET NULL,
  turma_nome TEXT,
  responsavel_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  responsavel_nome TEXT,
  responsavel_telefone TEXT,
  responsavel_email TEXT,
  status public.status_aluno NOT NULL DEFAULT 'ATIVO',
  foto TEXT,
  data_matricula DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Adicionar FK de aluno_dependente_id na tabela users apontando para alunos(id)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_users_aluno_dependente'
  ) THEN
    ALTER TABLE public.users 
      ADD CONSTRAINT fk_users_aluno_dependente 
      FOREIGN KEY (aluno_dependente_id) REFERENCES public.alunos(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Table 6: DISCIPLINAS
CREATE TABLE IF NOT EXISTS public.disciplinas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  turma_id UUID NOT NULL REFERENCES public.turmas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  carga_horaria_semanal INTEGER NOT NULL DEFAULT 4,
  professor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  professor_nome TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 7: COBRANCAS
CREATE TABLE IF NOT EXISTS public.cobrancas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  aluno_id UUID NOT NULL REFERENCES public.alunos(id) ON DELETE CASCADE,
  aluno_nome TEXT NOT NULL,
  responsavel_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  responsavel_nome TEXT,
  responsavel_telefone TEXT,
  responsavel_email TEXT,
  valor NUMERIC(10, 2) NOT NULL,
  vencimento DATE NOT NULL,
  data_pagamento TIMESTAMPTZ,
  status public.status_cobranca NOT NULL DEFAULT 'PENDENTE',
  tipo public.tipo_cobranca NOT NULL DEFAULT 'MENSALIDADE',
  referencia TEXT NOT NULL,
  codigo_pix TEXT,
  qr_code_pix TEXT,
  linha_digitavel_boleto TEXT,
  historico_envios JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 8: REGRAS COBRANCA
CREATE TABLE IF NOT EXISTS public.regras_cobranca (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  dias_gatilho INTEGER NOT NULL DEFAULT 0,
  canal public.canal_cobranca NOT NULL DEFAULT 'WHATSAPP',
  modelo_mensagem TEXT NOT NULL,
  ativa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 9: PRESENCAS
CREATE TABLE IF NOT EXISTS public.presencas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  turma_id UUID NOT NULL REFERENCES public.turmas(id) ON DELETE CASCADE,
  disciplina_id UUID NOT NULL REFERENCES public.disciplinas(id) ON DELETE CASCADE,
  aluno_id UUID NOT NULL REFERENCES public.alunos(id) ON DELETE CASCADE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  status public.status_presenca NOT NULL DEFAULT 'PRESENTE',
  observacao TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 10: NOTAS
CREATE TABLE IF NOT EXISTS public.notas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  turma_id UUID NOT NULL REFERENCES public.turmas(id) ON DELETE CASCADE,
  disciplina_id UUID NOT NULL REFERENCES public.disciplinas(id) ON DELETE CASCADE,
  aluno_id UUID NOT NULL REFERENCES public.alunos(id) ON DELETE CASCADE,
  bimestre SMALLINT NOT NULL CHECK (bimestre BETWEEN 1 AND 4),
  nota NUMERIC(4, 2) NOT NULL CHECK (nota BETWEEN 0.00 AND 10.00),
  faltas_totais INTEGER DEFAULT 0,
  av1 NUMERIC(4, 2),
  av2 NUMERIC(4, 2),
  atividades NUMERIC(4, 2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 11: COMUNICADOS
CREATE TABLE IF NOT EXISTS public.comunicados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  data TIMESTAMPTZ DEFAULT now(),
  autor_nome TEXT NOT NULL,
  autor_cargo TEXT NOT NULL,
  destinatario_role TEXT NOT NULL DEFAULT 'TODOS',
  urgente BOOLEAN DEFAULT false,
  lido_por_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 3. FUNÇÕES AUXILIARES DE HELPER RLS (PERFORMANCE SEM RECURSÃO)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_auth_tenant_id()
RETURNS UUID 
LANGUAGE sql 
STABLE 
SECURITY DEFINER
AS $$
  SELECT tenant_id FROM public.users WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS public.user_role 
LANGUAGE sql 
STABLE 
SECURITY DEFINER
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_auth_aluno_dependente_id()
RETURNS UUID 
LANGUAGE sql 
STABLE 
SECURITY DEFINER
AS $$
  SELECT aluno_dependente_id FROM public.users WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_auth_turmas_atribuidas()
RETURNS UUID[] 
LANGUAGE sql 
STABLE 
SECURITY DEFINER
AS $$
  SELECT COALESCE(turmas_atribuidas_ids, '{}') FROM public.users WHERE id = auth.uid();
$$;

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) & POLICIES
-- ============================================================================

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anos_letivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disciplinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cobrancas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regras_cobranca ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presencas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comunicados ENABLE ROW LEVEL SECURITY;

-- Drop antigas se existirem para idempotência
DROP POLICY IF EXISTS "SuperAdmin full access tenants" ON public.tenants;
DROP POLICY IF EXISTS "Users read own tenant" ON public.tenants;

CREATE POLICY "SuperAdmin full access tenants" ON public.tenants
  FOR ALL USING (public.get_auth_role() = 'SUPER_ADMIN');

CREATE POLICY "Users read own tenant" ON public.tenants
  FOR SELECT USING (id = public.get_auth_tenant_id());

DROP POLICY IF EXISTS "SuperAdmin full access users" ON public.users;
DROP POLICY IF EXISTS "Tenant users read same tenant users" ON public.users;
DROP POLICY IF EXISTS "User update own record" ON public.users;

CREATE POLICY "SuperAdmin full access users" ON public.users
  FOR ALL USING (public.get_auth_role() = 'SUPER_ADMIN');

CREATE POLICY "Tenant users read same tenant users" ON public.users
  FOR SELECT USING (tenant_id = public.get_auth_tenant_id());

CREATE POLICY "User update own record" ON public.users
  FOR UPDATE USING (id = auth.uid());

DROP POLICY IF EXISTS "Tenant isolation anos_letivos" ON public.anos_letivos;
CREATE POLICY "Tenant isolation anos_letivos" ON public.anos_letivos
  FOR ALL USING (
    public.get_auth_role() = 'SUPER_ADMIN' 
    OR tenant_id = public.get_auth_tenant_id()
  );

DROP POLICY IF EXISTS "Tenant isolation turmas" ON public.turmas;
CREATE POLICY "Tenant isolation turmas" ON public.turmas
  FOR ALL USING (
    public.get_auth_role() = 'SUPER_ADMIN' 
    OR tenant_id = public.get_auth_tenant_id()
  );

DROP POLICY IF EXISTS "Tenant isolation disciplinas" ON public.disciplinas;
CREATE POLICY "Tenant isolation disciplinas" ON public.disciplinas
  FOR ALL USING (
    public.get_auth_role() = 'SUPER_ADMIN' 
    OR tenant_id = public.get_auth_tenant_id()
  );

DROP POLICY IF EXISTS "Tenant isolation regras_cobranca" ON public.regras_cobranca;
CREATE POLICY "Tenant isolation regras_cobranca" ON public.regras_cobranca
  FOR ALL USING (
    public.get_auth_role() = 'SUPER_ADMIN' 
    OR tenant_id = public.get_auth_tenant_id()
  );

DROP POLICY IF EXISTS "Alunos select rule" ON public.alunos;
DROP POLICY IF EXISTS "Alunos write rule" ON public.alunos;

CREATE POLICY "Alunos select rule" ON public.alunos
  FOR SELECT USING (
    public.get_auth_role() = 'SUPER_ADMIN'
    OR (
      tenant_id = public.get_auth_tenant_id()
      AND (
        public.get_auth_role() IN ('DIRETORIA', 'SECRETARIA', 'FINANCEIRO', 'PROFESSOR')
        OR id = public.get_auth_aluno_dependente_id()
        OR responsavel_id = auth.uid()
      )
    )
  );

CREATE POLICY "Alunos write rule" ON public.alunos
  FOR ALL USING (
    public.get_auth_role() = 'SUPER_ADMIN'
    OR (
      tenant_id = public.get_auth_tenant_id()
      AND public.get_auth_role() IN ('DIRETORIA', 'SECRETARIA')
    )
  );

DROP POLICY IF EXISTS "Presencas select rule" ON public.presencas;
DROP POLICY IF EXISTS "Presencas write rule" ON public.presencas;

CREATE POLICY "Presencas select rule" ON public.presencas
  FOR SELECT USING (
    public.get_auth_role() = 'SUPER_ADMIN'
    OR (
      tenant_id = public.get_auth_tenant_id()
      AND (
        public.get_auth_role() IN ('DIRETORIA', 'SECRETARIA', 'FINANCEIRO')
        OR (public.get_auth_role() = 'PROFESSOR' AND turma_id = ANY(public.get_auth_turmas_atribuidas()))
        OR (public.get_auth_role() IN ('RESPONSAVEL', 'ALUNO') AND aluno_id = public.get_auth_aluno_dependente_id())
      )
    )
  );

CREATE POLICY "Presencas write rule" ON public.presencas
  FOR ALL USING (
    public.get_auth_role() = 'SUPER_ADMIN'
    OR (
      tenant_id = public.get_auth_tenant_id()
      AND (
        public.get_auth_role() IN ('DIRETORIA', 'SECRETARIA')
        OR (public.get_auth_role() = 'PROFESSOR' AND turma_id = ANY(public.get_auth_turmas_atribuidas()))
      )
    )
  );

DROP POLICY IF EXISTS "Notas select rule" ON public.notas;
DROP POLICY IF EXISTS "Notas write rule" ON public.notas;

CREATE POLICY "Notas select rule" ON public.notas
  FOR SELECT USING (
    public.get_auth_role() = 'SUPER_ADMIN'
    OR (
      tenant_id = public.get_auth_tenant_id()
      AND (
        public.get_auth_role() IN ('DIRETORIA', 'SECRETARIA', 'FINANCEIRO')
        OR (public.get_auth_role() = 'PROFESSOR' AND turma_id = ANY(public.get_auth_turmas_atribuidas()))
        OR (public.get_auth_role() IN ('RESPONSAVEL', 'ALUNO') AND aluno_id = public.get_auth_aluno_dependente_id())
      )
    )
  );

CREATE POLICY "Notas write rule" ON public.notas
  FOR ALL USING (
    public.get_auth_role() = 'SUPER_ADMIN'
    OR (
      tenant_id = public.get_auth_tenant_id()
      AND (
        public.get_auth_role() IN ('DIRETORIA', 'SECRETARIA')
        OR (public.get_auth_role() = 'PROFESSOR' AND turma_id = ANY(public.get_auth_turmas_atribuidas()))
      )
    )
  );

DROP POLICY IF EXISTS "Cobrancas select rule" ON public.cobrancas;
DROP POLICY IF EXISTS "Cobrancas write rule" ON public.cobrancas;

CREATE POLICY "Cobrancas select rule" ON public.cobrancas
  FOR SELECT USING (
    public.get_auth_role() = 'SUPER_ADMIN'
    OR (
      tenant_id = public.get_auth_tenant_id()
      AND (
        public.get_auth_role() IN ('DIRETORIA', 'SECRETARIA', 'FINANCEIRO')
        OR aluno_id = public.get_auth_aluno_dependente_id()
        OR responsavel_id = auth.uid()
      )
    )
  );

CREATE POLICY "Cobrancas write rule" ON public.cobrancas
  FOR ALL USING (
    public.get_auth_role() = 'SUPER_ADMIN'
    OR (
      tenant_id = public.get_auth_tenant_id()
      AND public.get_auth_role() IN ('DIRETORIA', 'FINANCEIRO', 'SECRETARIA')
    )
  );

DROP POLICY IF EXISTS "Comunicados select rule" ON public.comunicados;
DROP POLICY IF EXISTS "Comunicados write rule" ON public.comunicados;

CREATE POLICY "Comunicados select rule" ON public.comunicados
  FOR SELECT USING (
    public.get_auth_role() = 'SUPER_ADMIN'
    OR (
      tenant_id = public.get_auth_tenant_id()
      AND (
        destinatario_role = 'TODOS'
        OR destinatario_role = public.get_auth_role()::text
        OR public.get_auth_role() IN ('DIRETORIA', 'SECRETARIA')
      )
    )
  );

CREATE POLICY "Comunicados write rule" ON public.comunicados
  FOR ALL USING (
    public.get_auth_role() = 'SUPER_ADMIN'
    OR (
      tenant_id = public.get_auth_tenant_id()
      AND public.get_auth_role() IN ('DIRETORIA', 'SECRETARIA')
    )
  );

-- ============================================================================
-- 5. TRIGGER SUPABASE AUTH -> PUBLIC.USERS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    tenant_id,
    nome,
    email,
    role,
    avatar,
    cpf,
    telefone
  ) VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'tenant_id')::uuid, NULL),
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'ALUNO'::public.user_role),
    NEW.raw_user_meta_data->>'avatar',
    NEW.raw_user_meta_data->>'cpf',
    NEW.raw_user_meta_data->>'telefone'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    nome = COALESCE(EXCLUDED.nome, public.users.nome);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
