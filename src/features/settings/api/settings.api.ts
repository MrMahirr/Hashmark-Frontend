import { apiClient } from "@/shared/api/client";
import { ApiMethod } from "@/shared/api/methods";
import type { SettingsResponse, UpdateSettingsRequest } from "./settings.types";

/**
 * SRP (Single Responsibility Principle) ve DIP (Dependency Inversion Principle):
 * Ayarlar (Settings) modülüne ait HTTP işlemlerini üstlenen API katmanı.
 * Sabit string değerleri yerine dışarıdan (import) API sabitleri ve istemci objesi kullanılarak
 * OCP (Open/Closed Principle) uyumlu bir esneklik kazandırılır.
 */

/** 
 * Oturum açmış kullanıcının ayarlarını (e-posta bildirimi, gün) backend'den getirir.
 * 
 * @returns {Promise<SettingsResponse>} Kullanıcı ayarları
 */
export async function getSettings(): Promise<SettingsResponse> {
  const response = await apiClient.get<SettingsResponse>(
    ApiMethod.SETTINGS
  );
  return response.data;
}

/** 
 * Kullanıcının ayarlarını (kısmi veya tam) günceller.
 * 
 * @param {UpdateSettingsRequest} payload - Güncellenmek istenen ayarlar
 * @returns {Promise<SettingsResponse>} Güncelleme sonrası oluşan yeni ayarlar
 */
export async function updateSettings(payload: UpdateSettingsRequest): Promise<SettingsResponse> {
  const response = await apiClient.put<SettingsResponse>(
    ApiMethod.SETTINGS,
    payload
  );
  return response.data;
}
