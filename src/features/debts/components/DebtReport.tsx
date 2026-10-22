"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Printer } from "lucide-react";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { Button } from "@/shared/ui/Button";
import { ErrorState, LoadingState } from "@/shared/ui/StateViews";
import { calculateHealth } from "@/features/dashboard/utils/health";
import { getReportSummary } from "@/features/dashboard/api/dashboard.api";
import { useMappedRepos } from "@/features/repos/hooks/useRepos";
import { exportDebts } from "../api/debts.api";
import type { DebtFilters, DebtResponse } from "../api/debts.types";
import { debtAgeDays } from "../utils/debt-age";

/** Rapora basılan en fazla satır (tarayıcının yazdırma motoru için); tamamı CSV/JSON'da. */
export const MAX_REPORT_ROWS = 1000;

interface DebtReportProps {
  filters: DebtFilters;
  /** Veri gelince yazdırma penceresini bir kez aç */
  autoPrint?: boolean;
}

const CELL = "border-b border-hm-border px-2 py-1.5 text-left align-top";
const HEAD = `${CELL} font-mono text-[11px] uppercase tracking-[0.06em] text-hm-text-secondary`;

/**
 * Yazdırmaya uygun borç raporu. PDF, tarayıcının "PDF olarak kaydet" yazdırma hedefiyle üretilir (sunucuda PDF
 * kütüphanesi yok; Türkçe karakterler ve tema renkleri sorunsuz). Yazdırırken açık tema zorlanır ve sayfa
 * çerçevesi (kenar çubuğu, araç çubuğu) gizlenir.
 */
