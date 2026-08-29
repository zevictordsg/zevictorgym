"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Key, Lock, MessageCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FaqItem } from "@/components/ui/FaqItem";
import { ArrowRight } from "../icons";
import type { FunnelScreenProps } from "../types";

// "O que está incluso" — os dois cards de preço reaproveitam a mesma lista;
// no card grátis só o primeiro item vem "ativo" (verde), o resto fica opaco
// pra deixar claro que é conteúdo exclusivo do ELITE — exatamente como no
// Figma (mesmo ícone verified.svg em ambos, só muda a opacidade do item).
const INCLUDES = [
  "Planilha para montar sua própria dieta",
  "Aulas científicas sobre cada pilar da dieta",
  "Aulas sobre calorias e cardio para a manutenção perfeita",
  'Aula desvendando o "hack" de macros',
  "Distribuição de calorias e refeições livres na prática",
  "Aulas sobre as bases da dieta para saciedade e prazer",
];

// linhas quebradas manualmente (em vez de deixar o texto quebrar sozinho)
// pra garantir que os três cards fiquem com exatamente duas linhas cada,
// independente do tamanho de cada palavra — visual mais harmônico em fileira.
const TRUST_BADGES = [
  { icon: Key, lines: ["Acesso", "imediato"], tileBg: "#7C5CFC" },
  { icon: Lock, lines: ["Compra", "segura"], tileBg: "var(--brand-green)" },
  { icon: null, lines: ["Suporte", "prioritário"], tileBg: "#2a2a2a", tileText: "24" },
] as const;

