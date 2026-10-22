import Link from "next/link";
import type { Locale, Translator } from "@/shared/i18n";
import { Heading, Mono } from "@/shared/ui/Typography";
import { Panel } from "@/shared/ui/Panel";
import { tagColor } from "@/shared/ui/TagBadge";
import { cn } from "@/shared/ui/cn";
import type { PublicScore } from "../api/public-score";

interface PublicScoreViewProps {
  data: PublicScore;
  t: Translator;
  locale: Locale;
}

const GRADE_TONE: Record<string, string> = {
  A: "border-hm-success text-hm-success",
  B: "border-hm-success text-hm-success",
  C: "border-hm-warning text-hm-warning",
  D: "border-hm-danger text-hm-danger",
  F: "border-hm-danger text-hm-danger",
};

/** 8 haftalık açık borç çizgisi; ekran okuyucu için aynı veri tabloda. */
export function TrendSparkline({ points, label }: { points: PublicScore["trend"]; label: string }) {
  if (points.length < 2) return null;
  const width = 320;
  const height = 72;
  const max = Math.max(1, ...points.map((p) => p.total));
  const step = width / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(height - 4 - (p.total / max) * (height - 8)).toFixed(1)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[72px] w-full" role="img" aria-label={label}>
      <path d={path} fill="none" stroke="var(--hm-acc)" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function Bars({ rows, max }: { rows: Array<{ key: string; label: string; count: number; color: string }>; max: number }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-3 p-0">
      {rows.map((row) => (
        <li key={row.key} className="grid grid-cols-[minmax(0,110px)_1fr_48px] items-center gap-3">
          <span className="truncate font-mono text-xs font-bold" style={{ color: row.color }}>
            {row.label}
          </span>
          <div className="h-2 overflow-hidden rounded-[4px] bg-[color-mix(in_srgb,var(--hm-text-primary)_10%,transparent)]">
            <div
              className="h-full rounded-[4px]"
              style={{ width: `${row.count === 0 ? 0 : Math.max(3, (row.count / max) * 100)}%`, background: row.color }}
            />
          </div>
          <span className="text-right font-mono text-sm">{row.count}</span>
        </li>
      ))}
    </ul>
  );
}

/** Herkese açık "debt score" sayfası (sunucu bileşeni; etkileşim yok). */
export function PublicScoreView({ data, t, locale }: PublicScoreViewProps) {
  const scanned = data.grade !== null;
  const date = (iso: string) => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(iso));
  const labelRows = Object.entries(data.labels)
    .filter(([, count]) => count > 0)
    .map(([label, count]) => ({ key: label, label, count, color: tagColor(label) }));
  const ageRows = data.ageBuckets.map((b) => ({
    key: b.key,
    label: b.maxDays === null ? t("insights.age.over", { days: b.minDays }) : t("insights.age.range", { from: b.minDays, to: b.maxDays }),
    count: b.count,
    color: b.minDays >= 90 ? "var(--hm-danger)" : "var(--hm-acc)",
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Mono className="text-xs uppercase tracking-[0.08em] text-hm-text-secondary">{t("publicScore.eyebrow")}</Mono>
        <Heading as="h1" className="break-all text-[40px] leading-tight sm:text-[56px]">
          {data.repoName}
        </Heading>
        <p className="m-0 text-sm text-hm-text-secondary">
          {data.lastScannedAt ? t("publicScore.lastScan", { date: date(data.lastScannedAt) }) : t("publicScore.notScanned")}
        </p>
      </div>

      {scanned && (
        <>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-4">
            <Panel className="flex items-center gap-5 px-6 py-5">
              <span
                className={cn(
                  "inline-flex h-20 w-20 items-center justify-center rounded-[14px] border-2 font-serif text-[52px] leading-none",
                  GRADE_TONE[data.grade ?? ""] ?? "",
                )}
                aria-label={t("comparison.grade", { grade: data.grade ?? "" })}
              >
                {data.grade}
              </span>
              <span className="flex flex-col">
                <span className="text-[15px] text-hm-text-secondary">{t("insights.health.title")}</span>
                <span className="font-mono text-2xl">{data.score}/100</span>
              </span>
            </Panel>
            {[
              { label: t("publicScore.open"), value: data.openDebts },
              { label: t("comparison.col.stale"), value: data.staleCount },
              { label: t("insights.rot.title"), value: data.rotScore },
              { label: t("publicScore.averageAge"), value: t("publicScore.days", { days: data.averageAgeDays }) },
            ].map((stat) => (
              <Panel key={stat.label} className="flex flex-col gap-2 px-6 py-5">
                <span className="text-[15px] text-hm-text-secondary">{stat.label}</span>
                <Heading as="span" className="text-[44px]">
                  {stat.value}
                </Heading>
              </Panel>
            ))}
          </div>

          <div className="flex flex-wrap items-start gap-4">
            <Panel className="flex min-w-0 flex-[1_1_320px] flex-col gap-4 p-6">
              <h2 className="m-0 text-base font-bold">{t("dashboard.labels.title")}</h2>
              {labelRows.length === 0 ? (
                <p className="m-0 text-sm text-hm-text-secondary">{t("publicScore.clean")}</p>
              ) : (
                <Bars rows={labelRows} max={Math.max(...labelRows.map((r) => r.count))} />
              )}
            </Panel>
            <Panel className="flex min-w-0 flex-[1_1_320px] flex-col gap-4 p-6">
              <h2 className="m-0 text-base font-bold">{t("insights.age.title")}</h2>
              <Bars rows={ageRows} max={Math.max(1, ...ageRows.map((r) => r.count))} />
            </Panel>
            {data.trend.length >= 2 && (
              <Panel className="flex min-w-0 flex-[1_1_320px] flex-col gap-4 p-6">
                <h2 className="m-0 text-base font-bold">{t("dashboard.trend.title")}</h2>
                <TrendSparkline points={data.trend} label={t("publicScore.trendLabel")} />
                <table className="sr-only">
                  <caption>{t("dashboard.trend.title")}</caption>
                  <tbody>
                    {data.trend.map((p) => (
                      <tr key={p.weekStart}>
                        <th scope="row">{date(p.weekStart)}</th>
                        <td>{p.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="m-0 font-mono text-xs text-hm-text-secondary">
                  {date(data.trend[0].weekStart)} → {date(data.trend[data.trend.length - 1].weekStart)}
                </p>
              </Panel>
            )}
          </div>
        </>
      )}

      <Panel className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
        <div className="flex flex-col gap-1">
          <h2 className="m-0 text-base font-bold">{t("publicScore.ctaTitle")}</h2>
          <p className="m-0 text-sm text-hm-text-secondary">{t("publicScore.ctaText")}</p>
        </div>
        <Link
          href="/auth/login"
          className="inline-flex min-h-11 items-center rounded-control bg-hm-btn px-5 text-sm font-semibold text-hm-btn-fg no-underline hover:opacity-90"
        >
          {t("publicScore.cta")}
        </Link>
      </Panel>
      <p className="m-0 text-xs text-hm-text-secondary">{t("publicScore.disclaimer")}</p>
    </div>
  );
}
