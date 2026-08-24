-- Execute no SQL Editor do Supabase
-- Se a tabela já existe, rode apenas as linhas de RLS abaixo

CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  area TEXT NOT NULL,
  quadrant INTEGER NOT NULL CHECK (quadrant >= 1 AND quadrant <= 4),
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'Criado'
);

-- Habilita RLS e cria policy de acesso público
-- (necessário para que o Supabase permita leitura e escrita)
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura para todos" ON tickets
  FOR SELECT USING (true);

CREATE POLICY "Permitir inserção para todos" ON tickets
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização para todos" ON tickets
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Permitir exclusão para todos" ON tickets
  FOR DELETE USING (true);
