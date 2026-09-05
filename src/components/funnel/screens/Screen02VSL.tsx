"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Logo";
import { ArrowRight } from "../icons";
import type { FunnelScreenProps } from "../types";

/**
 * Tela de VSL — fiel ao node 2364:4306 do Figma: headline + player VTurb
 * (ConvertAI) + wordmark no rodapé. O CTA não existe no frame estático do
 * Figma (que é só o mockup "idle") — o wordmark ocupa o lugar dele até o
 * CTA aparecer, quando os dois trocam de lugar com um crossfade.
 *
 * O pitch de vendas dentro do vídeo começa aos 3min48s — o CTA só aparece
 * depois disso (`revealCtaAfterSeconds`), pra não oferecer "Continuar"
 * antes do vídeo ter feito o trabalho de convencer.
 * TODO: isso é um timer fixo (assume que o vídeo começou a tocar assim que
 * a tela montou, sem contar pausas) — não um listener real do progresso do
 * player. Trocar por um evento de progresso da VTurb se/quando o SDK deles
 * expuser um, pra travar certinho em quem pausa o vídeo.
 *
 * O elemento `<vturb-smartplayer>` é um Web Component custom da VTurb —
 * criado via DOM API (igual ao snippet oficial deles, que também faz
 * `document.createElement`) em vez de JSX direto, pra não precisar de uma
 * declaração de tipos ambiente pra uma tag desconhecida do TS. O wrapper
 * (`absolute inset-0` preenchendo o container) substitui o
 * `padding-top: 177.78%` do snippet original — aqui o espaço já vem fixado
 * pelo `flex-1` da tela (que garante caber sem scroll em qualquer altura de
 * viewport), então deixamos o player preencher esse espaço em vez de definir
 * a própria altura.
 */
const VTURB_PLAYER_ID = "vid-6a9bb538f5882a0f8e3b448e";
const VTURB_PLAYER_SRC =
  "https://scripts.converteai.net/a4150f7c-18fa-4974-9849-7f2765acd263/players/6a9bb538f5882a0f8e3b448e/v4/player.js";
const revealCtaAfterSeconds = 3 * 60 + 48; // 3:48 — quando o pitch começa no vídeo

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
  const playerHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setCtaVisible(true),
      revealCtaAfterSeconds * 1000
    );
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const host = playerHostRef.current;
    if (!host) return;

    const player = document.createElement("vturb-smartplayer");
    player.setAttribute("id", VTURB_PLAYER_ID);
    player.style.cssText = "display:block;width:100%;height:100%;";

    const placeholder = document.createElement("div");
    placeholder.className = "vturb-player-placeholder";
    placeholder.style.cssText =
      "position:absolute;inset:0;z-index:0;background-color:black;";

    player.appendChild(placeholder);
    host.appendChild(player);

    return () => {
      host.removeChild(player);
    };
  }, []);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex h-full min-h-0 flex-col items-center gap-4 bg-background px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-[calc(env(safe-area-inset-top)+16px)]"
    >
      <Script
        id="vturb-player-loader"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `var s=document.createElement("script"); s.src="${VTURB_PLAYER_SRC}", s.async=!0,document.head.appendChild(s);`,
        }}
      />

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
        className="relative min-h-0 w-full flex-1 overflow-hidden rounded-[15px] bg-black"
      >
        <div ref={playerHostRef} className="absolute inset-0" />
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
