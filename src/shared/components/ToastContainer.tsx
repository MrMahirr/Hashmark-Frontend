"use client";

import React from "react";
import { useToastStore, ToastType } from "../store/toast.store";
import { CheckCircle2, AlertCircle, Info, Loader2, X } from "lucide-react";

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4 text-hm-success shrink-0" />,
  error: <AlertCircle className="w-4 h-4 text-hm-danger shrink-0" />,
  info: <Info className="w-4 h-4 text-hm-blue shrink-0" />,
  loading: <Loader2 className="w-4 h-4 text-hm-text-primary animate-spin shrink-0" />,
};

const borderColors: Record<ToastType, string> = {
  success: "border-hm-success/30 bg-hm-success-bg/80",
  error: "border-hm-danger/30 bg-hm-danger-bg/80",
  info: "border-hm-blue/30 bg-hm-blue-bg/80",
  loading: "border-hm-border bg-hm-surface/90",
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-card border-[0.5px] backdrop-blur-md shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
            borderColors[t.type]
          }`}
        >
          <div className="mt-0.5">{icons[t.type]}</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-sans text-[13px] font-medium text-hm-text-primary leading-tight">
              {t.title}
            </h4>
            {t.description && (
              <p className="font-sans text-[12px] text-hm-text-secondary mt-1 leading-normal">
                {t.description}
              </p>
            )}
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="text-hm-text-secondary hover:text-hm-text-primary transition-colors p-0.5 rounded"
            aria-label="Kapat"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
