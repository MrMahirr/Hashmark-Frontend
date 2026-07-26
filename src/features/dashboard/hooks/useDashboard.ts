import { useQuery, useMutation } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import { getReportSummary, sendTestReport } from "../api/dashboard.api";
import { useDebtStats } from "@/features/debts/hooks/useDebts";
import { DebtType, type LabelDistribution, type ModuleDistribution, type TrendDataPoint } from "@/shared/types";

// NOTE: This hook acts as an Adapter between backend DTOs and UI presentation models
// config: default retry count is inherited from React Query Client provider settings

/**
 * SRP (Single Responsibility Principle) ve Adapter Pattern:
 * Dashboard (Raporlama) ekranlarındaki UI componentleri, doğrudan API çağrıları yapmak yerine
 * bu hook'ları kullanarak arayüz ile veri erişim mantığını ayırır.
 * React Query aracılığıyla caching, loading (yükleniyor) ve error handling süreçleri otomatik yönetilir.
 */

/** 
 * Dashboard için (global veya tekil repo) rapor özet verilerini (A-F notu, istatistikler vs) getirir.
 * 
 * @param {string} [repoId] - Opsiyonel repo id. (Global analiz sayfası ise boş yollanır)
 */
export function useReportSummary(repoId?: string) {
  // TODO: Implement custom staleTime and gcTime configuration from global settings
  return useQuery({
    // Query Key Factory: Repo ID verilmişse o repoya özel, yoksa genel rapor key'i oluşturur.
    queryKey: queryKeys.dashboard.summary(repoId),
    queryFn: () => getReportSummary(repoId),
  });
}

/**
 * Adapter Hook (SRP & DIP):
 * Backend'den gelen ham rapor ve istatistik DTO'larını birleştirerek arayüzün (Dashboard Overview)
 * ihtiyaç duyduğu kalite notu (Grade), sağlık skoru (Health Score) ve grafik formatlarına dönüştürür.
 */
export function useDashboardOverview(repoId?: string) {
  const summaryQuery = useReportSummary(repoId);
  const statsQuery = useDebtStats(repoId);

  const isLoading = summaryQuery.isLoading || statsQuery.isLoading;
  const isError = summaryQuery.isError || statsQuery.isError;

  const summary = summaryQuery.data;
  const stats = statsQuery.data;

  const totalDebts = stats?.total ?? 0;
  const resolvedDebts = stats?.resolvedThisWeek ?? 0;
  const activeDebts = Math.max(0, totalDebts - resolvedDebts);
  const resolutionRate = totalDebts > 0 ? Math.round((resolvedDebts / totalDebts) * 100) : 100;

  // HACK: Temporary fallback to totalDebts when backend labelStats is null during initial load
  // Sağlık Skoru ve Not Hesaplaması (Sadece TODO, FIXME, HACK, XXX penalize edilir; NOTE, DOC, INFO skordan düşülmez)
  const labelStats = summary?.labelStats;
  const todoCnt = labelStats?.todoCount ?? 0;
  const fixmeCnt = labelStats?.fixmeCount ?? 0;
  const hackCnt = labelStats?.hackCount ?? 0;
  const xxxCnt = labelStats?.xxxCount ?? 0;
  const noteCnt = labelStats?.noteCount ?? 0;
  const docCnt = labelStats?.docCount ?? 0;
  const infoCnt = labelStats?.infoCount ?? 0;

  const penalizableDebts = labelStats ? todoCnt + fixmeCnt + hackCnt + xxxCnt : totalDebts;

  const healthScore = Math.max(0, Math.min(100, 100 - Math.floor(penalizableDebts * 1.5)));
  let grade: "A" | "B" | "C" | "D" | "F" = "A";
  if (penalizableDebts > 80) grade = "F";
  else if (penalizableDebts > 50) grade = "D";
  else if (penalizableDebts > 30) grade = "C";
  else if (penalizableDebts > 10) grade = "B";

  // Trend Chart Verisinin Haritalanması
  const trendData: TrendDataPoint[] = summary?.trendData?.map((t) => ({
    date: t.weekStart,
    total: t.totalDebts,
    added: t.newDebts,
    resolved: t.resolvedDebts,
  })) ?? [];

  // FIXME: Verify percentage rounding precision when totalLabels sum exceeds 100% due to Math.round
  // Etiket Dağılımının (Label Distribution) Haritalanması
  const totalLabels = todoCnt + fixmeCnt + hackCnt + xxxCnt + noteCnt + docCnt + infoCnt;
  
  const labelDistribution: LabelDistribution[] = labelStats
    ? [
        { type: DebtType.TODO, count: todoCnt, percentage: totalLabels > 0 ? Math.round((todoCnt / totalLabels) * 100) : 0 },
        { type: DebtType.FIXME, count: fixmeCnt, percentage: totalLabels > 0 ? Math.round((fixmeCnt / totalLabels) * 100) : 0 },
        { type: DebtType.HACK, count: hackCnt, percentage: totalLabels > 0 ? Math.round((hackCnt / totalLabels) * 100) : 0 },
        { type: DebtType.XXX, count: xxxCnt, percentage: totalLabels > 0 ? Math.round((xxxCnt / totalLabels) * 100) : 0 },
        { type: DebtType.NOTE, count: noteCnt, percentage: totalLabels > 0 ? Math.round((noteCnt / totalLabels) * 100) : 0 },
        { type: DebtType.DOC, count: docCnt, percentage: totalLabels > 0 ? Math.round((docCnt / totalLabels) * 100) : 0 },
        { type: DebtType.INFO, count: infoCnt, percentage: totalLabels > 0 ? Math.round((infoCnt / totalLabels) * 100) : 0 },
      ].filter((l) => l.count > 0)
    : [];

  // Modül Dağılımının Haritalanması
  const moduleDistribution: ModuleDistribution[] = summary?.topModules?.map((m) => ({
    module: m.modulePath,
    count: m.debtCount,
  })) ?? [];

  // XXX: Critical: Ensure refetching queries does not trigger unnecessary component re-renders
  /** @return Formatted dashboard overview object containing health grade and chart datasets */
  return {
    isLoading,
    isError,
    grade,
    healthScore,
    stats: {
      totalDebts,
      activeDebts,
      resolvedDebts,
      activeRepos: 1,
      resolutionRate,
    },
    trendData,
    labelDistribution,
    moduleDistribution,
    refetch: () => {
      summaryQuery.refetch();
      statsQuery.refetch();
    },
  };
}

/** 
 * Belirtilen repo için (Webhook, e-posta test vb.) test raporunun gönderilmesini tetikler (Mutation).
 */
export function useSendTestReport() {
  return useMutation({
    mutationFn: (repoId: string) => sendTestReport(repoId),
  });
}
