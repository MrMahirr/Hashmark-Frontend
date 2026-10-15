"use client";

import dynamic from "next/dynamic";
import { useI18n } from "@/shared/i18n/I18nProvider";

function ChartSkeleton() {
  const { t } = useI18n();
  return (
    <div
      role="status"
      className="bg-hm-surface border-[0.5px] border-hm-border rounded-card p-4 flex items-center justify-center min-h-[300px] text-xs text-hm-text-secondary animate-pulse"
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
