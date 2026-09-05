"use client";

import { useEffect, useState, type ComponentType, type SVGProps } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DiscordIcon, SpotifyIcon } from "./icons";

/**
 * Página de links pessoal ("link-in-bio") — fica na raiz do site (`/`), com
 * o funil da planilha movido pra `/planilhadohack`. Fundo `#000000` porque
 * o recorte em `public/images/link.webp` já é puro preto com alfa variável
 * (confirmado via PIL: RGB 0,0,0 em toda a borda esfumaçada) — colado sobre
 * esse tom específico, a transição do retrato pro fundo da página fica
 * costurada sem nenhuma borda visível.
 *
 * `html`/`body` (definidos no layout raiz, compartilhado com a rota clara
 * do funil) ficam brancos por padrão — sem ajuste, um "arrastão" no celular
 * (rubber-band/overscroll no iOS) revela esse branco por trás do conteúdo.
 * O `useEffect` abaixo tinge os dois de `#000000` enquanto essa tela está
 * montada e devolve a cor original ao desmontar, sem precisar duplicar o
 * layout raiz numa rota separada só por causa disso.
 *
 * Estética inspirada nas referências "Blank School" que o usuário enviou:
 * paleta quase monocromática, tipografia serifada itálica pontual (reusa
 * `font-script`/Instrument Serif já carregada pro logo do Carbmaxxing) e
 * cartões escuros com hairline — aqui adaptado pra botões de link com um
 * toque de cor por plataforma nos badges de ícone.
 */

const PAGE_BG = "#000000";

type LinkItem = {
  key: string;
  href: string;
  label: string;
  subtitle: string;
  /** ícone via componente (lucide ou SVG de marca) — usado quando `iconImage` não é passado */
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  /** ícone via imagem (ex: o app icon real do AuraLab) — sobrepõe `icon` quando presente */
  iconImage?: string;
  color: string;
  external: boolean;
  primary?: boolean;
};

// tom neutro compartilhado pelos badges "preto e branco" (todos menos o
// Discord, que mantém a cor de marca pra ficar reconhecível de cara)
const MONO = "#d4d4d4";

const LINKS: LinkItem[] = [
  // Instagram e TikTok removidos a pedido do usuário — o primeiro card
  // (gratuito, a planilha) é o destaque agora; ver `PlanilhaCard` abaixo,
  // renderizado antes deste `.map` em vez de entrar nessa lista genérica
  // (o layout do card dele é todo diferente de um `LinkRow` comum).
  {
    key: "auralab",
    href: "https://apps.apple.com/br/app/auralab/id6794130003",
    label: "App AuraLab",
    subtitle: "Organize treinos, dieta e hábitos",
    iconImage: "/images/app.webp",
    color: MONO,
    external: true,
  },
  {
    key: "discord",
    href: "https://discord.gg/ryMeXhjW",
    label: "Comunidade no Discord",
    subtitle: "Entre na comunidade do Carbmaxxing",
    icon: DiscordIcon,
    color: "#5865f2",
    external: true,
  },
  {
    key: "spotify",
    href: "https://open.spotify.com/playlist/2vt8Hqptib0TcdL1BldIqv?si=9992160f6e3e4f9e",
    label: "Playlist H4K3AD4",
    subtitle: "Playlist brutal que direciona o carbo",
    icon: SpotifyIcon,
    color: "#1db954",
    external: true,
  },
];

const container: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.09,
      delayChildren: 0.25,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

// Poeira/partículas sutis flutuando no fundo. Posições e tempos vêm de uma
// função pseudo-aleatória determinística (mesmo seed sempre gera o mesmo
// resultado) em vez de `Math.random()` puro — assim o HTML renderizado no
// servidor e no cliente batem exatamente, sem warning de hydration mismatch.
function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const PARTICLE_COUNT = 22;
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  left: seededRandom(i * 3 + 1) * 100,
  top: seededRandom(i * 3 + 2) * 100,
  size: 1 + seededRandom(i * 3 + 3) * 1.6,
  duration: 7 + seededRandom(i * 7 + 1) * 9,
  delay: seededRandom(i * 7 + 2) * 6,
  drift: 12 + seededRandom(i * 7 + 3) * 20,
}));

