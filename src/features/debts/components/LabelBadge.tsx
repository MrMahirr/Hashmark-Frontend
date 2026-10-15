import { TagBadge } from "@/shared/ui/TagBadge";

interface LabelBadgeProps {
  type: string;
  className?: string;
}

/** Etiket rozeti; tek kaynak `shared/ui/TagBadge` (renkler tema belirteçlerinden gelir). */
export function LabelBadge({ type, className }: LabelBadgeProps) {
  return <TagBadge tag={type} className={className} />;
}
