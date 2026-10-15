"use client";

import React from "react";
import { useToastStore, ToastType } from "../store/toast.store";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { CheckCircle2, AlertCircle, Info, Loader2, X } from "lucide-react";

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-hm-success shrink-0" />,
  error: <AlertCircle aria-hidden="true" className="w-4 h-4 text-hm-danger shrink-0" />,
  info: <Info aria-hidden="true" className="w-4 h-4 text-hm-acc shrink-0" />,
  loading: <Loader2 aria-hidden="true" className="w-4 h-4 text-hm-text-primary animate-spin shrink-0" />,
};

const borderColors: Record<ToastType, string> = {
  success: "border-hm-success/40 bg-hm-surface",
  error: "border-hm-danger/40 bg-hm-surface",
  info: "border-hm-acc/40 bg-hm-surface",
  loading: "border-hm-border bg-hm-surface",
};

/**
 * Bildirim kutuları. `role="status"` / `aria-live` ile ekran okuyuculara duyurulur;
 * hata bildirimleri `alert` olarak kesintiye uğratıcı biçimde okunur.
 */
export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();
  const { t } = useI18n();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[300] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.type === "error" ? "alert" : "status"}
          className={`pointer-events-auto hm-anim-fade-in flex items-start gap-3 p-3.5 rounded-card border shadow-[4px_4px_0_var(--hm-shadow)] ${
            borderColors[toast.type]
          }`}
        >
          <div className="mt-0.5">{icons[toast.type]}</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-sans text-sm font-bold text-hm-text-primary leading-tight">
              {toast.title}
            </h4>
            {toast.description && (
              <p className="font-sans text-[13px] text-hm-text-secondary mt-1 leading-normal">
                {toast.description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="text-hm-text-secondary hover:text-hm-text-primary transition-colors p-0.5 rounded"
            aria-label={t("common.close")}
          >
            <X aria-hidden="true" className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
