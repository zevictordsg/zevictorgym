"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, Mic, Pause, Phone, Play, Send, Smile, Video } from "lucide-react";
import type { FunnelScreenProps } from "../types";

/**
 * Roteiro do chat com respostas em botão (o "usuário" nunca digita — toca
 * numa das opções pra continuar a conversa). Cada bloco tem: 1+ mensagens
 * do Zé (texto ou áudio) reveladas com indicador de "digitando…", seguidas
 * de 1+ opções tocáveis. Só UMA opção fica visível/tocável por vez — depois
 * do toque ela "trava" no histórico com o estilo de mensagem enviada normal
 * (balão verde + selo de confirmado), e só então o próximo bloco começa.
 */
type MessageContent =
  | { kind: "text"; text: string }
  | { kind: "audio"; src: string };

type Block = {
  id: string;
  messages: MessageContent[];
  options: string[];
  /** só o Bloco 1 usa isso — legenda "toque para responder" acima da opção */
  hint?: boolean;
  /** Bloco 7 — mostra o contador de vagas restantes (valor ao vivo, ver useSpotsCountdown) */
  showSpotsCounter?: boolean;
  /** Bloco 9 — não é mais uma resposta de chat, é a navegação pra próxima tela */
  isFinal?: boolean;
};

const text = (t: string): MessageContent => ({ kind: "text", text: t });

const BLOCKS: Block[] = [
  {
    id: "opening",
    messages: [text("Oi! Aqui é o Zé 👋"), text("Vi que você acabou de pedir a planilha")],
    options: ["Isso mesmo 👊"],
    hint: true,
  },
  {
    id: "connection",
    messages: [
      text("Bora, ela já tá quase pronta pra te mandar aqui"),
      text(
        "Só uma coisa rápida antes: hoje seu foco é mais ganhar massa, secar, ou os dois ao mesmo tempo?"
      ),
    ],
    options: ["Ganhar massa", "Secar", "Os dois"],
  },
  {
    id: "confirm",
    messages: [
      text("Boa, é o que a maioria aqui busca também"),
      text("Sua planilha já tá garantida, só mais um passinho aqui e ela é sua"),
    ],
    options: ["Bora, qual passo?"],
  },
  {
    id: "gap",
    messages: [
      text("Só um adianto: quando ela chegar, você vai ver os números certos pra seguir"),
      text(
        'Mas ela sozinha não te explica o PORQUÊ: por que às vezes você come "certo" e mesmo assim não vê resultado'
      ),
    ],
    options: ["Comigo é assim 😅"],
  },
  {
    id: "introduce-opportunity",
    messages: [
      text(
        "Pois é. Foi exatamente pra resolver isso que eu gravei uma sequência de aulas explicando o método inteiro"
      ),
      text("Só que não é algo que eu deixo aberto pra qualquer um"),
    ],
    options: ["Por quê?"],
  },
  {
    id: "audio",
    messages: [{ kind: "audio", src: "/audio/audioze.mp3" }],
    options: ["Quero saber mais"],
  },
  {
    id: "offer-reveal",
    messages: [
      text(
        "As aulas explicam o método completo: o motivo real por trás dos seus números, não só a planilha pronta"
      ),
      text("Abri 50 vagas pra quem pegou a planilha nessa leva"),
    ],
    // TODO: quando existir backend, trocar useSpotsCountdown por uma leitura real da contagem de vagas.
    showSpotsCounter: true,
    options: ["Quero garantir minha vaga"],
  },
  {
    id: "reinforce",
    messages: [
      text("Não tem pegadinha: você vê o método completo, no seu tempo, direto comigo"),
      text("Só não posso deixar aberto pra sempre, senão vira só mais um curso engavetado"),
    ],
    options: ["Bora, quero entender"],
  },
  {
    id: "transition",
    messages: [text("Deixa eu te mostrar rapidinho o que muda de verdade se você entrar, ou se não entrar")],
    options: ["Ver os dois caminhos →"],
    isFinal: true,
  },
];

