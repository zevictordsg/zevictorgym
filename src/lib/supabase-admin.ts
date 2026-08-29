import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
