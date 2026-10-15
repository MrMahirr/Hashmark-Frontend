"use client";

import dynamic from "next/dynamic";
import { useI18n } from "@/shared/i18n/I18nProvider";

function ChartSkeleton() {
  const { t } = useI18n();
  return (
    <div
      role="status"
      className="flex min-h-[300px] animate-pulse items-center justify-center rounded-card border border-hm-border bg-hm-surface p-6 text-sm text-hm-text-secondary"
    >
      {t("dashboard.trend.loading")}
    </div>
  );
}

/**
 * Recharts (~100 KB gzip) yalnızca grafik gerçekten gösterileceğinde, ayrı bir parça olarak yüklenir.
 * Böylece grafiği olmayan sayfaların ilk yüklemesi küçülür.
 */
export const LazyTrendChart = dynamic(() => import("./TrendChart").then((module) => module.TrendChart), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
