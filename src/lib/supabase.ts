import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Cliente Supabase para uso no browser (client components). Só pode
 * usar a chave `anon`, nunca a `service_role`.
 *
 * Retorna `null` (com um aviso no console) enquanto as variáveis de
 * ambiente não estiverem configuradas, para o funil continuar
 * funcionando em desenvolvimento antes de você criar o projeto Supabase.
 */
export function getSupabaseBrowserClient() {
  if (!url || !anonKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY não configuradas — ver .env.local.example"
      );
    }
    return null;
  }
  return createClient(url, anonKey);
}
