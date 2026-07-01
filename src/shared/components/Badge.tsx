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
 * CSS class'ları globals.css'deki .pill-* tanımlarını kullanır.
 */
export function Badge({ type, className = "" }: BadgeProps) {
  const config = DEBT_TYPE_CONFIG[type];

  return (
    <span className={`pill ${config.pillClass} ${className}`}>
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
  success: "pill-success",
  danger: "pill-danger",
  warning: "pill-todo",
  info: "bg-hm-blue-light text-hm-blue",
};

export function StatusBadge({
  label,
  variant,
  className = "",
}: StatusBadgeProps) {
  return (
    <span className={`pill ${statusVariantClass[variant]} ${className}`}>
      {label}
    </span>
  );
}
