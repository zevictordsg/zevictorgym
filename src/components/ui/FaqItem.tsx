"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Item de acordeão pra seções de "Perguntas Frequentes" */
export function FaqItem({
  question,
  answer,
  tone = "dark",
}: {
  question: string;
  answer: string;
  tone?: "dark" | "light";
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-[14px] border transition-colors",
        tone === "dark"
          ? cn("border-white/10", open ? "bg-white/[0.06]" : "bg-white/[0.03]")
          : cn("border-black/[0.06]", open ? "bg-black/[0.03]" : "bg-transparent")
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <span
          className={cn(
            "text-[14px] font-semibold leading-[1.35]",
            tone === "dark" ? "text-white/90" : "text-foreground"
          )}
        >
          {question}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={cn("shrink-0", tone === "dark" ? "text-white/40" : "text-foreground/40")}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p
              className={cn(
                "px-4 pb-4 text-[13px] leading-[1.5]",
                tone === "dark" ? "text-white/55" : "text-foreground/60"
              )}
            >
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
