import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import {
  getRepos,
  getRepo,
  syncRepos,
  deleteRepo,
} from "../api/repos.api";

/**
 * SRP ve Adapter Pattern:
 * Repos modülüne ait Component'lar doğrudan API çağrıları yapmak yerine 
 * bu hook'ları tüketir. Böylece önbelleğe alma (caching), hata yönetimi ve loading stateleri 
 * React lifecycle'ı ile optimize edilmiş şekilde UI katmanına iletilir.
 */

/** 
 * Kullanıcının sahip olduğu tüm repoları fetch eder ve önbellekler.
 */
export function useRepos() {
  return useQuery({
    queryKey: queryKeys.repos.all,
    queryFn: getRepos,
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
 * İşlem bittikten sonra listeyi yeniler (Invalidate).
 */
export function useSyncRepos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncRepos,
    onSuccess: () => {
      // Senkronizasyon başarılı olduktan sonra önbellekteki liste sorgusunu "bayat" (stale) işaretle 
      // ve yeniden tetiklenmesini sağla. (OCP ve State Consistency)
      queryClient.invalidateQueries({ queryKey: queryKeys.repos.all });
    },
  });
}

/** 
 * Verilen repoyu sistemden siler. (Mutation)
 * İşlem bittikten sonra listeyi yeniler.
 */
export function useDeleteRepo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (repoId: string) => deleteRepo(repoId),
    onSuccess: () => {
      // Veritabanından kayıt silindiğinde arayüzü güncel tutmak için cache'i invalidte ediyoruz.
      queryClient.invalidateQueries({ queryKey: queryKeys.repos.all });
    },
  });
}