const FAQS = [
  {
    q: "Preciso seguir alguma dieta super restritiva?",
    a: "Não. O método Carbmaxxing é justamente o oposto: você aprende a distribuir carboidratos e calorias de um jeito que cabe refeições livres sem travar o resultado — nada de \"proibido comer isso\".",
  },
  {
    q: "Funciona pra emagrecer e pra ganhar massa?",
    a: "Sim. A estrutura é a mesma (organização de macros e calorias), só muda o objetivo que você define dentro da planilha — funciona tanto pra quem quer secar quanto pra quem quer ganhar músculo.",
  },
  {
    q: "Em quanto tempo eu vejo resultado?",
    a: "Isso depende da sua consistência, mas a maioria dos alunos sente diferença já nas primeiras semanas aplicando a estrutura corretamente — o material foi feito pra ser simples de seguir no dia a dia.",
  },
  {
    q: "Como funciona a garantia de 7 dias?",
    a: "Se por qualquer motivo você não ficar satisfeito nos primeiros 7 dias após a compra, é só pedir o reembolso — devolvemos 100% do valor, sem burocracia e sem perguntas.",
  },
  {
    q: "Vou ter suporte depois de comprar?",
    a: "Sim, quem entra na ELITE Carbmaxxing tem acesso a suporte prioritário pra tirar dúvidas sobre a aplicação do método — você não fica sozinho no processo.",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

function IncludeRow({ label, active }: { label: string; active: boolean }) {
  return (
    <div className={cnRow(active)}>
      <Image src="/images/verified.svg" alt="" width={11.5} height={11.5} className="shrink-0" />
      <p
        className="text-[12px] leading-[1.4] tracking-[-0.36px]"
        style={{ color: active ? "var(--check-green-text)" : "#535353" }}
      >
        {label}
      </p>
    </div>
  );
}

function cnRow(active: boolean) {
  return `flex w-full items-center gap-1.5 ${active ? "" : "opacity-50"}`;
}

export function Screen09FinalOffer({ onNext }: FunnelScreenProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-full bg-dark-screen-bg px-5 pb-[calc(env(safe-area-inset-bottom)+32px)] pt-[calc(env(safe-area-inset-top)+24px)]"
    >
      <div className="flex flex-col gap-8">
        {/* aviso de validade do desconto — sólido (não translúcido) pra
            destacar sobre o fundo escuro, diferente do Callout padrão que é
            usado nas telas de fundo claro */}
        <motion.div
          variants={item}
          className="w-full rounded-[15px] border-2 px-[15px] py-3 text-center text-[16px] font-semibold leading-snug"
          style={{ background: "#fff5b2", borderColor: "rgba(236,213,120,0.3)", color: "#bb8543" }}
        >
          Este desconto é aplicável somente no dia que foi resgatado o
          voucher 11/08/2026
        </motion.div>

        <motion.div variants={item} className="flex flex-col gap-3 text-center text-white">
          <h1 className="text-[28px] font-semibold leading-[1.1] tracking-[-1.12px]">
            Seu acesso está quase
            <br />
            liberado para uso!
          </h1>
          <p className="text-[16px] leading-[1.4] tracking-[-0.48px] text-white/50">
            Escolha entre baixar a planilha gratuitamente, ou entender no
            passo a passo como tudo se estrutura para ter ainda mais
            liberdade no processo.
          </p>
        </motion.div>

        {/* card grátis */}
        <motion.div
          variants={item}
          className="flex w-full flex-col items-center gap-[17px] rounded-[16px] bg-white p-6"
        >
          <p className="w-full text-[28px] font-semibold leading-[1.1] tracking-[-1.12px] text-[#151515]">
            Planilha para estruturar sua dieta
          </p>
          <p className="w-full text-[44px] font-semibold leading-[1.1] tracking-[-1.76px] text-[#151515] opacity-30">
            R$0,00
          </p>
          <p className="w-full text-[14px] font-semibold leading-[1.1] tracking-[-0.56px] text-[#c40000] opacity-70">
            ⚠️ PDF gratuito para você montar sua dieta
          </p>
          <p className="w-full text-[12px] leading-[1.4] tracking-[-0.48px] text-[#696969] opacity-70">
            Criado por quem verdadeiramente testou o hack de macros e
            obteve o resultado que sempre quis ter.
          </p>
          <p className="w-full text-[14px] font-bold leading-[1.4] tracking-[-0.56px] text-[#696969]">
            O que está incluso
          </p>
          <div className="flex w-full flex-col gap-3">
            {INCLUDES.map((label, i) => (
              <IncludeRow key={label} label={label} active={i === 0} />
            ))}
          </div>
          <Button variant="dark-gradient" onClick={onNext}>
            Quero apenas baixar o PDF
          </Button>
        </motion.div>

        {/* card ELITE — mais destacado que o card grátis: borda e glow
            brancos, um pouco maior, "flutuando" sobre o card acima */}
        <motion.div
          variants={item}
          className="relative z-10 -mt-2 flex w-full scale-[1.02] flex-col items-start gap-[17px] rounded-[20px] border-2 border-white bg-white p-7 shadow-[0_16px_40px_rgba(255,255,255,0.3)]"
        >
          <div className="flex w-full items-center justify-center rounded-[9px] bg-[#bfe401] p-2.5">
            <p className="text-[14px] font-semibold leading-[1.1] tracking-[-0.56px] text-[#151515]">
              🔥 85% de desconto 🔥
            </p>
          </div>
          <div className="relative aspect-[290/77] w-full max-w-[240px] self-center">
            <Image src="/images/logo2.svg" alt="Carbmaxxing ELITE" fill className="object-contain" />
          </div>
          <div className="flex flex-col gap-2 leading-[1.1] text-[#151515]">
            <div className="flex items-end gap-1">
              <span className="text-[24px] font-semibold tracking-[-0.96px]">R$</span>
              <span className="text-[44px] font-semibold tracking-[-1.76px]">47,90</span>
              <span className="text-[16px] font-normal tracking-[-0.64px] opacity-30">
                à vista
              </span>
            </div>
            <p className="text-[18px] font-semibold tracking-[-0.72px]">ou 7x de R$6,32</p>
          </div>
          <p className="w-full text-[12px] leading-[1.4] tracking-[-0.48px] text-[#696969] opacity-70">
            Oportunidade exclusiva de acesso a comunidade Carbmaxxing ELITE
          </p>
          <p className="w-full text-[14px] font-bold leading-[1.4] tracking-[-0.56px] text-[#696969]">
            O que está incluso
          </p>
          <div className="flex w-full flex-col gap-3">
            {INCLUDES.map((label) => (
              <IncludeRow key={label} label={label} active />
            ))}
          </div>
          <Button variant="brand" onClick={onNext} icon={<ArrowRight className="h-3.5 w-3.5" />}>
            Entrar na ELITE Carbmaxxing
          </Button>
        </motion.div>

        {/* selos de confiança */}
        <motion.div variants={item} className="grid w-full grid-cols-3 gap-2.5">
          {TRUST_BADGES.map((b) => (
            <div
              key={b.lines.join(" ")}
              className="flex flex-col items-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.05] px-2 py-3.5 text-center"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-[10px] text-white"
                style={{ background: b.tileBg }}
              >
                {b.icon ? <b.icon className="h-4 w-4" /> : <span className="text-[13px] font-bold">{b.tileText}</span>}
              </span>
              <span className="text-[11px] font-semibold leading-[1.25] text-white/70">
                {b.lines[0]}
                <br />
                {b.lines[1]}
              </span>
            </div>
          ))}
        </motion.div>

        {/* garantia */}
        <motion.div
          variants={item}
          className="flex w-full flex-col gap-2.5 rounded-[16px] bg-white p-5"
        >
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 shrink-0 text-[#151515]" />
            <p className="text-[16px] font-bold leading-[1.3] text-[#151515]">
              Garantia Incondicional de 7 dias
            </p>
          </div>
          <p className="text-[13px] leading-[1.45] text-[#696969]">
            Se por qualquer motivo você não ficar satisfeito nos primeiros 7
            dias, devolvemos 100% do seu investimento. Sem burocracia, sem
            perguntas.
          </p>
        </motion.div>

        {/* CTA WhatsApp — número de placeholder, troque pelo real do consultor */}
        <motion.div variants={item}>
          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2.5 rounded-[15px] bg-[#25D366] px-[15px] py-[15px] text-[16px] font-medium tracking-tight text-white shadow-[0_4px_7.95px_rgba(0,0,0,0.1)] transition-[filter] hover:brightness-105"
          >
            <MessageCircle className="h-4 w-4" fill="currentColor" />
            Falar com consultor no WhatsApp
          </a>
        </motion.div>

        {/* perguntas frequentes */}
        <motion.div variants={item} className="flex flex-col gap-4">
          <h2 className="text-[20px] font-bold tracking-[-0.6px] text-white">
            Perguntas Frequentes
          </h2>
          <div className="flex flex-col gap-2.5">
            {FAQS.map((f) => (
              <FaqItem key={f.q} question={f.q} answer={f.a} tone="dark" />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
