"use client";

import { X } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { BadgeCard } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";
import { ArrowRight } from "../icons";
import type { FunnelScreenProps } from "../types";

/**
 * Tela de comparação entre modelos — fiel ao node 2364:4442 do Figma:
 * headline → cartão escuro com 3 linhas (cutting / carbmaxxing hack em
 * destaque verde com caveira sobrepondo o canto / bulking) → callout
 * "ATENÇÃO" âmbar → CTA. `bare: true` (sem barra de progresso) — só o
 * botão de voltar flutuante, cuidamos do padding do topo aqui.
 */
const MODELS = [
  {
    key: "cutting",
    kind: "loss" as const,
    title: "Cutting agressivo",
    subtitle: "Difícil de manter I Desistência na certa I Frustração com o shape I Dieta sem gosto",
  },
  {
    key: "carbmaxxing",
    kind: "win" as const,
    title: "Carbmaxxing hack",
    subtitle: "Fácil aplicação na rotina I Secar se torna fácil I Refs livres se tornam suas aliadas",
  },
  {
    key: "bulking",
    kind: "loss" as const,
    title: "Bulking pra ganhar massa",
    subtitle: "Te deixa gordo I Seu sono piora I Te faz empurrar comida I Piora seu metabolismo",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

const rowsContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const rowItem: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

export function Screen04ModelComparison({ onNext }: FunnelScreenProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex h-full min-h-0 flex-col justify-center gap-4 bg-background px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-[calc(env(safe-area-inset-top)+20px)]"
    >
      <motion.p
        variants={item}
        className="text-center text-[15px] font-medium leading-[1.4] text-foreground/50"
      >
        E tudo foi feito com base em testes que eu mesmo já fiz, e o com
        mais resultados é o sinalizado abaixo👇
      </motion.p>

      <motion.div
        variants={item}
        className="flex w-full flex-col items-center gap-3 rounded-[24px] bg-dark-card-bg px-3 py-4 shadow-[0_8px_18px_rgba(0,0,0,0.3)]"
      >
        <p className="text-[10px] font-medium uppercase tracking-[1px] text-white">
          Comparação entre modelos
        </p>

        <motion.div
          variants={rowsContainer}
          initial="hidden"
          animate="show"
          className="flex w-full flex-col gap-2.5"
        >
          {MODELS.map((m) => {
            const isWin = m.kind === "win";
            return (
              <motion.div
                key={m.key}
                variants={rowItem}
                className={
                  isWin
                    ? "relative flex w-full items-center gap-2.5 rounded-[18px] border border-[#b0f8cf] bg-[#35ad4f] p-2.5 shadow-[0_4px_8px_rgba(134,212,99,0.25)]"
                    : "flex w-full items-center gap-2.5 rounded-[16px] bg-[#2d2d2d] p-2.5 shadow-[0_3px_7px_rgba(0,0,0,0.1)]"
                }
              >
                {isWin && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.6, rotate: 10.47 }}
                    animate={{ opacity: 1, scale: 1, rotate: 10.47 }}
                    transition={{ delay: 0.55, duration: 0.4, ease: "backOut" }}
                    className="absolute -right-1.5 -top-3 text-[22px] drop-shadow-[0_3px_5px_rgba(0,0,0,0.3)]"
                  >
                    💀
                  </motion.span>
                )}

                <span
                  className={
                    isWin
                      ? "flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[13px] bg-white"
                      : "flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] bg-[#3f3f3f]"
                  }
                >
                  {isWin ? (
                    <Logo className="text-[22px] text-[#2f2f2f]" />
                  ) : (
                    <X className="h-4 w-4 text-white/50" strokeWidth={2} />
                  )}
                </span>

                <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
                  <p
                    className={
                      isWin
                        ? "text-[15px] font-semibold tracking-[-0.5px] text-white"
                        : "text-[13px] font-semibold tracking-[-0.5px] text-white"
                    }
                  >
                    {m.title}
                  </p>
                  <p
                    className={
                      isWin
                        ? "text-[11px] leading-[1.3] text-[#010400] opacity-50"
                        : "text-[10px] leading-[1.3] text-white opacity-30"
                    }
                  >
                    {m.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      <motion.div variants={item}>
        <BadgeCard
          badge="ATENÇÃO"
          badgeBg="#dfa228"
          bg="rgba(255,245,178,0.2)"
          border="rgba(236,213,120,0.3)"
          className="gap-2.5"
        >
          <p className="text-[13px] leading-[1.4]" style={{ color: "var(--callout-amber-text)" }}>
            🚨 Seu metabolismo não sofre com isso, pelo contrário, o
            carbmaxxing ajuda no processo de ajuste da sensibilidade à
            insulina enquanto te permite ter mais energia para os treinos e
            sua atividade na rotina
          </p>
        </BadgeCard>
      </motion.div>

      <motion.div variants={item}>
        <Button onClick={onNext} icon={<ArrowRight className="h-3.5 w-3.5" />}>
          Quero acessar a planilha com o hack
        </Button>
      </motion.div>
    </motion.div>
  );
}
