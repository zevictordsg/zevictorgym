"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FunnelShell } from "./FunnelShell";
import { FUNNEL_STEPS } from "@/data/funnel-steps";
import { useFunnelStore } from "@/store/funnel-store";

const variants = {
  enter: (direction: 1 | -1) => ({ x: direction > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: 1 | -1) => ({ x: direction > 0 ? -48 : 48, opacity: 0 }),
};

export function FunnelEngine() {
  const currentIndex = useFunnelStore((s) => s.currentIndex);
  const direction = useFunnelStore((s) => s.direction);
  const hasHydrated = useFunnelStore((s) => s.hasHydrated);
  const goNext = useFunnelStore((s) => s.goNext);
  const goBack = useFunnelStore((s) => s.goBack);

  if (!hasHydrated) {
    return <div className="h-full bg-background" />;
  }

  const step = FUNNEL_STEPS[currentIndex];
  const Screen = step.Component;
  const progress = FUNNEL_STEPS.length > 1 ? currentIndex / (FUNNEL_STEPS.length - 1) : 0;

  return (
    <FunnelShell
      bare={step.bare}
      theme={step.theme}
      progress={step.bare ? undefined : progress}
      showBack={currentIndex > 0}
      onBack={goBack}
    >
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={step.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "tween", duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="h-full"
        >
          <Screen
            onNext={() => goNext(FUNNEL_STEPS.length - 1)}
            onBack={goBack}
          />
        </motion.div>
      </AnimatePresence>
    </FunnelShell>
  );
}
