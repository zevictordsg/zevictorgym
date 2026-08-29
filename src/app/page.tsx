import type { Metadata, Viewport } from "next";
import { LinkInBio } from "@/components/links/LinkInBio";

export const metadata: Metadata = {
  title: "@zevictor.gym",
  description: "Hackeando a fisiologia a favor da estética.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0c0c0c",
};

export default function Home() {
  return <LinkInBio />;
}
