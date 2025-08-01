-- scripts/001_create_businesses_table.sql

CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id TEXT NOT NULL UNIQUE, -- Связь с ID пользователя
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  email TEXT,
  business_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Добавляем индекс для owner_id для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_businesses_owner_id ON businesses (owner_id);
