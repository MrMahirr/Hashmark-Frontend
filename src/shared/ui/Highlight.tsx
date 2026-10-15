import { type ReactNode } from "react";
import { cn } from "./cn";

/** Başlıkta vurgulanan sözcük: −1.2° döndürülmüş limon bant. */
export function Highlight({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "-mx-[0.05em] inline-block -rotate-[1.2deg] rounded-[4px] bg-hm-hl px-[0.1em] text-hm-hl-fg",
        className,
      )}
    >
      {children}
    </span>
  );
}
