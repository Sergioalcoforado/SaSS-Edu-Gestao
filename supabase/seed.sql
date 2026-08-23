-- ============================================================================
-- EDUGESTÃO SAAS - SEED DATA (DADOS INICIAIS DE DEMONSTRAÇÃO)
-- Data: 2026-08-23
-- ============================================================================

-- Fixar UUIDs Determinísticos para Testes
-- Tenant 1: Colégio Futuro Saber (Plano PRO)
-- Tenant 2: Escola Aprendiz do Amanhã (Plano BASIC)

-- 1. TENANTS
INSERT INTO public.tenants (
  id, nome, cnpj, subdominio, logo, plano, status, alunos_count, mensalidades_total, cor_primaria, email_contato, telefone_contato, limite_alunos, valor_mensalidade_plano
) VALUES 
('11111111-1111-4111-a111-111111111111', 'Colégio Futuro Saber', '12.345.678/0001-90', 'futurosaber', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=150', 'PRO', 'ATIVO', 450, 445500.00, '#4F46E5', 'contato@futurosaber.com.br', '(11) 98765-4321', 600, 990.00),
('22222222-2222-4222-a222-222222222222', 'Escola Aprendiz do Amanhã', '98.765.432/0001-10', 'aprendiz', 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150', 'BASIC', 'ATIVO', 180, 178200.00, '#059669', 'secretaria@aprendiz.com.br', '(21) 97654-3210', 250, 490.00)
ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome;

-- 2. ANOS LETIVOS
INSERT INTO public.anos_letivos (
  id, tenant_id, ano, status, data_inicio, data_fim, turmas_count
) VALUES
('a1111111-1111-4111-a111-111111111111', '11111111-1111-4111-a111-111111111111', '2026', 'ATIVO', '2026-02-02', '2026-12-18', 12),
('a2222222-2222-4222-a222-222222222222', '22222222-2222-4222-a222-222222222222', '2026', 'ATIVO', '2026-02-05', '2026-12-15', 6)
ON CONFLICT (id) DO NOTHING;

-- 3. TURMAS
INSERT INTO public.turmas (
  id, tenant_id, nome, ano_letivo, turno, nivel, capacidade, alunos_matriculados
) VALUES
('t1111111-1111-4111-a111-111111111111', '11111111-1111-4111-a111-111111111111', '9º Ano A', '2026', 'MANHA', 'FUNDAMENTAL_2', 35, 32),
('t1111111-1111-4111-a111-222222222222', '11111111-1111-4111-a111-111111111111', '3º Ano Médio A', '2026', 'MANHA', 'MEDIO', 40, 38),
('t2222222-2222-4222-a222-111111111111', '22222222-2222-4222-a222-222222222222', '5º Ano A', '2026', 'TARDE', 'FUNDAMENTAL_1', 30, 28)
ON CONFLICT (id) DO NOTHING;

-- 4. ALUNOS
INSERT INTO public.alunos (
  id, tenant_id, nome, matricula, cpf, data_nascimento, turma_id, turma_nome, responsavel_nome, responsavel_telefone, responsavel_email, status, foto, data_matricula
) VALUES
('b1111111-1111-4111-a111-111111111111', '11111111-1111-4111-a111-111111111111', 'Gabriel Silva Santos', '2026-001', '123.456.789-01', '2011-05-14', 't1111111-1111-4111-a111-111111111111', '9º Ano A', 'Carlos Santos', '(11) 99887-6655', 'carlos.santos@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', '2026-01-15'),
('b1111111-1111-4111-a111-222222222222', '11111111-1111-4111-a111-111111111111', 'Sophia Oliveira Lima', '2026-002', '234.567.890-12', '2011-08-22', 't1111111-1111-4111-a111-111111111111', '9º Ano A', 'Mariana Oliveira', '(11) 98765-1122', 'mariana.oliveira@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '2026-01-16'),
('b1111111-1111-4111-a111-333333333333', '11111111-1111-4111-a111-111111111111', 'Lucas Mendes Costa', '2026-003', '345.678.901-23', '2011-03-10', 't1111111-1111-4111-a111-111111111111', '9º Ano A', 'Roberto Costa', '(11) 97654-3344', 'roberto.costa@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '2026-01-18'),
('b2222222-2222-4222-a222-111111111111', '22222222-2222-4222-a222-222222222222', 'Beatriz Ferreira Souza', '2026-101', '456.789.012-34', '2015-11-05', 't2222222-2222-4222-a222-111111111111', '5º Ano A', 'Patricia Souza', '(21) 98877-5544', 'patricia.souza@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '2026-01-20')
ON CONFLICT (id) DO NOTHING;

-- 5. DISCIPLINAS
INSERT INTO public.disciplinas (
  id, tenant_id, turma_id, nome, carga_horaria_semanal, professor_nome
) VALUES
('d1111111-1111-4111-a111-111111111111', '11111111-1111-4111-a111-111111111111', 't1111111-1111-4111-a111-111111111111', 'Matemática', 5, 'Prof. Marcos Andrade'),
('d1111111-1111-4111-a111-222222222222', '11111111-1111-4111-a111-111111111111', 't1111111-1111-4111-a111-111111111111', 'Língua Portuguesa', 5, 'Profª. Ana Beatriz'),
('d1111111-1111-4111-a111-333333333333', '11111111-1111-4111-a111-111111111111', 't1111111-1111-4111-a111-111111111111', 'História', 3, 'Prof. Ricardo Gomes')
ON CONFLICT (id) DO NOTHING;

-- 6. NOTAS (Com Av1, Av2, Atividades e Média)
INSERT INTO public.notas (
  id, tenant_id, turma_id, disciplina_id, aluno_id, bimestre, nota, faltas_totais, av1, av2, atividades
) VALUES
('n1111111-1111-4111-a111-111111111111', '11111111-1111-4111-a111-111111111111', 't1111111-1111-4111-a111-111111111111', 'd1111111-1111-4111-a111-111111111111', 'b1111111-1111-4111-a111-111111111111', 1, 8.50, 1, 8.50, 9.00, 8.00),
('n1111111-1111-4111-a111-222222222222', '11111111-1111-4111-a111-111111111111', 't1111111-1111-4111-a111-111111111111', 'd1111111-1111-4111-a111-111111111111', 'b1111111-1111-4111-a111-222222222222', 1, 9.70, 0, 9.50, 10.00, 9.60),
('n1111111-1111-4111-a111-333333333333', '11111111-1111-4111-a111-111111111111', 't1111111-1111-4111-a111-111111111111', 'd1111111-1111-4111-a111-111111111111', 'b1111111-1111-4111-a111-333333333333', 1, 6.30, 3, 6.00, 6.50, 6.40)
ON CONFLICT (id) DO NOTHING;

-- 7. COBRANÇAS PIX
INSERT INTO public.cobrancas (
  id, tenant_id, aluno_id, aluno_nome, responsavel_nome, responsavel_telefone, responsavel_email, valor, vencimento, status, tipo, referencia, codigo_pix, qr_code_pix
) VALUES
('c1111111-1111-4111-a111-111111111111', '11111111-1111-4111-a111-111111111111', 'b1111111-1111-4111-a111-111111111111', 'Gabriel Silva Santos', 'Carlos Santos', '(11) 99887-6655', 'carlos.santos@email.com', 990.00, '2026-08-10', 'PAGO', 'MENSALIDADE', 'Mensalidade Agosto/2026', '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-4266141740005204000053039865405990.005802BR5925Futuro Saber Edu6009Sao Paulo62070503***6304E2CA', 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=EduGestaoPIXDemo'),
('c1111111-1111-4111-a111-222222222222', '11111111-1111-4111-a111-111111111111', 'b1111111-1111-4111-a111-222222222222', 'Sophia Oliveira Lima', 'Mariana Oliveira', '(11) 98765-1122', 'mariana.oliveira@email.com', 990.00, '2026-09-10', 'PENDENTE', 'MENSALIDADE', 'Mensalidade Setembro/2026', '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-4266141740005204000053039865405990.005802BR5925Futuro Saber Edu6009Sao Paulo62070503***6304E2CA', 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=EduGestaoPIXDemo')
ON CONFLICT (id) DO NOTHING;

-- 8. COMUNICADOS
INSERT INTO public.comunicados (
  id, tenant_id, titulo, conteudo, autor_nome, autor_cargo, destinatario_role, urgente
) VALUES
('m1111111-1111-4111-a111-111111111111', '11111111-1111-4111-a111-111111111111', 'Reunião de Pais e Mestres - 3º Bimestre', 'Prezados pais e responsáveis, convidamos todos para nossa reunião pedagógica no próximo sábado às 09h.', 'Coordenação Pedagógica', 'Coordenadora', 'TODOS', true),
('m1111111-1111-4111-a111-222222222222', '11111111-1111-4111-a111-111111111111', 'Feira de Ciências 2026 - Inscrições Abertas', 'As inscrições para os grupos da Feira de Ciências estão abertas até o dia 30/08.', 'Prof. Ricardo Gomes', 'Professor de História', 'TODOS', false)
ON CONFLICT (id) DO NOTHING;
