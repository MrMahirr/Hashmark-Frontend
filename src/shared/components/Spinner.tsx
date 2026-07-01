import { Loader2 } from "lucide-react";

type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}

const sizeMap: Record<SpinnerSize, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

/**
 * Loading spinner. Opsiyonel label ile birlikte kullanılabilir.
 * Tam sayfa loading için fullPage variant'ı kullanılabilir.
 */
export function Spinner({ size = "md", className = "", label }: SpinnerProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 text-hm-text-muted ${className}`}
      role="status"
      aria-label={label ?? "Loading"}
    >
      <Loader2 className={`animate-spin ${sizeMap[size]}`} />
      {label && <span className="text-sm font-medium">{label}</span>}
    </div>
  );
}

/**
 * Tam sayfa ortasında gösterilen loading spinner.
 */
export function FullPageSpinner({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size="lg" label={label} />
    </div>
  );
}
