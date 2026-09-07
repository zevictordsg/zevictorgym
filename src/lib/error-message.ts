/**
 * Extrai uma mensagem legível de um valor capturado num catch(error).
 *
 * `error instanceof Error ? error.message : "erro desconhecido"` (o padrão
 * usado nas rotas antes) esconde a mensagem real sempre que o valor
 * lançado não é uma instância de `Error` de verdade — é exatamente o caso
 * dos erros do Supabase (`PostgrestError`, e em algumas versões
 * `AuthError`), que chegam como objetos simples com `{ message, code,
 * details, hint }` em vez de subclasses de `Error`. Isso fazia
 * `/api/stripe/webhook` e `/api/enroll` logarem só "erro desconhecido" pro
 * Vercel, escondendo o motivo real da falha (ex: erro de constraint, RLS,
 * etc.) bem na hora que mais precisávamos ver.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;

  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message) return message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "erro desconhecido (valor não serializável)";
  }
}
