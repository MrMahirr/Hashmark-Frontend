"use client";

import { useI18n } from "@/shared/i18n/I18nProvider";
import { Panel } from "@/shared/ui/Panel";

interface ModuleStat {
  name: string;
  count: number;
  percentage: number;
}

interface RepoModuleDistributionProps {
  data: ModuleStat[];
}

export const RepoModuleDistribution = ({ data }: RepoModuleDistributionProps) => {
  const { t } = useI18n();

  return (
    <Panel className="flex h-full flex-col gap-[18px] p-6">
      <h3 className="m-0 text-base font-bold text-hm-text-primary">{t("repos.modules.title")}</h3>
      <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
        {data.map((item) => (
          <li key={item.name} className="grid grid-cols-[minmax(0,140px)_1fr_48px] items-center gap-3">
            <span className="truncate font-mono text-xs text-hm-text-secondary" title={item.name}>
              {item.name}
            </span>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={item.percentage}
              aria-label={`${item.name}: ${item.count}`}
              className="h-2 overflow-hidden rounded-[4px] bg-[color-mix(in_srgb,var(--hm-text-primary)_10%,transparent)]"
            >
              <div className="h-full rounded-[4px] bg-hm-acc" style={{ width: `${item.percentage}%` }} />
            </div>
            <span className="text-right font-mono text-sm">{item.count}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
};
