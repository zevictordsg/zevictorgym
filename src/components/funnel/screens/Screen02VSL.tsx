"use client";

import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Logo";
import { ArrowRight } from "../icons";
import type { FunnelScreenProps } from "../types";

/**
 * Tela de VSL — fiel ao node 2364:4306 do Figma: headline + placeholder de
 * vídeo (retângulo cinza arredondado) + wordmark no rodapé. O CTA não
 * existe no frame estático do Figma (que é só o mockup "idle") — o
 * wordmark ocupa o lugar dele até o CTA aparecer (depois de alguns
 * segundos), quando os dois trocam de lugar com um crossfade.
 *
 * O placeholder usa `flex-1` (em vez de aspect-ratio fixo) pra ocupar
 * exatamente o espaço que sobra entre o título e o rodapé — garante que
 * a tela sempre cabe sem scroll, em qualquer altura de viewport.
 */
const videoSrc: string | null = null;
const revealCtaAfterSeconds = 5;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export function Screen02VSL({ onNext }: FunnelScreenProps) {
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setCtaVisible(true),
      revealCtaAfterSeconds * 1000
    );
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex h-full min-h-0 flex-col items-center gap-4 bg-background px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-[calc(env(safe-area-inset-top)+16px)]"
    >
      <motion.h1
        variants={item}
        className="shrink-0 text-center text-[20px] font-semibold leading-[1.1] tracking-[-0.8px] text-[#444]"
      >
        Assista o vídeo abaixo pra
        <br />
        receber o material completo
      </motion.h1>

      <motion.div
        variants={item}
        className="relative min-h-0 w-full flex-1 overflow-hidden rounded-[15px] bg-[#d9d9d9]"
      >
        {videoSrc ? (
          <video
            src={videoSrc}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/70 text-[#444]">
              <Play className="h-5 w-5 translate-x-0.5" fill="currentColor" />
            </span>
          </div>
        )}
      </motion.div>

      <motion.div
        variants={item}
        className="flex min-h-[56px] w-full shrink-0 items-center justify-center"
      >
        <AnimatePresence mode="wait" initial={false}>
          {ctaVisible ? (
            <motion.div
              key="cta"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <Button onClick={onNext} icon={<ArrowRight className="h-3.5 w-3.5" />}>
                Continuar
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="wordmark"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Wordmark />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
