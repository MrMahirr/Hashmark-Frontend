"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { useI18n } from "@/shared/i18n/I18nProvider";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** "center": ortada modal, "right"/"left": kenardan açılan panel (ayrıntı paneli, mobil menü). */
  placement?: "center" | "right" | "left";
  children: ReactNode;
  className?: string;
}

/**
 * Yerel `<dialog>` üzerine kurulu erişilebilir modal: odak hapsi, Esc ile kapanma,
 * arka planın etkisizleştirilmesi ve `aria-labelledby` tarayıcı tarafından sağlanır.
 * Açılırken odak içeriğe taşınır; kapanınca tetikleyen öğeye geri döner.
 */
export function Dialog({ open, onClose, title, placement = "center", children, className = "" }: DialogProps) {
  const { t } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }

    const handleClose = () => onCloseRef.current();
    dialog.addEventListener("close", handleClose);

    return () => {
      dialog.removeEventListener("close", handleClose);
      if (typeof dialog.close === "function" && dialog.open) dialog.close();
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  const placementClass =
    placement === "right"
      ? "hm-anim-slide-right ml-auto mr-0 h-full max-h-none w-full max-w-[480px] rounded-none"
      : placement === "left"
        ? "hm-anim-slide-left mr-auto ml-0 h-full max-h-none w-[280px] max-w-[85vw] rounded-none"
        : "hm-anim-fade-in m-auto w-full max-w-[560px] max-h-[85vh] rounded-card";

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClick={(event) => {
        // Arka plana (dialog'un kendisine) tıklanınca kapat
        if (event.target === event.currentTarget) onClose();
      }}
      className={`hm-dialog p-0 bg-hm-surface text-hm-text-primary border-[0.5px] border-hm-border shadow-2xl ${placementClass} ${className}`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-3 border-b-[0.5px] border-hm-border px-5 py-3">
          <h2 id={titleId} className="text-sm font-medium text-hm-text-primary">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.close")}
            className="rounded-md p-1.5 text-hm-text-secondary hover:bg-hm-bg hover:text-hm-text-primary"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </dialog>
  );
}
