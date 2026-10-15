import { Heading, Mono } from "./Typography";
import { Panel } from "./Panel";
import { cn } from "./cn";

interface StatCardProps {
  title: string;
  value: string | number;
  badgeText?: string;
  badgeType?: "good" | "high" | "neutral";
}

const NOTE_TONE = {
  high: "text-hm-danger",
  good: "text-hm-success",
  neutral: "text-hm-text-secondary",
} as const;

/** KPI paneli: etiket, serif 56 px değer ve mono not. */
export function StatCard({ title, value, badgeText, badgeType = "neutral" }: StatCardProps) {
  return (
    <Panel className="flex flex-col gap-3 px-6 py-[22px]">
      <span className="text-[15px] text-hm-text-secondary">{title}</span>
      <span className="flex flex-wrap items-baseline gap-3">
        <Heading as="span" className="text-[56px]">
          {value}
        </Heading>
        {badgeText && <Mono className={cn("text-xs", NOTE_TONE[badgeType])}>{badgeText}</Mono>}
      </span>
    </Panel>
  );
}
