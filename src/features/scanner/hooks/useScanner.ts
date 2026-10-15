import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { queryKeys } from "@/shared/api/query-keys";
import { useToastStore } from "@/shared/store/toast.store";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { getScanStatus, startScan } from "../api/scanner.api";
import { scanPollInterval } from "../utils/scan-status";

/**
 * SRP ve Adapter Pattern:
 * React bileşenleri (Components) API çağırmak yerine bu hook'ları kullanır.
 * Polling, TanStack Query'nin refetchInterval özelliğiyle yapılır.
 */

/**
 * Belirtilen repoId'ye ait kod tarama (scan) durumunu getirir.
 * Tarama devam ediyorsa (PENDING veya RUNNING) periyodik olarak yeni durumu sorar.
 * Hiç tarama yapılmamış depoda (404) hata sayılmaz ve tekrar denenmez.
 *
 * @param {string} repoId - Sorgulanacak reponun id'si
 */
export function useScanStatus(repoId: string) {
  return useQuery({
    queryKey: queryKeys.scanner.status(repoId),
    queryFn: () => getScanStatus(repoId),
    enabled: !!repoId,
    retry: (failureCount, error) =>
      !(isAxiosError(error) && error.response?.status === 404) && failureCount < 1,
    // PENDING/RUNNING iken sorgula; DONE, FAILED veya veri yokken dur
    refetchInterval: (query) => scanPollInterval(query.state.data?.status),
  });
}

/**
 * Kullanıcının belirli bir repoyu manuel olarak yeniden taratmasını sağlar (Mutation).
 */
export function useStartScan() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);
  const { t } = useI18n();

  return useMutation({
    mutationFn: (repoId: string) => startScan(repoId),
    onSuccess: (_, repoId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.scanner.status(repoId),
      });
      addToast({
        title: t("scan.started"),
        description: t("scan.startedDescription"),
        type: "success",
      });
    },
    onError: (err: Error) => {
      // 409: bu depo için tarama zaten sırada/çalışıyor
      const serverMessage = isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message
        : undefined;
      addToast({
        title: t("scan.startFailed"),
        description: serverMessage || err.message || t("scan.startFailedDescription"),
        type: "error",
      });
    },
  });
}
