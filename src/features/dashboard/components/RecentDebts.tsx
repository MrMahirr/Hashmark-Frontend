"use client";

import { useI18n } from "@/shared/i18n/I18nProvider";
import { RecentDebt } from "@/shared/types/dashboard.types";
import { LabelBadge } from "@/features/debts/components/LabelBadge";

interface RecentDebtsProps {
  debts: RecentDebt[];
}

export const RecentDebts = ({ debts }: RecentDebtsProps) => {
  const { t, formatDate } = useI18n();

  return (
    <div className="bg-hm-surface border-[0.5px] border-hm-border rounded-card overflow-hidden">
      <div className="p-4 border-b-[0.5px] border-hm-border bg-hm-surface">
        <h2 className="font-sans text-sm font-medium text-hm-text-primary">{t("dashboard.recent.title")}</h2>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-hm-bg border-b-[0.5px] border-hm-border font-sans text-sm font-medium text-hm-text-secondary">
              <th scope="col" className="py-2 px-4 font-medium">{t("dashboard.recent.label")}</th>
              <th scope="col" className="py-2 px-4 font-medium">{t("dashboard.recent.file")}</th>
              <th scope="col" className="py-2 px-4 font-medium">{t("dashboard.recent.note")}</th>
              <th scope="col" className="py-2 px-4 font-medium text-right">{t("dashboard.recent.date")}</th>
            </tr>
          </thead>
          <tbody className="font-sans text-sm text-hm-text-primary">
            {!debts || debts.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-hm-text-secondary font-sans text-xs">
                  {t("dashboard.recent.empty")}
                </td>
              </tr>
            ) : (
              debts.map((debt) => (
                <tr
                  key={debt.id}
                  className="bg-hm-surface border-b-[0.5px] border-hm-border hover:bg-hm-bg transition-colors"
                >
                  <td className="py-3 px-4">
                    <LabelBadge type={debt.type} />
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-hm-text-secondary">{debt.filePath}</td>
                  <td className="py-3 px-4 truncate max-w-[200px]" title={debt.message}>
                    {debt.message}
                  </td>
                  <td className="py-3 px-4 text-right text-hm-text-secondary">{formatDate(debt.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
