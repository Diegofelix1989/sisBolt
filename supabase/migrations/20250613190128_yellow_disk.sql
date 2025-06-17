/*
  # Sistema Multi-Empresa
  
  1. Nova Estrutura
    - `empresas` (empresas do sistema)
    - Adicionar `empresa_id` em todas as tabelas relevantes
    - Novo tipo de usuário `master_admin`
    - Políticas RLS atualizadas para multi-empresa
  
  2. Segurança
    - Isolamento completo entre empresas
    - Admin master pode ver tudo
    - Admins de empresa só veem sua empresa
    - Atendentes só veem dados de sua empresa
  
  3. Migração
    - Preservar dados existentes
    - Criar empresa padrão
    - Associar dados existentes à empresa padrão
*/

-- Novo enum para tipos de usuário incluindo master admin
ALTER TYPE tipo_usuario ADD VALUE IF NOT EXISTS 'master_admin';

-- Tabela de empresas
CREATE TABLE IF NOT EXISTS empresas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome text NOT NULL,
  cnpj text UNIQUE,
  email text,
  telefone text,
  endereco text,
  cidade text,
  estado text,
  cep text,
  logo_url text,
  status status_ativo NOT NULL DEFAULT 'ativo',
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

-- Adicionar empresa_id nas tabelas existentes
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS empresa_id uuid REFERENCES empresas(id);
ALTER TABLE locais ADD COLUMN IF NOT EXISTS empresa_id uuid REFERENCES empresas(id);
ALTER TABLE tipos_ticket ADD COLUMN IF NOT EXISTS empresa_id uuid REFERENCES empresas(id);
ALTER TABLE filas ADD COLUMN IF NOT EXISTS empresa_id uuid REFERENCES empresas(id);
ALTER TABLE guiches ADD COLUMN IF NOT EXISTS empresa_id uuid REFERENCES empresas(id);
ALTER TABLE telas ADD COLUMN IF NOT EXISTS empresa_id uuid REFERENCES empresas(id);
ALTER TABLE publicidades ADD COLUMN IF NOT EXISTS empresa_id uuid REFERENCES empresas(id);
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS empresa_id uuid REFERENCES empresas(id);
ALTER TABLE impressoras ADD COLUMN IF NOT EXISTS empresa_id uuid REFERENCES empresas(id);

-- Criar empresa padrão
INSERT INTO empresas (id, nome, cnpj, email, status)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Empresa Padrão',
  '00.000.000/0001-00',
  'contato@empresapadrao.com',
  'ativo'
) ON CONFLICT (id) DO NOTHING;

-- Associar dados existentes à empresa padrão
UPDATE usuarios SET empresa_id = '00000000-0000-0000-0000-000000000001' WHERE empresa_id IS NULL;
UPDATE locais SET empresa_id = '00000000-0000-0000-0000-000000000001' WHERE empresa_id IS NULL;
UPDATE tipos_ticket SET empresa_id = '00000000-0000-0000-0000-000000000001' WHERE empresa_id IS NULL;
UPDATE filas SET empresa_id = '00000000-0000-0000-0000-000000000001' WHERE empresa_id IS NULL;
UPDATE guiches SET empresa_id = '00000000-0000-0000-0000-000000000001' WHERE empresa_id IS NULL;
UPDATE telas SET empresa_id = '00000000-0000-0000-0000-000000000001' WHERE empresa_id IS NULL;
UPDATE publicidades SET empresa_id = '00000000-0000-0000-0000-000000000001' WHERE empresa_id IS NULL;
UPDATE tickets SET empresa_id = '00000000-0000-0000-0000-000000000001' WHERE empresa_id IS NULL;
UPDATE impressoras SET empresa_id = '00000000-0000-0000-0000-000000000001' WHERE empresa_id IS NULL;

-- Tornar empresa_id obrigatório (exceto para master_admin)
ALTER TABLE usuarios ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE locais ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE tipos_ticket ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE filas ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE guiches ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE telas ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE publicidades ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE tickets ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE impressoras ALTER COLUMN empresa_id SET NOT NULL;

-- Habilitar RLS na tabela empresas
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;

-- Função para verificar se é master admin
CREATE OR REPLACE FUNCTION is_master_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM usuarios
    WHERE id = auth.uid()
    AND tipo = 'master_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter empresa do usuário
