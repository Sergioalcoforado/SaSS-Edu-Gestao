-- ============================================================================
-- EDUGESTÃO SAAS - SCRIPT SQL SEED CORRIGIDO (UUIDs VÁLIDOS)
-- Data: 2026-08-25
-- ============================================================================

-- 1. TENANTS (Escolas Clientes)
INSERT INTO public.tenants (
  id, nome, cnpj, subdominio, logo, plano, status, alunos_count, mensalidades_total, cor_primaria, email_contato, telefone_contato, limite_alunos, valor_mensalidade_plano
) VALUES 
('11111111-1111-4111-a111-111111111111', 'Colégio Futuro Saber', '12.345.678/0001-90', 'futurosaber', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=150', 'PRO', 'ATIVO', 15, 14850.00, '#4F46E5', 'contato@futurosaber.com.br', '(11) 98765-4321', 600, 990.00),
('22222222-2222-4222-a222-222222222222', 'Escola Aprendiz do Amanhã', '98.765.432/0001-10', 'aprendiz', 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150', 'BASIC', 'ATIVO', 15, 7350.00, '#059669', 'secretaria@aprendiz.com.br', '(21) 97654-3210', 250, 490.00)
ON CONFLICT (id) DO UPDATE SET 
  nome = EXCLUDED.nome,
  alunos_count = EXCLUDED.alunos_count;

-- 2. USUÁRIOS (Direção e 3 Professores por Escola)
INSERT INTO public.users (
  id, tenant_id, nome, email, role, avatar
) VALUES
-- Tenant 1 Users
('11111111-1111-4111-a111-000000000001', '11111111-1111-4111-a111-111111111111', 'Profa. Mariana Silva', 'mariana.silva@futurosaber.com.br', 'DIRETORIA', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'),
('11111111-1111-4111-a111-000000000002', '11111111-1111-4111-a111-111111111111', 'Prof. Marcos Andrade', 'marcos.andrade@futurosaber.com.br', 'PROFESSOR', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'),
('11111111-1111-4111-a111-000000000003', '11111111-1111-4111-a111-111111111111', 'Profª. Ana Beatriz Viana', 'ana.beatriz@futurosaber.com.br', 'PROFESSOR', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'),
('11111111-1111-4111-a111-000000000004', '11111111-1111-4111-a111-111111111111', 'Prof. Ricardo Gomes', 'ricardo.gomes@futurosaber.com.br', 'PROFESSOR', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'),

-- Tenant 2 Users
('22222222-2222-4222-a222-000000000001', '22222222-2222-4222-a222-222222222222', 'Prof. Roberto Alencar', 'roberto@aprendiz.com.br', 'DIRETORIA', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'),
('22222222-2222-4222-a222-000000000002', '22222222-2222-4222-a222-222222222222', 'Profª. Carla Mendes', 'carla.mendes@aprendiz.com.br', 'PROFESSOR', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'),
('22222222-2222-4222-a222-000000000003', '22222222-2222-4222-a222-222222222222', 'Prof. Eduardo Lima', 'eduardo.lima@aprendiz.com.br', 'PROFESSOR', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100'),
('22222222-2222-4222-a222-000000000004', '22222222-2222-4222-a222-222222222222', 'Profª. Juliana Rocha', 'juliana.rocha@aprendiz.com.br', 'PROFESSOR', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100')
ON CONFLICT (id) DO NOTHING;

-- 3. ANOS LETIVOS
INSERT INTO public.anos_letivos (
  id, tenant_id, ano, status, data_inicio, data_fim, turmas_count
) VALUES
('11111111-1111-4111-a111-0000000000a1', '11111111-1111-4111-a111-111111111111', '2026', 'ATIVO', '2026-02-02', '2026-12-18', 2),
('22222222-2222-4222-a222-0000000000a1', '22222222-2222-4222-a222-222222222222', '2026', 'ATIVO', '2026-02-05', '2026-12-15', 2)
ON CONFLICT (id) DO NOTHING;

-- 4. TURMAS
INSERT INTO public.turmas (
  id, tenant_id, nome, ano_letivo, turno, nivel, capacidade, alunos_matriculados
) VALUES
-- Tenant 1 Turmas
('11111111-1111-4111-a111-000000000010', '11111111-1111-4111-a111-111111111111', '9º Ano A', '2026', 'MANHA', 'FUNDAMENTAL_2', 35, 10),
('11111111-1111-4111-a111-000000000020', '11111111-1111-4111-a111-111111111111', '3º Ano Médio A', '2026', 'MANHA', 'MEDIO', 40, 5),

-- Tenant 2 Turmas
('22222222-2222-4222-a222-000000000010', '22222222-2222-4222-a222-222222222222', '5º Ano A', '2026', 'TARDE', 'FUNDAMENTAL_1', 30, 10),
('22222222-2222-4222-a222-000000000020', '22222222-2222-4222-a222-222222222222', '6º Ano B', '2026', 'MANHA', 'FUNDAMENTAL_2', 35, 5)
ON CONFLICT (id) DO NOTHING;

-- 5. DISCIPLINAS (3 por Escola)
INSERT INTO public.disciplinas (
  id, tenant_id, turma_id, nome, carga_horaria_semanal, professor_nome
) VALUES
-- Tenant 1 Disciplinas
('11111111-1111-4111-a111-0000000000d1', '11111111-1111-4111-a111-111111111111', '11111111-1111-4111-a111-000000000010', 'Matemática', 5, 'Prof. Marcos Andrade'),
('11111111-1111-4111-a111-0000000000d2', '11111111-1111-4111-a111-111111111111', '11111111-1111-4111-a111-000000000010', 'Língua Portuguesa', 5, 'Profª. Ana Beatriz Viana'),
('11111111-1111-4111-a111-0000000000d3', '11111111-1111-4111-a111-111111111111', '11111111-1111-4111-a111-000000000010', 'História & Filosofia', 3, 'Prof. Ricardo Gomes'),

-- Tenant 2 Disciplinas
('22222222-2222-4222-a222-0000000000d1', '22222222-2222-4222-a222-222222222222', '22222222-2222-4222-a222-000000000010', 'Ciências Naturais', 4, 'Profª. Carla Mendes'),
('22222222-2222-4222-a222-0000000000d2', '22222222-2222-4222-a222-222222222222', '22222222-2222-4222-a222-000000000010', 'Geografia', 3, 'Prof. Eduardo Lima'),
('22222222-2222-4222-a222-0000000000d3', '22222222-2222-4222-a222-222222222222', '22222222-2222-4222-a222-000000000010', 'Língua Inglesa', 3, 'Profª. Juliana Rocha')
ON CONFLICT (id) DO NOTHING;

-- 6. ALUNOS (15 por Escola = 30 no Total)
INSERT INTO public.alunos (
  id, tenant_id, nome, matricula, cpf, data_nascimento, turma_id, turma_nome, responsavel_nome, responsavel_telefone, responsavel_email, status, foto, data_matricula
) VALUES
-- Tenant 1: Colégio Futuro Saber (15 Alunos)
('11111111-1111-4111-a111-000000000101', '11111111-1111-4111-a111-111111111111', 'Gabriel Silva Santos', '2026-001', '123.456.789-01', '2011-05-14', '11111111-1111-4111-a111-000000000010', '9º Ano A', 'Carlos Santos', '(11) 99887-6655', 'carlos.santos@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', '2026-01-15'),
('11111111-1111-4111-a111-000000000102', '11111111-1111-4111-a111-111111111111', 'Sophia Oliveira Lima', '2026-002', '234.567.890-12', '2011-08-22', '11111111-1111-4111-a111-000000000010', '9º Ano A', 'Mariana Oliveira', '(11) 98765-1122', 'mariana.oliveira@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '2026-01-16'),
('11111111-1111-4111-a111-000000000103', '11111111-1111-4111-a111-111111111111', 'Lucas Mendes Costa', '2026-003', '345.678.901-23', '2011-03-10', '11111111-1111-4111-a111-000000000010', '9º Ano A', 'Roberto Costa', '(11) 97654-3344', 'roberto.costa@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '2026-01-18'),
('11111111-1111-4111-a111-000000000104', '11111111-1111-4111-a111-111111111111', 'Alice Ferreira Rocha', '2026-004', '456.789.012-34', '2011-11-03', '11111111-1111-4111-a111-000000000010', '9º Ano A', 'Patricia Rocha', '(11) 99123-4455', 'patricia.rocha@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '2026-01-19'),
('11111111-1111-4111-a111-000000000105', '11111111-1111-4111-a111-111111111111', 'Bernardo Alves Martins', '2026-005', '567.890.123-45', '2011-01-25', '11111111-1111-4111-a111-000000000010', '9º Ano A', 'Fernando Martins', '(11) 98234-5566', 'fernando.martins@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '2026-01-20'),
('11111111-1111-4111-a111-000000000106', '11111111-1111-4111-a111-111111111111', 'Isabella Gomez Castro', '2026-006', '678.901.234-56', '2011-07-19', '11111111-1111-4111-a111-000000000010', '9º Ano A', 'Amanda Castro', '(11) 97345-6677', 'amanda.castro@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', '2026-01-21'),
('11111111-1111-4111-a111-000000000107', '11111111-1111-4111-a111-111111111111', 'Enzo Gabriel Ribeiro', '2026-007', '789.012.345-67', '2011-09-08', '11111111-1111-4111-a111-000000000010', '9º Ano A', 'Gustavo Ribeiro', '(11) 96456-7788', 'gustavo.ribeiro@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', '2026-01-22'),
('11111111-1111-4111-a111-000000000108', '11111111-1111-4111-a111-111111111111', 'Valentina Cardoso Lima', '2026-008', '890.123.456-78', '2011-12-30', '11111111-1111-4111-a111-000000000010', '9º Ano A', 'Renata Lima', '(11) 95567-8899', 'renata.lima@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', '2026-01-23'),
('11111111-1111-4111-a111-000000000109', '11111111-1111-4111-a111-111111111111', 'Miguel Henrique Souza', '2026-009', '901.234.567-89', '2011-04-12', '11111111-1111-4111-a111-000000000010', '9º Ano A', 'Paulo Souza', '(11) 94678-9900', 'paulo.souza@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '2026-01-24'),
('11111111-1111-4111-a111-000000000110', '11111111-1111-4111-a111-111111111111', 'Helena Barbosa Silva', '2026-010', '012.345.678-90', '2011-06-05', '11111111-1111-4111-a111-000000000010', '9º Ano A', 'Camila Silva', '(11) 93789-0011', 'camila.silva@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', '2026-01-25'),
('11111111-1111-4111-a111-000000000111', '11111111-1111-4111-a111-111111111111', 'Heitor Vasconcelos Ramos', '2026-011', '111.222.333-44', '2008-02-14', '11111111-1111-4111-a111-000000000020', '3º Ano Médio A', 'Marcos Ramos', '(11) 92890-1122', 'marcos.ramos@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', '2026-01-10'),
('11111111-1111-4111-a111-000000000112', '11111111-1111-4111-a111-111111111111', 'Laura Antunes Dias', '2026-012', '222.333.444-55', '2008-08-20', '11111111-1111-4111-a111-000000000020', '3º Ano Médio A', 'Vanessa Dias', '(11) 91901-2233', 'vanessa.dias@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '2026-01-11'),
('11111111-1111-4111-a111-000000000113', '11111111-1111-4111-a111-111111111111', 'Davi Lucca Nogueira', '2026-013', '333.444.555-66', '2008-05-09', '11111111-1111-4111-a111-000000000020', '3º Ano Médio A', 'Rodrigo Nogueira', '(11) 99012-3344', 'rodrigo.nogueira@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', '2026-01-12'),
('11111111-1111-4111-a111-000000000114', '11111111-1111-4111-a111-111111111111', 'Manuela Farias Cruz', '2026-014', '444.555.666-77', '2008-10-17', '11111111-1111-4111-a111-000000000020', '3º Ano Médio A', 'Juliana Cruz', '(11) 98123-4455', 'juliana.cruz@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '2026-01-13'),
('11111111-1111-4111-a111-000000000115', '11111111-1111-4111-a111-111111111111', 'Pedro Henrique Araujo', '2026-015', '555.666.777-88', '2008-04-03', '11111111-1111-4111-a111-000000000020', '3º Ano Médio A', 'Alexandre Araujo', '(11) 97234-5566', 'alexandre.araujo@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '2026-01-14'),

-- Tenant 2: Escola Aprendiz do Amanhã (15 Alunos)
('22222222-2222-4222-a222-000000000201', '22222222-2222-4222-a222-222222222222', 'Beatriz Ferreira Souza', '2026-101', '456.789.012-34', '2015-11-05', '22222222-2222-4222-a222-000000000010', '5º Ano A', 'Patricia Souza', '(21) 98877-5544', 'patricia.souza@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '2026-01-20'),
('22222222-2222-4222-a222-000000000202', '22222222-2222-4222-a222-222222222222', 'Caio Eduardo Monteiro', '2026-102', '567.890.123-45', '2015-03-14', '22222222-2222-4222-a222-000000000010', '5º Ano A', 'Wagner Monteiro', '(21) 97766-4433', 'wagner.monteiro@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '2026-01-21'),
('22222222-2222-4222-a222-000000000203', '22222222-2222-4222-a222-222222222222', 'Maria Clara Resende', '2026-103', '678.901.234-56', '2015-08-29', '22222222-2222-4222-a222-000000000010', '5º Ano A', 'Luciana Resende', '(21) 96655-3322', 'luciana.resende@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', '2026-01-22'),
('22222222-2222-4222-a222-000000000204', '22222222-2222-4222-a222-222222222222', 'Matheus Felipe Xavier', '2026-104', '789.012.345-67', '2015-01-18', '22222222-2222-4222-a222-000000000010', '5º Ano A', 'Sergio Xavier', '(21) 95544-2211', 'sergio.xavier@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', '2026-01-23'),
('22222222-2222-4222-a222-000000000205', '22222222-2222-4222-a222-222222222222', 'Julia Vitoria Carvalho', '2026-105', '890.123.456-78', '2015-06-11', '22222222-2222-4222-a222-000000000010', '5º Ano A', 'Claudia Carvalho', '(21) 94433-1100', 'claudia.carvalho@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', '2026-01-24'),
('22222222-2222-4222-a222-000000000206', '22222222-2222-4222-a222-222222222222', 'Nicolas Alexander Reis', '2026-106', '901.234.567-89', '2015-09-02', '22222222-2222-4222-a222-000000000010', '5º Ano A', 'Andre Reis', '(21) 93322-0099', 'andre.reis@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '2026-01-25'),
('22222222-2222-4222-a222-000000000207', '22222222-2222-4222-a222-222222222222', 'Lorena Paes de Andrade', '2026-107', '012.345.678-90', '2015-12-15', '22222222-2222-4222-a222-000000000010', '5º Ano A', 'Monica Andrade', '(21) 92211-9988', 'monica.andrade@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', '2026-01-26'),
('22222222-2222-4222-a222-000000000208', '22222222-2222-4222-a222-222222222222', 'Arthur Vinicius Freitas', '2026-108', '123.987.654-32', '2015-04-07', '22222222-2222-4222-a222-000000000010', '5º Ano A', 'Marcelo Freitas', '(21) 91100-8877', 'marcelo.freitas@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', '2026-01-27'),
('22222222-2222-4222-a222-000000000209', '22222222-2222-4222-a222-222222222222', 'Clara Beatriz Peixoto', '2026-109', '234.876.543-21', '2015-07-23', '22222222-2222-4222-a222-000000000010', '5º Ano A', 'Teresa Peixoto', '(21) 99988-7766', 'teresa.peixoto@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '2026-01-28'),
('22222222-2222-4222-a222-000000000210', '22222222-2222-4222-a222-222222222222', 'Samuel Oliveira Guimarães', '2026-110', '345.765.432-10', '2015-10-31', '22222222-2222-4222-a222-000000000010', '5º Ano A', 'Bruno Guimarães', '(21) 98877-6655', 'bruno.guimaraes@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', '2026-01-29'),
('22222222-2222-4222-a222-000000000211', '22222222-2222-4222-a222-222222222222', 'Alice Vitoria Moreira', '2026-111', '666.777.888-99', '2014-03-21', '22222222-2222-4222-a222-000000000020', '6º Ano B', 'Fernanda Moreira', '(21) 97766-5544', 'fernanda.moreira@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '2026-01-15'),
('22222222-2222-4222-a222-000000000212', '22222222-2222-4222-a222-222222222222', 'Benício Cesar Fonseca', '2026-112', '777.888.999-00', '2014-09-09', '22222222-2222-4222-a222-000000000020', '6º Ano B', 'Daniel Fonseca', '(21) 96655-4433', 'daniel.fonseca@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '2026-01-16'),
('22222222-2222-4222-a222-000000000213', '22222222-2222-4222-a222-222222222222', 'Yasmin Cristina Teles', '2026-113', '888.999.000-11', '2014-06-17', '22222222-2222-4222-a222-000000000020', '6º Ano B', 'Priscila Teles', '(21) 95544-3322', 'priscila.teles@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '2026-01-17'),
('22222222-2222-4222-a222-000000000214', '22222222-2222-4222-a222-222222222222', 'Lorenzo Gabriel Duarte', '2026-114', '999.000.111-22', '2014-01-04', '22222222-2222-4222-a222-000000000020', '6º Ano B', 'Eduardo Duarte', '(21) 94433-2211', 'eduardo.duarte@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '2026-01-18'),
('22222222-2222-4222-a222-000000000215', '22222222-2222-4222-a222-222222222222', 'Lara Giovanna Mendonça', '2026-115', '000.111.222-33', '2014-11-28', '22222222-2222-4222-a222-000000000020', '6º Ano B', 'Tatiana Mendonça', '(21) 93322-1100', 'tatiana.mendonca@email.com', 'ATIVO', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', '2026-01-19')
ON CONFLICT (id) DO NOTHING;

-- 7. NOTAS
INSERT INTO public.notas (
  id, tenant_id, turma_id, disciplina_id, aluno_id, bimestre, nota, faltas_totais, av1, av2, atividades
) VALUES
('11111111-1111-4111-a111-000000000f01', '11111111-1111-4111-a111-111111111111', '11111111-1111-4111-a111-000000000010', '11111111-1111-4111-a111-0000000000d1', '11111111-1111-4111-a111-000000000101', 1, 8.50, 1, 8.50, 9.00, 8.00),
('11111111-1111-4111-a111-000000000f02', '11111111-1111-4111-a111-111111111111', '11111111-1111-4111-a111-000000000010', '11111111-1111-4111-a111-0000000000d1', '11111111-1111-4111-a111-000000000102', 1, 9.70, 0, 9.50, 10.00, 9.60),
('11111111-1111-4111-a111-000000000f03', '11111111-1111-4111-a111-111111111111', '11111111-1111-4111-a111-000000000010', '11111111-1111-4111-a111-0000000000d1', '11111111-1111-4111-a111-000000000103', 1, 6.30, 3, 6.00, 6.50, 6.40),
('22222222-2222-4222-a222-000000000f01', '22222222-2222-4222-a222-222222222222', '22222222-2222-4222-a222-000000000010', '22222222-2222-4222-a222-0000000000d1', '22222222-2222-4222-a222-000000000201', 1, 9.00, 0, 9.00, 9.00, 9.00)
ON CONFLICT (id) DO NOTHING;

-- 8. COBRANÇAS PIX DOS ALUNOS
INSERT INTO public.cobrancas (
  id, tenant_id, aluno_id, aluno_nome, responsavel_nome, responsavel_telefone, responsavel_email, valor, vencimento, status, tipo, referencia, codigo_pix, qr_code_pix
) VALUES
('11111111-1111-4111-a111-000000000c01', '11111111-1111-4111-a111-111111111111', '11111111-1111-4111-a111-000000000101', 'Gabriel Silva Santos', 'Carlos Santos', '(11) 99887-6655', 'carlos.santos@email.com', 990.00, '2026-08-10', 'PAGO', 'MENSALIDADE', 'Mensalidade Agosto/2026', '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-4266141740005204000053039865405990.005802BR5925Futuro Saber Edu6009Sao Paulo62070503***6304E2CA', 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=EduGestaoPIXDemo'),
('11111111-1111-4111-a111-000000000c02', '11111111-1111-4111-a111-111111111111', '11111111-1111-4111-a111-000000000102', 'Sophia Oliveira Lima', 'Mariana Oliveira', '(11) 98765-1122', 'mariana.oliveira@email.com', 990.00, '2026-09-10', 'PENDENTE', 'MENSALIDADE', 'Mensalidade Setembro/2026', '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-4266141740005204000053039865405990.005802BR5925Futuro Saber Edu6009Sao Paulo62070503***6304E2CA', 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=EduGestaoPIXDemo'),
('22222222-2222-4222-a222-000000000c01', '22222222-2222-4222-a222-222222222222', '22222222-2222-4222-a222-000000000201', 'Beatriz Ferreira Souza', 'Patricia Souza', '(21) 98877-5544', 'patricia.souza@email.com', 490.00, '2026-08-10', 'ATRASADO', 'MENSALIDADE', 'Mensalidade Agosto/2026', '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-4266141740005204000053039865405490.005802BR5925Aprendiz Edu6009RIO DE JANEIRO62070503***6304C5D6', 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=EduGestaoPIXDemo')
ON CONFLICT (id) DO NOTHING;
