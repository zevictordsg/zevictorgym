"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { BadgeCard } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";
import { ArrowRight } from "../icons";
import type { FunnelScreenProps } from "../types";

const BENEFITS = [
  "Treinos com muito mais energia",
  "Direcionamento correto do Carboidrato",
  "Aspecto de ”Seco” mesmo comendo ”besteiras”",
  "Ganho de músculo enquanto perde gordura",
  "Adesão à dieta que realmente te faz crescer",
  "A cada refeição seus músculos agradecem",
];

// Opostos diretos de cada item de BENEFITS, na mesma ordem — usados no card
// "SEM APLICAR O CARBMAXXING" (antes reaproveitava a lista positiva com
// ícone de "x", o que ficava contraditório: dizia "sem aplicar" mas listava
// benefícios como se fossem coisas que você TERIA sem aplicar).
const DRAWBACKS = [
  "Treinos sem energia nenhuma",
  "Carboidrato jogado de qualquer jeito",
  "Inchado até comendo ”certinho”",
  "Perde músculo junto com a gordura",
  "Dieta restritiva que você abandona rápido",
  "A cada refeição só vem culpa e frustração",
];

/**
 * Como essa tela é a única com scroll intencional, as animações de entrada
 * disparam por `whileInView` (revelam conforme o usuário rola) em vez de
 * tudo de uma vez no mount — reforça a leitura progressiva do conteúdo.
 */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const rowsContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const rowItem: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

function ChecklistRow({
  children,
  positive,
}: {
  children: string;
  positive: boolean;
}) {
  return (
    <motion.div
      variants={rowItem}
      className="flex w-full items-center gap-1.5 text-xs font-medium"
      style={{ color: positive ? "var(--check-green-text)" : "var(--check-red-text)" }}
    >
      <Image
        src={positive ? "/images/verified.svg" : "/images/iconx.svg"}
        alt=""
        width={12}
        height={12}
        className="shrink-0"
      />
      <span>{children}</span>
    </motion.div>
  );
}

export function Screen06ComparisonScroll({ onNext }: FunnelScreenProps) {
  return (
    <div className="flex min-h-full flex-col gap-8 bg-background px-5 pb-[calc(env(safe-area-inset-bottom)+32px)] pt-[calc(env(safe-area-inset-top)+20px)]">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        variants={fadeUp}
        className="flex flex-col items-center gap-5"
      >
        <Logo className="text-[26px] text-foreground" />
        <p className="text-center text-[15px] leading-[1.4] text-foreground/50">
          A partir de agora a decisão é óbvia... E seu único objetivo é não
          deixar sua preguiça tomar conta (eu quase deixei) 👇
        </p>
      </motion.div>

      <div className="flex flex-col gap-4">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={rowsContainer}
          className="flex flex-col gap-4 rounded-[15px] border-2 px-[15px] py-3"
          style={{ background: "var(--check-green-bg)", borderColor: "var(--check-green-border)" }}
        >
          <motion.div variants={rowItem} className="flex items-center gap-2.5">
            <Image src="/images/verified.svg" alt="" width={16} height={16} />
            <p className="text-[16px] font-bold tracking-tight" style={{ color: "var(--check-green-title)" }}>
              APLICANDO O CARBMAXXING
            </p>
          </motion.div>
          <div className="flex flex-col gap-3">
            {BENEFITS.map((b) => (
              <ChecklistRow key={b} positive>
                {b}
              </ChecklistRow>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={rowsContainer}
          className="flex flex-col gap-4 rounded-[15px] border-2 px-[15px] py-3"
          style={{ background: "var(--check-red-bg)", borderColor: "var(--check-red-border)" }}
        >
          <motion.div variants={rowItem} className="flex items-center gap-2.5">
            <Image src="/images/logox.svg" alt="" width={16} height={16} />
            <p className="text-[16px] font-bold tracking-tight" style={{ color: "var(--check-red-title)" }}>
              SEM APLICAR O CARBMAXXING
            </p>
          </motion.div>
          <div className="flex flex-col gap-3">
            {DRAWBACKS.map((b) => (
              <ChecklistRow key={b} positive={false}>
                {b}
              </ChecklistRow>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="flex flex-col gap-3.5 rounded-[15px] border-2 px-[15px] py-3"
        style={{ background: "rgba(255,252,235,0.2)", borderColor: "rgba(202,202,202,0.3)" }}
      >
        <span className="w-fit rounded-[5px] bg-[#414141] px-2 py-1 text-[10px] font-bold text-white">
          PARECE LOUCURA NÉ
        </span>
        <p className="text-[18px] font-semibold leading-[1.3] text-[#4f4f4f]">
          Com poucos ajustes sua dieta ajusta seu metabolismo da forma correta
          e trabalha a favor do seu shape.
        </p>
        <div className="flex w-full justify-between gap-2">
          <div className="relative aspect-[403/557] flex-1 overflow-hidden rounded-2xl bg-[#eee]">
            <Image src="/images/esquerda2.webp" alt="Antes" fill sizes="50vw" className="object-cover" />
          </div>
          <div className="relative aspect-[402/559] flex-1 overflow-hidden rounded-2xl bg-[#eee]">
            <Image src="/images/direita2.webp" alt="Depois" fill sizes="50vw" className="object-cover" />
          </div>
        </div>
        <p className="text-[14px] leading-[1.4] text-[#939393]">
          Eu comia literalmente 500 calorias a menos na primeira imagem e hoje
          tenho muito mais liberdade com um físico muito mais estético e seco
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <BadgeCard
          badge="OPORTUNIDADE DE PRIMEIRO ACESSO"
          badgeBg="#dfa228"
          bg="rgba(255,245,178,0.2)"
          border="rgba(236,213,120,0.3)"
          className="gap-2.5"
        >
          <p className="text-[18px] font-semibold leading-[1.3]" style={{ color: "var(--callout-amber-text)" }}>
            Você recebeu um voucher premiado por ter sido 1 dos 50 primeiros que
            chegaram até aqui e vai conseguir acessar a calculadora com um
            desconto gigante 🫡
          </p>
          <p className="text-[14px] leading-[1.4] text-[#6c6c6c]">
            Clique no botão abaixo para ter acesso à planilha e para garantir
            sua oportunidade de acessar a calculadora
          </p>
        </BadgeCard>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        variants={fadeUp}
      >
        <Button onClick={onNext} icon={<ArrowRight className="h-3.5 w-3.5" />}>
          Quero receber a planilha
        </Button>
      </motion.div>
    </div>
  );
}
