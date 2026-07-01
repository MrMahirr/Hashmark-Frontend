import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  badgeText?: string;
  badgeType?: "good" | "high" | "neutral";
}

export const StatCard = ({ title, value, badgeText, badgeType }: StatCardProps) => {
  const getBadgeStyles = () => {
    switch (badgeType) {
      case "high":
        return "text-hm-danger bg-hm-danger-bg";
      case "good":
        return "text-hm-success bg-hm-success-bg";
      default:
        return "text-hm-text-secondary bg-hm-bg";
    }
  };

  return (
    <div className="bg-hm-surface border-[0.5px] border-hm-border rounded-card p-4 flex flex-col justify-between h-[100px]">
      <span className="font-sans text-sm text-hm-text-secondary">{title}</span>
      <div className="flex items-baseline gap-2">
        <span className="font-sans text-2xl font-semibold text-hm-text-primary">{value}</span>
        {badgeText && (
          <span className={`font-sans text-xs font-medium px-1.5 py-0.5 rounded ${getBadgeStyles()}`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};
