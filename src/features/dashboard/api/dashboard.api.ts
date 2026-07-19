import { apiClient } from "@/shared/api/client";
import { ApiMethod } from "@/shared/api/methods";
import { ApiEndpoint } from "@/shared/api/endpoints";
import type { ReportSummaryResponse } from "./dashboard.types";

/**
 * SRP (Single Responsibility Principle) ve DIP (Dependency Inversion Principle):
 * Dashboard (Raporlama) modülüne ait HTTP işlemlerini üstlenen API katmanı.
 * Sabit string değerleri yerine dışarıdan (import) sabitleri ve client objesini kullanır.
 */

/** 
 * Genel (Global) veya belirli bir repo için rapor özetini (Grade, Health vs.) getirir.
 * 
 * @param {string} [repoId] - Opsiyonel repo id. Gönderilmezse global özeti getirir.
 * @returns {Promise<ReportSummaryResponse>} Rapor özeti
 */
export async function getReportSummary(repoId?: string): Promise<ReportSummaryResponse> {
  const response = await apiClient.get<ReportSummaryResponse>(
    `${ApiMethod.REPORT}/${ApiEndpoint.SUMMARY}`,
    { 
      // repoId verilmezse undefined olarak URL'den çıkarılır (Axios özelliği)
      params: { repoId } 
    }
  );
  return response.data;
}

/** 
 * Raporun test amaçlı (Webhook vb. yollarla) gönderilmesini tetikler.
 * 
 * @param {string} repoId - Test raporu gönderilecek reponun id'si
 * @returns {Promise<void>}
 */
export async function sendTestReport(repoId: string): Promise<void> {
  await apiClient.post(
    `${ApiMethod.REPORT}/${repoId}/${ApiEndpoint.SEND_TEST}`
  );
}
