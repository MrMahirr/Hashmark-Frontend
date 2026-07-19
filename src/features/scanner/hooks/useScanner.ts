import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import { getScanStatus, startScan } from "../api/scanner.api";

/**
 * SRP ve Adapter Pattern:
 * React bileşenleri (Components) API çağırmak yerine bu hook'ları kullanır. 
 * Bileşenlerin içerisinde setInterval kurmak yerine, TanStack Query'nin state management
 * ve polling (refetchInterval) özelliklerini kullanarak UI'ı gereksiz yükten kurtarırız.
 */

/** 
 * Belirtilen repoId'ye ait kod tarama (scan) durumunu getirir.
 * Tarama devam ediyorsa (PENDING veya IN_PROGRESS), periyodik (Polling) olarak
 * backend'den yeni durumu sorar.
 * 
 * @param {string} repoId - Sorgulanacak reponun id'si
 */
export function useScanStatus(repoId: string) {
  return useQuery({
    queryKey: queryKeys.scanner.status(repoId),
    queryFn: () => getScanStatus(repoId),
    enabled: !!repoId, // repoId gelmeden API isteği başlatma
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Durum bekliyor veya devam ediyorsa 5 saniyede bir kontrol et (Polling)
      if (status === "PENDING" || status === "IN_PROGRESS") {
        return 5000;
      }
      // COMPLETED, FAILED veya undefined ise dur. (Polling iptal)
      return false;
    },
  });
}

/** 
 * Kullanıcının belirli bir repoyu manuel olarak yeniden taratmasını sağlar (Mutation).
 */
export function useStartScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (repoId: string) => startScan(repoId),
    onSuccess: (_, repoId) => {
      // Tarama isteği başarılı olduğunda (HTTP 20x),
      // bu repo'ya ait scanner status bilgisini eski/bayat (stale) olarak işaretle.
      // Bu sayede useScanStatus hook'u tetiklenir ve polling sürecini arkaplanda otomatik başlatır.
      queryClient.invalidateQueries({
        queryKey: queryKeys.scanner.status(repoId),
      });
    },
  });
}
