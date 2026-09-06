import "server-only";
import { createClient } from "@supabase/supabase-js";

// `.trim()` é defensivo: variáveis de ambiente coladas em painéis (Vercel,
// etc.) às vezes carregam um espaço/quebra de linha invisível no fim, e o
// Supabase client aceita a URL sem reclamar na hora de criar o client — só
// quebra depois, numa chamada real, com um erro genérico tipo "Invalid path
// specified in request URL" que não aponta pra causa.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

/**
 * Cliente Supabase com a `service_role` key — SOMENTE em route handlers /
 * server actions. Nunca importe este arquivo em um "use client".
 * Ignora RLS, então trate os dados com cuidado.
 */
export function getSupabaseAdminClient() {
  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL ausentes — configure o .env.local (ver .env.local.example)"
    );
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
