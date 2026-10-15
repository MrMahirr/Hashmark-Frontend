"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { TrendDataPoint } from "@/shared/types/dashboard.types";

interface TrendChartProps {
  data: TrendDataPoint[];
}

// Renkler CSS değişkenlerinden gelir; açık/koyu temada otomatik uyum sağlar
const TICK = { fontSize: 11, fill: "var(--hm-text-secondary)" };

export const TrendChart = ({ data }: TrendChartProps) => {
  const { t } = useI18n();
  const hasData = !!data && data.length > 0;

  return (
    <div className="bg-hm-surface border-[0.5px] border-hm-border rounded-card p-4 flex flex-col min-h-[300px]">
      <h2 className="font-sans text-sm font-medium text-hm-text-primary mb-6">{t("dashboard.trend.title")}</h2>
      <div className="flex-1 w-full h-full min-h-[220px] flex items-center justify-center">
        {!hasData ? (
          <p className="font-sans text-xs text-hm-text-secondary text-center">{t("dashboard.trend.empty")}</p>
        ) : (
          <div
            role="img"
            aria-label={`${t("dashboard.trend.title")}: ${data.map((d) => `${d.date} ${d.total}`).join(", ")}`}
            className="w-full h-full min-h-[220px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--hm-blue)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--hm-blue)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--hm-border)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={TICK} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={TICK} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--hm-surface)",
                    color: "var(--hm-text-primary)",
                    borderRadius: "8px",
                    border: "1px solid var(--hm-border)",
                    fontSize: "13px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="var(--hm-blue)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};
