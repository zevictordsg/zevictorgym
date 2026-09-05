"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { SocialProofPill, Callout } from "@/components/ui/Card";
import { SwipeButton } from "@/components/ui/SwipeButton";
import type { FunnelScreenProps } from "../types";

/**
 * Simula pessoas entrando em tempo real — sobe de tempos em tempos (intervalo
 * aleatório) pra dar aquele detalhe vivo/gamificado na pílula de prova social.
 */
function useLiveCount(start: number) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let cancelled = false;

    function scheduleNext() {
      const delay = 3500 + Math.random() * 4500;
      window.setTimeout(() => {
        if (cancelled) return;
        setCount((c) => c + (Math.random() < 0.75 ? 1 : 2));
        scheduleNext();
      }, delay);
    }

    scheduleNext();
    return () => {
      cancelled = true;
    };
  }, []);

  return count;
}

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Screen01Hook({ onNext }: FunnelScreenProps) {
  const liveCount = useLiveCount(29);

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      {/* Pattern de pontos sutil no fundo — reforça o clima "gamificado" sem
          competir com o conteúdo (o Figma em si é liso/branco aqui). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          maskImage:
            "radial-gradient(ellipse 100% 60% at 50% 0%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 100% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative flex h-full min-h-0 flex-1 flex-col items-center justify-start gap-5 px-5 pb-5 pt-[calc(env(safe-area-inset-top)+20px)]"
      >
        <motion.div variants={item} className="flex justify-center">
          <SocialProofPill>
            Pessoas acessando a planilha{" "}
            <span className="relative inline-flex overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={liveCount}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  +{liveCount}
                </motion.span>
              </AnimatePresence>
            </span>
          </SocialProofPill>
        </motion.div>

        <motion.div variants={item} className="flex justify-center gap-1">
          <div className="relative h-[186px] w-[134px] overflow-hidden rounded-[13px] bg-[#eee]">
            <Image
              src="/images/esquerda.webp"
              alt="Antes de aplicar o hack"
              fill
              sizes="134px"
              className="object-cover"
              priority
            />
          </div>
          <div className="relative h-[186px] w-[134px] overflow-hidden rounded-[13px] bg-[#eee]">
            <Image
              src="/images/direita.webp"
              alt="Depois de aplicar o hack"
              fill
              sizes="134px"
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        <motion.div variants={item} className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-[21px] font-semibold leading-[1.15] tracking-tight text-foreground-strong">
            Vou te entregar o hack de macros que me fez atingir 10% de gordura
            corporal enquanto aumentei em até{" "}
            <span className="text-brand-green">1000 calorias a minha dieta!</span>
          </h1>

          <p className="text-[14px] leading-[1.35] text-foreground/50">
            Colegas que testaram essa técnica atingiram percentuais até mais
            baixos que o meu,{" "}
            <span className="font-bold text-foreground/50">
              mesmo com 2 ou 3 refeições livres na semana.
            </span>
          </p>
        </motion.div>

        <motion.div variants={item} className="w-full">
          <Callout tone="danger" className="text-[13px] font-semibold opacity-50">
            Aqui você vai ter acesso à estrutura de dieta que eu realmente testei
            na prática, não uma cópia do GPT.
          </Callout>
        </motion.div>

        <motion.div variants={item} className="flex w-full flex-col items-center gap-2.5">
          <SwipeButton label="Iniciar agora" onComplete={onNext} />

          <p className="text-[13px] text-foreground/40">Deslize pra iniciar</p>

          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="flex"
                initial={{ opacity: 0.2 }}
                animate={{ opacity: [0.2, 1, 0.2], x: [0, 6, 0] }}
                transition={{
                  duration: 1.15,
                  repeat: Infinity,
                  delay: i * 0.16,
                  ease: "easeInOut",
                }}
              >
                <Image src="/arrow.svg" alt="" width={7} height={11} aria-hidden />
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
