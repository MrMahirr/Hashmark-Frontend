import { apiClient } from "@/shared/api/client";
import { ApiMethod } from "@/shared/api/methods";
import { ApiEndpoint } from "@/shared/api/endpoints";

export interface SendTestEmailResponse {
  /** E-posta sağlayıcısı (Brevo) yapılandırılmış mı */
  configured: boolean;
  sent: boolean;
}

/** Oturumdaki kullanıcıya, kendi özet ayarlarıyla bir deneme e-postası gönderir. */
export async function sendTestEmail(): Promise<SendTestEmailResponse> {
  const response = await apiClient.post<SendTestEmailResponse>(`${ApiMethod.REPORT}/${ApiEndpoint.SEND_TEST}`);
  return response.data;
}
