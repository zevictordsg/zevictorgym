import type { Metadata, Viewport } from "next";
import { ObrigadoContent } from "./ObrigadoContent";

export const metadata: Metadata = {
  title: "Acesso liberado — Carbmaxxing®",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#171717",
};

export default function ObrigadoPage() {
  return <ObrigadoContent />;
}
