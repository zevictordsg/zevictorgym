"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSpotsRemaining } from "@/hooks/useSpotsRemaining";
import type { FunnelScreenProps } from "../types";

// estrelinhas ambiente espalhadas pela tela toda (não só nos cantos) —
// cada uma pisca em loop num ritmo levemente diferente (duration própria)
// pra não sincronizar e parecer "artificial", reforçando que essa é uma
// tela especial/premiada.
const STARS = [
  { top: "8%", left: "10%", size: 14, rotate: -15, duration: 3.2 },
  { top: "5%", left: "46%", size: 7, rotate: 6, duration: 4.4 },
  { top: "7%", right: "12%", size: 10, rotate: 20, duration: 3.6 },
  { top: "23%", left: "5%", size: 7, rotate: -10, duration: 4.8 },
  { top: "26%", right: "7%", size: 9, rotate: 14, duration: 3.9 },
  { bottom: "38%", left: "8%", size: 6, rotate: 18, duration: 4.3 },
  { bottom: "36%", right: "5%", size: 8, rotate: -22, duration: 3.4 },
  { bottom: "9%", left: "4%", size: 10, rotate: 10, duration: 4.0 },
  { bottom: "11%", right: "8%", size: 16, rotate: -8, duration: 3.7 },
  { bottom: "18%", left: "44%", size: 6, rotate: 25, duration: 4.9 },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

// card2.svg (283x389, moldura escura) fica atrás como base; card1.svg
// (268x374, face clara — já com logo/título/código de barras desenhados
// nela) fica por cima com esse inset, que é a margem exata entre as duas
// formas no arquivo original do Figma (7.5px em ambos os eixos na escala
// nativa), convertida em % pra se manter fiel em qualquer tamanho renderizado.
const CARD1_INSET = "1.928% 2.650%";

// giro completo (2.5 voltas) antes de assentar na face virada — 900° mod 360
// = 180°, ou seja, termina exatamente na face de trás (desconto).
const REDEEM_SPIN_DEG = 900;

// confete que estoura no instante em que o voucher vira — ângulos/distâncias
// fixos (não randômicos) pra o resultado ser sempre o mesmo, alternando
// pontinhos redondos com tirinhas retangulares (giram e "caem" com um
// leve efeito de gravidade) pra parecer confete de verdade.
const CONFETTI_COLORS = ["#6BE3A6", "#FFD37A", "#8FE0FF", "#FF9FD6", "#FFFFFF"];
const CONFETTI = Array.from({ length: 32 }, (_, i) => {
  const angle = (i / 32) * Math.PI * 2 + (i % 2 === 0 ? 0.18 : -0.12);
  const distance = 96 + (i % 4) * 30;
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - 20,
    rotate: (i * 47) % 360,
    shape: i % 3 === 0 ? "rect" : "circle",
    size: i % 3 === 0 ? 4 : i % 3 === 1 ? 7 : 5,
    delay: (i % 8) * 0.018,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  } as const;
});

