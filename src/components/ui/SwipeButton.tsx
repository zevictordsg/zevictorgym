"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { cn } from "@/lib/utils";

const TRACK_PADDING = 7; // px — corresponde ao inset do pill dentro da trilha no Figma
const COMPLETE_THRESHOLD = 0.62; // % da trilha arrastada pra confirmar

/**
 * Botão "deslize para iniciar" — fiel ao node 2364:4250 do Figma: o pill
 * branco com "Iniciar agora" + chip de seta é o próprio elemento arrastável
 * (não um círculo separado), dentro de uma trilha cinza mais larga. Não
 * muda de cor ao arrastar — só desliza. Um clique simples não avança: é
 * proposital, pra reforçar a interação gamificada do hook do funil.
 */
export function SwipeButton({
  label,
  onComplete,
  className,
}: {
  label: string;
  onComplete: () => void;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const [maxDrag, setMaxDrag] = useState(0);
  const [done, setDone] = useState(false);
  const x = useMotionValue(0);

  useEffect(() => {
    function measure() {
      const track = trackRef.current;
      const pill = pillRef.current;
      if (!track || !pill) return;
      setMaxDrag(
        Math.max(track.offsetWidth - pill.offsetWidth - TRACK_PADDING * 2, 0)
      );
    }
    measure();

    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (pillRef.current) ro.observe(pillRef.current);
    return () => ro.disconnect();
  }, []);

  function complete() {
    animate(x, maxDrag, {
      type: "spring",
      stiffness: 340,
      damping: 32,
      onComplete: () => {
        setDone(true);
        window.setTimeout(onComplete, 260);
      },
    });
  }

  function handleDragEnd() {
    if (done) return;
    const progress = maxDrag > 0 ? x.get() / maxDrag : 0;

    if (progress > COMPLETE_THRESHOLD) {
      complete();
    } else {
      animate(x, 0, { type: "spring", stiffness: 420, damping: 34 });
    }
  }

  return (
    <div
      ref={trackRef}
      className={cn(
        "relative flex w-full items-center rounded-[24px] border border-[#f0f0f0] bg-[#e8e8e8] p-[7px]",
        className
      )}
    >
      <motion.div
        ref={pillRef}
        role="button"
        tabIndex={0}
        aria-label={label}
        drag={done ? false : "x"}
        dragConstraints={{ left: 0, right: maxDrag }}
        dragElastic={0.04}
        dragMomentum={false}
        style={{ x }}
        onDragEnd={handleDragEnd}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !done) {
            e.preventDefault();
            complete();
          }
        }}
        whileTap={{ scale: 0.98 }}
        className="relative z-10 flex w-fit cursor-grab items-center gap-2.5 rounded-[16px] bg-white py-1.5 pl-5 pr-1.5 shadow-[4px_7px_6.55px_rgba(0,0,0,0.12)] active:cursor-grabbing"
      >
        <span className="whitespace-nowrap text-[16px] font-bold tracking-[-0.48px] text-foreground/50">
          {label}
        </span>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3f3f5] text-[16px] font-medium tracking-[-0.48px] text-foreground/50">
          →
        </span>
      </motion.div>
    </div>
  );
}
