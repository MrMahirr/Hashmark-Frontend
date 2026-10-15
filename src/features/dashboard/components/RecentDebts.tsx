"use client";

import { useI18n } from "@/shared/i18n/I18nProvider";
import { RecentDebt } from "@/shared/types/dashboard.types";
import { TagBadge } from "@/shared/ui/TagBadge";
import { ButtonLink } from "@/shared/ui/Button";
import { DataRow, DataRowHeader } from "@/shared/ui/DataRow";
import { Panel } from "@/shared/ui/Panel";

interface RecentDebtsProps {
  debts: RecentDebt[];
}

/** "Son Borçlar" tablosu: panel başlığı + "Tümünü gör" + 4 sütunlu `DataRow` ızgarası. */
export const RecentDebts = ({ debts }: RecentDebtsProps) => {
  const { t, formatDate } = useI18n();

  return (
    <Panel className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
        <h2 className="m-0 text-base font-bold text-hm-text-primary">{t("dashboard.recent.title")}</h2>
        <ButtonLink href="/dashboard/debts" variant="outline">
          {t("dashboard.recent.viewAll")}
        </ButtonLink>
      </div>

      <div className="overflow-x-auto" role="table" aria-label={t("dashboard.recent.title")} tabIndex={0}>
        <DataRowHeader role="row">
          <span role="columnheader">{t("dashboard.recent.label")}</span>
          <span role="columnheader">{t("dashboard.recent.file")}</span>
          <span role="columnheader">{t("dashboard.recent.note")}</span>
          <span role="columnheader" className="text-right">
            {t("dashboard.recent.date")}
          </span>
        </DataRowHeader>

        {!debts || debts.length === 0 ? (
          <div className="border-t border-hm-border px-6 py-10 text-center text-sm text-hm-text-secondary">
            {t("dashboard.recent.empty")}
          </div>
        ) : (
          debts.map((debt) => (
            <DataRow key={debt.id} role="row">
              <span role="cell">
                <TagBadge tag={debt.type} />
              </span>
              <span role="cell" className="truncate font-mono text-[13px] text-hm-text-secondary" title={debt.filePath}>
                {debt.filePath}
              </span>
              <span role="cell" className="truncate text-[15px]" title={debt.message}>
                {debt.message}
              </span>
              <span role="cell" className="text-right font-mono text-[13px] text-hm-text-secondary">
                {formatDate(debt.createdAt)}
              </span>
            </DataRow>
          ))
        )}
      </div>
    </Panel>
  );
};
