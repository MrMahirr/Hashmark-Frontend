"use client";

import { useState } from "react";
import { useI18n } from "@/shared/i18n/I18nProvider";
import type { TriageRequestStatus } from "@/shared/types/debt.types";
import { Button } from "@/shared/ui/Button";
import { Field } from "@/shared/ui/Field";

interface DebtBulkBarProps {
  count: number;
  pending: boolean;
  onApply: (payload: { status?: TriageRequestStatus; assignee?: string }) => void;
  onClear: () => void;
}

/** Seçili satırlar için toplu triyaj çubuğu (yok say / düzeltilmeyecek / yeniden aç / ata). */
export function DebtBulkBar({ count, pending, onApply, onClear }: DebtBulkBarProps) {
  const { t } = useI18n();
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignee, setAssignee] = useState("");

  const reset = () => {
    setAssignOpen(false);
    setAssignee("");
  };

  return (
    <div
      role="region"
      aria-label={t("debts.selected", { count })}
      className="flex flex-wrap items-center gap-2.5 rounded-card border border-hm-acc bg-hm-surface px-4 py-3"
    >
      <span className="font-mono text-[13px] font-bold text-hm-text-primary" aria-live="polite">
        {t("debts.selected", { count })}
      </span>
      <Button variant="outline" disabled={pending} onClick={() => onApply({ status: "IGNORED" })}>
        {t("debts.bulk.ignore")}
      </Button>
      <Button variant="outline" disabled={pending} onClick={() => onApply({ status: "WONT_FIX" })}>
        {t("debts.bulk.wontFix")}
      </Button>
      <Button variant="outline" disabled={pending} onClick={() => onApply({ status: "OPEN" })}>
        {t("debts.bulk.reopen")}
      </Button>

      {assignOpen ? (
        <form
          className="flex flex-wrap items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (assignee.trim()) {
              onApply({ assignee: assignee.trim() });
              reset();
            }
          }}
        >
          <Field
            autoFocus
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
            maxLength={100}
            aria-label={t("debts.bulk.assignPrompt")}
            placeholder={t("debts.detail.assigneePlaceholder")}
            className="w-48"
          />
          <Button type="submit" disabled={pending || !assignee.trim()}>
            {t("common.save")}
          </Button>
        </form>
      ) : (
        <Button variant="outline" onClick={() => setAssignOpen(true)}>
          {t("debts.bulk.assign")}
        </Button>
      )}

      <Button
        variant="ghost"
        className="ml-auto"
        onClick={() => {
          reset();
          onClear();
        }}
      >
        {t("debts.clearSelection")}
      </Button>
    </div>
  );
}
