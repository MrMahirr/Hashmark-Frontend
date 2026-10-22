"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown, ShieldAlert } from "lucide-react";
import { useI18n } from "@/shared/i18n/I18nProvider";
import type { MessageKey } from "@/shared/i18n";
import { Panel } from "@/shared/ui/Panel";
import { cn } from "@/shared/ui/cn";
import { calculateHealth, type HealthGrade } from "../utils/health";
import { useRepoComparison } from "../hooks/useDashboard";
import type { RepoInsightsRowDto } from "../api/dashboard.types";

export interface ComparisonRow {
  repoId: string;
  name: string;
  scanned: boolean;
  grade: HealthGrade;
  score: number;
  open: number;
  stale: number;
  rot: number;
  urgent: number;
  secrets: number;
  hours: number;
  cost: number | null;
  currency: string | null;
}

type SortKey = "score" | "name" | "open" | "stale" | "rot" | "urgent" | "hours";

const COLUMNS: Array<{ key: SortKey; labelKey: MessageKey; numeric: boolean }> = [
  { key: "name", labelKey: "comparison.col.repo", numeric: false },
  { key: "score", labelKey: "comparison.col.health", numeric: true },
  { key: "open", labelKey: "comparison.col.open", numeric: true },
  { key: "stale", labelKey: "comparison.col.stale", numeric: true },
  { key: "rot", labelKey: "comparison.col.rot", numeric: true },
  { key: "urgent", labelKey: "comparison.col.urgent", numeric: true },
  { key: "hours", labelKey: "comparison.col.cost", numeric: true },
];

export function toComparisonRows(rows: RepoInsightsRowDto[]): ComparisonRow[] {
  return rows.map(({ repoId, fullName, lastScannedAt, insights }) => {
    const { score, grade } = calculateHealth(insights.weightedDebt);
    return {
      repoId: String(repoId),
      name: fullName,
      scanned: lastScannedAt !== null,
      grade,
      score,
      open: insights.openDebts,
      stale: insights.staleCount,
      rot: insights.rotScore,
      urgent: (insights.priorityCounts.CRITICAL ?? 0) + (insights.priorityCounts.HIGH ?? 0),
      secrets: insights.secretCount,
      hours: insights.estimatedHours,
      cost: insights.estimatedCost,
      currency: insights.currency,
    };
  });
}

/**
 * Sıralama; taranmamış depolar her zaman sonda. Eşitlikte ada göre (kararlı sıra).
 * Varsayılan: sağlık skoru yüksekten düşüğe (liderlik tablosu).
 */
export function sortComparison(rows: ComparisonRow[], key: SortKey, dir: "asc" | "desc"): ComparisonRow[] {
  const sign = dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    if (a.scanned !== b.scanned) return a.scanned ? -1 : 1;
    const diff = key === "name" ? a.name.localeCompare(b.name) : a[key] - b[key];
    return diff !== 0 ? diff * sign : a.name.localeCompare(b.name);
  });
}

const GRADE_TONE: Record<HealthGrade, string> = {
  A: "border-hm-success text-hm-success",
  B: "border-hm-success text-hm-success",
  C: "border-hm-warning text-hm-warning",
  D: "border-hm-danger text-hm-danger",
  F: "border-hm-danger text-hm-danger",
};

const HEAD_CELL =
  "whitespace-nowrap bg-[color-mix(in_srgb,var(--hm-text-primary)_4%,transparent)] px-4 py-2 text-left font-mono text-xs font-normal uppercase tracking-[0.06em] text-hm-text-secondary";

