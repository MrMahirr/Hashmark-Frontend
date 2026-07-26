"use client";

import React from "react";
import { useParams } from "next/navigation";
import { RepoHeader } from "./RepoHeader";
import { RepoStatsRow } from "./RepoStatsRow";
import { RepoModuleDistribution } from "./RepoModuleDistribution";
import { RepoDebtTable } from "./RepoDebtTable";
import { TrendChart } from "@/features/dashboard/components/TrendChart";
import { LabelDistribution } from "@/features/dashboard/components/LabelDistribution";
import { useRepo, mapRepoResponseToRepo } from "../hooks/useRepos";
import { useDashboardOverview } from "@/features/dashboard/hooks/useDashboard";
import { useMappedDebts } from "@/features/debts/hooks/useDebts";
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

  const {
    data: debtsPage,
    isLoading: isDebtsLoading,
    isError: isDebtsError,
    refetch: refetchDebts,
  } = useMappedDebts({ repoId }, repoDto?.fullName || "");

  const isLoading = isRepoLoading || isOverviewLoading || isDebtsLoading;
  const isError = isRepoError || isOverviewError || isDebtsError;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] w-full gap-3">
        <Loader2 className="w-8 h-8 text-hm-blue animate-spin" />
        <p className="font-sans text-xs text-hm-text-secondary animate-pulse">
          Depo detayları ve analitiği yükleniyor...
        </p>
      </div>
    );
  }

  if (isError || !repoDto) {
    return (
      <div className="bg-hm-surface border-[0.5px] border-hm-border rounded-card p-8 flex flex-col items-center justify-center text-center gap-4 my-8">
        <div className="w-12 h-12 rounded-full bg-hm-danger-bg flex items-center justify-center text-hm-danger">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-sans text-base font-medium text-hm-text-primary">
            Depo Bilgileri Alınamadı
          </h3>
          <p className="font-sans text-xs text-hm-text-secondary mt-1 max-w-md">
            Seçilen depoya ait verileri çekerken bir sorun oluştu veya depo bulunamadı. Lütfen tekrar deneyin.
          </p>
        </div>
        <button
          onClick={() => {
            refetchRepo();
            refetchOverview();
            refetchDebts();
          }}
          className="px-4 py-2 bg-hm-text-primary text-hm-surface rounded text-xs font-medium flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Yeniden Dene
        </button>
      </div>
    );
  }

  const repo = mapRepoResponseToRepo(repoDto);
  repo.debtCount = stats.totalDebts;
  repo.resolvedCount = stats.resolvedDebts;

  // ModuleDistribution stat transformasyonu
  const totalModuleDebts = moduleDistribution.reduce((acc, curr) => acc + curr.count, 0);
  const formattedModules = moduleDistribution.map((m) => ({
    name: m.module || "Root",
    count: m.count,
    percentage: totalModuleDebts > 0 ? Math.round((m.count / totalModuleDebts) * 100) : 0,
  }));

  const addedThisWeek = trendData.length > 0 ? trendData[trendData.length - 1].added : 0;

  return (
    <>
      {/* Header */}
      <RepoHeader repo={repo} />

      {/* Stats Row */}
      <RepoStatsRow
        totalCount={stats.totalDebts}
        addedCount={addedThisWeek}
        resolvedCount={stats.resolvedDebts}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 flex">
          <div className="w-full h-full min-w-0">
            <TrendChart data={trendData} />
          </div>
        </div>
        <div className="flex">
          <div className="w-full h-full min-w-0">
            <LabelDistribution data={labelDistribution} />
          </div>
        </div>
      </div>

      {/* Module Distribution and Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <RepoModuleDistribution data={formattedModules} />
        </div>
        <div className="lg:col-span-2">
          <RepoDebtTable data={debtsPage?.content || []} />
        </div>
      </div>
    </>
  );
}
