"use client";

import type { ReactNode } from "react";
import { ChevronLeft } from "./icons";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";

export function FunnelShell({
  children,
  progress,
  onBack,
  showBack,
  bare = false,
  theme = "light",
}: {
  children: ReactNode;
  /** 0 a 1. Se undefined, a barra de progresso não é exibida. */
  progress?: number;
  onBack?: () => void;
  showBack?: boolean;
  /** Tela imersiva (VSL, voucher) sem header padrão */
  bare?: boolean;
  /** Cor dos ícones do header quando `bare` é false */
  theme?: "light" | "dark";
}) {
  const bg = theme === "dark" ? "bg-dark-screen-bg" : "bg-background";

  return (
    <div className={cn("relative flex h-full flex-col", bg)}>
      {!bare && (
        <div className="flex shrink-0 items-center gap-3 px-5 pb-3 pt-[calc(env(safe-area-inset-top)+16px)]">
          <button
            onClick={onBack}
            aria-label="Voltar"
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-opacity",
              theme === "dark" ? "text-white/70" : "text-[#111]/50",
              showBack ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {progress !== undefined && (
            <ProgressBar value={progress} tone={theme} className="flex-1" />
          )}
        </div>
      )}

      {bare && showBack && (
        <button
          onClick={onBack}
          aria-label="Voltar"
          className={cn(
            "absolute left-4 z-20 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors",
            "top-[calc(env(safe-area-inset-top)+16px)]",
            theme === "dark"
              ? "bg-white/10 text-white/80 hover:bg-white/15"
              : "bg-black/5 text-[#111]/60 hover:bg-black/10"
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      <div className="no-scrollbar relative flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
