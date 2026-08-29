import type { Metadata, Viewport } from "next";
import { FunnelEngine } from "@/components/funnel/FunnelEngine";

export const metadata: Metadata = {
  title: "Carbmaxxing® — O hack de macros para secar comendo mais",
  description:
    "Descubra o hack de macros que libera até 1000kcal a mais na sua dieta sem parar de perder gordura.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function PlanilhaDoHack() {
  return (
    // Funil desenhado mobile-first: no desktop ele ocupa a área branca da
    // tela inteira (sem moldura de celular), mas o conteúdo em si fica
    // centralizado numa coluna com a largura de referência do Figma.
    <main className="min-h-dvh w-full bg-background">
      <div className="relative mx-auto h-dvh w-full max-w-[430px] overflow-hidden bg-background">
        <FunnelEngine />
      </div>
    </main>
  );
}
