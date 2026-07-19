import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import { getDebts, getDebtStats } from "../api/debts.api";

/**
 * SRP (Single Responsibility Principle) ve Adapter Pattern:
 * API ile React Component'ları (Arayüz) arasındaki iletişimi sağlayan ara katman.
 * Verilerin çekilmesinden, önbelleğe (cache) alınmasından ve loading (yükleniyor) 
 * statelerinden sorumludur.
 */

/** 
 * Veritabanındaki teknik borçları listeler.
 * @param {Record<string, unknown>} filters - Filtreleme parametreleri (Örn: severity="HIGH")
 * OCP'ye göre filtreler dinamik bir objedir; yeni filtre gelse dahi bu kod değişmez.
 */
export function useDebts(filters?: Record<string, unknown>) {
  return useQuery({
    // Query Key Factory kullanarak cache tutarlılığı sağlanır
    // Filtre varsa özel cache key'i, yoksa genel liste cache key'i (debts.all) oluşturur.
    queryKey: filters && Object.keys(filters).length > 0 
      ? queryKeys.debts.filtered(filters) 
      : queryKeys.debts.all,
    queryFn: () => getDebts(filters),
  });
}

/** 
 * Tüm projenin veya spesifik bir reponun istatistik verilerini (Kritik:5, Yüksek:12 vs.) çeker.
 * @param {string} [repoId] - Opsiyonel repo id
 */
export function useDebtStats(repoId?: string) {
  return useQuery({
    // RepoId varsa o reponun istatistikleri ayrı bir cache olarak tutulur.
    queryKey: queryKeys.debts.stats(repoId),
    queryFn: () => getDebtStats(repoId),
  });
}
