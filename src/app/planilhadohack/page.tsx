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
    <>
      {/*
        Hints de carregamento pro player VTurb (VSL da Screen02) — só essa
        rota usa o player, então ficam aqui em vez do layout raiz. O App
        Router do Next "iça" (hoist) automaticamente qualquer
        <link>/<script> renderizado num Server Component pro <head> real
        do documento, então não precisam estar dentro de <head> manual.
      */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            '!function(i,n){i._plt=i._plt||(n&&n.timeOrigin?n.timeOrigin+n.now():Date.now())}(window,performance);',
        }}
      />
      <link
        rel="preload"
        href="https://scripts.converteai.net/a4150f7c-18fa-4974-9849-7f2765acd263/players/6a9bb538f5882a0f8e3b448e/v4/player.js"
        as="script"
      />
      <link
        rel="preload"
        href="https://scripts.converteai.net/lib/js/smartplayer-wc/v4/smartplayer.js"
        as="script"
      />
      <link
        rel="preload"
        href="https://cdn.converteai.net/a4150f7c-18fa-4974-9849-7f2765acd263/6a9bb5208dabdd364b5081c3/main.m3u8"
        as="fetch"
      />
      <link rel="dns-prefetch" href="https://cdn.converteai.net" />
      <link rel="dns-prefetch" href="https://scripts.converteai.net" />
      <link rel="dns-prefetch" href="https://images.converteai.net" />
      <link rel="dns-prefetch" href="https://license.vturb.com" />

      {/* Funil desenhado mobile-first: no desktop ele ocupa a área branca da
          tela inteira (sem moldura de celular), mas o conteúdo em si fica
          centralizado numa coluna com a largura de referência do Figma. */}
      <main className="min-h-dvh w-full bg-background">
        <div className="relative mx-auto h-dvh w-full max-w-[430px] overflow-hidden bg-background">
          <FunnelEngine />
        </div>
      </main>
    </>
  );
}
