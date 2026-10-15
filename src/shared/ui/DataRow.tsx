import { type HTMLAttributes } from "react";
import { cn } from "./cn";

/** Borç tablosu satır ızgarası: etiket 110 / yol 1.4fr / not 2fr / tarih 130. */
export const DATA_ROW_COLUMNS =
  "grid-cols-[110px_minmax(220px,1.4fr)_minmax(220px,2fr)_130px]";

interface DataRowProps extends HTMLAttributes<HTMLDivElement> {
  /** Varsayılan 4 sütunlu ızgara yerine özel `grid-cols-*` sınıfı. */
  columns?: string;
}

/** Tablo satırı (`.trow`). Dar ekranda kapsayıcıda yatay kaydırma beklenir (`min-w-[760px]`). */
export function DataRow({ columns = DATA_ROW_COLUMNS, className, ...props }: DataRowProps) {
  return (
    <div
      className={cn(
        "grid min-w-[760px] items-center gap-4 border-t border-hm-border px-6 py-3.5",
        columns,
        className,
      )}
      {...props}
    />
  );
}

/** Sütun başlıkları: mono 12 px, büyük harf, hafif zemin. */
export function DataRowHeader({ columns = DATA_ROW_COLUMNS, className, ...props }: DataRowProps) {
  return (
    <DataRow
      columns={columns}
      className={cn(
        "bg-[color-mix(in_srgb,var(--hm-text-primary)_4%,transparent)] font-mono text-xs uppercase tracking-[0.06em] text-hm-text-secondary",
        className,
      )}
      {...props}
    />
  );
}
