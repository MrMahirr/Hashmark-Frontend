import type { ReactNode } from "react";
import { buttonClass } from "@/shared/ui/button-styles";
import { Logo } from "@/shared/ui/Logo";

interface ErrorFallbackProps {
  title: string;
  description: string;
  /** Hata kodu satırı (örn. "Hata kodu: 123"); sunucu loglarıyla eşleştirmek için. */
  digest?: string;
  actions: ReactNode;
  fullScreen?: boolean;
}

/**
 * error.tsx, global-error.tsx ve not-found.tsx için ortak, sunucu/istemci bileşeni.
 * Stack trace veya iç hata mesajı kullanıcıya gösterilmez.
 */
export function ErrorFallback({ title, description, digest, actions, fullScreen = false }: ErrorFallbackProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center gap-5 bg-hm-bg p-6 text-center ${
        fullScreen ? "min-h-screen" : "min-h-[60vh]"
      }`}
    >
      <Logo scale={1.4} className="mb-2" />
      <div className="flex max-w-[460px] flex-col gap-2">
        <h1 className="m-0 font-serif text-[44px] font-normal leading-none text-hm-text-primary">{title}</h1>
        <p className="m-0 text-base leading-normal text-hm-text-secondary">{description}</p>
        {digest ? <p className="m-0 mt-2 font-mono text-xs text-hm-text-secondary">{digest}</p> : null}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">{actions}</div>
    </div>
  );
}

/** Birincil eylem düğmesi (ör. "Tekrar dene"). */
export const fallbackButtonClass = buttonClass("primary");

/** İkincil eylem bağlantısı (ör. "Ana sayfa"). */
export const fallbackLinkClass = buttonClass("outline");
