"use client";

import { useI18n } from "@/shared/i18n/I18nProvider";
import { Button } from "@/shared/ui/Button";

export const PAGE_SIZES = [20, 50, 100] as const;

interface DebtPaginationProps {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  from: number;
  to: number;
  busy: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSizeChange: (size: number) => void;
}

/** Tablo altı: aralık metni, sayfa boyutu seçici ve önceki/sonraki. */
export function DebtPagination({
  page,
  size,
  totalElements,
  totalPages,
  from,
  to,
  busy,
  onPrev,
  onNext,
  onSizeChange,
}: DebtPaginationProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hm-border px-6 py-3.5">
      <span className="font-mono text-xs text-hm-text-secondary" aria-live="polite">
        {t("debts.pagination.range", { total: totalElements, from, to })}
      </span>
      <div className="flex flex-wrap items-center gap-2.5">
        <label className="flex items-center gap-2 font-mono text-xs text-hm-text-secondary">
          {t("debts.pagination.size")}
          <select
            value={size}
            onChange={(event) => onSizeChange(Number(event.target.value))}
            className="min-h-11 cursor-pointer rounded-control border border-hm-border bg-hm-bg px-2.5 font-mono text-[13px] font-bold text-hm-text-primary"
          >
            {PAGE_SIZES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <Button variant="outline" onClick={onPrev} disabled={page <= 0 || busy}>
          {t("debts.pagination.prev")}
        </Button>
        <span className="px-1 font-mono text-xs text-hm-text-secondary">
          {t("debts.pagination.page", { page: page + 1, pages: totalPages })}
        </span>
        <Button variant="outline" onClick={onNext} disabled={page >= totalPages - 1 || busy}>
          {t("debts.pagination.next")}
        </Button>
      </div>
    </div>
  );
}
