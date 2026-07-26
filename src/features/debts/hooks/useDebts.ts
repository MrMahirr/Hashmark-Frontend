import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import { getDebts, getDebtStats } from "../api/debts.api";
import { Debt, DebtType, DebtStatus } from "@/shared/types/debt.types";
import type { DebtResponse, PageResponse } from "../api/debts.types";

/**
 * SRP (Single Responsibility Principle) ve Adapter Pattern:
 * API ile React Component'ları (Arayüz) arasındaki iletişimi sağlayan ara katman.
 * Verilerin çekilmesinden, önbelleğe (cache) alınmasından ve loading (yükleniyor) 
 * statelerinden sorumludur.
 */

/**
 * Adapter fonksiyonu: Backend DTO'sunu UI katmanının beklediği Debt arayüzüne çevirir.
 */
export function mapDebtResponseToDebt(dto: DebtResponse, defaultRepoName = ""): Debt {
  return {
    id: String(dto.id),
    type: (dto.label as DebtType) || DebtType.TODO,
    message: dto.content || "",
    filePath: dto.filePath || "",
    lineNumber: dto.lineNo || 0,
    repoId: String(dto.repoId),
    repoName: dto.repoFullName || defaultRepoName || `Repo #${dto.repoId}`,
    author: "Developer",
    status: dto.resolvedAt ? DebtStatus.RESOLVED : DebtStatus.ACTIVE,
    createdAt: dto.detectedAt ? new Date(dto.detectedAt).toLocaleDateString() : "",
    resolvedAt: dto.resolvedAt ? new Date(dto.resolvedAt).toLocaleDateString() : null,
  };
}

/** 
 * Veritabanındaki teknik borçları listeler (Ham DTO PageResponse döner).
 * @param {Record<string, unknown>} filters - Filtreleme parametreleri (Örn: label="TODO", page=0, size=20)
 */
export function useDebts(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: filters && Object.keys(filters).length > 0 
      ? queryKeys.debts.filtered(filters) 
      : queryKeys.debts.all,
    queryFn: () => getDebts(filters),
  });
}

/** 
 * Veritabanındaki teknik borçları çekip doğrudan UI (Debt) modellerine çevrilmiş olarak döner.
 */
export function useMappedDebts(filters?: Record<string, unknown>, defaultRepoName = "") {
  return useQuery({
    queryKey: filters && Object.keys(filters).length > 0 
      ? queryKeys.debts.filtered(filters) 
      : queryKeys.debts.all,
    queryFn: async (): Promise<PageResponse<Debt>> => {
      const res = await getDebts(filters);
      return {
        ...res,
        content: res.content.map((dto) => mapDebtResponseToDebt(dto, defaultRepoName)),
      };
    },
  });
}

/** 
 * Tüm projenin veya spesifik bir reponun istatistik verilerini çeker.
 * @param {string} [repoId] - Opsiyonel repo id
 */
export function useDebtStats(repoId?: string) {
  return useQuery({
    queryKey: queryKeys.debts.stats(repoId),
    queryFn: () => getDebtStats(repoId),
  });
}
