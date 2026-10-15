"use client";

import { TrendingUp, CheckCircle } from "lucide-react";
import { useI18n } from "@/shared/i18n/I18nProvider";

interface RepoStatsRowProps {
  totalCount: number;
  addedCount: number;
  resolvedCount: number;
}

export const RepoStatsRow = ({ totalCount, addedCount, resolvedCount }: RepoStatsRowProps) => {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="bg-hm-surface rounded-card p-4 border-[0.5px] border-hm-border relative overflow-hidden">
        <div className="font-sans text-[11px] font-medium text-hm-text-secondary mb-1">{t("repos.stats.total")}</div>
        <div className="font-sans text-2xl font-semibold text-hm-text-primary">{totalCount}</div>
        <div aria-hidden="true" className="absolute bottom-2 right-3 font-mono text-[48px] text-hm-text-secondary opacity-5 font-bold">#</div>
      </div>

      <div className="bg-hm-surface rounded-card p-4 border-[0.5px] border-hm-border relative overflow-hidden">
        <div className="font-sans text-[11px] font-medium text-hm-text-secondary mb-1">{t("repos.stats.added")}</div>
        <div className="font-sans text-2xl font-semibold text-hm-danger flex items-center gap-2">
          +{addedCount}
          <TrendingUp className="text-hm-danger" size={20} aria-hidden="true" />
        </div>
      </div>

      <div className="bg-hm-surface rounded-card p-4 border-[0.5px] border-hm-border relative overflow-hidden">
        <div className="font-sans text-[11px] font-medium text-hm-text-secondary mb-1">{t("repos.stats.resolved")}</div>
        <div className="font-sans text-2xl font-semibold text-hm-success flex items-center gap-2">
          {resolvedCount}
          <CheckCircle className="text-hm-success" size={20} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};
