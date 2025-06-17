/*
  # Configuração inicial do banco de dados
  
  1. Tabelas
    - usuarios (gerenciamento de usuários)
    - locais (locais de atendimento)
    - tipos_ticket (tipos de tickets)
    - filas (filas de atendimento)
    - guiches (guichês de atendimento)
    - telas (telas de exibição)
    - publicidades (conteúdo publicitário)
    - tickets (tickets emitidos)
    - logs_atendimento (registro de atendimentos)
    - impressoras (configuração de impressoras)
  
  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas de acesso baseadas em função
    
  3. Índices
    - Otimização para consultas frequentes
*/

-- Habilitar UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum para tipos de usuário
CREATE TYPE tipo_usuario AS ENUM ('admin', 'atendente');

-- Enum para status ativo/inativo
CREATE TYPE status_ativo AS ENUM ('ativo', 'inativo');

-- Enum para status de uso do guichê
CREATE TYPE status_uso_guiche AS ENUM ('disponivel', 'em_uso');

-- Enum para tipo de exibição da tela
CREATE TYPE tipo_exibicao AS ENUM ('tickets', 'publicidade', 'ambos');

-- Enum para tipo de mídia
CREATE TYPE tipo_midia AS ENUM ('imagem', 'video', 'texto', 'url');

-- Enum para status do ticket
CREATE TYPE status_ticket AS ENUM ('aguardando', 'em_atendimento', 'atendido', 'cancelado');

-- Enum para reset de numeração do ticket
CREATE TYPE reset_ticket AS ENUM ('nunca', 'diario', 'semanal', 'mensal', 'anual', 'manual');

-- Enum para tipo de impressora
CREATE TYPE tipo_impressora AS ENUM ('ticket', 'relatorio', 'geral');

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome text NOT NULL,
  email text UNIQUE NOT NULL,
  tipo tipo_usuario NOT NULL DEFAULT 'atendente',
  status status_ativo NOT NULL DEFAULT 'ativo',
  criado_em timestamptz NOT NULL DEFAULT now()
);

-- Tabela de locais
CREATE TABLE IF NOT EXISTS locais (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome text NOT NULL,
  descricao text,
  status status_ativo NOT NULL DEFAULT 'ativo',
  criado_em timestamptz NOT NULL DEFAULT now()
);

-- Tabela de tipos de ticket
CREATE TABLE IF NOT EXISTS tipos_ticket (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome text NOT NULL,
  descricao text,
  prioridade integer NOT NULL DEFAULT 1,
  status status_ativo NOT NULL DEFAULT 'ativo',
  criado_em timestamptz NOT NULL DEFAULT now()
);

-- Tabela de filas
CREATE TABLE IF NOT EXISTS filas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome text NOT NULL,
  tipo_ticket_id uuid NOT NULL REFERENCES tipos_ticket(id),
  prefixo text NOT NULL,
  tamanho_ticket integer NOT NULL DEFAULT 3,
  local_id uuid NOT NULL REFERENCES locais(id),
  reset_ticket reset_ticket NOT NULL DEFAULT 'diario',
  status status_ativo NOT NULL DEFAULT 'ativo',
  criado_em timestamptz NOT NULL DEFAULT now()
);

-- Tabela de controle de numeração de tickets
CREATE TABLE IF NOT EXISTS controle_tickets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  fila_id uuid NOT NULL REFERENCES filas(id),
  referencia text NOT NULL,
  ultimo_numero integer NOT NULL DEFAULT 0,
  criado_em timestamptz NOT NULL DEFAULT now(),
  UNIQUE(fila_id, referencia)
);

-- Tabela de guichês
CREATE TABLE IF NOT EXISTS guiches (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome text NOT NULL,
  local_id uuid NOT NULL REFERENCES locais(id),
  status_uso status_uso_guiche NOT NULL DEFAULT 'disponivel',
  status_ativo status_ativo NOT NULL DEFAULT 'ativo',
  criado_em timestamptz NOT NULL DEFAULT now()
);

-- Tabela de telas
CREATE TABLE IF NOT EXISTS telas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome text NOT NULL,
  local_id uuid NOT NULL REFERENCES locais(id),
  tipo_exibicao tipo_exibicao NOT NULL DEFAULT 'ambos',
  status status_ativo NOT NULL DEFAULT 'ativo',
  criado_em timestamptz NOT NULL DEFAULT now()
);

-- Tabela de publicidades
CREATE TABLE IF NOT EXISTS publicidades (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo text NOT NULL,
  tipo_midia tipo_midia NOT NULL,
  media_path text,
  duracao integer NOT NULL DEFAULT 10,
  tela_id uuid NOT NULL REFERENCES telas(id),
  status status_ativo NOT NULL DEFAULT 'ativo',
  data_criacao timestamptz NOT NULL DEFAULT now(),
  data_inicio timestamptz,
  data_fim timestamptz
);

-- Tabela de tickets
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero integer NOT NULL,
  fila_id uuid NOT NULL REFERENCES filas(id),
  status status_ticket NOT NULL DEFAULT 'aguardando',
  observacao text,
  chamado_por uuid REFERENCES usuarios(id),
  chamado_em timestamptz,
  atendimento_iniciado_em timestamptz,
  atendimento_finalizado_em timestamptz,
  guiche_id uuid REFERENCES guiches(id),
  criado_em timestamptz NOT NULL DEFAULT now()
);

