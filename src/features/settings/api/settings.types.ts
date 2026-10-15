/**
 * Interface Segregation Principle (ISP) & Single Responsibility Principle (SRP):
 * Ayarlar (Settings) modülüne ait API Request ve Response modelleri bu dosyada tutulur.
 */

/** Haftalık raporun gönderileceği gün (backend `notify_day`). */
export type NotifyDay =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

// ── Response Types ──

/**
 * GET /settings, PUT /settings
 * Backend DTO karşılığı: dev.hashmark.settings.dto.UserSettingsDto
 */
export interface SettingsResponse {
  emailNotify: boolean;
  notifyDay: NotifyDay | string;
}

// ── Request Types ──

/**
 * PUT /settings
 * Backend DTO karşılığı: dev.hashmark.settings.dto.UserSettingsDto
 */
export interface UpdateSettingsRequest {
  emailNotify?: boolean;
  notifyDay?: NotifyDay | string;
}
