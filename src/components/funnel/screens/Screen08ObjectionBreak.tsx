"use client";

import { useState, type UIEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Card";
import { CheckItem } from "@/components/ui/CheckItem";
import { ArrowRight } from "../icons";
import type { FunnelScreenProps } from "../types";

const BULLETS = [
  "Aulas onde estruturo tudo no passo a passo",
  "Sistema que te permite liberdade na dieta",
  "Distribuição correta de macros e calorias",
  "Materiais completos de acompanhamento",
  "Aulas científicas te explicando a base de tudo",
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

const bulletsContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const bulletItem: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

export function Screen08ObjectionBreak({ onNext }: FunnelScreenProps) {
  const [hasScrolled, setHasScrolled] = useState(false);

  function handleScroll(e: UIEvent<HTMLDivElement>) {
    if (!hasScrolled && e.currentTarget.scrollTop > 8) {
      setHasScrolled(true);
    }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex h-full flex-col bg-background"
    >
      {/* área rolável — o conteúdo é mais alto que a tela de propósito, o
          fade com blur no rodapé (fora dessa div) insinua que tem mais pra
          ver descendo. A seta flutua por cima e some assim que o usuário
          começa a rolar. */}
      <div className="relative min-h-0 flex-1">
        <div onScroll={handleScroll} className="no-scrollbar h-full overflow-y-auto">
          <div className="flex flex-col gap-8 px-5 pb-6 pt-[calc(env(safe-area-inset-top)+20px)]">
          <motion.div variants={item}>
            <Callout tone="amber" className="text-[14px]">
              🚨 Ainda bem que você chegou até aqui, afinal quem chega cedo
              bebe água limpa🚨
            </Callout>
          </motion.div>

          <motion.div
            variants={item}
            className="relative aspect-[706/366] w-full overflow-hidden rounded-[24px] shadow-[0_4px_19.9px_rgba(0,0,0,0.25)]"
          >
            <Image src="/images/guloseimas.webp" alt="" fill className="object-cover" />
          </motion.div>

          <motion.div variants={item} className="flex flex-col gap-3 text-center">
            <p className="text-[16px] font-bold leading-[1.4] text-foreground/50">
              Copie e cole a organização de calorias e macros que me permitem
              aproveitar refs livres sem sentir culpa e ainda transformar isso
              em combustível para meus treinos!
            </p>
            <p className="text-[14px] leading-[1.4] text-[#939393]">
              Essa estrutura me fez literalmente alcançar um físico que eu só
              imaginava ter com dietas super restritivas e que me deixariam
              com fome o dia todo.
            </p>
          </motion.div>

          <motion.div variants={bulletsContainer} className="flex flex-col gap-3">
            {BULLETS.map((b) => (
              <motion.div key={b} variants={bulletItem}>
                <CheckItem tone="green-soft" className="py-3 text-sm">
                  {b}
                </CheckItem>
              </motion.div>
            ))}
          </motion.div>
          </div>
        </div>

        {/* seta indicando que dá pra rolar mais — some assim que o usuário
            começa a rolar o conteúdo */}
        <AnimatePresence>
          {!hasScrolled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center"
            >
              <div className="flex flex-col items-center gap-0.5 rounded-full bg-background/80 px-2 py-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.12)]">
                {[0, 1].map((i) => (
                  <motion.span
                    key={i}
                    className="flex"
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: [0.2, 1, 0.2], y: [0, 5, 0] }}
                    transition={{
                      duration: 1.15,
                      repeat: Infinity,
                      delay: i * 0.16,
                      ease: "easeInOut",
                    }}
                  >
                    <Image
                      src="/arrow.svg"
                      alt=""
                      width={7}
                      height={11}
                      style={{ transform: "rotate(90deg)" }}
                      aria-hidden
                    />
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* rodapé fixo — o CTA fica sempre visível; o degradê com blur logo
          acima faz o conteúdo que está rolando "sumir" suavemente antes de
          chegar nele, em vez de cortar seco. Em vez de um único
          backdrop-filter (que tem borda dura, já que o blur não tem como
          variar de intensidade dentro do mesmo elemento), empilhamos 3
          camadas com blur crescente, cada uma mascarada num ponto
          diferente do degradê — a soma das três dá a sensação de um blur
          progressivo e suave em vez de "ligar" de uma vez. */}
      <div className="relative shrink-0">
        <div className="pointer-events-none absolute inset-x-0 bottom-full h-14">
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 50%, black 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 50%, black 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
              maskImage: "linear-gradient(to bottom, transparent 40%, black 70%, black 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 40%, black 70%, black 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              maskImage: "linear-gradient(to bottom, transparent 65%, black 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 65%, black 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, var(--background) 92%)",
            }}
          />
        </div>
        <motion.div
          variants={item}
          className="bg-background px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-2"
        >
          <Button onClick={onNext} icon={<ArrowRight className="h-3.5 w-3.5" />}>
            Quero o material mais completo!
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
