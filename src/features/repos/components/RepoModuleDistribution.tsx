"use client";

import { useI18n } from "@/shared/i18n/I18nProvider";

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
    <div className="bg-hm-surface rounded-card border-[0.5px] border-hm-border p-4 mb-4 h-full flex flex-col">
      <h3 className="font-sans text-sm font-medium text-hm-text-primary mb-4">{t("repos.modules.title")}</h3>
      <ul className="flex flex-col gap-3 justify-center flex-1">
        {data.map((item, index) => {
          const colors = ["bg-hm-blue", "bg-hm-text-primary", "bg-hm-text-secondary", "bg-hm-border"];
          const barColor = colors[index % colors.length];

          return (
            <li key={item.name} className="flex items-center gap-3">
              <div className="w-32 font-mono text-[11px] text-hm-text-secondary truncate pr-2 border-r-[0.5px] border-hm-border" title={item.name}>
                {item.name}
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={item.percentage}
                  aria-label={`${item.name}: ${item.count}`}
                  className={`h-2 ${barColor} rounded-r-full`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
                <span className="font-sans text-[11px] font-medium text-hm-text-secondary">{item.count}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
