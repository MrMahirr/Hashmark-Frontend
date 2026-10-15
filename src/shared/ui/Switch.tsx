"use client";

import { type ButtonHTMLAttributes } from "react";
import { FOCUS_RING, cn } from "./cn";

interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "role"> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

/** 64×36 anahtar. `role="switch"` + `aria-checked`; Space/Enter yerel düğme davranışıyla çalışır. */
export function Switch({ checked, onCheckedChange, className, disabled, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative h-9 w-16 flex-none cursor-pointer rounded-pill border p-0 transition-colors duration-200",
        checked ? "border-hm-acc bg-hm-acc" : "border-hm-border bg-hm-bg",
        "disabled:cursor-not-allowed disabled:opacity-50",
        FOCUS_RING,
        className,
      )}
      {...props}
    >
      <i
        aria-hidden="true"
        className={cn(
          "absolute left-[3px] top-[3px] h-7 w-7 rounded-full transition-transform duration-200",
          checked ? "translate-x-7 bg-hm-bg" : "bg-hm-text-primary",
        )}
      />
    </button>
  );
}
