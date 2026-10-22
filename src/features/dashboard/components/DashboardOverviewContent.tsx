"use client";

import React from "react";
import { StatCard } from "./StatCard";
import { LazyTrendChart } from "./LazyCharts";
import { LabelDistribution } from "./LabelDistribution";
import { RecentDebts } from "./RecentDebts";
import { OnboardingChecklist } from "./OnboardingChecklist";
import { DebtInsights } from "./DebtInsights";
import { RepoComparison } from "./RepoComparison";
import { useDashboardOverview } from "../hooks/useDashboard";
import { useMappedDebts } from "@/features/debts/hooks/useDebts";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { ErrorState, LoadingState } from "@/shared/ui/StateViews";

/**
 * SRP & Client Boundary:
 * Server Component olan sayfa (page.tsx) yerine React Query hook'larını ve interaktif
 * verileri bu Client Component yönetir.
 */
export function DashboardOverviewContent() {
  const { t } = useI18n();
  const {
    isLoading: isOverviewLoading,
    isError: isOverviewError,
    stats,
    trendData,
    labelDistribution,
    insights,
    grade,
    healthScore,
    refetch: refetchOverview,
  } = useDashboardOverview();

  const {
    data: debtsData,
    isLoading: isDebtsLoading,
    isError: isDebtsError,
    refetch: refetchDebts,
  } = useMappedDebts({ page: 0, size: 5, status: "open" });

  const isLoading = isOverviewLoading || isDebtsLoading;
  const isError = isOverviewError || isDebtsError;

  if (isLoading) {
    return <LoadingState label={t("dashboard.loading")} />;
  }

  if (isError) {
    return (
      <ErrorState
        title={t("dashboard.errorTitle")}
        description={t("dashboard.errorDescription")}
        retryLabel={t("common.retry")}
        onRetry={() => {
          refetchOverview();
          refetchDebts();
        }}
      />
    );
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <OnboardingChecklist />

      {/* Stat Cards Row */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-4">
        <StatCard title={t("dashboard.stat.total")} value={stats.totalDebts} />
        <StatCard
          title={t("dashboard.stat.added")}
          value={trendData.length > 0 ? `+${trendData[trendData.length - 1].added}` : "+0"}
          badgeText={t("dashboard.badge.high")}
          badgeType="high"
        />
        <StatCard
          title={t("dashboard.stat.resolved")}
          value={stats.resolvedDebts}
          badgeText={t("dashboard.badge.good")}
          badgeType="good"
        />
        <StatCard title={t("dashboard.stat.repos")} value={stats.activeRepos} />
      </div>

      {insights && <DebtInsights insights={insights} grade={grade} healthScore={healthScore} />}

      {/* Grafik + etikete göre */}
      <div className="flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-[2_1_460px]">
          <LazyTrendChart data={trendData} />
        </div>
        <div className="min-w-0 flex-[1_1_320px]">
          <LabelDistribution data={labelDistribution} />
        </div>
      </div>

      <RepoComparison />

      {/* Table: Recent Debts */}
      <RecentDebts debts={debtsData?.content || []} />
    </div>
  );
}
