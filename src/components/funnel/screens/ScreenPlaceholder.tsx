"use client";

import { Construction } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "../icons";
import type { FunnelScreenProps } from "../types";

/**
 * Placeholder temporário — o link do Figma para esta tela ainda não foi
 * confirmado (ver comentário em `data/funnel-steps.tsx`). Assim que você
 * mandar o node-id certo eu troco por uma implementação fiel.
 */
export function ScreenPlaceholder({
  title,
  description,
  onNext,
}: FunnelScreenProps & { title: string; description: string }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 px-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f3f5] text-[#999]">
        <Construction className="h-5 w-5" />
      </span>
      <h2 className="text-[20px] font-semibold text-foreground-strong">{title}</h2>
      <p className="text-sm text-foreground/50">{description}</p>
      <div className="mt-8 w-full">
        <Button onClick={onNext} icon={<ArrowRight className="h-3.5 w-3.5" />}>
          Continuar (placeholder)
        </Button>
      </div>
    </div>
  );
}
