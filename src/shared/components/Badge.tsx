import { DebtType } from "@/shared/types/debt.types";
import { TagBadge } from "@/shared/ui/TagBadge";
import { cn } from "@/shared/ui/cn";

interface BadgeProps {
  type: DebtType;
  className?: string;
}

/** Borç tipi rozeti — yeni tasarımın `TagBadge` ilkeline devreder. */
export function Badge({ type, className }: BadgeProps) {
  return <TagBadge tag={type} className={className} />;
}

/* --- Genel durum rozeti --- */

interface StatusBadgeProps {
  label: string;
  variant: "success" | "danger" | "warning" | "info";
  className?: string;
}

const statusVariantClass: Record<StatusBadgeProps["variant"], string> = {
  success: "border-hm-success text-hm-success bg-hm-success-bg",
  danger: "border-hm-danger text-hm-danger bg-hm-danger-bg",
  warning: "border-hm-warning text-hm-warning bg-hm-warning-bg",
  info: "border-hm-info text-hm-info bg-hm-info-bg",
};

export function StatusBadge({ label, variant, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-[6px] border px-[9px] py-px font-mono text-xs font-bold",
        statusVariantClass[variant],
        className,
      )}
    >
      {label}
    </span>
  );
}
