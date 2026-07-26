/**
 * Interface Segregation Principle (ISP) & Single Responsibility Principle (SRP):
 * Ayarlar (Settings) modülüne ait API Request ve Response modelleri bu dosyada tutulur.
 * Sadece Settings işlemlerinde kullanılacağından diğer sayfaları/tipleri kirletmez.
 */

// ── Response Types ──

/** 
 * GET /settings
 * Kullanıcının mevcut ayarlarını döner.
 * Backend DTO karşılığı: dev.hashmark.settings.dto.SettingsDto
 */
export interface SettingsResponse {
  webhookUrl: string | null;
  notifyOnCritical: boolean;
  notifyOnHigh: boolean;
}

// ── Request Types ──

/** 
 * PATCH /settings
 * Ayarların bir kısmını (veya tamamını) güncellemek için gönderilen payload.
 * PATCH metodu doğası gereği alanlar opsiyoneldir (Partial update).
 * Backend DTO karşılığı: dev.hashmark.settings.dto.UpdateSettingsRequest
 */
export interface UpdateSettingsRequest {
  webhookUrl?: string;
  notifyOnCritical?: boolean;
  notifyOnHigh?: boolean;
}