CREATE OR REPLACE FUNCTION get_user_empresa_id()
RETURNS uuid AS $$
BEGIN
  RETURN (
    SELECT empresa_id FROM usuarios
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas RLS atualizadas para multi-empresa

-- Empresas
DROP POLICY IF EXISTS "Usuários podem ver suas empresas" ON empresas;
CREATE POLICY "Usuários podem ver suas empresas"
  ON empresas
  FOR SELECT
  TO authenticated
  USING (
    is_master_admin() OR 
    id = get_user_empresa_id()
  );

DROP POLICY IF EXISTS "Master admin pode gerenciar empresas" ON empresas;
CREATE POLICY "Master admin pode gerenciar empresas"
  ON empresas
  TO authenticated
  USING (is_master_admin());

-- Usuários
DROP POLICY IF EXISTS "Usuários podem ver seus próprios dados" ON usuarios;
CREATE POLICY "Usuários podem ver dados da empresa"
  ON usuarios
  FOR SELECT
  TO authenticated
  USING (
    is_master_admin() OR 
    empresa_id = get_user_empresa_id()
  );

DROP POLICY IF EXISTS "Admins podem gerenciar usuários" ON usuarios;
CREATE POLICY "Admins podem gerenciar usuários da empresa"
  ON usuarios
  TO authenticated
  USING (
    is_master_admin() OR 
    (empresa_id = get_user_empresa_id() AND EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid()
      AND tipo = 'admin'
    ))
  );

-- Locais
DROP POLICY IF EXISTS "Todos podem ver locais ativos" ON locais;
CREATE POLICY "Usuários podem ver locais da empresa"
  ON locais
  FOR SELECT
  TO authenticated
  USING (
    is_master_admin() OR 
    empresa_id = get_user_empresa_id()
  );

DROP POLICY IF EXISTS "Admins podem gerenciar locais" ON locais;
CREATE POLICY "Admins podem gerenciar locais da empresa"
  ON locais
  TO authenticated
  USING (
    is_master_admin() OR 
    (empresa_id = get_user_empresa_id() AND EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid()
      AND tipo = 'admin'
    ))
  );

-- Tipos de Ticket
DROP POLICY IF EXISTS "Todos podem ver tipos de ticket ativos" ON tipos_ticket;
CREATE POLICY "Usuários podem ver tipos de ticket da empresa"
  ON tipos_ticket
  FOR SELECT
  TO authenticated
  USING (
    is_master_admin() OR 
    empresa_id = get_user_empresa_id()
  );

DROP POLICY IF EXISTS "Admins podem gerenciar tipos de ticket" ON tipos_ticket;
CREATE POLICY "Admins podem gerenciar tipos de ticket da empresa"
  ON tipos_ticket
  TO authenticated
  USING (
    is_master_admin() OR 
    (empresa_id = get_user_empresa_id() AND EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid()
      AND tipo = 'admin'
    ))
  );

-- Filas
DROP POLICY IF EXISTS "Todos podem ver filas ativas" ON filas;
CREATE POLICY "Usuários podem ver filas da empresa"
  ON filas
  FOR SELECT
  TO authenticated
  USING (
    is_master_admin() OR 
    empresa_id = get_user_empresa_id()
  );

DROP POLICY IF EXISTS "Admins podem gerenciar filas" ON filas;
CREATE POLICY "Admins podem gerenciar filas da empresa"
  ON filas
  TO authenticated
  USING (
    is_master_admin() OR 
    (empresa_id = get_user_empresa_id() AND EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid()
      AND tipo = 'admin'
    ))
  );

-- Guichês
DROP POLICY IF EXISTS "Todos podem ver guichês ativos" ON guiches;
CREATE POLICY "Usuários podem ver guichês da empresa"
  ON guiches
  FOR SELECT
  TO authenticated
  USING (
    is_master_admin() OR 
    empresa_id = get_user_empresa_id()
  );

DROP POLICY IF EXISTS "Admins podem gerenciar guichês" ON guiches;
CREATE POLICY "Admins podem gerenciar guichês da empresa"
  ON guiches
  TO authenticated
  USING (
    is_master_admin() OR 
    (empresa_id = get_user_empresa_id() AND EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid()
      AND tipo = 'admin'
    ))
  );

-- Telas
DROP POLICY IF EXISTS "Todos podem ver telas ativas" ON telas;
CREATE POLICY "Usuários podem ver telas da empresa"
  ON telas
  FOR SELECT
  TO authenticated
  USING (
    is_master_admin() OR 
    empresa_id = get_user_empresa_id()
  );

DROP POLICY IF EXISTS "Admins podem gerenciar telas" ON telas;
CREATE POLICY "Admins podem gerenciar telas da empresa"
  ON telas
  TO authenticated
  USING (
    is_master_admin() OR 
    (empresa_id = get_user_empresa_id() AND EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid()
      AND tipo = 'admin'
    ))
  );