/** Depo karşılaştırma / liderlik tablosu: izlenen depoların sağlık notu ve içgörüleri, sıralanabilir. */
export function RepoComparison() {
  const { t, locale } = useI18n();
  const { data } = useRepoComparison();
  const [sort, setSort] = useState<SortKey>("score");
  const [dir, setDir] = useState<"asc" | "desc">("desc");

  const rows = useMemo(() => sortComparison(toComparisonRows(data ?? []), sort, dir), [data, sort, dir]);

  // Tek depoda karşılaştırma anlamsız
  if (rows.length < 2) return null;

  const onSort = (key: SortKey) => {
    if (key === sort) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSort(key);
      // Sağlıkta en iyi, diğerlerinde en az borçlu önce
      setDir(key === "score" ? "desc" : "asc");
    }
  };

  const costText = (row: ComparisonRow) => {
    if (row.cost !== null && row.currency) {
      try {
        return new Intl.NumberFormat(locale, { style: "currency", currency: row.currency, maximumFractionDigits: 0 }).format(row.cost);
      } catch {
        return `${row.cost} ${row.currency}`;
      }
    }
    return t("insights.cost.hours", { hours: new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(row.hours) });
  };

  return (
    <Panel className="overflow-hidden">
      <div className="flex flex-col gap-1 px-6 py-5">
        <h2 className="m-0 text-base font-bold text-hm-text-primary">{t("comparison.title")}</h2>
        <p className="m-0 text-sm text-hm-text-secondary">{t("comparison.description")}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <caption className="sr-only">{t("comparison.title")}</caption>
          <thead>
            <tr>
              <th scope="col" className={cn(HEAD_CELL, "w-12")}>
                #
              </th>
              {COLUMNS.map((column) => {
                const active = sort === column.key;
                const Icon = !active ? ArrowUpDown : dir === "asc" ? ArrowUp : ArrowDown;
                const label = t(column.labelKey);
                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
                    className={cn(HEAD_CELL, column.numeric && "text-right")}
                  >
                    <button
                      type="button"
                      onClick={() => onSort(column.key)}
                      aria-label={t("debts.sortBy", { column: label })}
                      className={cn(
                        "inline-flex min-h-11 cursor-pointer items-center gap-1 font-mono text-xs uppercase tracking-[0.06em] hover:text-hm-text-primary",
                        active && "text-hm-text-primary",
                      )}
                    >
                      {label}
                      <Icon size={12} aria-hidden="true" />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="text-hm-text-primary">
            {rows.map((row, index) => (
              <tr key={row.repoId} className="border-t border-hm-border">
                <td className="px-4 py-3 font-mono text-sm text-hm-text-secondary">{row.scanned ? index + 1 : "–"}</td>
                <td className="max-w-[260px] px-4 py-3">
                  <Link
                    href={`/dashboard/repos/${row.repoId}`}
                    className="block truncate font-mono text-[13px] font-bold hover:text-hm-acc hover:underline"
                    title={row.name}
                  >
                    {row.name}
                  </Link>
                  {!row.scanned && <span className="text-xs text-hm-text-secondary">{t("comparison.notScanned")}</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  {row.scanned ? (
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex h-7 w-7 items-center justify-center rounded-[6px] border font-mono text-sm font-bold",
                          GRADE_TONE[row.grade],
                        )}
                        aria-label={t("comparison.grade", { grade: row.grade })}
                      >
                        {row.grade}
                      </span>
                      <span className="font-mono text-sm">{row.score}</span>
                    </span>
                  ) : (
                    t("common.dash")
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">{row.open}</td>
                <td className={cn("px-4 py-3 text-right font-mono text-sm", row.stale > 0 && "text-hm-danger")}>
                  {row.stale}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">{row.rot}</td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  <span className="inline-flex items-center justify-end gap-1.5">
                    {row.secrets > 0 && (
                      <span
                        className="inline-flex items-center text-hm-danger"
                        title={t("comparison.secrets", { count: row.secrets })}
                      >
                        <ShieldAlert size={14} aria-hidden="true" />
                        <span className="sr-only">{t("comparison.secrets", { count: row.secrets })}</span>
                      </span>
                    )}
                    {row.urgent}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-sm">{costText(row)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
