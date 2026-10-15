import { DebtType } from "@/shared/types/debt.types";
import { tagColor } from "@/shared/ui/TagBadge";

interface DebtBreakdownBarProps {
  breakdown: Record<string, number>;
}

const ORDER = Object.values(DebtType) as string[];

/** Yığılmış etiket çubuğu (16 px) + lejant ("TODO 4"). Boş kırılımda hiçbir şey çizmez. */
export function DebtBreakdownBar({ breakdown }: DebtBreakdownBarProps) {
  const entries = ORDER.map((type) => [type, breakdown[type] ?? 0] as const).filter(([, count]) => count > 0);
  if (entries.length === 0) return null;

  return (
    <>
      <div className="flex h-4 gap-[3px]" aria-hidden="true">
        {entries.map(([type, count]) => (
          <span
            key={type}
            className="min-w-1 rounded-[4px]"
            style={{ flex: `${count} 1 0`, background: tagColor(type) }}
          />
        ))}
      </div>
      <ul className="m-0 flex list-none flex-wrap gap-x-[22px] gap-y-2.5 p-0">
        {entries.map(([type, count]) => (
          <li key={type} className="inline-flex items-center gap-2 font-mono text-xs">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[3px]" style={{ background: tagColor(type) }} />
            {type} {count}
          </li>
        ))}
      </ul>
    </>
  );
}
