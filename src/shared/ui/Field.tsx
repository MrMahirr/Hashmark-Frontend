"use client";

import { type InputHTMLAttributes, type ReactNode, forwardRef, useId } from "react";
import { FOCUS_RING, cn } from "./cn";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Görünür etiket; verilmezse çağıran `aria-label` vermelidir. */
  label?: string;
  /** Sol ikon (44 px sol dolgu açılır). */
  icon?: ReactNode;
  hint?: string;
  error?: string;
}

/** 48 px metin alanı: isteğe bağlı etiket, sol ikon, ipucu ve hata (`aria-invalid` + `aria-describedby`). */
export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, icon, hint, error, className, id, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const noteId = `${inputId}-note`;
  const note = error ?? hint;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-hm-text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-hm-text-secondary"
          >
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={note ? noteId : undefined}
          className={cn(
            "min-h-12 w-full rounded-control border bg-hm-bg pr-4 text-base font-medium text-hm-text-primary placeholder:text-hm-text-secondary",
            icon ? "pl-11" : "pl-4",
            error ? "border-hm-danger" : "border-hm-border",
            FOCUS_RING,
            className,
          )}
          {...props}
        />
      </div>
      {note && (
        <p id={noteId} role={error ? "alert" : undefined} className={cn("text-[13px]", error ? "text-hm-danger" : "text-hm-text-secondary")}>
          {note}
        </p>
      )}
    </div>
  );
});
