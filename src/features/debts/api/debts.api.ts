import { apiClient } from "@/shared/api/client";
import { ApiMethod } from "@/shared/api/methods";
import { ApiEndpoint } from "@/shared/api/endpoints";
import type {
  DebtContextResponse,
  DebtFilters,
  DebtResponse,
  DebtStatsResponse,
  DebtTriageRequest,
  ExportFormat,
  PageResponse,
} from "./debts.types";

/**
 * SRP (Single Responsibility Principle) ve DIP (Dependency Inversion Principle):
 * Bu dosya sadece Debts (Teknik Borçlar) modülüne ait HTTP API isteklerinin atılmasından sorumludur.
 */

/** Boş/undefined değerleri atar; backend yalnızca anlamlı parametreleri görür. */
export function buildDebtParams(filters: DebtFilters = {}): Record<string, string | number> {
  const params: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === "") continue;
    params[key] = value as string | number;
  }
  return params;
}

/**
 * Borçları (filtreli, aramalı, sıralı, sayfalı) getirir.
 * @param {DebtFilters} filters - Filtre/arama/sıralama parametreleri
 */
export async function getDebts(filters?: DebtFilters | Record<string, unknown>): Promise<PageResponse<DebtResponse>> {
  const response = await apiClient.get<PageResponse<DebtResponse>>(ApiMethod.DEBTS, {
    params: buildDebtParams(filters as DebtFilters),
  });
  return response.data;
}

/**
 * Borç istatistiklerini getirir. repoId verilirse yalnızca o depoya ait olanı döndürür.
 * @param {string} [repoId] - Opsiyonel Repo Id
 */
export async function getDebtStats(repoId?: string): Promise<DebtStatsResponse> {
  const response = await apiClient.get<DebtStatsResponse>(
    `${ApiMethod.DEBTS}/${ApiEndpoint.STATS}`,
    { params: { repoId } }
  );
  return response.data;
}

/** Bir borcu yok say / düzeltilmeyecek işaretle / yeniden aç ve/veya kişiye ata. */
export async function triageDebt(id: string, payload: DebtTriageRequest): Promise<DebtResponse> {
  const response = await apiClient.patch<DebtResponse>(`${ApiMethod.DEBTS}/${id}`, payload);
  return response.data;
}

/** Borcun çevresindeki kaynak kodu satırları. */
export async function getDebtContext(id: string, radius = 5): Promise<DebtContextResponse> {
  const response = await apiClient.get<DebtContextResponse>(`${ApiMethod.DEBTS}/${id}/context`, {
    params: { radius },
  });
  return response.data;
}

export interface ExportedFile {
  blob: Blob;
  filename: string;
}

/** Mevcut filtrelere göre borçları CSV/JSON/SARIF olarak indirir (sayfalama yok sayılır). */
export async function exportDebts(filters: DebtFilters, format: ExportFormat): Promise<ExportedFile> {
  const { page: _page, size: _size, ...rest } = filters;
  void _page;
  void _size;
  const response = await apiClient.get<Blob>(`${ApiMethod.DEBTS}/export`, {
    params: { ...buildDebtParams(rest), format },
    responseType: "blob",
  });

  const disposition = String(response.headers["content-disposition"] ?? "");
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition);
  return {
    blob: response.data,
    filename: match?.[1] ?? `hashmark-debts.${format}`,
  };
}
