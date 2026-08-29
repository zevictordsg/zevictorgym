"use client";

import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { ArrowRight } from "../icons";
import type { FunnelScreenProps } from "../types";

/**
 * Tela de "prova social com gráfico de crescimento" — sem node no Figma,
 * construída a partir de uma referência de dashboard de resultados (print
 * enviado pelo usuário) e adaptada pro contexto da dieta: em vez de
 * "modelo de negócio", mostra a evolução de quem aprendeu a hora certa de
 * aplicar o carboidrato e estruturar as calorias certas. Fica entre o
 * WhatsApp e a tela de comparação de benefícios. `bare: true` + tema
 * escuro, igual ao voucher e à oferta final.
 */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai"];

// Curva desenhada à mão (não é dado real) só pra passar a sensação de
// evolução constante — sobe com um pequeno platô no início e acelera no
// final, terminando no mês atual em destaque.
const CHART_W = 300;
const CHART_H = 110;
const AREA_PATH =
  "M0,96 C22,94 34,88 52,84 C74,79 82,62 104,54 C128,45 138,30 162,24 C188,17 204,14 226,10 C252,6 276,4 300,2";

export function Screen05GrowthChart({ onNext }: FunnelScreenProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex h-full min-h-0 flex-col justify-between gap-5 bg-dark-screen-bg px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-[calc(env(safe-area-inset-top)+24px)]"
    >
      <motion.div variants={item} className="flex flex-col gap-2 text-center">
        <h1 className="text-[23px] font-semibold leading-[1.15] tracking-tight text-white">
          Isso é o que acontece quando você acerta a{" "}
          <span className="text-brand-green-deep">hora certa</span> do
          carboidrato🔥
        </h1>
        <p className="text-[13px] leading-[1.4] text-white/50">
          Esse é o gráfico de evolução de quem aprendeu a estruturar a dieta
          com as calorias certas através do nosso sistema inteligente.
        </p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2 rounded-[18px] bg-dark-card-bg p-3.5">
          <p className="text-[10px] font-medium uppercase tracking-[0.5px] text-white/40">
            Usando a planilha
          </p>
          <CountUp
            to={124}
            className="text-[26px] font-semibold tracking-[-0.6px] text-white"
          />
          <span className="flex items-center gap-1 text-[12px] font-semibold text-brand-green-deep">
            ▲ +18%
          </span>
        </div>
        <div className="flex flex-col gap-2 rounded-[18px] bg-dark-card-bg p-3.5">
          <p className="text-[10px] font-medium uppercase tracking-[0.5px] text-white/40">
            Energia extra
          </p>
          <p className="text-[26px] font-semibold tracking-[-0.6px] text-white">
            +1000 kcal
          </p>
          <span className="text-[12px] font-semibold text-brand-green-deep">
            ▲ Na 1ª semana
          </span>
        </div>
      </motion.div>

      <motion.div
        variants={item}
        className="flex min-h-0 flex-1 flex-col gap-2 rounded-[20px] bg-dark-card-bg p-4"
      >
        <div className="flex flex-col gap-0.5">
          <p className="text-[13px] font-bold text-white/80">
            Resultado total de alunos
          </p>
          <p className="text-[11px] text-white/40">
            Evolução de quem aplicou o método nos últimos 3 meses
          </p>
        </div>
        <CountUp
          to={412}
          className="text-[28px] font-semibold tracking-[-0.9px] text-white"
        />

        <div className="relative min-h-0 flex-1">
          <svg
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            className="h-full w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--brand-green-deep)" stopOpacity="0.45" />
                <stop offset="100%" stopColor="var(--brand-green-deep)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d={`${AREA_PATH} L${CHART_W},${CHART_H} L0,${CHART_H} Z`}
              fill="url(#growthFill)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            />
            <motion.path
              d={AREA_PATH}
              fill="none"
              stroke="var(--brand-green-deep)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.45, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.circle
              cx={226}
              cy={10}
              r={4}
              fill="var(--brand-green-deep)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.3, ease: "backOut" }}
            />
          </svg>

          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.3, ease: "backOut" }}
            className="absolute rounded-full bg-white px-2 py-1 text-[11px] font-bold text-[#151515] shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
            style={{ left: "75.3%", top: "9%", transform: "translate(-50%, -100%)" }}
          >
            +34%
          </motion.span>
        </div>

        <div className="flex justify-between px-0.5 text-[10px] font-medium text-white/30">
          {MONTHS.map((m) => (
            <span key={m} className={m === "Abr" ? "font-bold text-white" : undefined}>
              {m}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Button onClick={onNext} icon={<ArrowRight className="h-3.5 w-3.5" />}>
          Quero entender como
        </Button>
      </motion.div>
    </motion.div>
  );
}
