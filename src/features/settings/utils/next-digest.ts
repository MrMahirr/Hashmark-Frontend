import type { DigestFrequency, NotifyDay } from "../api/settings.types";

export const NOTIFY_DAYS: readonly NotifyDay[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export const DIGEST_FREQUENCIES: readonly DigestFrequency[] = ["DAILY", "WEEKLY", "MONTHLY"];

export interface DigestScheduleInput {
  frequency: DigestFrequency;
  /** Yalnızca haftalıkta kullanılır */
  day: NotifyDay;
  /** 0–23, `timeZone` içinde */
  hour: number;
  /** IANA adı (Europe/Istanbul) */
  timeZone: string;
}

const HOUR_MS = 60 * 60 * 1000;
/** En uzun aralık aylıktır: 32 gün içinde mutlaka bir gönderim anı vardır. */
const MAX_HOURS = 32 * 24;

/**
 * Bir sonraki gönderim anı; sunucudaki `DigestSchedule` ile aynı kural: günlük her gün, haftalık seçilen gün,
 * aylık ayın 1'i, kullanıcının saat diliminde seçilen saatte. Zamanlayıcı saat başı çalıştığı için `from`'dan
 * sonraki ilk saat başından itibaren aranır. Saat dilimi geçersizse `null`.
 */
export function nextDigestAt(schedule: DigestScheduleInput, from: Date = new Date()): Date | null {
  let format: Intl.DateTimeFormat;
  try {
    format = new Intl.DateTimeFormat("en-US", {
      timeZone: schedule.timeZone,
      weekday: "long",
      day: "numeric",
      hour: "numeric",
      hourCycle: "h23",
    });
  } catch {
    return null;
  }
  const start = Math.floor(from.getTime() / HOUR_MS) * HOUR_MS + HOUR_MS;
  for (let i = 0; i < MAX_HOURS; i++) {
    const at = new Date(start + i * HOUR_MS);
    const parts = Object.fromEntries(format.formatToParts(at).map((p) => [p.type, p.value]));
    if (Number(parts.hour) !== schedule.hour) continue;
    const matches =
      schedule.frequency === "DAILY" ||
      (schedule.frequency === "MONTHLY" && Number(parts.day) === 1) ||
      (schedule.frequency === "WEEKLY" && parts.weekday?.toUpperCase() === schedule.day);
    if (matches) return at;
  }
  return null;
}

/** Seçilebilir saat dilimleri; tarayıcı listeyi veremezse kısa bir yedek liste. */
export function timeZoneOptions(current?: string | null): string[] {
  let zones: string[];
  try {
    zones = Intl.supportedValuesOf("timeZone");
  } catch {
    zones = ["UTC", "Europe/Istanbul", "Europe/London", "Europe/Berlin", "America/New_York", "America/Los_Angeles", "Asia/Tokyo"];
  }
  if (current && !zones.includes(current)) zones = [current, ...zones];
  return zones;
}

/** Tarayıcının saat dilimi (yeni kullanıcı için öneri). */
export function browserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Istanbul";
  } catch {
    return "Europe/Istanbul";
  }
}

/** Kısa yerel gün adı (Pzt / Mon …); `NOTIFY_DAYS` sırasına göre. */
export function weekdayLabel(day: NotifyDay, locale: string): string {
  // 1 Ocak 2024 Pazartesi
  const index = NOTIFY_DAYS.indexOf(day);
  return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(new Date(2024, 0, 1 + index));
}
