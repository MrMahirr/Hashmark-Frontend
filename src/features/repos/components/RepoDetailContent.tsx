"use client";

import React from "react";
import { useParams } from "next/navigation";
import { RepoHeader } from "./RepoHeader";
import { RepoStatsRow } from "./RepoStatsRow";
import { RepoModuleDistribution } from "./RepoModuleDistribution";
import { BranchSetting } from "./BranchSetting";
import { LazyTrendChart } from "@/features/dashboard/components/LazyCharts";
import { LabelDistribution } from "@/features/dashboard/components/LabelDistribution";
import { DebtExplorer } from "@/features/debts/components/DebtExplorer";
import { ScanProgress } from "@/features/scanner/components/ScanProgress";
import { useRepo, mapRepoResponseToRepo } from "../hooks/useRepos";
import { useDashboardOverview } from "@/features/dashboard/hooks/useDashboard";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

interface RepoDetailContentProps {
  repoId?: string;
}

/**
 * SRP & Client Boundary:
 * Spesifik bir deponun detay sayfasındaki tüm grafik, tablo ve analiz istatistiklerini
 * canlı API verileriyle entegre eder.
 */
export function RepoDetailContent({ repoId: propRepoId }: RepoDetailContentProps) {
  const { t } = useI18n();
  const params = useParams();
  const repoId = propRepoId || (params?.repoId as string) || "";
  const {
    data: repoDto,
    isLoading: isRepoLoading,
    isError: isRepoError,
    refetch: refetchRepo,
  } = useRepo(repoId);

  const {
    stats,
    trendData,
    labelDistribution,
    moduleDistribution,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
    refetch: refetchOverview,
  } = useDashboardOverview(repoId);

  const isLoading = isRepoLoading || isOverviewLoading;
  const isError = isRepoError || isOverviewError;

  if (isLoading) {
    return (
      <div role="status" className="flex flex-col items-center justify-center min-h-[500px] w-full gap-3">
        <Loader2 className="w-8 h-8 text-hm-blue animate-spin" aria-hidden="true" />
        <p className="font-sans text-xs text-hm-text-secondary animate-pulse">{t("repos.detail.loading")}</p>
      </div>
    );
  }

  if (isError || !repoDto) {
    return (
      <div className="bg-hm-surface border-[0.5px] border-hm-border rounded-card p-8 flex flex-col items-center justify-center text-center gap-4 my-8">
        <div className="w-12 h-12 rounded-full bg-hm-danger-bg flex items-center justify-center text-hm-danger">
          <AlertCircle className="w-6 h-6" aria-hidden="true" />
        </div>
        <div role="alert">
          <h3 className="font-sans text-base font-medium text-hm-text-primary">{t("repos.detail.errorTitle")}</h3>
          <p className="font-sans text-xs text-hm-text-secondary mt-1 max-w-md">
            {t("repos.detail.errorDescription")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            refetchRepo();
            refetchOverview();
          }}
          className="px-4 py-2 bg-hm-text-primary text-hm-surface rounded text-xs font-medium flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          {t("common.retry")}
        </button>
      </div>
    );
  }

  const repo = mapRepoResponseToRepo(repoDto);
  repo.debtCount = stats.totalDebts;
  repo.resolvedCount = stats.resolvedDebts;

  const totalModuleDebts = moduleDistribution.reduce((acc, curr) => acc + curr.count, 0);
  const formattedModules = moduleDistribution.map((m) => ({
    name: m.module || t("repos.modules.root"),
    count: m.count,
    percentage: totalModuleDebts > 0 ? Math.round((m.count / totalModuleDebts) * 100) : 0,
  }));

  const addedThisWeek = trendData.length > 0 ? trendData[trendData.length - 1].added : 0;

  return (
    <>
      <RepoHeader repo={repo} />

      <div className="mb-4">
        <ScanProgress repoId={repoId} />
      </div>

      <RepoStatsRow
        totalCount={stats.totalDebts}
        addedCount={addedThisWeek}
        resolvedCount={stats.resolvedDebts}
      />

      <BranchSetting repoId={repoId} currentBranch={repo.trackedBranch} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 flex">
          <div className="w-full h-full min-w-0">
            <LazyTrendChart data={trendData} />
          </div>
        </div>
        <div className="flex">
          <div className="w-full h-full min-w-0">
            <LabelDistribution data={labelDistribution} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1">
          <RepoModuleDistribution data={formattedModules} />
        </div>
        <div className="lg:col-span-2" />
      </div>

      <DebtExplorer fixedRepoId={repoId} fixedRepoName={repoDto.fullName} />
    </>
  );
}
