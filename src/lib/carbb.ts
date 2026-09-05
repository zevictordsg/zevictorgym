import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente admin (service_role) do Supabase do OUTRO projeto — a área de
 * membros "carbb" (carbmaxxing.vercel.app), não o Supabase deste funil
 * (leads/funnel_events). Mesmo padrão de "lança erro só quando usado" do
 * `@/lib/supabase-admin`, só que apontando pro projeto certo.
 */
let carbbAdminClient: SupabaseClient | null = null;

function getCarbbAdminClient() {
  if (carbbAdminClient) return carbbAdminClient;

  const url = process.env.CARBB_SUPABASE_URL;
  const serviceRoleKey = process.env.CARBB_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "CARBB_SUPABASE_URL / CARBB_SUPABASE_SERVICE_ROLE_KEY ausentes — configure o .env.local"
    );
  }

  carbbAdminClient = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return carbbAdminClient;
}

export type CarbbProduct = "pdf" | "calculadora";

export type GrantAccessInput = {
  email: string;
  displayName?: string;
  whatsapp?: string;
  /**
   * Produtos a liberar nesta chamada. Quem compra a Calculadora recebe os
   * dois ("pdf" + "calculadora") — essa lista é decidida por quem chama
   * (ver /api/enroll e /api/stripe/webhook), não uma hierarquia aqui dentro.
   */
  products: CarbbProduct[];
  stripeCustomerId?: string;
  stripeCheckoutSessionId?: string;
};

export type GrantAccessResult = {
  email: string;
  /** Só vem preenchida quando a conta é criada agora nesta chamada — uma
   * conta já existente não tem a senha resetada nem exposta de novo. */
  password?: string;
  accountCreated: boolean;
};

function randomPassword() {
  // Nunca digitada por um humano na criação (a pessoa recebe pronta) — só
  // precisa ser forte o bastante. 15 bytes aleatórios em base64url dá uma
  // senha de 20 caracteres.
  const bytes = new Uint8Array(15);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString("base64url");
}

/**
 * O Admin SDK do Supabase não tem "getUserByEmail" direto — pagina
 * listUsers() procurando o e-mail. Funciona bem pro volume atual; se a base
 * crescer muito, dá pra trocar por uma function SQL própria no carbb (ex:
 * RPC que faz `select id from auth.users where email = ...`).
 */
async function findUserByEmail(supabase: SupabaseClient, email: string) {
  const perPage = 200;
  for (let page = 1; page <= 25; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === email);
    if (match) return match;
    if (data.users.length < perPage) return null;
  }
  return null;
}

/**
 * Cria (ou reaproveita) a conta na área de membros e libera os produtos
 * pedidos. Usada tanto pelo caminho gratuito (/api/enroll — só "pdf")
 * quanto pelo webhook do Stripe (["pdf", "calculadora"] depois de pagamento
 * confirmado).
 *
 * Se o e-mail já tiver conta (ex: pegou o PDF grátis antes e agora comprou
 * a Calculadora), NÃO mexe em senha — só atualiza/adiciona os produtos
 * liberados pra esse profile_id existente.
 */
export async function grantCarbbAccess({
  email,
  displayName,
  whatsapp,
  products,
  stripeCustomerId,
  stripeCheckoutSessionId,
}: GrantAccessInput): Promise<GrantAccessResult> {
  const supabase = getCarbbAdminClient();
  const normalizedEmail = email.trim().toLowerCase();

  let userId: string;
  let password: string | undefined;
  let accountCreated = false;

  const candidatePassword = randomPassword();
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email: normalizedEmail,
    password: candidatePassword,
    email_confirm: true,
    user_metadata: {
      ...(displayName ? { display_name: displayName } : {}),
      ...(whatsapp ? { whatsapp } : {}),
    },
  });

  if (createError) {
    const alreadyRegistered =
      createError.code === "email_exists" ||
      createError.code === "user_already_exists" ||
      /already registered|already exists/i.test(createError.message);

    if (!alreadyRegistered) {
      throw createError;
    }

    const existing = await findUserByEmail(supabase, normalizedEmail);
    if (!existing) {
      throw new Error(
        `[carbb] usuário existente não encontrado por e-mail: ${normalizedEmail}`
      );
    }
    userId = existing.id;
  } else {
    userId = created.user.id;
    password = candidatePassword;
    accountCreated = true;
  }

  const rows = products.map((product) => ({
    profile_id: userId,
    product,
    status: "active" as const,
    stripe_customer_id: stripeCustomerId ?? null,
    stripe_checkout_session_id: stripeCheckoutSessionId ?? null,
  }));

  const { error: upsertError } = await supabase
    .from("subscriptions")
    .upsert(rows, { onConflict: "profile_id,product" });

  if (upsertError) {
    throw upsertError;
  }

  return { email: normalizedEmail, password, accountCreated };
}
