// lib/supabase.ts
import { createClient } from "@supabase/supabase-js"

// Создаем клиент Supabase для использования на сервере (Server Actions, Route Handlers)
// Используем URL и Service Role Key для доступа с повышенными привилегиями
// Service Role Key НЕ ДОЛЖЕН быть доступен на клиенте!
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Supabase URL or Service Role Key is not set in environment variables.")
  // В продакшене можно выбросить ошибку или принять другие меры
}

export const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!)
