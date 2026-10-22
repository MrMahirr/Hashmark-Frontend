/** Bu kadar gündür açık borç "çürüyen" sayılır (sunucudaki `DebtInsightsCalculator.STALE_DAYS`). */
export const STALE_DAYS = 90;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Borcun yaşı (gün): git blame tarihi, yoksa ilk görülme. Tarih yoksa/bozuksa null. */
export function debtAgeDays(
  debt: { introducedAt?: string | null; createdAt?: string | null },
  now: number = Date.now(),
): number | null {
  const iso = debt.introducedAt || debt.createdAt;
  if (!iso) return null;
  const time = Date.parse(iso);
  if (Number.isNaN(time)) return null;
  return Math.max(0, Math.floor((now - time) / DAY_MS));
}

export function isStale(debt: { introducedAt?: string | null; createdAt?: string | null }, now?: number): boolean {
  const age = debtAgeDays(debt, now);
  return age !== null && age >= STALE_DAYS;
}
