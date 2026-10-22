import type { DebtPriority } from "@/shared/types/debt.types";

/** Borç sayfasına bağlantıyla taşınabilen süzgeçler (içgörü kartlarından gelir). */
export interface DebtLinkFilters {
  repoId?: string;
  olderThanDays?: number;
  priority?: DebtPriority;
  secret?: boolean;
  debtOnly?: boolean;
  /** Dosya ya da klasör yolu (hotspot haritasından) */
  path?: string;
}

const PRIORITIES: readonly string[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const MAX_AGE_DAYS = 36_500;
const MAX_PATH_LENGTH = 500;

export const DEBTS_PATH = "/dashboard/debts";

/** Örn. `/dashboard/debts?olderThanDays=90&debtOnly=1` */
export function buildDebtsHref(filters: DebtLinkFilters = {}): string {
  const params = new URLSearchParams();
  if (filters.repoId) params.set("repoId", filters.repoId);
  if (filters.olderThanDays) params.set("olderThanDays", String(filters.olderThanDays));
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.secret) params.set("secret", "1");
  if (filters.debtOnly) params.set("debtOnly", "1");
  if (filters.path) params.set("path", filters.path);
  const query = params.toString();
  return query ? `${DEBTS_PATH}?${query}` : DEBTS_PATH;
}

type SearchParamValue = string | string[] | undefined;

function first(value: SearchParamValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function flag(value: SearchParamValue): boolean {
  const v = first(value);
  return v === "1" || v === "true";
}

/** URL'deki değerler kullanıcı girdisidir: tanınmayanlar yok sayılır. */
export function parseDebtLinkFilters(params: Record<string, SearchParamValue>): DebtLinkFilters {
  const result: DebtLinkFilters = {};
  const repoId = first(params.repoId);
  if (repoId && /^\d{1,19}$/.test(repoId)) result.repoId = repoId;

  const days = Number(first(params.olderThanDays));
  if (Number.isInteger(days) && days > 0) result.olderThanDays = Math.min(days, MAX_AGE_DAYS);

  const priority = first(params.priority)?.toUpperCase();
  if (priority && PRIORITIES.includes(priority)) result.priority = priority as DebtPriority;

  if (flag(params.secret)) result.secret = true;
  if (flag(params.debtOnly)) result.debtOnly = true;

  const path = first(params.path)?.trim().replace(/^\/+|\/+$/g, "");
  if (path && path.length <= MAX_PATH_LENGTH) result.path = path;
  return result;
}
