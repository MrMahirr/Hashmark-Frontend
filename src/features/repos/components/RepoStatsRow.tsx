"use client";

import { useI18n } from "@/shared/i18n/I18nProvider";
import { StatCard } from "@/shared/ui/StatCard";

interface RepoStatsRowProps {
  totalCount: number;
  addedCount: number;
  resolvedCount: number;
}

export const RepoStatsRow = ({ totalCount, addedCount, resolvedCount }: RepoStatsRowProps) => {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-4">
      <StatCard title={t("repos.stats.total")} value={totalCount} />
      <StatCard title={t("repos.stats.added")} value={`+${addedCount}`} badgeType={addedCount > 0 ? "high" : "neutral"} />
      <StatCard title={t("repos.stats.resolved")} value={resolvedCount} badgeType={resolvedCount > 0 ? "good" : "neutral"} />
    </div>
  );
};