function Particles() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -p.drift, 0], opacity: [0, 0.35, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function LinkRow({ data }: { data: LinkItem }) {
  const Icon = data.icon;
  const ArrowIcon = data.external ? ArrowUpRight : ArrowRight;

  return (
    <motion.a
      href={data.href}
      target={data.external ? "_blank" : undefined}
      rel={data.external ? "noopener noreferrer" : undefined}
      variants={item}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn(
        "group relative flex w-full items-center gap-3.5 overflow-hidden rounded-[18px] border px-4 py-3.5 backdrop-blur-sm transition-colors duration-200",
        data.primary
          ? "border-[#34c16d]/40 bg-[#34c16d]/[0.08] shadow-[0_10px_30px_rgba(52,193,109,0.16)]"
          : "border-white/[0.08] bg-white/[0.035] hover:border-white/[0.16] hover:bg-white/[0.06]"
      )}
    >
      {/* fio de luz no topo do card — reforça a leitura "de vidro" sem
          precisar de mais cor */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />

      {data.primary && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[18px]"
          style={{ boxShadow: "0 0 0 1px rgba(52,193,109,0.35)" }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {data.iconImage ? (
        <span className="relative z-10 h-11 w-11 shrink-0 overflow-hidden rounded-[13px] ring-1 ring-white/10">
          <Image
            src={data.iconImage}
            alt=""
            fill
            sizes="44px"
            className="object-cover"
          />
        </span>
      ) : (
        Icon && (
          <span
            className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px]"
            style={{ background: `${data.color}20`, color: data.color }}
          >
            <Icon className="h-5 w-5" />
          </span>
        )
      )}

      <span className="relative z-10 flex min-w-0 flex-1 flex-col items-start text-left">
        <span className="text-[15px] font-semibold tracking-[-0.2px] text-white">
          {data.label}
        </span>
        <span className="text-[12px] text-white/40">{data.subtitle}</span>
      </span>

      <ArrowIcon className="relative z-10 h-4 w-4 shrink-0 text-white/30 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-white/80" />
    </motion.a>
  );
}

/**
 * Card de destaque da planilha gratuita — primeiro item da lista, com
 * estrutura própria (bem diferente do `LinkRow` genérico dos outros links):
 * mockup 3D do livro no topo, esmaecendo pra preto, tag "[Gratuita]",
 * título, subtítulo e um botão pílula branco "Quero Acessar".
 *
 * Estrutura 1:1 com o node do Figma (Aura 2.0, "Frame 1171276589",
 * node-id 2536:63): mesma composição imagem→gradiente→tag→título→
 * subtítulo→pílula, usando `bgcard.webp` (mockup mono/prateado do livro,
 * 2216×3004 — mesma peça já usada como capa desse PDF na área de membros).
 *
 * A janela da imagem é mais baixa que a altura natural dela nessa largura
 * (~518px num card de 382px ⇒ ~311px, uns 40% a menos): a imagem continua
 * inteira por trás, só "a janela" encolhe, com `object-top` — o livro já
 * começa colado no topo do próprio arquivo `bgcard.webp` (sem margem
 * morta acima dele), então esse corte mais curto tira exatamente o excesso
 * de baixo (lombada + preto vazio) e deixa o card mais compacto sem
 * cortar título/subtítulo, igual à referência do Figma.
 *
 * Animação/hairline/hover seguem a mesma linguagem do `LinkRow` (fio de
 * luz no topo, `whileHover`/`whileTap`, cantos arredondados com borda
 * translúcida) — só a escala e a composição interna que mudam por ser o
 * card principal da página.
 */
function PlanilhaCard() {
  return (
    <motion.a
      href="/planilhadohack"
      variants={item}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="group relative flex w-full flex-col justify-end overflow-hidden rounded-[28px] border border-white/[0.14] bg-black"
    >
      {/* fio de luz no topo do card — mesmo detalhe dos outros cards */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />

      {/* mockup do livro, esmaecendo pra preto até virar o bloco de texto —
          altura fixa menor que a natural da imagem (ver comentário acima),
          cortando o excesso de baixo por trás da máscara do card */}
      <div className="relative h-[311px] w-full shrink-0 overflow-hidden">
        {/* imagem + gradiente dentro do MESMO wrapper que recebe o scale do
            hover — assim os dois crescem juntos e o gradiente nunca fica
            "para trás" revelando um pedaço não-esmaecido da imagem (bug
            de quando só a imagem escalava e o gradiente ficava parado) */}
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.03]">
          <Image
            src="/images/bgcard.webp"
            alt="Como Montar Sua Própria Dieta — planilha gratuita"
            fill
            sizes="(max-width: 430px) 100vw, 430px"
            priority
            className="object-cover object-top"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ backgroundImage: "linear-gradient(to bottom, transparent 0%, transparent 55%, #000 96%)" }}
          />
        </div>
      </div>

      <div className="relative z-10 -mt-6 flex flex-col gap-4 px-6 pb-6">
        <div className="flex flex-col gap-1 text-white">
          <p className="text-[13px] font-bold tracking-[-0.2px]">[Gratuita]</p>
          <p className="text-[27px] font-bold leading-[1.08] tracking-[-0.6px]">
            Planilha de Dieta
          </p>
        </div>

        <p className="text-[13px] font-medium leading-[1.4] text-white/55">
          Entenda como secar e ganhar músculo enquanto come muito mais!
        </p>

        <span className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-[999px] bg-white px-4 py-2 text-[16px] font-bold text-black/70 transition-colors duration-200 group-hover:text-black">
          Quero Acessar
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </motion.a>
  );
}

