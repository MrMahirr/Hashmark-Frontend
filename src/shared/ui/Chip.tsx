"use client";

import { type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { FOCUS_RING, cn } from "./cn";

interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-pressed"> {
  /** Seçili = ters renk. Filtre ve sekme düğmeleri için `aria-pressed` olarak yansır. */
  pressed: boolean;
  children: ReactNode;
}

/** Filtre / sekme çipi (`.chip`, `.ntab`): 44 px, mono 13 px kalın, seçiliyken ters renk. */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { pressed, className, type = "button", children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={pressed}
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-pill border px-4 font-mono text-[13px] font-bold",
        pressed
          ? "border-hm-text-primary bg-hm-text-primary text-hm-bg"
          : "border-hm-border bg-hm-bg text-hm-text-primary hover:border-hm-text-primary",
        FOCUS_RING,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});

/** Çip satırı: sarmalanır, `aria-label` ile grup olarak duyurulur. */
export function ChipGroup({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div role="group" className={cn("flex flex-wrap gap-2", className)} {...props}>
      {children}
    </div>
  );
}