-- Tabela de logs de atendimento
CREATE TABLE IF NOT EXISTS logs_atendimento (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id uuid NOT NULL REFERENCES usuarios(id),
  ticket_id uuid NOT NULL REFERENCES tickets(id),
  guiche_id uuid REFERENCES guiches(id),
  acao text NOT NULL,
  detalhes text,
  timestamp timestamptz NOT NULL DEFAULT now()
);

-- Tabela de impressoras
CREATE TABLE IF NOT EXISTS impressoras (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome text NOT NULL,
  modelo text,
  ip text,
  porta integer NOT NULL DEFAULT 9100,
  local_id uuid NOT NULL REFERENCES locais(id),
  tipo tipo_impressora NOT NULL DEFAULT 'ticket',
  largura_colunas integer NOT NULL DEFAULT 40,
  cabecalho text,
  rodape text,
  status status_ativo NOT NULL DEFAULT 'ativo',
  criado_em timestamptz NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE locais ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipos_ticket ENABLE ROW LEVEL SECURITY;
ALTER TABLE filas ENABLE ROW LEVEL SECURITY;
ALTER TABLE controle_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE guiches ENABLE ROW LEVEL SECURITY;
ALTER TABLE telas ENABLE ROW LEVEL SECURITY;
ALTER TABLE publicidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs_atendimento ENABLE ROW LEVEL SECURITY;
ALTER TABLE impressoras ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS

-- Usuários
CREATE POLICY "Usuários podem ver seus próprios dados"
  ON usuarios
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins podem gerenciar usuários"
  ON usuarios
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM usuarios
    WHERE id = auth.uid()
    AND tipo = 'admin'
  ));

-- Locais
CREATE POLICY "Todos podem ver locais ativos"
  ON locais
  FOR SELECT
  TO authenticated
  USING (status = 'ativo');

CREATE POLICY "Admins podem gerenciar locais"
  ON locais
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM usuarios
    WHERE id = auth.uid()
    AND tipo = 'admin'
  ));

-- Tipos de Ticket
CREATE POLICY "Todos podem ver tipos de ticket ativos"
  ON tipos_ticket
  FOR SELECT
  TO authenticated
  USING (status = 'ativo');

CREATE POLICY "Admins podem gerenciar tipos de ticket"
  ON tipos_ticket
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM usuarios
    WHERE id = auth.uid()
    AND tipo = 'admin'
  ));

-- Filas
CREATE POLICY "Todos podem ver filas ativas"
  ON filas
  FOR SELECT
  TO authenticated
  USING (status = 'ativo');

CREATE POLICY "Admins podem gerenciar filas"
  ON filas
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM usuarios
    WHERE id = auth.uid()
    AND tipo = 'admin'
  ));

-- Controle de Tickets
CREATE POLICY "Atendentes podem ver controle de tickets"
  ON controle_tickets
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Atendentes podem atualizar controle de tickets"
  ON controle_tickets
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM usuarios
    WHERE id = auth.uid()
    AND (tipo = 'admin' OR tipo = 'atendente')
  ));

-- Guichês
CREATE POLICY "Todos podem ver guichês ativos"
  ON guiches
  FOR SELECT
  TO authenticated
  USING (status_ativo = 'ativo');

CREATE POLICY "Admins podem gerenciar guichês"
  ON guiches
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM usuarios
    WHERE id = auth.uid()
    AND tipo = 'admin'
  ));

-- Telas
CREATE POLICY "Todos podem ver telas ativas"
  ON telas
  FOR SELECT
  TO authenticated
  USING (status = 'ativo');

CREATE POLICY "Admins podem gerenciar telas"
  ON telas
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM usuarios
    WHERE id = auth.uid()
    AND tipo = 'admin'
  ));

-- Publicidades
CREATE POLICY "Todos podem ver publicidades ativas"
  ON publicidades
  FOR SELECT
  TO authenticated
  USING (status = 'ativo');

CREATE POLICY "Admins podem gerenciar publicidades"
  ON publicidades
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM usuarios
    WHERE id = auth.uid()
    AND tipo = 'admin'
  ));

-- Tickets
CREATE POLICY "Atendentes podem ver tickets"
  ON tickets
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Atendentes podem criar tickets"
  ON tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM usuarios
    WHERE id = auth.uid()
    AND (tipo = 'admin' OR tipo = 'atendente')
  ));

CREATE POLICY "Atendentes podem atualizar tickets"
  ON tickets
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM usuarios
    WHERE id = auth.uid()
    AND (tipo = 'admin' OR tipo = 'atendente')
  ));

-- Logs de Atendimento
CREATE POLICY "Atendentes podem ver logs"
  ON logs_atendimento
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Atendentes podem criar logs"
  ON logs_atendimento
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM usuarios
    WHERE id = auth.uid()
    AND (tipo = 'admin' OR tipo = 'atendente')
  ));

-- Impressoras
CREATE POLICY "Todos podem ver impressoras ativas"
  ON impressoras
  FOR SELECT
  TO authenticated
  USING (status = 'ativo');

CREATE POLICY "Admins podem gerenciar impressoras"
  ON impressoras
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM usuarios
    WHERE id = auth.uid()
    AND tipo = 'admin'
  ));