export function LinkInBio() {
  // O navegador só promove o elemento pra uma camada de composição própria
  // (necessária pro mix-blend-mode) quando ele começa a pintar — nos
  // primeiros quadros a imagem pode aparecer sem a mesclagem ainda ativa
  // (o "flash" reportado). `willChange` força essa camada a existir desde
  // o primeiro render, e o `onLoad` só revela a imagem (opacity 0 → 1)
  // depois que ela já decodificou com a mesclagem aplicada — cinto e
  // suspensório: o hint de composição resolve a causa, o fade cobre
  // qualquer navegador que ainda assim pinte um quadro sem ela.
  const [portraitLoaded, setPortraitLoaded] = useState(false);

  // Tinge html/body de #0c0c0c enquanto essa tela está montada, pra não
  // aparecer branco atrás durante o rubber-band/overscroll no mobile —
  // reverte pra cor original ao sair da rota (ex: indo pro /planilhadohack).
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const prevRoot = root.style.backgroundColor;
    const prevBody = body.style.backgroundColor;
    root.style.backgroundColor = PAGE_BG;
    body.style.backgroundColor = PAGE_BG;
    return () => {
      root.style.backgroundColor = prevRoot;
      body.style.backgroundColor = prevBody;
    };
  }, []);

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-[#000000]">
      {/* mesmo fluxo único de antes (logo → foto → @/frase → botões), com
          sobreposição de propósito: logo, frase e botões têm z-index
          explícito (z-10) e a foto NÃO tem — fica no nível "auto" padrão,
          então esses elementos ainda pintam por cima dela na ordem certa.
          Importante: a foto propositalmente não recebe nenhum z-index
          próprio. Dar um z-index numérico ao contêiner dela criaria um
          novo "stacking context" isolado, e o mix-blend-mode dentro dele
          passaria a mesclar só com o fundo transparente desse contêiner
          (nada visível) em vez do preto da página — foi exatamente isso
          que quebrou o modo lighten antes.

          A coluna em si (este `motion.div`) TAMBÉM não recebe z-index
          próprio, de propósito: sem um número aqui, ela não cria seu
          próprio stacking context, e os z-index dos filhos (logo/frase/
          botões/rodapé) "escapam" e competem diretamente com o blur do
          rodapé lá embaixo (z-20) no nível mais alto da página. Foi dar
          z-10 nela que impedia até um z-30 no rodapé de furar por cima do
          blur — a coluna inteira pintava como um bloco só, abaixo dele. */}
      <Particles />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col items-center px-6 pb-[calc(env(safe-area-inset-bottom)+40px)] pt-[calc(env(safe-area-inset-top)+28px)]"
      >
        <motion.div variants={item} className="relative z-10 h-[22px] w-[26px]">
          <Image src="/images/zlogo.svg" alt="" fill priority className="object-contain" />
        </motion.div>

        {/* -mt-16 puxa a foto ainda mais pra cima, por baixo da logo; ~8%
            menor que antes (108vw/483px → 99vw/444px); sem movimento
            próprio (parada), só o fade de entrada; sem z-index aqui de
            propósito (ver comentário acima) */}
        <motion.div
          variants={item}
          className="relative -mt-16 aspect-[1108/1235] w-[99vw] max-w-[444px]"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: portraitLoaded ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src="/images/link.webp"
              alt="Zé Victor"
              fill
              priority
              sizes="444px"
              onLoad={() => setPortraitLoaded(true)}
              className="mix-blend-lighten object-contain"
              style={{ willChange: "mix-blend-mode, opacity", transform: "translateZ(0)" }}
            />
          </motion.div>
        </motion.div>

        {/* -mt-28: frase sobe ainda mais, sobrepondo mais a base da foto (z-10 > auto da foto) */}
        <motion.div
          variants={item}
          className="relative z-10 -mt-28 flex flex-col items-center gap-2.5 text-center"
        >
          <p className="text-[19px] font-semibold tracking-[-0.3px] text-white">
            @zevictor.gym
          </p>
          <p className="max-w-[280px] font-script text-[17px] italic leading-[1.4] text-white/50">
            &ldquo;Hackeando a fisiologia a favor da estética&rdquo;
          </p>
        </motion.div>

        {/* mt-10: mais respiro ainda entre o bloco @/frase e os botões */}
        <div className="relative z-10 mt-10 flex w-full flex-col gap-3">
          <PlanilhaCard />
          {LINKS.map((l) => (
            <LinkRow key={l.key} data={l} />
          ))}
        </div>

        {/* de volta ao fluxo normal (a coluna acima não tem mais z-index
            próprio, então o z-30 aqui já basta pra ficar por cima do blur,
            z-20, sem precisar tirar o rodapé da coluna). Revela sozinho,
            com atraso, depois do resto da página — fade + blur vindo de
            baixo pra cima — em vez de entrar junto com o stagger geral. */}
        <motion.p
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          animate={{ opacity: 0.45, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-30 mt-10 text-[10px] uppercase tracking-[1.5px] text-neutral-400"
        >
          © 2026 ZEVICTORGYM
        </motion.p>
      </motion.div>

      {/* blur no rodapé — fixo na viewport (não rola junto com o conteúdo).
          Só o desfoque progressivo, sem nenhum degradê de opacidade/cor por
          cima (não escurece pra preto, só borra). Mesma técnica das outras
          telas do funil: um único backdrop-filter tem borda dura (o blur
          não varia de intensidade dentro do mesmo elemento), então
          empilhamos camadas com blur crescente, cada uma mascarada num
          ponto diferente do degradê. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-32">
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 55%, black 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 55%, black 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            maskImage: "linear-gradient(to bottom, transparent 45%, black 75%, black 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 45%, black 75%, black 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            maskImage: "linear-gradient(to bottom, transparent 70%, black 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 70%, black 100%)",
          }}
        />
      </div>
    </div>
  );
}
