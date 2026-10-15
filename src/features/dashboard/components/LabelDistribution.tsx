"use client";

import { useI18n } from "@/shared/i18n/I18nProvider";
import { LabelDistribution as ILabelDistribution } from "@/shared/types/dashboard.types";
import { Panel } from "@/shared/ui/Panel";
import { tagColor } from "@/shared/ui/TagBadge";

interface LabelDistributionProps {
  data: ILabelDistribution[];
}

/** "Etikete Göre": her etiket için renkli mono ad, ince çubuk ve sayı. */
export const LabelDistribution = ({ data }: LabelDistributionProps) => {
  const { t } = useI18n();

  return (
    <Panel className="flex min-w-0 flex-col gap-[18px] p-6">
      <h2 className="m-0 text-base font-bold text-hm-text-primary">{t("dashboard.labels.title")}</h2>
      {!data || data.length === 0 ? (
        <p className="py-8 text-center text-sm text-hm-text-secondary">{t("dashboard.labels.empty")}</p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
          {data.map((item) => (
            <li key={item.type} className="grid grid-cols-[64px_1fr_48px] items-center gap-3">
              <span className="font-mono text-xs font-bold" style={{ color: tagColor(item.type) }}>
                {item.type}
              </span>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={item.percentage}
                aria-label={`${item.type}: ${item.percentage}%`}
                className="h-2 overflow-hidden rounded-[4px] bg-[color-mix(in_srgb,var(--hm-text-primary)_10%,transparent)]"
              >
                <div
                  className="h-full rounded-[4px]"
                  style={{
                    width: `${item.count === 0 ? 0 : Math.max(2, item.percentage)}%`,
                    background: tagColor(item.type),
                  }}
                />
              </div>
              <span className="text-right font-mono text-sm">{item.count}</span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
};
