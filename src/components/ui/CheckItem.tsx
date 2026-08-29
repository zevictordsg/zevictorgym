import type { ReactNode } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "green-solid" | "red-solid" | "green-soft" | "red-soft";

const toneStyles: Record<Tone, { bg: string; text: string; icon: "check" | "x" }> = {
  "green-solid": { bg: "var(--check-green-bg)", text: "var(--check-green-text)", icon: "check" },
  "red-solid": { bg: "var(--check-red-bg)", text: "var(--check-red-text)", icon: "x" },
  "green-soft": { bg: "var(--soft-green-bg)", text: "var(--soft-green-text)", icon: "check" },
  "red-soft": { bg: "var(--soft-red-bg)", text: "var(--soft-red-text)", icon: "x" },
};

/** Linha de checklist ("✓ Treinos com mais energia" / "✕ Sem descontrole") */
export function CheckItem({
  children,
  tone,
  className,
}: {
  children: ReactNode;
  tone: Tone;
  className?: string;
}) {
  const t = toneStyles[tone];

  return (
    <div
      className={cn(
        "flex w-full items-center gap-2.5 rounded-[10px] px-4 py-2.5 text-xs font-medium",
        className
      )}
      style={{ background: t.bg, color: t.text }}
    >
      {t.icon === "check" ? (
        <Image src="/images/verified.svg" alt="" width={16} height={16} className="shrink-0" />
      ) : (
        <X className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
      )}
      <span>{children}</span>
    </div>
  );
}
