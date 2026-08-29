"use client";

import { forwardRef, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "brand" | "light" | "dark-gradient";

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  variant?: Variant;
  icon?: ReactNode;
  children?: ReactNode;
};

const variantClasses: Record<Variant, string> = {
  // CTA principal — gradiente verde (usado na maioria das telas)
  brand: cn(
    "cta-gradient text-white shadow-[0_4px_7.95px_rgba(0,0,0,0.1)]",
    "hover:brightness-105"
  ),
  // Pílula clara sobre fundo escuro (ex: tela do voucher)
  light: "bg-[#ececec] text-black shadow-[0_4px_7.95px_rgba(0,0,0,0.1)] hover:bg-white",
  // CTA secundário — gradiente cinza (ex: "baixar só o PDF" grátis, oferta final)
  "dark-gradient": cn(
    "border border-[#808080] bg-[linear-gradient(259deg,#6b6b6b_9%,#434343_91%)]",
    "text-white shadow-[0_4px_7.95px_rgba(0,0,0,0.1)] hover:brightness-110"
  ),
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "brand", icon, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "flex w-full items-center justify-center gap-2.5 rounded-[15px]",
          "px-[15px] py-[15px] text-[16px] font-medium tracking-tight",
          "transition-[filter] duration-150 disabled:opacity-50",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
        {icon}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
