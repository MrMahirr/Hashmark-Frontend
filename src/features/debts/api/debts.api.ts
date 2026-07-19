import { apiClient } from "@/shared/api/client";
import { ApiMethod } from "@/shared/api/methods";
import { ApiEndpoint } from "@/shared/api/endpoints";
import type { DebtResponse, DebtStatsResponse } from "./debts.types";

/**
 * SRP (Single Responsibility Principle) ve DIP (Dependency Inversion Principle):
 * Bu dosya sadece Debts (Teknik Borçlar) modülüne ait HTTP API isteklerinin atılmasından sorumludur.
 * URL Base kısımları (ApiMethod, ApiEndpoint) ve HTTP istemcisi (apiClient) soyutlanarak dışarıdan import edilir.
 */

/** 
 * Sistemdeki tüm borçları veya filtrelenmiş borçları getirir.
 * @param {Record<string, unknown>} params - URL Query parametreleri (örn: ?repoId=1&severity=HIGH)
 * @returns {Promise<DebtResponse[]>} Borç listesi
 */
export async function getDebts(params?: Record<string, unknown>): Promise<DebtResponse[]> {
  const response = await apiClient.get<DebtResponse[]>(
    ApiMethod.DEBTS,
    { params } // axios, objeyi query string'e çevirir
  );
  return response.data;
}

/** 
 * Borç istatistiklerini getirir (Kritik, Yüksek vb. sayısal dağılımı).
 * Eğer repoId verilirse spesifik bir repoya ait istatistikleri,
 * verilmezse global (tüm repolar) istatistikleri döndürür.
 * 
 * @param {string} [repoId] - Opsiyonel Repo Id
 * @returns {Promise<DebtStatsResponse>} İstatistik nesnesi
 */
export async function getDebtStats(repoId?: string): Promise<DebtStatsResponse> {
  const response = await apiClient.get<DebtStatsResponse>(
    `${ApiMethod.DEBTS}/${ApiEndpoint.STATS}`,
    { 
      // Eğer repoId undefined ise axios bu parametreyi URL'e eklemez, 
      // bu sayede aynı fonksiyonla iki farklı senaryo çözülmüş olur (OCP).
      params: { repoId } 
    }
  );
  return response.data;
}
