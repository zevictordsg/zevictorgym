import { Instrument_Sans, Instrument_Serif } from "next/font/google";

// Fonte principal do funil (extraída do Figma: "Instrument Sans" Medium/SemiBold/Bold)
export const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
  display: "swap",
});

// Aproximação do traço cursivo do símbolo "C." do logo (o original é um vetor
// desenhado à mão no Figma — troque `Logo.tsx` pelo SVG exportado do arquivo
// quando quiser fidelidade 1:1).
export const logoScript = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-logo-script",
  display: "swap",
});
