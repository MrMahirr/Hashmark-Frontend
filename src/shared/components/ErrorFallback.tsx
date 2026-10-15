import type { ReactNode } from "react";

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
      className={`flex flex-col items-center justify-center gap-4 p-6 text-center bg-hm-bg ${
        fullScreen ? "min-h-screen" : "min-h-[60vh]"
      }`}
    >
      <div aria-hidden="true" className="font-mono text-[36px] font-medium text-hm-text-primary leading-none">#</div>
      <div className="flex flex-col gap-1 max-w-[420px]">
        <h1 className="text-[16px] font-medium text-hm-text-primary">{title}</h1>
        <p className="text-[13px] text-hm-text-secondary">{description}</p>
        {digest ? <p className="text-[11px] font-mono text-hm-text-secondary mt-2">{digest}</p> : null}
      </div>
      <div className="flex items-center gap-3">{actions}</div>
    </div>
  );
}

export const fallbackButtonClass =
  "inline-flex items-center justify-center h-10 px-5 rounded-full text-[13px] font-medium " +
  "bg-hm-text-primary text-hm-surface hover:opacity-90 transition-opacity";

export const fallbackLinkClass =
  "inline-flex items-center justify-center h-10 px-5 rounded-full text-[13px] font-medium " +
  "border-[0.5px] border-hm-border text-hm-text-primary hover:bg-hm-border-light transition-colors";
