"use client";

import { ScreenPlaceholder } from "./ScreenPlaceholder";
import type { FunnelScreenProps } from "../types";

export function Screen09Placeholder(props: FunnelScreenProps) {
  return (
    <ScreenPlaceholder
      {...props}
      title="Oferta final"
      description="Planilha grátis vs Carbmaxxing ELITE (checkout Stripe). Preciso do link do Figma dessa tela (a nona) pra implementar com fidelidade."
    />
  );
}
