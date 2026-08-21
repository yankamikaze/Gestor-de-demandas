-- Execute no SQL Editor do Supabase

CREATE TABLE tickets (
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

-- Policies (caso ative RLS)
-- ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Permitir acesso total temporário" ON tickets FOR ALL USING (true);
