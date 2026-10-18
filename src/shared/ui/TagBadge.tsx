import { type CSSProperties } from "react";
import { cn } from "./cn";

const TAG_COLOR_VAR: Record<string, string> = {
  TODO: "--hm-todo",
  FIXME: "--hm-fixme",
  HACK: "--hm-hack",
  XXX: "--hm-xxx",
  NOTE: "--hm-note",
  DOC: "--hm-doc",
  INFO: "--hm-info",
};

/**
 * Etiketin renk değişkeni (`var(--hm-todo)` …). Yerleşik olmayan etiketler `.hashmark.yml` özel etiketleridir
 * (SECURITY, OPTIMIZE …) ve ortak `--hm-custom` rengini alır; boş etiket ikincil metin rengine düşer.
 */
export function tagColor(tag: string): string {
  const known = TAG_COLOR_VAR[tag.toUpperCase()];
  return `var(${known ?? (tag.trim() ? "--hm-custom" : "--hm-text-secondary")})`;
}

interface TagBadgeProps {
  tag: string;
  /** `md` = 12 px, `sm` = 11.5 px (yoğun listeler). */
  size?: "md" | "sm";
  /** Zaten renk tonlu bir satırın içindeyse kendi zeminini çizmez (çift ton kontrastı düşürür). */
  flat?: boolean;
  className?: string;
}

/** Etiket rozeti: 1 px kenarlık + %12 renk tonu (çalışma anında `color-mix`), mono kalın, 6 px yarıçap. */
export function TagBadge({ tag, size = "md", flat = false, className }: TagBadgeProps) {
  const style = { "--c": tagColor(tag) } as CSSProperties;
  return (
    <span
      style={style}
      className={cn(
        "inline-block justify-self-start rounded-[6px] border border-[var(--c)] px-[9px] py-px font-mono font-bold text-[var(--c)]",
        !flat && "bg-[color-mix(in_srgb,var(--c)_12%,transparent)]",
        size === "md" ? "text-xs" : "text-[11.5px]",
        className,
      )}
    >
      {tag}
    </span>
  );
}
