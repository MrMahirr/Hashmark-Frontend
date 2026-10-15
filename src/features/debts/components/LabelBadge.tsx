import { DEBT_TYPE_CONFIG, DebtType } from "@/shared/types/debt.types";

interface LabelBadgeProps {
  type: DebtType | string;
  className?: string;
}

/** Etiket rozeti; renkler tema belirteçlerinden gelir (açık/koyu temada okunaklı). */
export function LabelBadge({ type, className = "" }: LabelBadgeProps) {
  const config = DEBT_TYPE_CONFIG[type as DebtType];
  const colors = config ? `${config.bgClass} ${config.colorClass}` : "bg-hm-bg text-hm-text-secondary";

  return (
    <span
      className={`inline-block px-1.5 py-0.5 rounded font-mono text-[10px] font-medium border-[0.5px] border-current/20 ${colors} ${className}`}
    >
      {type}
    </span>
  );
}
