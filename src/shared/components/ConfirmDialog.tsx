"use client";

import { type ReactNode } from "react";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { Button } from "@/shared/ui/Button";
import { Dialog } from "./Dialog";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Yıkıcı işlem onayı: `role="alertdialog"`, "Vazgeç" + onay düğmesi. */
export function ConfirmDialog({ open, title, children, confirmLabel, pending = false, onConfirm, onCancel }: ConfirmDialogProps) {
  const { t } = useI18n();

  return (
    <Dialog open={open} onClose={onCancel} title={title} role="alertdialog">
      <div className="flex flex-col gap-5 p-6">
        <div className="text-base leading-[1.55] text-hm-text-secondary">{children}</div>
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={pending}>
            {t("common.cancel")}
          </Button>
          <Button onClick={onConfirm} isLoading={pending}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
