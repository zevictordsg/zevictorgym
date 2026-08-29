import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

/** Pílula "• Pessoas acessando a planilha +29" do topo do hook */
export function SocialProofPill({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-semibold",
        className
      )}
      style={{
        background: "var(--pill-green-bg)",
        borderColor: "var(--pill-green-border)",
        color: "var(--pill-green-text)",
      }}
    >
      <span className="h-[4px] w-[4px] shrink-0 rounded-full bg-current" />
      {children}
    </span>
  );
}

type CalloutTone = "danger" | "amber";

const calloutTones: Record<CalloutTone, { bg: string; border: string; text: string }> = {
  danger: {
    bg: "var(--callout-red-bg)",
    border: "var(--callout-red-border)",
    text: "var(--callout-red-text)",
  },
  amber: {
    bg: "var(--callout-amber-bg)",
    border: "var(--callout-amber-border)",
    text: "var(--callout-amber-text)",
  },
};

/** Caixa de alerta (vermelha ou âmbar) usada em várias telas do funil */
export function Callout({
  tone = "danger",
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { tone?: CalloutTone }) {
  const t = calloutTones[tone];
  return (
    <div
      className={cn(
        "w-full rounded-[15px] border-2 px-[15px] py-3 text-center text-sm font-semibold leading-snug",
        className
      )}
      style={{ background: t.bg, borderColor: t.border, color: t.text }}
      {...props}
    >
      {children}
    </div>
  );
}

/** Cartão com badge de título (ex: "PARECE LOUCURA NÉ" / "OPORTUNIDADE DE PRIMEIRO ACESSO") */
export function BadgeCard({
  badge,
  badgeBg,
  bg,
  border,
  children,
  className,
}: {
  badge: string;
  badgeBg: string;
  bg: string;
  border: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-start gap-3.5 rounded-[15px] border-2 px-[15px] py-3",
        className
      )}
      style={{ background: bg, borderColor: border }}
    >
      <span
        className="rounded-[5px] px-2 py-1 text-[10px] font-bold tracking-[-0.3px] text-white"
        style={{ background: badgeBg }}
      >
        {badge}
      </span>
      {children}
    </div>
  );
}