export function DebtReport({ filters, autoPrint = false }: DebtReportProps) {
  const { t, locale, formatDate } = useI18n();
  const repos = useMappedRepos();
  const summary = useQuery({
    queryKey: ["report", "summary", filters.repoId ?? "all"],
    queryFn: () => getReportSummary(filters.repoId),
  });
  const debts = useQuery({
    queryKey: ["report", "debts", filters],
    queryFn: async (): Promise<DebtResponse[]> => {
      const file = await exportDebts(filters, "json");
      return JSON.parse(await file.blob.text()) as DebtResponse[];
    },
    staleTime: 60_000,
  });
  const printed = useRef(false);

  // Yazdırırken açık tema: koyu temada siyah sayfa basılmasın
  useEffect(() => {
    const root = document.documentElement;
    let previous: string | undefined;
    const before = () => {
      previous = root.dataset.theme;
      root.dataset.theme = "light";
    };
    const after = () => {
      if (previous === undefined) delete root.dataset.theme;
      else root.dataset.theme = previous;
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, []);

  const ready = summary.isSuccess && debts.isSuccess;
  useEffect(() => {
    if (autoPrint && ready && !printed.current) {
      printed.current = true;
      window.setTimeout(() => window.print(), 300);
    }
  }, [autoPrint, ready]);

  if (summary.isLoading || debts.isLoading) {
    return <LoadingState label={t("report.loading")} />;
  }
  if (summary.isError || debts.isError || !summary.data || !debts.data) {
    return (
      <ErrorState
        title={t("report.errorTitle")}
        description={t("report.errorDescription")}
        retryLabel={t("common.retry")}
        onRetry={() => {
          summary.refetch();
          debts.refetch();
        }}
      />
    );
  }

  const insights = summary.data.insights;
  const health = insights ? calculateHealth(insights.weightedDebt) : null;
  const repoName = filters.repoId
    ? (repos.data?.find((r) => r.id === filters.repoId)?.fullName ?? `#${filters.repoId}`)
    : t("debts.filter.allRepos");
  const rows = debts.data.slice(0, MAX_REPORT_ROWS);
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  const cost =
    insights?.estimatedCost != null && insights.currency
      ? new Intl.NumberFormat(locale, { style: "currency", currency: insights.currency, maximumFractionDigits: 0 }).format(
          insights.estimatedCost,
        )
      : insights
        ? t("insights.cost.hours", { hours: number.format(insights.estimatedHours) })
        : "";

  const filterParts = [
    filters.label && `${t("debts.filter.label")}: ${filters.label}`,
    filters.status && `${t("debts.filter.status")}: ${t(`debts.status.${filters.status}` as "debts.status.open")}`,
    filters.priority && `${t("debts.filter.priority")}: ${t(`debts.priority.${filters.priority}` as "debts.priority.LOW")}`,
    filters.olderThanDays && t("debts.filter.olderThan", { days: filters.olderThanDays }),
    filters.author && `${t("debts.filter.author")}: ${filters.author}`,
    filters.q && `"${filters.q}"`,
    filters.path && filters.path,
    filters.secret && t("debts.filter.secret"),
    filters.debtOnly && t("debts.filter.debtOnly"),
  ].filter(Boolean) as string[];

  return (
    <article className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-4 py-6 text-hm-text-primary sm:px-8 print:max-w-none print:p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <p className="m-0 text-sm text-hm-text-secondary">{t("report.printHint")}</p>
        <Button onClick={() => window.print()} leftIcon={<Printer size={16} aria-hidden="true" />}>
          {t("report.print")}
        </Button>
      </div>

      <header className="flex flex-col gap-1 border-b-2 border-hm-text-primary pb-3">
        <span className="font-mono text-xs uppercase tracking-[0.08em] text-hm-text-secondary">{t("report.eyebrow")}</span>
        <h1 className="m-0 font-serif text-[34px] leading-tight">{repoName}</h1>
        <p className="m-0 text-sm text-hm-text-secondary">
          {t("report.generated", { date: formatDate(new Date().toISOString()) })}
          {filterParts.length > 0 && ` · ${filterParts.join(" · ")}`}
        </p>
      </header>

      {insights && health && (
        <section aria-labelledby="report-summary" className="break-inside-avoid">
          <h2 id="report-summary" className="m-0 mb-3 text-base font-bold">
            {t("report.summary")}
          </h2>
          <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4 print:grid-cols-4">
            {[
              [t("insights.health.title"), `${health.grade} · ${health.score}/100`],
              [t("publicScore.open"), String(insights.openDebts)],
              [t("comparison.col.stale"), String(insights.staleCount)],
              [t("insights.rot.title"), String(insights.rotScore)],
              [t("insights.urgent.title"), String((insights.priorityCounts.CRITICAL ?? 0) + (insights.priorityCounts.HIGH ?? 0))],
              [t("debts.secret.label"), String(insights.secretCount)],
              [t("insights.cost.title"), cost],
              [t("publicScore.averageAge"), t("publicScore.days", { days: insights.averageAgeDays })],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col border-l-2 border-hm-border pl-3">
                <dt className="text-xs text-hm-text-secondary">{label}</dt>
                <dd className="m-0 font-mono text-lg">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section aria-labelledby="report-debts">
        <h2 id="report-debts" className="m-0 mb-3 text-base font-bold">
          {t("report.debts", { count: debts.data.length })}
        </h2>
        {rows.length === 0 ? (
          <p className="m-0 text-sm text-hm-text-secondary">{t("debts.empty")}</p>
        ) : (
          <table className="w-full border-collapse text-[12px]">
            <thead className="print:table-header-group">
              <tr>
                <th scope="col" className={HEAD}>{t("debts.col.label")}</th>
                {!filters.repoId && <th scope="col" className={HEAD}>{t("debts.col.repo")}</th>}
                <th scope="col" className={HEAD}>{t("debts.col.file")}</th>
                <th scope="col" className={HEAD}>{t("debts.col.content")}</th>
                <th scope="col" className={HEAD}>{t("debts.filter.priority")}</th>
                <th scope="col" className={HEAD}>{t("debts.col.owner")}</th>
                <th scope="col" className={`${HEAD} text-right`}>{t("report.age")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => {
                const age = debtAgeDays({ introducedAt: d.introducedAt, createdAt: d.detectedAt });
                return (
                  <tr key={d.id} className="break-inside-avoid">
                    <td className={`${CELL} font-mono font-bold`}>{d.label}</td>
                    {!filters.repoId && <td className={`${CELL} font-mono`}>{d.repoFullName}</td>}
                    <td className={`${CELL} break-all font-mono`}>
                      {d.filePath}:{d.lineNo}
                    </td>
                    <td className={`${CELL} break-words`}>{d.content}</td>
                    <td className={CELL}>
                      {d.priority ? t(`debts.priority.${d.priority}` as "debts.priority.LOW") : t("common.dash")}
                    </td>
                    <td className={CELL}>{d.assignee ?? d.authorLogin ?? t("common.dash")}</td>
                    <td className={`${CELL} text-right font-mono`}>{age ?? t("common.dash")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {debts.data.length > MAX_REPORT_ROWS && (
          <p className="m-0 mt-2 text-xs text-hm-text-secondary">
            {t("report.truncated", { shown: MAX_REPORT_ROWS, total: debts.data.length })}
          </p>
        )}
      </section>

      <footer className="border-t border-hm-border pt-3 text-xs text-hm-text-secondary">{t("report.footer")}</footer>
    </article>
  );
}
