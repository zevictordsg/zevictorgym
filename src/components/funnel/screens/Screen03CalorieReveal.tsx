"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "../icons";
import type { FunnelScreenProps } from "../types";

/**
 * Tela de revelação calórica — fiel ao node 2364:4335 do Figma. `bare: true`
 * (sem header/progress-bar) pra ficar idêntica ao frame de referência, que
 * não tem nenhum chrome no topo.
 *
 * Estrutura (de cima pra baixo, `justify-between` empurrando o CTA pro
 * rodapé): card escuro full-width com o número de calorias + caveira
 * sobrepondo a borda superior → colagem de 3 fotos → headline/subtexto →
 * checklist de 3 linhas (❌ vermelho, igual ao Figma) → CTA com pulsação
 * sutil.
 */
const RED_ITEMS = [
  "Sem passar fome",
  "Sem ter medo de comer o que quer",
  "Sem descontrole alimentar",
];

/**
 * Sobe o número em saltos curtos e aleatórios (igual ao contador ao vivo da
 * primeira tela) em vez de um tween contínuo — reforça a sensação de "número
 * sendo calculado em tempo real" até estabilizar no valor final.
 */
function useStepCount(start: number, target: number, delay = 0) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let cancelled = false;
    let current = start;

    function scheduleNext() {
      const interval = 550 + Math.random() * 900;
      window.setTimeout(() => {
        if (cancelled) return;
        const step = 18 + Math.floor(Math.random() * 40);
        current = Math.min(target, current + step);
        setCount(current);
        if (current < target) scheduleNext();
      }, interval);
    }

    const startTimer = window.setTimeout(() => {
      if (!cancelled) scheduleNext();
    }, delay);

    return () => {
      cancelled = true;
      window.clearTimeout(startTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return count;
}

export function Screen03CalorieReveal({ onNext }: FunnelScreenProps) {
  const liveCalories = useStepCount(859, 1642, 500);

  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-4 bg-background px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-[calc(env(safe-area-inset-top)+20px)]">
      {/* Card de calorias */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full shrink-0"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.6, rotate: 4.25 }}
          animate={{ opacity: 1, scale: 1, rotate: 4.25 }}
          transition={{ delay: 0.3, duration: 0.4, ease: "backOut" }}
          className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 text-[34px] drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
        >
          💀
        </motion.span>

        <div className="flex w-full flex-col items-center gap-1 rounded-[28px] bg-dark-card-bg px-3 py-5 shadow-[0_8px_18px_rgba(0,0,0,0.3)]">
          <p className="text-[10px] font-medium uppercase tracking-[1px] text-white/70">
            Calorias disponíveis com o hack
          </p>
          <p className="flex h-[52px] items-center text-[40px] font-semibold tracking-[-1.2px] text-brand-green-deep">
            +
            <span className="relative ml-1 inline-flex overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={liveCalories}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  {liveCalories.toLocaleString("pt-BR")}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="ml-1.5">Calorias</span>
          </p>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.35 }}
            className="mt-1 inline-flex items-center gap-2 rounded-xl bg-[#3a3a3a] px-4 py-1 text-[13px] font-medium text-white"
          >
            <span className="h-[5px] w-[5px] rounded-full bg-brand-green-deep" />
            245 kcal <span className="text-white/50">·</span> 23%
          </motion.span>
        </div>
      </motion.div>

      {/* Colagem de fotos */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex shrink-0 justify-center gap-2.5"
      >
        {["/images/quad1.webp", "/images/quad2.webp", "/images/quad3.webp"].map(
          (src) => (
            <div
              key={src}
              className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-[16px] ring-1 ring-black/5"
            >
              <Image src={src} alt="" fill sizes="76px" className="object-cover" />
            </div>
          )
        )}
      </motion.div>

      {/* Headline + subtexto */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.4 }}
        className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2.5 text-center"
      >
        <h2 className="text-[24px] font-semibold leading-[1.15] tracking-tight text-foreground-strong">
          Aplicando o &ldquo;hack&rdquo; mostrado dentro da planilha você
          terá mais{" "}
          <span className="text-brand-green-deep">1000 kcal</span> diárias de
          forma direcionada
        </h2>
        <p className="text-[14px] leading-[1.4] text-foreground/50">
          Um único ajuste que direciona o &ldquo;lixo&rdquo; em combustível
          para cada treino ser insano!
        </p>
      </motion.div>

      {/* Checklist vermelho — ❌ literal, igual ao Figma */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36, duration: 0.4 }}
        className="flex w-full shrink-0 flex-col gap-2"
      >
        {RED_ITEMS.map((label) => (
          <div
            key={label}
            className="flex w-full items-center gap-2.5 rounded-[10px] border px-[15px] py-3"
            style={{
              background: "var(--soft-red-bg)",
              borderColor: "var(--soft-red-border)",
            }}
          >
            <span className="shrink-0 text-[13px] leading-none">❌</span>
            <span className="text-[14px] font-medium text-[#8d0000] opacity-50">
              {label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* CTA com pulsação sutil */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.35 }}
        className="w-full shrink-0"
      >
        <motion.div
          animate={{ scale: [1, 1.025, 1] }}
          transition={{
            delay: 1.2,
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Button onClick={onNext} icon={<ArrowRight className="h-3.5 w-3.5" />}>
            Quero aplicar o hack
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
