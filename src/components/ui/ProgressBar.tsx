"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Segmentos "tracejados" — mesma referência visual usada na barra do topo
 *  das telas (dashes arredondados em vez de uma barra contínua). Fica no
 *  mesmo slot/altura de antes, então não empurra o resto do header. */
const SEGMENT_COUNT = 8;

export function ProgressBar({
  value,
  tone = "light",
  className,
}: {
  /** 0 a 1 */
  value: number;
  /** "light" = trilho escuro sobre header branco · "dark" = trilho translúcido (telas escuras) */
  tone?: "light" | "dark";
  className?: string;
}) {
  const clamped = Math.min(Math.max(value, 0), 1);
  const filledCount = Math.round(clamped * SEGMENT_COUNT);

  return (
    <div
      className={cn("flex items-center gap-[5px]", className)}
      role="progressbar"
      aria-valuenow={Math.round(clamped * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {Array.from({ length: SEGMENT_COUNT }).map((_, i) => {
        const filled = i < filledCount;
        return (
          <span
            key={i}
            className={cn(
              "h-[5px] flex-1 overflow-hidden rounded-full",
              tone === "light" ? "bg-[#1a1a1a]/15" : "bg-white/15"
            )}
          >
            <motion.span
              className="block h-full rounded-full bg-brand-green"
              initial={false}
              animate={{ width: filled ? "100%" : "0%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 28,
                delay: filled ? i * 0.03 : 0,
              }}
            />
          </span>
        );
      })}
    </div>
  );
}
