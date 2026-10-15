import { type ReactNode } from "react";
import { cn } from "@/shared/ui/cn";

/** Landing içerik kapsayıcısı: azami 1240 px, 40 px (mobilde 16 px) yan boşluk. */
export function Wrap({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1240px] px-4 sm:px-10", className)}>{children}</div>;
}
