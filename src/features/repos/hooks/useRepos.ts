import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import { useToastStore } from "@/shared/store/toast.store";
import {
  getRepos,
  getRepo,
  syncRepos,
  deleteRepo,
} from "../api/repos.api";

import { Repo, ScanStatus } from "@/shared/types/repo.types";
import type { RepoResponse } from "../api/repos.types";

/**
 * SRP ve Adapter Pattern:
 * Repos modülüne ait Component'lar doğrudan API çağrıları yapmak yerine 
 * bu hook'ları tüketir. Böylece önbelleğe alma (caching), hata yönetimi ve loading stateleri 
 * React lifecycle'ı ile optimize edilmiş şekilde UI katmanına iletilir.
 */

/**
 * Adapter: Backend DTO'sunu (RepoResponse) UI katmanının (Repo) beklediği formata çevirir.
 */
export function mapRepoResponseToRepo(dto: RepoResponse): Repo {
  const parts = (dto.fullName || "").split("/");
  return {
    id: String(dto.id),
    name: parts.length > 1 ? parts[1] : dto.fullName || `Repo #${dto.id}`,
    fullName: dto.fullName || `repo-${dto.id}`,
    owner: parts.length > 1 ? parts[0] : "",
    language: "TypeScript",
    description: "",
    isPrivate: dto.isPrivate ?? false,
    lastScanAt: dto.lastScannedAt ? new Date(dto.lastScannedAt).toLocaleDateString() : null,
    scanStatus: dto.lastScannedAt ? ScanStatus.COMPLETED : ScanStatus.IDLE,
    debtCount: 0,
    resolvedCount: 0,
    connectedAt: dto.createdAt ? new Date(dto.createdAt).toLocaleDateString() : "",
  };
}

/** 
 * Kullanıcının sahip olduğu tüm repoları fetch eder ve önbellekler (Ham DTO döner).
 */
export function useRepos() {
  return useQuery({
    queryKey: queryKeys.repos.all,
    queryFn: getRepos,
  });
}

/** 
 * Kullanıcının repolarını çekip arayüzün beklediği Repo modeline dönüştürülmüş olarak döner.
 */
export function useMappedRepos() {
  return useQuery({
    queryKey: queryKeys.repos.all,
    queryFn: async (): Promise<Repo[]> => {
      const list = await getRepos();
      return (list || []).map(mapRepoResponseToRepo);
    },
  });
}

/** 
 * Spesifik bir repoId'ye ait veriyi fetch eder ve önbellekler.
 * @param {string} repoId - Backend'den istenecek reponun ID'si
 */
export function useRepo(repoId: string) {
  return useQuery({
    queryKey: queryKeys.repos.detail(repoId),
    queryFn: () => getRepo(repoId),
    enabled: !!repoId, // repoId gelene kadar isteği beklet (Güvenlik/Performans)
  });
}

/** 
 * GitHub depolarını sisteme senkronize eder. (Mutation)
 * İşlem bittikten sonra listeyi yeniler (Invalidate) ve bildirim gösterir.
 */
export function useSyncRepos() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: syncRepos,
    onMutate: () => {
      addToast({
        title: "Senkronizasyon Başladı",
        description: "GitHub depolarınız senkronize ediliyor...",
        type: "info",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repos.all });
      addToast({
        title: "Senkronizasyon Tamamlandı",
        description: "Depolarınız başarıyla güncellendi.",
        type: "success",
      });
    },
    onError: (err: Error) => {
      addToast({
        title: "Senkronizasyon Hatası",
        description: err.message || "Depolar güncellenirken bir sorun oluştu.",
        type: "error",
      });
    },
  });
}

/** 
 * Verilen repoyu sistemden siler. (Mutation)
 * İşlem bittikten sonra listeyi yeniler.
 */
export function useDeleteRepo() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: (repoId: string) => deleteRepo(repoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repos.all });
      addToast({
        title: "Depo Silindi",
        description: "Depo sistemden başarıyla kaldırıldı.",
        type: "success",
      });
    },
    onError: (err: Error) => {
      addToast({
        title: "Hata",
        description: err.message || "Depo silinirken bir sorun oluştu.",
        type: "error",
      });
    },
  });
}
