import type { Metadata, Viewport } from "next";
import { instrumentSans, logoScript } from "@/lib/fonts";
import "./globals.css";

// Fallback — cada rota (`/` e `/planilhadohack`) define seu próprio
// metadata/viewport mais específico, isso aqui só cobre o caso de uma
// rota nova que ainda não tenha o próprio.
export const metadata: Metadata = {
  title: "Zé Victor",
  description: "Hackeando a fisiologia a favor da estética.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${instrumentSans.variable} ${logoScript.variable} h-full antialiased`}
    >
      <body className="h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
