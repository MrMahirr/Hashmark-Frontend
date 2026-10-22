"use client";

import React from "react";
import { useParams } from "next/navigation";
import { RepoHeader } from "./RepoHeader";
import { RepoStatsRow } from "./RepoStatsRow";
import { RepoModuleDistribution } from "./RepoModuleDistribution";
import { BranchSetting } from "./BranchSetting";
import { AutoScanSetting } from "./AutoScanSetting";
import { LazyTrendChart } from "@/features/dashboard/components/LazyCharts";
import { LabelDistribution } from "@/features/dashboard/components/LabelDistribution";
import { DebtExplorer } from "@/features/debts/components/DebtExplorer";
import { DebtInsights } from "@/features/dashboard/components/DebtInsights";
import { ScanProgress } from "@/features/scanner/components/ScanProgress";
import { useRepo, mapRepoResponseToRepo } from "../hooks/useRepos";
import { useDashboardOverview } from "@/features/dashboard/hooks/useDashboard";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { ErrorState, LoadingState } from "@/shared/ui/StateViews";

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
    insights,
    grade,
    healthScore,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
    refetch: refetchOverview,
  } = useDashboardOverview(repoId);

  const isLoading = isRepoLoading || isOverviewLoading;
  const isError = isRepoError || isOverviewError;

  if (isLoading) {
    return <LoadingState label={t("repos.detail.loading")} />;
  }

  if (isError || !repoDto) {
    return (
      <ErrorState
        title={t("repos.detail.errorTitle")}
        description={t("repos.detail.errorDescription")}
        retryLabel={t("common.retry")}
        onRetry={() => {
          refetchRepo();
          refetchOverview();
        }}
      />
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
    <div className="flex flex-col gap-5">
      <RepoHeader repo={repo} />

      <ScanProgress repoId={repoId} />

      <RepoStatsRow
        totalCount={stats.totalDebts}
        addedCount={addedThisWeek}
        resolvedCount={stats.resolvedDebts}
      />

      {insights && <DebtInsights insights={insights} grade={grade} healthScore={healthScore} repoId={repoId} />}

      <BranchSetting repoId={repoId} currentBranch={repo.trackedBranch} />

      <AutoScanSetting repoId={repoId} enabled={repo.autoScan ?? false} />

      <div className="flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-[2_1_460px]">
          <LazyTrendChart data={trendData} />
        </div>
        <div className="min-w-0 flex-[1_1_320px]">
          <LabelDistribution data={labelDistribution} />
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-[1_1_320px]">
          <RepoModuleDistribution data={formattedModules} />
        </div>
      </div>

      <DebtExplorer fixedRepoId={repoId} fixedRepoName={repoDto.fullName} />
    </div>
  );
}
