import type { NotifyDay } from "../api/settings.types";

export const NOTIFY_DAYS: readonly NotifyDay[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

/** JS `Date#getDay()` (0 = Pazar) indeksine karşılık gelen gün adı. */
const JS_DAY: Record<NotifyDay, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

/**
 * Seçilen günün, bugünden SONRAKİ ilk tarihi (bugün aynı gündeyse 7 gün sonrası).
 * Saat bilgisi içermez; yalnızca takvim günü döner.
 */
export function nextDigestDate(day: NotifyDay, from: Date = new Date()): Date {
  const target = JS_DAY[day];
  const result = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const delta = ((target - result.getDay() + 7) % 7) || 7;
  result.setDate(result.getDate() + delta);
  return result;
}

/** Kısa yerel gün adı (Pzt / Mon …); `NOTIFY_DAYS` sırasına göre. */
export function weekdayLabel(day: NotifyDay, locale: string): string {
  // 1 Ocak 2024 Pazartesi
  const index = NOTIFY_DAYS.indexOf(day);
  return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(new Date(2024, 0, 1 + index));
}