-- Publicidades
DROP POLICY IF EXISTS "Todos podem ver publicidades ativas" ON publicidades;
CREATE POLICY "Usuários podem ver publicidades da empresa"
  ON publicidades
  FOR SELECT
  TO authenticated
  USING (
    is_master_admin() OR 
    empresa_id = get_user_empresa_id()
  );

DROP POLICY IF EXISTS "Admins podem gerenciar publicidades" ON publicidades;
CREATE POLICY "Admins podem gerenciar publicidades da empresa"
  ON publicidades
  TO authenticated
  USING (
    is_master_admin() OR 
    (empresa_id = get_user_empresa_id() AND EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid()
      AND tipo = 'admin'
    ))
  );

-- Tickets
DROP POLICY IF EXISTS "Atendentes podem ver tickets" ON tickets;
CREATE POLICY "Usuários podem ver tickets da empresa"
  ON tickets
  FOR SELECT
  TO authenticated
  USING (
    is_master_admin() OR 
    empresa_id = get_user_empresa_id()
  );

DROP POLICY IF EXISTS "Atendentes podem criar tickets" ON tickets;
CREATE POLICY "Usuários podem criar tickets da empresa"
  ON tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    is_master_admin() OR 
    (empresa_id = get_user_empresa_id() AND EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid()
      AND (tipo = 'admin' OR tipo = 'atendente')
    ))
  );

DROP POLICY IF EXISTS "Atendentes podem atualizar tickets" ON tickets;
CREATE POLICY "Usuários podem atualizar tickets da empresa"
  ON tickets
  FOR UPDATE
  TO authenticated
  USING (
    is_master_admin() OR 
    (empresa_id = get_user_empresa_id() AND EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid()
      AND (tipo = 'admin' OR tipo = 'atendente')
    ))
  );

-- Logs de Atendimento
DROP POLICY IF EXISTS "Atendentes podem ver logs" ON logs_atendimento;
CREATE POLICY "Usuários podem ver logs da empresa"
  ON logs_atendimento
  FOR SELECT
  TO authenticated
  USING (
    is_master_admin() OR 
    EXISTS (
      SELECT 1 FROM tickets t
      WHERE t.id = ticket_id
      AND t.empresa_id = get_user_empresa_id()
    )
  );

DROP POLICY IF EXISTS "Atendentes podem criar logs" ON logs_atendimento;
CREATE POLICY "Usuários podem criar logs da empresa"
  ON logs_atendimento
  FOR INSERT
  TO authenticated
  WITH CHECK (
    is_master_admin() OR 
    EXISTS (
      SELECT 1 FROM tickets t
      WHERE t.id = ticket_id
      AND t.empresa_id = get_user_empresa_id()
      AND EXISTS (
        SELECT 1 FROM usuarios
        WHERE id = auth.uid()
        AND (tipo = 'admin' OR tipo = 'atendente')
      )
    )
  );

-- Impressoras
DROP POLICY IF EXISTS "Todos podem ver impressoras ativas" ON impressoras;
CREATE POLICY "Usuários podem ver impressoras da empresa"
  ON impressoras
  FOR SELECT
  TO authenticated
  USING (
    is_master_admin() OR 
    empresa_id = get_user_empresa_id()
  );

DROP POLICY IF EXISTS "Admins podem gerenciar impressoras" ON impressoras;
CREATE POLICY "Admins podem gerenciar impressoras da empresa"
  ON impressoras
  TO authenticated
  USING (
    is_master_admin() OR 
    (empresa_id = get_user_empresa_id() AND EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid()
      AND tipo = 'admin'
    ))
  );

-- Índices para otimização
CREATE INDEX IF NOT EXISTS idx_usuarios_empresa_id ON usuarios(empresa_id);
CREATE INDEX IF NOT EXISTS idx_locais_empresa_id ON locais(empresa_id);
CREATE INDEX IF NOT EXISTS idx_tipos_ticket_empresa_id ON tipos_ticket(empresa_id);
CREATE INDEX IF NOT EXISTS idx_filas_empresa_id ON filas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_guiches_empresa_id ON guiches(empresa_id);
CREATE INDEX IF NOT EXISTS idx_telas_empresa_id ON telas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_publicidades_empresa_id ON publicidades(empresa_id);
CREATE INDEX IF NOT EXISTS idx_tickets_empresa_id ON tickets(empresa_id);
CREATE INDEX IF NOT EXISTS idx_impressoras_empresa_id ON impressoras(empresa_id);

-- Trigger para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_empresas_updated_at BEFORE UPDATE ON empresas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();