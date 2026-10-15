import { cn } from "./cn";

interface AvatarProps {
  src?: string | null;
  /** Görsel yoksa gösterilecek ad; ilk harfler (en çok 2) alınır. */
  name?: string | null;
  size?: number;
  className?: string;
}

function initials(name?: string | null): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  return parts
    .slice(0, 2)
    .map((p) => p.charAt(0))
    .join("")
    .toLocaleUpperCase();
}

/** Dekoratif avatar: görsel ya da koyu zeminli baş harfler (mono, kalın). */
export function Avatar({ src, name, size = 32, className }: AvatarProps) {
  const style = { width: size, height: size };
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt="" src={src} style={style} className={cn("rounded-full border border-hm-border object-cover", className)} />
    );
  }
  return (
    <span
      aria-hidden="true"
      style={{ ...style, fontSize: Math.max(10, Math.round(size * 0.375)) }}
      className={cn(
        "inline-flex flex-none items-center justify-center rounded-full bg-hm-text-primary font-mono font-bold text-hm-bg",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
