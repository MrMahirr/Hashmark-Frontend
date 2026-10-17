import { useQuery, useMutation } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import { queryConfig } from "@/shared/config/query.config";
import { distributePercentages } from "@/shared/utils/percentages";
import { getReportSummary, sendTestReport } from "../api/dashboard.api";
import { calculateHealth } from "../utils/health";
import { useDebtStats } from "@/features/debts/hooks/useDebts";
import { useMappedRepos } from "@/features/repos/hooks/useRepos";
import { DebtType, type LabelDistribution, type ModuleDistribution, type TrendDataPoint } from "@/shared/types";

/**
 * SRP (Single Responsibility Principle) ve Adapter Pattern:
 * Dashboard (Raporlama) ekranlarındaki UI componentleri, doğrudan API çağrıları yapmak yerine
 * bu hook'ları kullanarak arayüz ile veri erişim mantığını ayırır.
 * React Query aracılığıyla caching, loading (yükleniyor) ve error handling süreçleri otomatik yönetilir.
 */

/**
 * Dashboard için (global veya tekil repo) rapor özet verilerini getirir.
 * Zamanlama ayarları `queryConfig` içinden gelir.
 *
 * @param {string} [repoId] - Opsiyonel repo id. (Global analiz sayfası ise boş yollanır)
 */
export function useReportSummary(repoId?: string) {
  return useQuery({
    // Query Key Factory: Repo ID verilmişse o repoya özel, yoksa genel rapor key'i oluşturur.
    queryKey: queryKeys.dashboard.summary(repoId),
    queryFn: () => getReportSummary(repoId),
    staleTime: queryConfig.reportStaleTime,
    gcTime: queryConfig.gcTime,
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
  const reposQuery = useMappedRepos();

  const isLoading = summaryQuery.isLoading || statsQuery.isLoading;
  const isError = summaryQuery.isError || statsQuery.isError;

  const summary = summaryQuery.data;
  const stats = statsQuery.data;

  const totalDebts = stats?.total ?? 0;
  const resolvedDebts = stats?.resolvedThisWeek ?? 0;
  const activeDebts = Math.max(0, totalDebts - resolvedDebts);
  const resolutionRate = totalDebts > 0 ? Math.round((resolvedDebts / totalDebts) * 100) : 100;

  const labelStats = summary?.labelStats;
  const todoCnt = labelStats?.todoCount ?? 0;
  const fixmeCnt = labelStats?.fixmeCount ?? 0;
  const hackCnt = labelStats?.hackCount ?? 0;
  const xxxCnt = labelStats?.xxxCount ?? 0;
  const noteCnt = labelStats?.noteCount ?? 0;
  const docCnt = labelStats?.docCount ?? 0;
  const infoCnt = labelStats?.infoCount ?? 0;
  const customCounts = Object.entries(labelStats?.customCounts ?? {})
    .filter(([, count]) => count > 0)
    .sort(([a], [b]) => a.localeCompare(b));
  const customCnt = customCounts.reduce((sum, [, count]) => sum + count, 0);

  // Etiket istatistiği henüz gelmediyse (ilk yükleme) toplam borç sayısı kullanılır.
  // Sağlık hesabında TODO, FIXME, HACK, XXX ve `.hashmark.yml` özel etiketleri penalize edilir;
  // NOTE, DOC, INFO edilmez.
  const penalizableDebts = labelStats ? todoCnt + fixmeCnt + hackCnt + xxxCnt + customCnt : totalDebts;
  const { score: healthScore, grade } = calculateHealth(penalizableDebts);

  const trendData: TrendDataPoint[] = summary?.trendData?.map((t) => ({
    date: t.weekStart,
    total: t.totalDebts,
    added: t.newDebts,
    resolved: t.resolvedDebts,
  })) ?? [];

  // Etiket dağılımı: yüzdelerin toplamı her zaman 100 (en büyük kalan yöntemi)
  const labelCounts: Array<{ type: DebtType | string; count: number }> = [
    { type: DebtType.TODO, count: todoCnt },
    { type: DebtType.FIXME, count: fixmeCnt },
    { type: DebtType.HACK, count: hackCnt },
    { type: DebtType.XXX, count: xxxCnt },
    // Özel etiketler borçtur: yerleşik borç etiketlerinden sonra, bilgi etiketlerinden önce
    ...customCounts.map(([type, count]) => ({ type, count })),
    { type: DebtType.NOTE, count: noteCnt },
    { type: DebtType.DOC, count: docCnt },
    { type: DebtType.INFO, count: infoCnt },
  ];
  const percentages = distributePercentages(labelCounts.map((l) => l.count));

  const labelDistribution: LabelDistribution[] = labelStats
    ? labelCounts
        .map((l, index) => ({ type: l.type, count: l.count, percentage: percentages[index] }))
        .filter((l) => l.count > 0)
    : [];

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
      // Tek depo görünümünde 1, genel bakışta bağlı depo sayısı
      activeRepos: repoId ? 1 : (reposQuery.data?.length ?? 0),
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
 * Belirtilen repo için test raporunun gönderilmesini tetikler (Mutation).
 */
export function useSendTestReport() {
  return useMutation({
    mutationFn: (repoId: string) => sendTestReport(repoId),
  });
}
