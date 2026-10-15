"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { TrendDataPoint } from "@/shared/types/dashboard.types";
import { Panel } from "@/shared/ui/Panel";

interface TrendChartProps {
  data: TrendDataPoint[];
}

// Renkler CSS değişkenlerinden gelir; açık/koyu temada otomatik uyum sağlar
const TICK = { fontSize: 11, fill: "var(--hm-text-secondary)", fontFamily: "var(--hm-font-mono)" };

/** Boş durumda gösterilen hayalet çubuklar (yükseklik %). */
const GHOST_HEIGHTS = [18, 30, 24, 42, 36, 55, 48, 62, 52, 70, 58, 66];

function GhostChart({ message }: { message: string }) {
  return (
    <div className="relative flex min-h-[200px] flex-1 items-end gap-2.5 border-b border-dashed border-hm-border px-2">
      {GHOST_HEIGHTS.map((height, i) => (
        <div key={i} aria-hidden="true" className="flex h-full flex-1 items-end justify-center">
          <span
            className="w-2.5 rounded-t-[5px] border border-b-0 border-dashed border-hm-border"
            style={{ height: `${height}%` }}
          />
        </div>
      ))}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <span className="rounded-[10px] bg-hm-surface px-3.5 py-2 text-center text-sm text-hm-text-secondary">
          {message}
        </span>
      </div>
    </div>
  );
}

export const TrendChart = ({ data }: TrendChartProps) => {
  const { t } = useI18n();
  const hasData = !!data && data.length > 0;

  return (
    <Panel className="flex min-h-[300px] min-w-0 flex-col gap-5 p-6">
      <h2 className="m-0 text-base font-bold text-hm-text-primary">{t("dashboard.trend.title")}</h2>
      {!hasData ? (
        <GhostChart message={t("dashboard.trend.empty")} />
      ) : (
        <div
          role="img"
          aria-label={`${t("dashboard.trend.title")}: ${data.map((d) => `${d.date} ${d.total}`).join(", ")}`}
          className="min-h-[220px] w-full flex-1"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--hm-acc)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--hm-acc)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--hm-border)" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={TICK} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={TICK} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--hm-surface)",
                  color: "var(--hm-text-primary)",
                  borderRadius: "10px",
                  border: "1px solid var(--hm-border)",
                  fontSize: "13px",
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="var(--hm-acc)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  );
};
