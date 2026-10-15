import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import { useToastStore } from "@/shared/store/toast.store";
import { getScanStatus, startScan } from "../api/scanner.api";
import { scanPollInterval } from "../utils/scan-status";

/**
 * SRP ve Adapter Pattern:
 * React bileşenleri (Components) API çağırmak yerine bu hook'ları kullanır. 
 * Bileşenlerin içerisinde setInterval kurmak yerine, TanStack Query'nin state management
 * ve polling (refetchInterval) özelliklerini kullanarak UI'ı gereksiz yükten kurtarırız.
 */

/** 
 * Belirtilen repoId'ye ait kod tarama (scan) durumunu getirir.
 * Tarama devam ediyorsa (PENDING veya RUNNING), periyodik (Polling) olarak
 * backend'den yeni durumu sorar.
 * 
 * @param {string} repoId - Sorgulanacak reponun id'si
 */
export function useScanStatus(repoId: string) {
  return useQuery({
    queryKey: queryKeys.scanner.status(repoId),
    queryFn: () => getScanStatus(repoId),
    enabled: !!repoId, // repoId gelmeden API isteği başlatma
    // PENDING/RUNNING iken 5 sn'de bir sorgula; DONE, FAILED veya veri yokken dur
    refetchInterval: (query) => scanPollInterval(query.state.data?.status),
  });
}

/** 
 * Kullanıcının belirli bir repoyu manuel olarak yeniden taratmasını sağlar (Mutation).
 */
export function useStartScan() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: (repoId: string) => startScan(repoId),
    onSuccess: (_, repoId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.scanner.status(repoId),
      });
      addToast({
        title: "Tarama Başlatıldı",
        description: "Seçilen depo için kod analizi arkaplanda başladı.",
        type: "success",
      });
    },
    onError: (err: Error) => {
      addToast({
        title: "Tarama Başlatılamadı",
        description: err.message || "Kod analizi tetiklenirken bir hata oluştu.",
        type: "error",
      });
    },
  });
}
