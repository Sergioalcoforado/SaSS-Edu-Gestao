-- ============================================================================
-- EDUGESTÃO SAAS - CORREÇÃO DE POLÍTICAS RLS (PERMISSÕES ANON/DEMO)
-- Data: 2026-08-23
-- ============================================================================

-- Permitir Leitura, Inserção e Atualização na tabela TENANTS para requisições Anon (sem login prévio no Auth)
DROP POLICY IF EXISTS "SuperAdmin full access tenants" ON public.tenants;
DROP POLICY IF EXISTS "Users read own tenant" ON public.tenants;
DROP POLICY IF EXISTS "Public read tenants" ON public.tenants;
DROP POLICY IF EXISTS "Public insert tenants" ON public.tenants;
DROP POLICY IF EXISTS "Public update tenants" ON public.tenants;

CREATE POLICY "Public read tenants" ON public.tenants FOR SELECT USING (true);
CREATE POLICY "Public insert tenants" ON public.tenants FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update tenants" ON public.tenants FOR UPDATE USING (true);

-- Permitir Leitura e Inserção para Anon nas demais tabelas de apoio para ambiente Demo/Dev
DROP POLICY IF EXISTS "Public access users" ON public.users;
CREATE POLICY "Public access users" ON public.users FOR ALL USING (true);

DROP POLICY IF EXISTS "Public access anos_letivos" ON public.anos_letivos;
CREATE POLICY "Public access anos_letivos" ON public.anos_letivos FOR ALL USING (true);

DROP POLICY IF EXISTS "Public access turmas" ON public.turmas;
CREATE POLICY "Public access turmas" ON public.turmas FOR ALL USING (true);

DROP POLICY IF EXISTS "Public access alunos" ON public.alunos;
CREATE POLICY "Public access alunos" ON public.alunos FOR ALL USING (true);

DROP POLICY IF EXISTS "Public access disciplinas" ON public.disciplinas;
CREATE POLICY "Public access disciplinas" ON public.disciplinas FOR ALL USING (true);

DROP POLICY IF EXISTS "Public access cobrancas" ON public.cobrancas;
CREATE POLICY "Public access cobrancas" ON public.cobrancas FOR ALL USING (true);

DROP POLICY IF EXISTS "Public access regras_cobranca" ON public.regras_cobranca;
CREATE POLICY "Public access regras_cobranca" ON public.regras_cobranca FOR ALL USING (true);

DROP POLICY IF EXISTS "Public access presencas" ON public.presencas;
CREATE POLICY "Public access presencas" ON public.presencas FOR ALL USING (true);

DROP POLICY IF EXISTS "Public access notas" ON public.notas;
CREATE POLICY "Public access notas" ON public.notas FOR ALL USING (true);

DROP POLICY IF EXISTS "Public access comunicados" ON public.comunicados;
CREATE POLICY "Public access comunicados" ON public.comunicados FOR ALL USING (true);
