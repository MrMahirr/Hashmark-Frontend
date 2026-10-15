"use client";

import React from "react";
import { StatCard } from "./StatCard";
import { LazyTrendChart } from "./LazyCharts";
import { LabelDistribution } from "./LabelDistribution";
import { RecentDebts } from "./RecentDebts";
import { OnboardingChecklist } from "./OnboardingChecklist";
import { useDashboardOverview } from "../hooks/useDashboard";
import { useMappedDebts } from "@/features/debts/hooks/useDebts";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

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
    return (
      <div role="status" className="flex flex-col items-center justify-center min-h-[500px] w-full gap-3">
        <Loader2 className="w-8 h-8 text-hm-blue animate-spin" aria-hidden="true" />
        <p className="font-sans text-xs text-hm-text-secondary animate-pulse">{t("dashboard.loading")}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-hm-surface border-[0.5px] border-hm-border rounded-card p-8 flex flex-col items-center justify-center text-center gap-4 my-8">
        <div className="w-12 h-12 rounded-full bg-hm-danger-bg flex items-center justify-center text-hm-danger">
          <AlertCircle className="w-6 h-6" aria-hidden="true" />
        </div>
        <div role="alert">
          <h3 className="font-sans text-base font-medium text-hm-text-primary">{t("dashboard.errorTitle")}</h3>
          <p className="font-sans text-xs text-hm-text-secondary mt-1 max-w-md">{t("dashboard.errorDescription")}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            refetchOverview();
            refetchDebts();
          }}
          className="px-4 py-2 bg-hm-text-primary text-hm-surface rounded text-xs font-medium flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          {t("common.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <OnboardingChecklist />

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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

      {/* Table: Recent Debts */}
      <RecentDebts debts={debtsData?.content || []} />
    </div>
  );
}
