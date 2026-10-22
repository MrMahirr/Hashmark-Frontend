"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { Panel } from "@/shared/ui/Panel";
import { StatCard } from "@/shared/ui/StatCard";
import { buildDebtsHref } from "@/features/debts/utils/debt-links";
import type { HealthGrade } from "../utils/health";
import type { DebtInsightsDto } from "../api/dashboard.types";

interface DebtInsightsProps {
  insights: DebtInsightsDto;
  grade: HealthGrade;
  healthScore: number;
  /** Tek depo görünümünde bağlantılar o depoya süzülür. */
  repoId?: string;
}

const LINK = "font-semibold text-hm-text-primary underline-offset-2 hover:text-hm-acc hover:underline";
const STALE_DAYS = 90;

/** Ücret yoksa saat, varsa para birimiyle tutar (kesirsiz). */
function useCostText(insights: DebtInsightsDto) {
  const { t, locale } = useI18n();
  const hours = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(insights.estimatedHours);
  if (insights.estimatedCost === null || !insights.currency) {
    return { value: t("insights.cost.hours", { hours }), note: undefined };
  }
  let value: string;
  try {
    value = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: insights.currency,
      maximumFractionDigits: 0,
    }).format(insights.estimatedCost);
  } catch {
    value = `${insights.estimatedCost} ${insights.currency}`;
  }
  return { value, note: t("insights.cost.hours", { hours }) };
}

/**
 * Analiz ve içgörü: sağlık notu, çürüme skoru, tahmini maliyet, acil borçlar, sızan sırlar ve yaş dağılımı.
 * Sayılar yalnızca açık borç etiketlerini kapsar (NOTE/DOC/INFO hariç); bağlantılar aynı kapsamla süzer.
 */
export function DebtInsights({ insights, grade, healthScore, repoId }: DebtInsightsProps) {
  const { t } = useI18n();
  const cost = useCostText(insights);
  const urgent = (insights.priorityCounts.CRITICAL ?? 0) + (insights.priorityCounts.HIGH ?? 0);
  const maxBucket = Math.max(1, ...insights.ageBuckets.map((b) => b.count));

  return (
    <section aria-labelledby="insights-heading" className="flex flex-col gap-4">
      <h2 id="insights-heading" className="sr-only">
        {t("insights.title")}
      </h2>

      {insights.secretCount > 0 && (
        <Panel role="alert" className="flex flex-wrap items-center gap-3 border-hm-danger bg-hm-danger-bg px-6 py-4">
          <ShieldAlert size={20} className="shrink-0 text-hm-danger" aria-hidden="true" />
          <p className="m-0 min-w-[200px] flex-1 text-sm text-hm-text-primary">
            {t("insights.secret.banner", { count: insights.secretCount })}
          </p>
          <Link href={buildDebtsHref({ repoId, secret: true })} className={LINK}>
            {t("insights.secret.view")}
          </Link>
        </Panel>
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-4">
        <StatCard
          title={t("insights.health.title")}
          value={grade}
          badgeText={`${healthScore}/100`}
          badgeType={grade === "A" || grade === "B" ? "good" : grade === "C" ? "neutral" : "high"}
          footer={t("insights.health.hint")}
        />
        <StatCard
          title={t("insights.rot.title")}
          value={insights.rotScore}
          badgeText={t("insights.rot.average", { days: insights.averageAgeDays })}
          badgeType={insights.rotScore >= 50 ? "high" : "neutral"}
          footer={
            insights.staleCount > 0 ? (
              <Link
                href={buildDebtsHref({ repoId, olderThanDays: STALE_DAYS, debtOnly: true })}
                className={LINK}
              >
                {t("insights.rot.stale", { count: insights.staleCount })}
              </Link>
            ) : (
              t("insights.rot.noStale")
            )
          }
        />
        <StatCard
          title={t("insights.cost.title")}
          value={cost.value}
          badgeText={cost.note}
          footer={
            insights.hourlyRate === null ? (
              <Link href="/dashboard/settings#cost" className={LINK}>
                {t("insights.cost.setRate")}
              </Link>
            ) : (
              t("insights.cost.hint")
            )
          }
        />
        <StatCard
          title={t("insights.urgent.title")}
          value={urgent}
          badgeText={
            insights.autoPriorityCount > 0 ? t("insights.urgent.auto", { count: insights.autoPriorityCount }) : undefined
          }
          badgeType={urgent > 0 ? "high" : "neutral"}
          footer={
            (insights.priorityCounts.CRITICAL ?? 0) > 0 ? (
              <Link href={buildDebtsHref({ repoId, priority: "CRITICAL" })} className={LINK}>
                {t("insights.urgent.critical", { count: insights.priorityCounts.CRITICAL })}
              </Link>
            ) : (
              t("insights.urgent.hint")
            )
          }
        />
      </div>

      <Panel className="flex min-w-0 flex-col gap-[18px] p-6">
        <h3 className="m-0 text-base font-bold text-hm-text-primary">{t("insights.age.title")}</h3>
        {insights.openDebts === 0 ? (
          <p className="py-4 text-center text-sm text-hm-text-secondary">{t("insights.age.empty")}</p>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
            {insights.ageBuckets.map((bucket) => {
              const label =
                bucket.maxDays === null
                  ? t("insights.age.over", { days: bucket.minDays })
                  : t("insights.age.range", { from: bucket.minDays, to: bucket.maxDays });
              const stale = bucket.minDays >= STALE_DAYS;
              return (
                <li key={bucket.key} className="grid grid-cols-[minmax(0,110px)_1fr_48px] items-center gap-3">
                  {bucket.count > 0 && bucket.minDays > 0 ? (
                    <Link
                      href={buildDebtsHref({ repoId, olderThanDays: bucket.minDays, debtOnly: true })}
                      title={t("insights.age.linkHint", { days: bucket.minDays })}
                      className="truncate font-mono text-xs text-hm-text-secondary hover:text-hm-acc hover:underline"
                    >
                      {label}
                    </Link>
                  ) : (
                    <span className="truncate font-mono text-xs text-hm-text-secondary">{label}</span>
                  )}
                  <div
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={insights.openDebts}
                    aria-valuenow={bucket.count}
                    aria-label={`${label}: ${bucket.count}`}
                    className="h-2 overflow-hidden rounded-[4px] bg-[color-mix(in_srgb,var(--hm-text-primary)_10%,transparent)]"
                  >
                    <div
                      className={stale ? "h-full rounded-[4px] bg-hm-danger" : "h-full rounded-[4px] bg-hm-acc"}
                      style={{ width: `${bucket.count === 0 ? 0 : Math.max(2, (bucket.count / maxBucket) * 100)}%` }}
                    />
                  </div>
                  <span className="text-right font-mono text-sm">{bucket.count}</span>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </section>
  );
}
