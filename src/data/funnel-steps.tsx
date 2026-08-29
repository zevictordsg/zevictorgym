import type { ComponentType } from "react";
import { Screen01Hook } from "@/components/funnel/screens/Screen01Hook";
import { Screen02VSL } from "@/components/funnel/screens/Screen02VSL";
import { Screen03CalorieReveal } from "@/components/funnel/screens/Screen03CalorieReveal";
import { Screen04ModelComparison } from "@/components/funnel/screens/Screen04ModelComparison";
import { Screen05WhatsApp } from "@/components/funnel/screens/Screen05WhatsApp";
import { Screen05GrowthChart } from "@/components/funnel/screens/Screen05GrowthChart";
import { Screen06ComparisonScroll } from "@/components/funnel/screens/Screen06ComparisonScroll";
import { Screen07VoucherSpin } from "@/components/funnel/screens/Screen07VoucherSpin";
import { Screen08ObjectionBreak } from "@/components/funnel/screens/Screen08ObjectionBreak";
import { Screen09FinalOffer } from "@/components/funnel/screens/Screen09FinalOffer";
import type { FunnelScreenProps } from "@/components/funnel/types";

export type FunnelStep = {
  id: string;
  Component: ComponentType<FunnelScreenProps>;
  /** esconde o header padrão (voltar + progresso) — tela cuida do próprio chrome */
  bare?: boolean;
  /** cor dos ícones do header quando `bare` é false */
  theme?: "light" | "dark";
};

/**
 * Registro central do funil, sincronizado com o arquivo Figma
 * (node-ids conferidos via MCP em 2026-08-25):
 *
 *  1. hook                 — node 2364:4236  ✅ implementada
 *  2. vsl                  — node 2364:4306  ✅ implementada (vídeo placeholder)
 *  3. calorie-reveal        — node 2364:4335  ✅ implementada
 *  4. model-comparison      — node 2364:4442  ✅ implementada
 *  5. whatsapp              — node 2373:2     ✅ implementada
 *  5b. growth-chart         — sem node no Figma; construída a partir de
 *      print de referência (dashboard de resultados) e adaptada pro
 *      contexto da dieta — fica entre o whatsapp e a comparação de
 *      benefícios, tema escuro igual ao voucher/oferta final
 *  6. comparison-scroll     — node 2373:1472  ✅ implementada
 *  7. voucher               — node 2374:1638  ✅ implementada
 *  8. objection-break       — node 2375:1746  ✅ implementada
 *  9. final-offer           — node 2388:1829  ✅ implementada (planilha grátis
 *     vs Carbmaxxing ELITE; selos de confiança, garantia e FAQ abaixo dos
 *     cards seguem a referência enviada, não têm node próprio no Figma)
 */
export const FUNNEL_STEPS: FunnelStep[] = [
  { id: "hook", Component: Screen01Hook, bare: true },
  { id: "vsl", Component: Screen02VSL, bare: true },
  { id: "calorie-reveal", Component: Screen03CalorieReveal, bare: true },
  { id: "model-comparison", Component: Screen04ModelComparison, bare: true },
  { id: "whatsapp", Component: Screen05WhatsApp, bare: true },
  { id: "growth-chart", Component: Screen05GrowthChart, bare: true, theme: "dark" },
  { id: "comparison-scroll", Component: Screen06ComparisonScroll, bare: true },
  { id: "voucher", Component: Screen07VoucherSpin, bare: true, theme: "dark" },
  { id: "objection-break", Component: Screen08ObjectionBreak, bare: true, theme: "light" },
  { id: "final-offer", Component: Screen09FinalOffer, bare: true, theme: "dark" },
];
