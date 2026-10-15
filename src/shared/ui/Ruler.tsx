import { cn } from "./cn";

/** Landing'deki cetvel çizgisi: iki katmanlı `repeating-linear-gradient` (12 px ve 60 px aralık). */
export function Ruler({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("h-4 border-t border-hm-border", className)}
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, color-mix(in srgb, var(--hm-text-primary) 40%, transparent) 0 1px, transparent 1px 12px), repeating-linear-gradient(90deg, color-mix(in srgb, var(--hm-text-primary) 70%, transparent) 0 1px, transparent 1px 60px)",
        backgroundSize: "100% 7px, 100% 16px",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0 0, 0 0",
      }}
    />
  );
}