type Step =
  | { kind: "message"; content: MessageContent }
  | { kind: "choice"; options: string[]; hint?: boolean; showSpotsCounter?: boolean; isFinal?: boolean };

const STEPS: Step[] = BLOCKS.flatMap((b) => [
  ...b.messages.map((content) => ({ kind: "message" as const, content })),
  {
    kind: "choice" as const,
    options: b.options,
    hint: b.hint,
    showSpotsCounter: b.showSpotsCounter,
    isFinal: b.isFinal,
  },
]);

type HistoryItem =
  | { type: "friend-text"; text: string; time: string }
  | { type: "friend-audio"; src: string; time: string }
  | { type: "me"; text: string; time: string };

const TEXT_TYPING_DELAY = 850;
const AUDIO_TYPING_DELAY = 1300;
const FIRST_MESSAGE_EXTRA_DELAY = 450;

function timeForIndex(i: number) {
  const totalMinutes = 9 * 60 + 14 + i;
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const INITIAL_SPOTS = 37;
const MIN_SPOTS = 21;

/**
 * Contagem de vagas caindo aos poucos, mesmo espírito do contador ao vivo da
 * primeira tela — intervalos aleatórios, para num piso pra não zerar a
 * promessa da oferta. TODO: quando existir backend, trocar por leitura real.
 */
function useSpotsCountdown(start: number, floor: number) {
  const [spots, setSpots] = useState(start);

  useEffect(() => {
    let cancelled = false;
    let current = start;

    function scheduleNext() {
      if (current <= floor) return;
      const delay = 6000 + Math.random() * 9000;
      window.setTimeout(() => {
        if (cancelled) return;
        current = Math.max(floor, current - 1);
        setSpots(current);
        scheduleNext();
      }, delay);
    }

    scheduleNext();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return spots;
}

const WAVEFORM = [6, 10, 14, 8, 16, 12, 7, 18, 10, 14, 9, 6, 15, 11, 8, 17, 12, 6, 10, 14, 9, 16, 7, 12, 8, 5];
const PLACEHOLDER_AUDIO_DURATION = 26;

/** Balão de áudio estilo nota de voz do WhatsApp — play/pause + waveform + duração. */
function AudioBubble({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    const onLoaded = () => setDuration(audio.duration);
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {});
      setPlaying(true);
    }
  }

  const activeBars = Math.round(progress * WAVEFORM.length);
  const displaySeconds = Math.round(duration ?? PLACEHOLDER_AUDIO_DURATION);
  const mm = Math.floor(displaySeconds / 60);
  const ss = String(displaySeconds % 60).padStart(2, "0");

  return (
    <div className="flex max-w-[80%] items-center gap-2.5 rounded-xl bg-white px-2.5 py-2 shadow-[0_1px_0_rgba(0,0,0,0.08)]">
      <audio ref={audioRef} src={src} preload="metadata" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pausar áudio" : "Tocar áudio"}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-green text-white"
      >
        {playing ? (
          <Pause className="h-4 w-4" fill="currentColor" />
        ) : (
          <Play className="h-4 w-4 translate-x-0.5" fill="currentColor" />
        )}
      </button>
      <div className="flex flex-1 items-end gap-[2.5px]">
        {WAVEFORM.map((h, i) => (
          <span
            key={i}
            className="w-[2.5px] shrink-0 rounded-full transition-colors"
            style={{ height: h, background: i < activeBars ? "var(--brand-green)" : "#d9d9d9" }}
          />
        ))}
      </div>
      <span className="shrink-0 text-[11px] tabular-nums text-black/40">
        {mm}:{ss}
      </span>
    </div>
  );
}

export function Screen05WhatsApp({ onNext, onBack }: FunnelScreenProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [typing, setTyping] = useState<"none" | "text" | "audio">("none");
  const scrollRef = useRef<HTMLDivElement>(null);
  const spotsRemaining = useSpotsCountdown(INITIAL_SPOTS, MIN_SPOTS);

  useEffect(() => {
    const step = STEPS[stepIndex];
    if (!step || step.kind !== "message") return;

    const isAudio = step.content.kind === "audio";
    const base = isAudio ? AUDIO_TYPING_DELAY : TEXT_TYPING_DELAY;
    const delay = stepIndex === 0 ? base + FIRST_MESSAGE_EXTRA_DELAY : base;

    const startTypingTimer = window.setTimeout(
      () => setTyping(isAudio ? "audio" : "text"),
      0
    );

    const revealTimer = window.setTimeout(() => {
      setTyping("none");
      setHistory((h) => [
        ...h,
        step.content.kind === "text"
          ? { type: "friend-text", text: step.content.text, time: timeForIndex(h.length) }
          : { type: "friend-audio", src: step.content.src, time: timeForIndex(h.length) },
      ]);
      setStepIndex((i) => i + 1);
    }, delay);

    return () => {
      window.clearTimeout(startTypingTimer);
      window.clearTimeout(revealTimer);
    };
  }, [stepIndex]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history, typing, stepIndex]);

  const pendingChoice = STEPS[stepIndex]?.kind === "choice" ? (STEPS[stepIndex] as Extract<Step, { kind: "choice" }>) : null;

  function handleChoose(label: string) {
    if (pendingChoice?.isFinal) {
      onNext();
      return;
    }
    setHistory((h) => [...h, { type: "me", text: label, time: timeForIndex(h.length) }]);
    setStepIndex((i) => i + 1);
  }

  return (
    <div className="flex h-full flex-col bg-whatsapp-bg">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex shrink-0 items-center justify-between bg-white px-5 pb-3 pt-[calc(env(safe-area-inset-top)+12px)]"
      >
        <div className="flex items-center gap-2.5">
          <button onClick={onBack} className="mr-1 text-[#111]/40">
            <span className="sr-only">Voltar</span>‹
          </button>
          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#e4e4e4]">
            <Image src="/perfilze.jpg" alt="Zé Victor" fill sizes="36px" className="object-cover" />
          </span>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[16px] font-semibold text-[#0a0a0a]">Zé Victor</span>
              <BadgeCheck className="h-3 w-3 text-brand-green" />
            </div>
            <p className="text-xs text-[#22d37e]">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-brand-green">
          <Video className="h-5 w-5" strokeWidth={1.75} />
          <Phone className="h-4 w-4" strokeWidth={1.75} />
        </div>
      </motion.div>

      <div ref={scrollRef} className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {history.map((item, i) => {
          if (item.type === "me") {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className="flex justify-end"
              >
                <div className="max-w-[75%] rounded-xl bg-[#d0fecf] px-2.5 py-1.5 text-[15px] leading-[21px] text-[#0a0a0a] shadow-[0_1px_0_rgba(0,0,0,0.08)]">
                  <p className="whitespace-pre-line">
                    {item.text}
                    <span className="ml-1.5 inline-flex translate-y-[1px] items-center gap-1 align-bottom text-[11px] text-black/40">
                      {item.time}
                      <Image src="/images/mensagem.svg" alt="Enviado" width={14} height={14} />
                    </span>
                  </p>
                </div>
              </motion.div>
            );
          }

          if (item.type === "friend-audio") {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className="flex justify-start"
              >
                <AudioBubble src={item.src} />
              </motion.div>
            );
          }

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className="flex justify-start"
            >
              <div className="max-w-[75%] rounded-xl bg-white px-2.5 py-1.5 text-[15px] leading-[21px] text-[#0a0a0a] shadow-[0_1px_0_rgba(0,0,0,0.08)]">
                <p className="whitespace-pre-line">
                  {item.text}
                  <span className="ml-1.5 inline-block translate-y-[1px] align-bottom text-[11px] text-black/40">
                    {item.time}
                  </span>
                </p>
              </div>
            </motion.div>
          );
        })}

        <AnimatePresence mode="wait">
          {typing === "text" && (
            <motion.div
              key="typing-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-1 rounded-xl bg-white px-3 py-2.5 shadow-[0_1px_0_rgba(0,0,0,0.08)]">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-[#bbb]"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {typing === "audio" && (
            <motion.div
              key="typing-audio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-[0_1px_0_rgba(0,0,0,0.08)]">
                <motion.span
                  animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="flex text-brand-green"
                >
                  <Mic className="h-4 w-4" />
                </motion.span>
                <span className="text-[11px] text-black/40">gravando áudio…</span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Barra de composição simulando o WhatsApp — a(s) opção(ões) tocável(is)
          ficam dentro dela (campo de "texto" ou chips), em vez de flutuando
          no meio da conversa. Sem escolha pendente ela fica no estado "ocioso"
          (placeholder cinza), reforçando a ilusão de chat real. */}
      <div className="shrink-0 border-t border-black/5 bg-[#f7f7f7] px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2.5">
        {pendingChoice?.showSpotsCounter && (
          <div className="mb-1.5 flex justify-center">
            <motion.span
              key={spotsRemaining}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-full bg-[#fff2cc] px-3 py-1 text-[12px] font-semibold text-[#8a6d1f]"
            >
              Vagas restantes: {spotsRemaining}
            </motion.span>
          </div>
        )}

        {pendingChoice?.hint && (
          <div className="mb-1.5 flex items-center justify-center gap-1 text-[12px] font-medium text-brand-green">
            <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 1.1, repeat: Infinity }}>
              👆
            </motion.span>
            toque para responder
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[#8b8b8b]">
            <Smile className="h-6 w-6" strokeWidth={1.75} />
          </span>

          {pendingChoice && pendingChoice.options.length > 1 ? (
            <div className="no-scrollbar flex min-h-[42px] flex-1 items-center gap-1.5 overflow-x-auto rounded-full border border-[#e2e2e2] bg-white px-3 py-1.5">
              {pendingChoice.options.map((label) => (
                <motion.button
                  key={label}
                  type="button"
                  onClick={() => handleChoose(label)}
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  whileTap={{ scale: 0.94 }}
                  className="shrink-0 rounded-full border-2 border-brand-green bg-white px-3 py-1 text-[13px] font-semibold text-brand-green"
                >
                  {label}
                </motion.button>
              ))}
            </div>
          ) : (
            <motion.button
              type="button"
              disabled={!pendingChoice}
              onClick={() => pendingChoice && handleChoose(pendingChoice.options[0])}
              animate={
                pendingChoice
                  ? { boxShadow: ["0 0 0 0 rgba(44,197,113,0)", "0 0 0 5px rgba(44,197,113,0.12)", "0 0 0 0 rgba(44,197,113,0)"] }
                  : undefined
              }
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="flex min-h-[42px] flex-1 items-center rounded-full border border-[#e2e2e2] bg-white px-4 py-1.5 text-left"
            >
              <span
                className={
                  pendingChoice
                    ? "truncate text-[15px] font-medium text-[#111]"
                    : "truncate text-[15px] text-[#9c9c9c]"
                }
              >
                {pendingChoice ? pendingChoice.options[0] : "Mensagem"}
              </span>
            </motion.button>
          )}

          <motion.button
            type="button"
            disabled={!pendingChoice || pendingChoice.options.length > 1}
            onClick={() =>
              pendingChoice && pendingChoice.options.length === 1 && handleChoose(pendingChoice.options[0])
            }
            animate={
              pendingChoice && pendingChoice.options.length === 1
                ? { scale: [1, 1.08, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className={
              pendingChoice && pendingChoice.options.length === 1
                ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-green text-white"
                : "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e2e2e2] text-[#9c9c9c]"
            }
          >
            {pendingChoice && pendingChoice.options.length === 1 ? (
              <Send className="h-4 w-4" fill="currentColor" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
