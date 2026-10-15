import { FOCUS_RING, cn } from "./cn";

/** `onAccent`: limon zemin üzerindeki (CTA bloğu) koyu düğme. */
export type ButtonVariant = "primary" | "outline" | "ghost" | "danger" | "onAccent";
/** `md` = uygulama (44 px), `lg` = landing/giriş (56 px, 5 px ofset gölge). */
export type ButtonSize = "md" | "lg";

const BASE =
  "inline-flex cursor-pointer items-center justify-center whitespace-nowrap no-underline disabled:cursor-not-allowed disabled:opacity-50";

const SIZE: Record<ButtonSize, string> = {
  md: "min-h-11 gap-2.5 rounded-control px-5 text-[15px]",
  lg: "min-h-14 gap-3 rounded-[14px] px-7 text-[17px]",
};

function variantClass(variant: ButtonVariant, size: ButtonSize): string {
  switch (variant) {
    case "primary":
      return cn(
        "bg-hm-btn font-bold text-hm-btn-fg transition-[transform,box-shadow] duration-150",
        size === "lg"
          ? "shadow-[5px_5px_0_var(--hm-shadow)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0_var(--hm-shadow)]"
          : "shadow-[4px_4px_0_var(--hm-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--hm-shadow)]",
      );
    case "outline":
      return "border border-hm-border bg-transparent font-semibold text-hm-text-primary hover:border-hm-text-primary";
    case "ghost":
      return "bg-transparent font-semibold text-hm-text-secondary hover:bg-[color-mix(in_srgb,var(--hm-text-primary)_8%,transparent)] hover:text-hm-text-primary";
    case "onAccent":
      return "bg-hm-hl-fg font-bold text-hm-hl shadow-[5px_5px_0_var(--hm-hl-fg)] outline outline-2 outline-offset-[5px] outline-hm-hl-fg transition-[transform,box-shadow] duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0_var(--hm-hl-fg)]";
    case "danger":
      return "border border-hm-danger bg-transparent font-semibold text-hm-danger hover:bg-hm-danger-bg";
  }
}

/** Sunucu ve istemci bileşenlerinin ortak kullanabilmesi için "use client" dışında tutulur. */
export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra?: string): string {
  return cn(BASE, SIZE[size], variantClass(variant, size), FOCUS_RING, extra);
}
