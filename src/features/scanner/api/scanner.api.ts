import { apiClient } from "@/shared/api/client";
import { ApiMethod } from "@/shared/api/methods";
import { ApiEndpoint } from "@/shared/api/endpoints";
import type { ScanStatusResponse } from "./scanner.types";

/**
 * SRP (Single Responsibility Principle) ve DIP (Dependency Inversion Principle):
 * Bu dosya sadece Scanner (Tarama) modülüne ait HTTP API isteklerinin atılmasından sorumludur.
 * URL Base kısımları (ApiMethod, ApiEndpoint) ve axios/fetch mantığı (apiClient) soyutlanarak dışarıdan import edilir.
 */

/** 
 * Verilen bir reponun anlık tarama durumunu (ScanStatusDto) getirir.
 * @param {string} repoId - Sorgulanacak reponun id'si
 * @returns {Promise<ScanStatusResponse>} Tarama durum detayları
 */
export async function getScanStatus(repoId: string): Promise<ScanStatusResponse> {
  const response = await apiClient.get<ScanStatusResponse>(
    `${ApiMethod.SCAN}/${repoId}/${ApiEndpoint.STATUS}`
  );
  return response.data;
}

/** 
 * Belirtilen repo için backend üzerinde yeni bir kod tarama (Code Scan) işlemini asenkron olarak başlatır.
 * @param {string} repoId - Taraması başlatılacak reponun id'si
 * @returns {Promise<void>}
 */
export async function startScan(repoId: string): Promise<void> {
  await apiClient.post(
    `${ApiMethod.SCAN}/${repoId}`
  );
}
