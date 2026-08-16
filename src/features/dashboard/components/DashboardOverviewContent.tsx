"use client";

import React from "react";
import { StatCard } from "./StatCard";
import { TrendChart } from "./TrendChart";
import { LabelDistribution } from "./LabelDistribution";
import { RecentDebts } from "./RecentDebts";
import { useDashboardOverview } from "../hooks/useDashboard";
import { useMappedDebts } from "@/features/debts/hooks/useDebts";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

/**
 * SRP & Client Boundary:
 * Server Component olan sayfa (page.tsx) yerine React Query hook'larını ve interaktif
 * verileri bu Client Component yönetir.
 */
export function DashboardOverviewContent() {
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
  } = useMappedDebts({ page: 0, size: 5 });

  const isLoading = isOverviewLoading || isDebtsLoading;
  const isError = isOverviewError || isDebtsError;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] w-full gap-3">
        <Loader2 className="w-8 h-8 text-hm-blue animate-spin" />
        <p className="font-sans text-xs text-hm-text-secondary animate-pulse">
          Dashboard verileri yükleniyor...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-hm-surface border-[0.5px] border-hm-border rounded-card p-8 flex flex-col items-center justify-center text-center gap-4 my-8">
        <div className="w-12 h-12 rounded-full bg-hm-danger-bg flex items-center justify-center text-hm-danger">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-sans text-base font-medium text-hm-text-primary">
            Veriler Alınamadı
          </h3>
          <p className="font-sans text-xs text-hm-text-secondary mt-1 max-w-md">
            Backend sunucusundan canlı verileri çekerken bir sorun oluştu. Lütfen bağlantınızı kontrol edin.
          </p>
        </div>
        <button
          onClick={() => {
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

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Toplam Borç" value={stats.totalDebts} />
        <StatCard
          title="Bu Hafta Eklenen"
          value={trendData.length > 0 ? `+${trendData[trendData.length - 1].added}` : "+0"}
          badgeText="Yüksek"
          badgeType="high"
        />
        <StatCard
          title="Çözülen"
          value={stats.resolvedDebts}
          badgeText="İyi"
          badgeType="good"
        />
        <StatCard title="Depolar" value={stats.activeRepos} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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

      {/* Table: Recent Debts */}
      <RecentDebts debts={debtsData?.content || []} />
    </div>
  );
}
