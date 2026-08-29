"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";

export function CountUp({
  to,
  from = 0,
  duration = 1.4,
  delay = 0,
  format = (n) => Math.round(n).toLocaleString("pt-BR"),
  className,
}: {
  to: number;
  from?: number;
  duration?: number;
  delay?: number;
  format?: (value: number) => string;
  className?: string;
}) {
  const [value, setValue] = useState(from);

  useEffect(() => {
    const controls = animate(from, to, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setValue(latest),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);

  return <span className={className}>{format(value)}</span>;
}
