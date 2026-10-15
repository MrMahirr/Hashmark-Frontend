"use client";

import { useI18n } from "@/shared/i18n/I18nProvider";
import { LabelDistribution as ILabelDistribution } from "@/shared/types/dashboard.types";
import { DebtType } from "@/shared/types/debt.types";

interface LabelDistributionProps {
  data: ILabelDistribution[];
}

// Tema belirteçleri: açık ve koyu temada otomatik doğru renk
const BAR_COLORS: Record<DebtType, string> = {
  [DebtType.TODO]: "bg-hm-todo",
  [DebtType.FIXME]: "bg-hm-fixme",
  [DebtType.HACK]: "bg-hm-hack",
  [DebtType.XXX]: "bg-hm-xxx",
  [DebtType.NOTE]: "bg-hm-note",
  [DebtType.DOC]: "bg-hm-doc",
  [DebtType.INFO]: "bg-hm-info",
};

export const LabelDistribution = ({ data }: LabelDistributionProps) => {
  const { t } = useI18n();

  return (
    <div className="bg-hm-surface border-[0.5px] border-hm-border rounded-card p-4 flex flex-col min-h-[300px]">
      <h2 className="font-sans text-sm font-medium text-hm-text-primary mb-6">{t("dashboard.labels.title")}</h2>
      <div className="flex-1 flex flex-col gap-4 justify-center">
        {!data || data.length === 0 ? (
          <p className="font-sans text-xs text-hm-text-secondary text-center py-8">{t("dashboard.labels.empty")}</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {data.map((item) => (
              <li key={item.type} className="flex items-center gap-3">
                <span className="font-mono text-xs text-hm-text-secondary w-12">{item.type}</span>
                <div
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={item.percentage}
                  aria-label={`${item.type}: ${item.percentage}%`}
                  className="flex-1 h-2 bg-hm-bg rounded-full overflow-hidden"
                >
                  <div
                    className={`h-full ${BAR_COLORS[item.type] ?? "bg-hm-border"}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="font-sans text-sm text-hm-text-primary w-8 text-right">{item.count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
