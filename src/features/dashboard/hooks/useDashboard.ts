import { useQuery, useMutation } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import { getReportSummary, sendTestReport } from "../api/dashboard.api";

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
 * Belirtilen repo için (Webhook, e-posta test vb.) test raporunun gönderilmesini tetikler (Mutation).
 */
export function useSendTestReport() {
  return useMutation({
    mutationFn: (repoId: string) => sendTestReport(repoId),
  });
}
