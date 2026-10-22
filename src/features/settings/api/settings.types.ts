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
  /** Özete dahil edilecek etiketler; boş = hepsi */
  digestLabels?: string[];
  /** Özetin gönderileceği alternatif adres; boş/null = GitHub e-postası */
  digestEmail?: string | null;
  /** Teknik borç maliyeti için saatlik ücret; null = ayarlanmadı */
  hourlyRate?: number | null;
  /** ISO 4217 (TRY, USD, EUR, GBP) */
  currency?: string | null;
}

// ── Request Types ──

/**
 * PUT /settings
 * Backend DTO karşılığı: dev.hashmark.settings.dto.UserSettingsDto
 */
export interface UpdateSettingsRequest {
  emailNotify?: boolean;
  notifyDay?: NotifyDay | string;
  /** Boş dizi = tüm etiketler */
  digestLabels?: string[];
  /** Boş string = GitHub e-postasını kullan */
  digestEmail?: string;
  /** 0 = ücreti kaldır */
  hourlyRate?: number;
  currency?: string;
}