export function Screen07VoucherSpin({ onNext }: FunnelScreenProps) {
  const [redeemed, setRedeemed] = useState(false);
  // Mesmo número ao vivo mostrado no chat do WhatsApp (Screen05) — antes essa
  // tela tinha um "39" fixo, bem diferente do que o usuário acabou de ver
  // cair pra 4 no chat, o que quebrava a credibilidade da urgência.
  const spotsRemaining = useSpotsRemaining();

  function handleRedeem() {
    if (redeemed) {
      onNext();
      return;
    }
    setRedeemed(true);
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative flex h-full flex-col items-center justify-between overflow-hidden px-5 pb-8 pt-[calc(env(safe-area-inset-top)+36px)]"
    >
      {/* glow ambiente — respiração lenta atrás do título e do cartão, pra dar
          um ar de "tela premiada" mesmo antes do resgate */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[6%] -z-10 h-[220px] w-[220px] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(107,227,166,0.16) 0%, rgba(107,227,166,0) 70%)",
        }}
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.12, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,211,122,0.14) 0%, rgba(255,211,122,0) 70%)",
        }}
        animate={{ opacity: [0.4, 0.85, 0.4], scale: [1, 1.15, 1] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />

      {STARS.map((s, i) => {
        const { size, rotate, duration, ...position } = s;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0.3, 1], scale: [0.5, 1, 1, 1] }}
            transition={{
              delay: 0.25 + i * 0.06,
              duration,
              times: [0, 0.12, 0.55, 1],
              repeat: Infinity,
              repeatDelay: 0.3,
              ease: "easeInOut",
            }}
            className="absolute"
            style={position}
          >
            <Star
              className="text-white/20"
              style={{ width: size, height: size, transform: `rotate(${rotate}deg)` }}
              fill="currentColor"
            />
          </motion.span>
        );
      })}

      <motion.div variants={item} className="flex flex-col items-center gap-6">
        <div className="relative flex items-center gap-2">
          <span className="-mt-1 -rotate-[14deg] text-2xl">🎁</span>
          <div className="text-center text-[28px] font-semibold leading-[1.1] text-[#e7e7e7]">
            <p>Resgate</p>
            <p>Seu Voucher</p>
          </div>
          <span className="-mt-1 rotate-[14deg] text-2xl">🎁</span>
        </div>

        <p className="max-w-[330px] text-center text-[18px] leading-[1.4] text-[#d4d4d4]/80">
          <span className="font-bold">Restam apenas {spotsRemaining} Vouchers</span> até 50
          membros. Clique em Resgatar Agora.
        </p>
      </motion.div>

      <div className="relative" style={{ perspective: 1200 }}>
        {/* brilho que estoura por trás do cartão no momento da revelação */}
        {redeemed && (
          <motion.span
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-16 w-16 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(107,227,166,0.6) 0%, rgba(107,227,166,0) 70%)",
            }}
            initial={{ x: "-50%", y: "-50%", scale: 0.3, opacity: 0.95 }}
            animate={{ x: "-50%", y: "-50%", scale: 10, opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        )}

        <motion.div
          initial={{ rotateY: 180, scale: 0.85, opacity: 0 }}
          animate={{ rotateY: redeemed ? REDEEM_SPIN_DEG : 0, scale: 1, opacity: 1 }}
          transition={
            redeemed
              ? { duration: 0.95, ease: [0.45, 0, 0.2, 1] }
              : { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }
          }
          style={{ transformStyle: "preserve-3d" }}
          className="relative aspect-[283/389] w-[228px] shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
        >
          {/* moldura escura (card2) — fica visível o giro inteiro, atrás das faces */}
          <Image src="/images/card2.svg" alt="" fill priority className="pointer-events-none select-none" />

          {/* face da frente: ticket (card1 já traz logo, título e código de barras) */}
          <div
            className="absolute"
            style={{ inset: CARD1_INSET, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          >
            <Image src="/images/card1.svg" alt="" fill className="pointer-events-none select-none" />
          </div>

          {/* face de trás: desconto liberado (card32 já vem com a arte
              completa, incluindo o texto "Calculadora da Elite" — sem
              sobreposição HTML aqui, é tudo baked no próprio arquivo) */}
          <div
            className="absolute inset-0"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <Image src="/images/card32.svg" alt="" fill className="pointer-events-none select-none" />
          </div>
        </motion.div>

        {/* confete — estoura do centro do cartão junto com o giro, com um
            leve arco de "gravidade" na queda pra ficar mais intenso */}
        {redeemed && (
          <span className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            {CONFETTI.map((c, i) =>
              c.shape === "circle" ? (
                <motion.span
                  key={i}
                  className="absolute rounded-full"
                  style={{ width: c.size, height: c.size, background: c.color }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
                  animate={{
                    x: [0, c.x, c.x * 1.12],
                    y: [0, c.y, c.y + 46],
                    opacity: [1, 1, 0],
                    scale: [0.4, 1, 0.9],
                  }}
                  transition={{
                    duration: 1.3,
                    delay: 0.3 + c.delay,
                    times: [0, 0.4, 1],
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              ) : (
                <motion.span
                  key={i}
                  className="absolute"
                  style={{ width: c.size, height: c.size * 2.4, background: c.color, borderRadius: 1 }}
                  initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                  animate={{
                    x: [0, c.x, c.x * 1.12],
                    y: [0, c.y, c.y + 46],
                    rotate: [0, c.rotate, c.rotate * 1.7],
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 1.3,
                    delay: 0.3 + c.delay,
                    times: [0, 0.4, 1],
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              )
            )}
          </span>
        )}
      </div>

      <motion.div variants={item} className="w-full">
        <Button variant="light" onClick={handleRedeem}>
          {redeemed ? "Continuar" : "Resgatar Agora"}
        </Button>
      </motion.div>
    </motion.div>
  );
}
