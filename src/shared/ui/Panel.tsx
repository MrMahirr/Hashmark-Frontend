import { type HTMLAttributes } from "react";
import { cn } from "./cn";

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  /** `app` = 18 px (uygulama), `landing` = 22 px, `cta` = 28 px (limon CTA bloğu). */
  radius?: "app" | "landing" | "cta";
}

const RADIUS = { app: "rounded-card", landing: "rounded-panel", cta: "rounded-cta" } as const;

/** Yüzey paneli: `--hm-surface` zemin + 1 px `--hm-border` kenarlık. */
export function Panel({ radius = "app", className, ...props }: PanelProps) {
  return <div className={cn("border border-hm-border bg-hm-surface", RADIUS[radius], className)} {...props} />;
}
