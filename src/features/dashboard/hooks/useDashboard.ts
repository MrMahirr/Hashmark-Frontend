import { useQuery, useMutation } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import { getReportSummary, sendTestReport } from "../api/dashboard.api";
import { useDebtStats } from "@/features/debts/hooks/useDebts";
import { DebtType, type LabelDistribution, type ModuleDistribution, type TrendDataPoint } from "@/shared/types";

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

  // Sağlık Skoru ve Not Hesaplaması
  const healthScore = Math.max(0, Math.min(100, 100 - Math.floor(totalDebts * 1.5)));
  let grade: "A" | "B" | "C" | "D" | "F" = "A";
  if (totalDebts > 80) grade = "F";
  else if (totalDebts > 50) grade = "D";
  else if (totalDebts > 30) grade = "C";
  else if (totalDebts > 10) grade = "B";

  // Trend Chart Verisinin Haritalanması
  const trendData: TrendDataPoint[] = summary?.trendData?.map((t) => ({
    date: t.weekStart,
    total: t.totalDebts,
    added: t.newDebts,
    resolved: t.resolvedDebts,
  })) ?? [];

  // Etiket Dağılımının (Label Distribution) Haritalanması
  const labelStats = summary?.labelStats;
  const totalLabels = labelStats ? labelStats.todoCount + labelStats.fixmeCount + labelStats.hackCount + labelStats.xxxCount : 0;
  
  const labelDistribution: LabelDistribution[] = labelStats
    ? [
        { type: DebtType.TODO, count: labelStats.todoCount, percentage: totalLabels > 0 ? Math.round((labelStats.todoCount / totalLabels) * 100) : 0 },
        { type: DebtType.FIXME, count: labelStats.fixmeCount, percentage: totalLabels > 0 ? Math.round((labelStats.fixmeCount / totalLabels) * 100) : 0 },
        { type: DebtType.HACK, count: labelStats.hackCount, percentage: totalLabels > 0 ? Math.round((labelStats.hackCount / totalLabels) * 100) : 0 },
        { type: DebtType.XXX, count: labelStats.xxxCount, percentage: totalLabels > 0 ? Math.round((labelStats.xxxCount / totalLabels) * 100) : 0 },
      ].filter((l) => l.count > 0)
    : [];

  // Modül Dağılımının Haritalanması
  const moduleDistribution: ModuleDistribution[] = summary?.topModules?.map((m) => ({
    module: m.modulePath,
    count: m.debtCount,
  })) ?? [];

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
