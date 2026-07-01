import {
  DebtType,
  DEBT_TYPE_CONFIG,
} from "@/shared/types/debt.types";

interface BadgeProps {
  type: DebtType;
  className?: string;
}

/**
 * Debt tipi için renkli pill badge.
 * Renk konfigürasyonu DEBT_TYPE_CONFIG'den alınır,
 * CSS class'ları Tailwind utility class'larına dönüştürülmüştür.
 */
export function Badge({ type, className = "" }: BadgeProps) {
  const config = DEBT_TYPE_CONFIG[type];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium leading-5 whitespace-nowrap ${config.bgClass} ${config.colorClass} ${className}`}>
      {config.label}
    </span>
  );
}

/* --- Generic Status Badge --- */

interface StatusBadgeProps {
  label: string;
  variant: "success" | "danger" | "warning" | "info";
  className?: string;
}

const statusVariantClass: Record<StatusBadgeProps["variant"], string> = {
  success: "text-hm-success bg-hm-success-bg",
  danger: "text-hm-danger bg-hm-danger-bg",
  warning: "text-hm-todo bg-hm-todo-bg",
  info: "bg-hm-blue-light text-hm-blue",
};

export function StatusBadge({
  label,
  variant,
  className = "",
}: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium leading-5 whitespace-nowrap ${statusVariantClass[variant]} ${className}`}>
      {label}
    </span>
  );
}
