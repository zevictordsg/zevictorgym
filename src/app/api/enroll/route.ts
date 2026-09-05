import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { grantCarbbAccess } from "@/lib/carbb";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Caminho gratuito da oferta final ("Quero apenas baixar o PDF"): cria (ou
 * reaproveita) a conta na área de membros (carbb) já liberando o módulo
 * "pdf", e devolve a senha gerada pra tela de sucesso mostrar — síncrono,
 * sem precisar de webhook (isso só existe no caminho pago, via Stripe).
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "corpo inválido" }, { status: 400 });
  }

  const { email, nome, whatsapp, leadId } = body as {
    email?: string;
    nome?: string;
    whatsapp?: string;
    leadId?: string;
  };

  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!normalizedEmail || !EMAIL_RE.test(normalizedEmail)) {
    return NextResponse.json({ error: "e-mail inválido" }, { status: 400 });
  }

  try {
    const result = await grantCarbbAccess({
      email: normalizedEmail,
      displayName: nome,
      whatsapp,
      products: ["pdf"],
    });

    // Atualiza o lead com o e-mail capturado agora — best effort, não deve
    // impedir a liberação do PDF se o Supabase do funil não estiver
    // configurado ou a chamada falhar por qualquer motivo.
    try {
      const supabase = getSupabaseAdminClient();
      if (leadId) {
        await supabase
          .from("leads")
          .update({ email: normalizedEmail })
          .eq("id", leadId);
      }
    } catch {
      // sem Supabase do funil configurado — ignora.
    }

    return NextResponse.json({
      ok: true,
      email: result.email,
      password: result.password,
      accountCreated: result.accountCreated,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "erro desconhecido";
    console.error("[api/enroll]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
