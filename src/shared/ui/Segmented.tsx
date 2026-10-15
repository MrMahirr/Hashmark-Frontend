"use client";

import { FOCUS_RING, cn } from "./cn";

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  /** Ekran okuyucu etiketi (görünür metin kısaltma ise). */
  ariaLabel?: string;
}

interface SegmentedProps<T extends string> {
  options: ReadonlyArray<SegmentedOption<T>>;
  value: T;
  onChange: (value: T) => void;
  "aria-label": string;
  className?: string;
}

/** Segmentli pill (TR/EN gibi): seçili = ters renk, her düğme `aria-pressed`. */
export function Segmented<T extends string>({ options, value, onChange, className, ...rest }: SegmentedProps<T>) {
  return (
    <div
      role="group"
      aria-label={rest["aria-label"]}
      className={cn("inline-flex rounded-pill border border-hm-border bg-hm-surface p-0.5", className)}
    >
      {options.map((option) => {
        const pressed = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={pressed}
            aria-label={option.ariaLabel}
            onClick={() => onChange(option.value)}
            className={cn(
              "min-h-10 min-w-11 cursor-pointer rounded-pill px-3 font-mono text-[13px] font-bold",
              pressed ? "bg-hm-text-primary text-hm-bg" : "bg-transparent text-hm-text-primary",
              FOCUS_RING,
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
