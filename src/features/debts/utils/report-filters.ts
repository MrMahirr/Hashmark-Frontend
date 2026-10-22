import type { DebtFilters } from "../api/debts.types";
import { parseDebtLinkFilters } from "./debt-links";

export const REPORT_PATH = "/dashboard/report";
const STATUSES = ["open", "resolved", "ignored"];
const LABEL = /^[A-Z][A-Z0-9_]{1,9}$/;
const AUTHOR = /^[A-Za-z0-9][A-Za-z0-9-]{0,38}$/;
const MAX_QUERY = 200;

type SearchParamValue = string | string[] | undefined;

function first(value: SearchParamValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Tüm borç gezgini süzgeçleriyle rapor (PDF) bağlantısı; sayfalama ve sıralama taşınmaz.
 * `print` verilirse sayfa veri gelince yazdırma penceresini açar.
 */
export function buildReportHref(filters: DebtFilters, options: { print?: boolean } = {}): string {
  const params = new URLSearchParams();
  const put = (key: string, value: string | number | boolean | undefined) => {
    if (value === undefined || value === "" || value === false) return;
    params.set(key, value === true ? "1" : String(value));
  };
  put("repoId", filters.repoId);
  put("label", filters.label);
  put("status", filters.status);
  put("q", filters.q);
  put("author", filters.author);
  put("olderThanDays", filters.olderThanDays);
  put("priority", filters.priority);
  put("secret", filters.secret);
  put("debtOnly", filters.debtOnly);
  put("path", filters.path);
  put("print", options.print);
  const query = params.toString();
  return query ? `${REPORT_PATH}?${query}` : REPORT_PATH;
}

/** URL'deki değerler kullanıcı girdisidir: tanınmayanlar yok sayılır. */
export function parseReportFilters(params: Record<string, SearchParamValue>): DebtFilters {
  const link = parseDebtLinkFilters(params);
  const filters: DebtFilters = { ...link };
  const label = first(params.label)?.trim().toUpperCase();
  if (label && LABEL.test(label)) filters.label = label;
  const status = first(params.status)?.trim().toLowerCase();
  if (status && STATUSES.includes(status)) filters.status = status;
  const q = first(params.q)?.trim();
  if (q) filters.q = q.slice(0, MAX_QUERY);
  const author = first(params.author)?.trim();
  if (author && AUTHOR.test(author)) filters.author = author;
  return filters;
}
