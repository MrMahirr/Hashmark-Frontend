import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import { getSettings, updateSettings } from "../api/settings.api";
import type { UpdateSettingsRequest } from "../api/settings.types";

/**
 * SRP ve Adapter Pattern:
 * Ayarlar modülü React Component'ları bu hook'ları tüketir. Böylece önbelleğe alma, 
 * veri çekme ve güncelleme sonrası ekranı tazeleme (invalidation) işlemleri 
 * tek bir noktadan, komponentleri kirletmeden sağlanır.
 */

/** 
 * Kullanıcının mevcut ayarlarını API üzerinden çeker ve önbelleğe (cache) alır.
 */
export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings.current,
    queryFn: getSettings,
  });
}

/** 
 * Kullanıcının ayarlarını güncelleyen (Mutation) fonksiyonu döndürür.
 * Güncelleme başarılı olduğunda, useSettings() ile çekilen cache verisini
 * "bayat" (stale) olarak işaretler ve UI'ın otomatik yenilenmesini sağlar.
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSettingsRequest) => updateSettings(payload),
    onSuccess: () => {
      // Değişiklik sonrası ayarları tekrar sunucudan çekmesi için Query'i invalidate et.
      queryClient.invalidateQueries({
        queryKey: queryKeys.settings.current,
      });
    },
  });
}
