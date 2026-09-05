"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { CheckCircle2, Copy, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Credentials = { email: string; password?: string };

// Definido no .env.local.example / Vercel — URL pública do projeto "carbb"
// (área de membros). Fallback aponta pro deploy atual, sem domínio próprio.
const CARBB_APP_URL =
  process.env.NEXT_PUBLIC_CARBB_APP_URL?.replace(/\/$/, "") || "https://carbmaxxing.vercel.app";

const WHATSAPP_SUPPORT_URL =
  "https://wa.me/5518996026528?text=Salve%20Z%C3%A9%2C%20acabei%20de%20liberar%20meu%20acesso%20e%20preciso%20de%20ajuda!";

const SESSION_STORAGE_KEY = "carbb_credentials";

// Quanto tempo esperar o webhook do Stripe confirmar antes de cair no
// fallback "seu acesso já foi liberado, mas..." — 2s x 20 tentativas = 40s,
// bem mais que o normal (webhook costuma responder em segundos).
const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 20;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export function ObrigadoContent() {
  const [phase, setPhase] = useState<"loading" | "ready" | "timeout" | "missing">("loading");
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [copied, setCopied] = useState(false);
  const attemptsRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    // `await` antes de qualquer setState — mesmo no caminho síncrono
    // (sessionStorage) — pra tirar o setState de dentro do corpo direto do
    // efeito (recomendação do react-hooks/set-state-in-effect: evita o
    // cascading render de um setState síncrono logo no mount).
    async function init() {
      await Promise.resolve();
      if (cancelled) return;

      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");

      // Caminho gratuito — /api/enroll já devolveu a senha na hora, a
      // Screen09FinalOffer só guardou num relay de curtíssima duração
      // (sessionStorage) antes de navegar pra cá.
      if (!sessionId) {
        const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as Credentials;
            setCredentials(parsed);
            setPhase("ready");
            return;
          } catch {
            // segue pro fallback abaixo
          }
        }
        setPhase("missing");
        return;
      }

      // Caminho pago — faz polling em /api/checkout/status até o webhook do
      // Stripe terminar de criar a conta e gravar a senha (ver
      // src/app/api/stripe/webhook/route.ts).
      async function poll() {
        if (cancelled) return;
        attemptsRef.current += 1;

        try {
          const res = await fetch(
            `/api/checkout/status?session_id=${encodeURIComponent(sessionId!)}`
          );
          const data = (await res.json()) as {
            ready?: boolean;
            email?: string;
            password?: string;
          };

          if (cancelled) return;

          if (data.ready && data.email) {
            setCredentials({ email: data.email, password: data.password });
            setPhase("ready");
            return;
          }
        } catch {
          // erro de rede — só tenta de novo no próximo tick
        }

        if (cancelled) return;

        if (attemptsRef.current >= MAX_POLL_ATTEMPTS) {
          setPhase("timeout");
          return;
        }

        window.setTimeout(poll, POLL_INTERVAL_MS);
      }

      await poll();
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCopy() {
    if (!credentials?.password) return;
    try {
      await navigator.clipboard.writeText(credentials.password);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponível — sem problema, a senha já está visível na tela
    }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex min-h-full flex-col items-center justify-center gap-8 bg-dark-screen-bg px-5 pb-[calc(env(safe-area-inset-bottom)+32px)] pt-[calc(env(safe-area-inset-top)+40px)]"
    >
      <motion.div
        variants={item}
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#bfe401]"
      >
        <CheckCircle2 className="h-8 w-8 text-[#151515]" strokeWidth={2.5} />
      </motion.div>

      <motion.div variants={item} className="flex flex-col gap-2 text-center text-white">
        <h1 className="text-[28px] font-semibold leading-[1.1] tracking-[-1.12px]">
          Seu acesso foi liberado!
        </h1>
        <p className="text-[15px] leading-[1.4] tracking-[-0.45px] text-white/50">
          {phase === "loading"
            ? "Estamos preparando sua conta na área de membros — leva só alguns segundos."
            : "Use os dados abaixo para entrar na área de membros."}
        </p>
      </motion.div>

      {phase === "loading" && (
        <motion.div variants={item} className="flex flex-col items-center gap-3 py-4 text-white/70">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-[13px]">Confirmando seu pagamento...</p>
        </motion.div>
      )}

      {phase === "ready" && credentials && (
        <motion.div
          variants={item}
          className="flex w-full flex-col gap-4 rounded-[16px] bg-white p-6"
        >
          <div className="flex flex-col gap-1">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-[#696969]">
              E-mail de acesso
            </p>
            <p className="text-[15px] font-medium text-[#151515]">{credentials.email}</p>
          </div>

          {credentials.password ? (
            <div className="flex flex-col gap-1">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-[#696969]">
                Senha
              </p>
              <div className="flex items-center justify-between gap-2 rounded-[12px] border border-[#e5e5e5] px-4 py-3">
                <span className="font-mono text-[15px] tracking-wide text-[#151515]">
                  {credentials.password}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex shrink-0 items-center gap-1.5 rounded-[8px] bg-[#f2f2f2] px-2.5 py-1.5 text-[12px] font-medium text-[#151515] transition-colors hover:bg-[#e5e5e5]"
                >
                  <Copy className="h-3 w-3" />
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
              <p className="text-[12px] leading-[1.4] text-[#696969]">
                Guarde essa senha — ela não vai ser mostrada de novo. Você pode trocá-la depois de
                entrar.
              </p>
            </div>
          ) : (
            <p className="text-[13px] leading-[1.4] text-[#696969]">
              Você já tinha uma conta com esse e-mail — entre com a senha que você já usa.
            </p>
          )}

          <a href={`${CARBB_APP_URL}/login`}>
            <Button variant="brand">Entrar na área de membros</Button>
          </a>
        </motion.div>
      )}

      {(phase === "timeout" || phase === "missing") && (
        <motion.div
          variants={item}
          className="flex w-full flex-col gap-4 rounded-[16px] bg-white p-6 text-center"
        >
          <p className="text-[14px] leading-[1.5] text-[#151515]">
            {phase === "timeout"
              ? "Seu pagamento foi confirmado e seu acesso já está liberado, mas não conseguimos mostrar sua senha aqui a tempo."
              : "Não encontramos os dados de acesso nesta página."}
          </p>
          <p className="text-[13px] leading-[1.5] text-[#696969]">
            Tente entrar com o e-mail que você usou{phase === "timeout" ? " na compra" : ""}. Se
            precisar de ajuda, fale com a gente no WhatsApp.
          </p>
          <a href={`${CARBB_APP_URL}/login`}>
            <Button variant="brand">Ir para o login</Button>
          </a>
          <a
            href={WHATSAPP_SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2.5 rounded-[15px] bg-[#25D366] px-[15px] py-[15px] text-[16px] font-medium tracking-tight text-white shadow-[0_4px_7.95px_rgba(0,0,0,0.1)] transition-[filter] hover:brightness-105"
          >
            <MessageCircle className="h-4 w-4" fill="currentColor" />
            Falar com o suporte
          </a>
        </motion.div>
      )}
    </motion.div>
  );
}
